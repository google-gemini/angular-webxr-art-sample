import { Component, NgZone } from '@angular/core';

import { Color, DirectionalLight, DirectionalLightHelper, HemisphereLight, HemisphereLightHelper, Mesh, MeshPhongMaterial, Object3D, PlaneGeometry } from 'three';

import { LayoutButtonsComponent } from '../../layout-buttons/layout-buttons.component';
import { LayoutService } from '../layout.service';
import { LoadersService } from '../loaders.service';
import { PrimitivesService } from '../primitives.service';
import { RenderTargetService } from '../render-target.service';
import { SceneComponent } from '../scene/scene.component';
import { XRService } from '../xr.service';

@Component( {
  selector: 'art-test',
  standalone: true,
  imports: [LayoutButtonsComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
} )
export class TestComponent extends SceneComponent {
  man: any;
  frames: Object3D[] = [];
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

  ngOnInit () {
    // Layout test
    this.createBoxes();

  }
  override ngAfterViewInit (): void {
    super.ngAfterViewInit();

    // Load the Man model
    this.man = this.loadersService.loadGLTF( {
      path: '/assets/models/man.glb',
      onLoadCB: this.onLoad.bind( this ),
    } );

    // Environment
    this.addEnvironment();

    // Lights
    this.addLights();

  }

  createLayout () {

    this.layout.sphereLayout( {
      objects: this.frames,
      n: 4,
      width: 100,
      height: 100,
      depth: 300
    } );
  }

  createBoxes () {
    const n = 20;
    let w = 800 / n;
    let h = 600 / n;
    let d = 800 / n;
    const boxes: Object3D[] = [];
    for ( let i = 0; i < 100; i++ ) {
      const box = this.primitives.createBox();
      box.position.x = w * Math.random() - w / 2;
      box.position.y = h * Math.random() - h / 2;
      box.position.z = d * Math.random() - d / 2;
      boxes.push( box );
      this.addToScene( box );
    }

    this.frames = boxes;

    // this.addToRender( () => {
    //   // const vec = new Vector3();
    //   this.frames.forEach( ( obj ) => {
    //     obj.lookAt( this.camera.position );
    //   } );
    // } );


    // setTimeout( () => {
    //   this.createLayout();
    // }, 2500 );

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
        model.position.x = 0;
        model.position.y = 0;
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
