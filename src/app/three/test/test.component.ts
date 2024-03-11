import { Component, NgZone } from '@angular/core';

import { SceneComponent } from '../scene/scene.component';
import { LoadersService } from '../loaders.service';
import { PrimitivesService } from '../primitives.service';
import { Color, DirectionalLight, DirectionalLightHelper, Fog, HemisphereLight, HemisphereLightHelper, Mesh, MeshPhongMaterial, Object3D, PlaneGeometry, Vector3 } from 'three';
import { XRService } from '../xr.service';
import { RenderTargetService } from '../render-target.service';
import { LayoutService } from '../layout.service';

@Component( {
  selector: 'art-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
} )
export class TestComponent extends SceneComponent {
  man: any;
  constructor(
    ngZone: NgZone,
    loadersService: LoadersService,
    private primitives: PrimitivesService,
    xrService: XRService,
    private renderTargetService: RenderTargetService,
    private layout: LayoutService
  ) {
    super( ngZone, loadersService, xrService );
  }

  override ngAfterViewInit (): void {
    super.ngAfterViewInit();

    // Environment
    this.addEnvironment();

    // Lights
    this.addLights();

    // Render Target
    // this.createRenderTarget( {
    //   width: 6,
    //   height: 8,
    //   position: { x: 0, y: 1, z: -3 },
    //   camera: this.camera,
    //   scene: this.scene,
    //   renderer: this.renderer
    // } );
    this.createLayout();
    // Load the Man model
    this.man = this.loadersService.loadGLTF( {
      path: '/assets/models/man.glb',
      onLoadCB: this.onLoad.bind( this ),
    } );

    this.debug();

  }

  createLayout () {

    const boxes: any[] = [];
    for ( let i = 0; i < 100; i++ ) {
      const box = this.primitives.createBox();
      boxes.push( box );
      // this.addToScene( box );
    }

    const spheres: Object3D[] = [];
    for ( let i = 0; i < 100; i++ ) {
      const sphere = this.primitives.createSphere( {} );
      spheres.push( sphere );
      this.addToScene( sphere );
    }


    this.layout.gridLayout( {
      objects: spheres,
      width: 100,
      height: 100,
      depth: 300
    } );
    // @ts-ignore
    // this.addToScene( ...spheres );
    // const boxes = this.primitives.createInstancedMesh( { count: 50 } );
    // boxes.position.z = -3;
    // this.addToScene(  );

    // for ( let i = 0; i < 100; i++ ) {

    // }
  }

  createRenderTarget ( ops: any ) {
    const [targetRenderFunction, targetPlane, targetScene] = this.renderTargetService.createRenderTarget( ops );

    const aLogo = this.loadersService.loadGLTF( {
      path: 'assets/models/dark-objects.glb',
      onLoadCB: ( model: Object3D ) => {
        model.position.z = -5;
        model.position.x = -2;
        model.position.y = -2;
        // @ts-ignore
        targetScene.add( model );
        console.log( 'targetScene, model ', targetScene, model );
      }
    } );

    const man = this.loadersService.loadGLTF( {
      path: '/assets/models/man.glb',
      onLoadCB: ( model: Object3D ) => {
        model.position.z = -5;
        model.position.x = -0;
        model.position.y = -0;
        model.rotation.y = Math.PI / 4;
        // @ts-ignore
        targetScene.add( model );
        console.log( 'targetScene, model ', targetScene, model );
      }
    } );

    const dirLight = new DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( 3, 10, 10 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    // @ts-ignore
    targetScene.add( dirLight );

    // @ts-ignore
    this.addToRender( () => targetRenderFunction() );

  }

  addEnvironment () {

    // Scene background
    this.scene.background = new Color( 0xa8def0 );
    // this.scene.fog = new Fog( 0xa0a0a0, 10, 50 );

    // ground
    const mesh = new Mesh( new PlaneGeometry( 20, 20 ), new MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add( mesh );
  }

  addLights () {
    const hemiLight = new HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
    hemiLight.position.set( 0, 20, 0 );

    const hHelper = new HemisphereLightHelper( hemiLight, 5, 'orange' );
    this.scene.add( hemiLight, hHelper );

    const dirLight = new DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( 3, 10, 10 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;

    const dHelper = new DirectionalLightHelper( dirLight, 5, );
    this.scene.add( dirLight, dHelper );


    const light = new DirectionalLight();
    light.position.set( 0.2, 1.5, -2 );

    const helper = new DirectionalLightHelper( light, 5, 'red' );
    this.scene.add( light, helper );
  }

  onLoad ( model: Object3D ) {
    model.position.z = -5;
    this.scene.add( model );
  }

}
