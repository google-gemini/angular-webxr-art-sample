import { Component, NgZone } from '@angular/core';

import { AmbientLight, Color, DirectionalLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, PerspectiveCamera, PlaneGeometry, Scene, Vector3, WebGLRenderTarget } from 'three';

import { LoadersService } from '../three/loaders.service';
import { PrimitivesService } from '../three/primitives.service';
import { SceneComponent } from '../three/scene/scene.component';
import { XRService } from '../three/xr.service';

@Component( {
  selector: 'art-portal',
  standalone: true,
  imports: [],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss'
} )
export class PortalComponent extends SceneComponent {
  secondaryScene: Scene = new Scene();
  secondaryCamera: any;
  aLogo: Object3D | undefined;
  renderTarget: any;
  constructor( ngZone: NgZone, loadersService: LoadersService, private primitives: PrimitivesService, xrService: XRService ) {
    super( ngZone, loadersService, xrService );
  }

  override ngAfterViewInit (): void {
    super.ngAfterViewInit();

    // Camera
    const cameraPos = new Vector3( -16, 8, 16 );
    this.camera.position.x = cameraPos.x;
    this.camera.position.y = cameraPos.y;
    this.camera.position.z = cameraPos.z;

    this.scene.background = new Color( 0xa8def0 );


    this.createRenderTarget();
    this.addEnvironment();
    // Load the logo
    const aLogo = this.loadersService.loadGLTF( {
      path: '/assets/models/aLogo.glb',
      onLoadCB: this.onLoad.bind( this ),
    } );

  }

  createRenderTarget () {
    const targetSize = { width: 6, height: 6, material: new MeshBasicMaterial( { color: 'white' } ) };

    const targetPlane = this.primitives.createPlane( targetSize );
    const targetPlanePosition = { x: -5, y: targetSize.height / 2, z: 5 };

    const renderTargetWidth = targetSize.width * 512;
    const renderTargetHeight = targetSize.height * 512;
    this.renderTarget = new WebGLRenderTarget( renderTargetWidth, renderTargetHeight );

    // SECONDARY CAMERA
    const secondaryAspect = renderTargetWidth / renderTargetHeight;
    this.secondaryCamera = new PerspectiveCamera( this.camera.fov, secondaryAspect,
      this.camera.near, this.camera.far );
    this.secondaryCamera.position.x = targetPlanePosition.x;
    this.secondaryCamera.position.y = targetPlanePosition.y + 4;
    this.secondaryCamera.position.z = targetPlanePosition.z;
    this.secondaryCamera.lookAt( new Vector3( 10, 5, -10 ) );

    // SECONDARY SCENE
    this.secondaryScene = new Scene();
    this.secondaryScene.background = new Color( 0xD61C4E );
    const secondaryDirectionalLight = new DirectionalLight( 0xFFFFFF, 1 );
    {
      secondaryDirectionalLight.position.set( -10, 10, 10 );
      secondaryDirectionalLight.castShadow = true;
      secondaryDirectionalLight.shadow.mapSize.width = 4096;
      secondaryDirectionalLight.shadow.mapSize.height = 4096;
      const d = 35;
      secondaryDirectionalLight.shadow.camera.left = - d;
      secondaryDirectionalLight.shadow.camera.right = d;
      secondaryDirectionalLight.shadow.camera.top = d;
      secondaryDirectionalLight.shadow.camera.bottom = - d;
      this.secondaryScene.add( secondaryDirectionalLight );

      this.addToRender( ( delta: any ) => {
        secondaryDirectionalLight.position.x = Math.cos( delta * 0.002 ) * 10;
        secondaryDirectionalLight.position.z = Math.sin( delta * 0.002 ) * 10;
        // draw render target scene to render target
        this.secondaryCamera.rotation.x = this.camera.rotation.x;
        this.secondaryCamera.rotation.y = this.camera.rotation.y;
        this.secondaryCamera.rotation.z = this.camera.rotation.z;
      } );

      this.loadersService.loadGLTF( {
        path: 'assets/models/forest-ground.glb',
        onLoadCB: ( model: Object3D ) => {
          model.traverse( function ( object: Object3D ) {
            object.receiveShadow = true;
          } );
          this.secondaryScene.add( model );
        }
      } );

      this.loadersService.loadGLTF( {
        path: 'assets/models/dark-objects.glb',
        onLoadCB: ( model: Object3D ) => {
          model.traverse( function ( object: Object3D ) {
            object.receiveShadow = true;
          } );
          console.log(
            'Dark Obj', model
          );
          this.secondaryScene.add( model );
        }
      } );
    }
  }

  addEnvironment () {
    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const direcitonalLight = new DirectionalLight( color, intensity );
      direcitonalLight.position.set( 3, 10, -4 );
      direcitonalLight.castShadow = true;
      direcitonalLight.shadow.mapSize.width = 4096;
      direcitonalLight.shadow.mapSize.height = 4096;
      const d = 35;
      direcitonalLight.shadow.camera.left = - d;
      direcitonalLight.shadow.camera.right = d;
      direcitonalLight.shadow.camera.top = d;
      direcitonalLight.shadow.camera.bottom = - d;
      this.scene.add( direcitonalLight );
    }
    this.loadersService.loadGLTF( {
      path: 'assets/models/forest-ground.glb',
      onLoadCB: ( model: Object3D ) => {
        model.traverse( function ( object: Object3D ) {
          object.receiveShadow = true;
        } );
        console.log(
          'Forest Ground Obj', model
        );
        this.scene.add( model );
      }
    } );


    this.loadersService.loadGLTF( {
      path: 'assets/models/forest-trees.glb',
      onLoadCB: ( model: Object3D ) => {
        model.traverse( function ( object: Object3D ) {
          object.receiveShadow = true;
        } );
        console.log(
          'Forest Trees Obj', model
        );
        this.scene.add( model );
      }
    } );

    {
      const material = new MeshPhongMaterial( {
        map: this.renderTarget.texture,
      } );
      const targetPlane = new Mesh( new PlaneGeometry( 6, 6, 32 ), material );
      targetPlane.rotation.y = -Math.PI / 4;

      targetPlane.position.y = 3;
      targetPlane.position.x = -5;
      targetPlane.position.z = 5;

      targetPlane.castShadow = true;
      this.scene.add( targetPlane );
    }

    this.addToRender( this.animate.bind( this ) );
  }

  onLoad ( model: Object3D ) {
    const ambientLight = new AmbientLight( 0xFFFFFF, 1 );
    this.scene.add( ambientLight );
    this.debug();
    model.position.set( -30, 1, -100 );
    model.position.y = 1;
    model.name = 'aLogo';
    // this.secondaryScene.add( model );
    this.addToScene( model );
    this.addToRender( () => {
      model.rotation.y += 0.01;
    } );
  }

  animate () {

    this.renderer.setRenderTarget( this.renderTarget );
    this.renderer.render( this.secondaryScene, this.secondaryCamera );
    this.renderer.setRenderTarget( null );
    // Render scene to canvas

  }
}
