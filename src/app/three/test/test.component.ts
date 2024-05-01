import { Component, effect, inject, input, InputSignal } from '@angular/core';

import { BoxGeometry, DirectionalLight, Group, Mesh, MeshStandardMaterial, Object3D, RectAreaLight } from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

import { animate, easeInOut } from 'popmotion';

import { Artwork, ArtworksService } from '../../artworks.service';
import { LayoutButtonsComponent } from '../../layout-buttons/layout-buttons.component';
import { FrameService } from '../frame.service';
import { LayoutService } from '../layout.service';
import { RenderTargetService } from '../render-target.service';
import { SceneComponent } from '../scene/scene.component';

@Component( {
  selector: 'art-test',
  standalone: true,
  imports: [LayoutButtonsComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
} )
export class TestComponent extends SceneComponent {
  // Services
  private artworksService = inject( ArtworksService );
  private frameService = inject( FrameService );
  private layout: LayoutService = inject( LayoutService );
  private renderTargetService: RenderTargetService = inject( RenderTargetService );
  public fa: InputSignal<Artwork> = input.required();

  man: any;
  frames: Object3D[] = [];
  private artworks = this.artworksService.artworks();
  focusArtwork = this.artworksService.getFocusedArtwork();
  private focusedFrame: any;

  constructor() {
    super();
    effect( () => {
      console.log( `The current focused is: ${this.fa().url}` );
      this.frameService.updateFrame( { texture: this.fa().url, frame: this.focusedFrame } );
    } );
  }

  ngOnInit () {

    // Layout test
    this.createBoxes();

  }

  override ngAfterViewInit (): void {
    super.ngAfterViewInit();

    // Focus frame
    this.focusFrame();

    // Environment
    this.addEnvironment();

    // Lights
    this.addRectLights();

  };

  focusFrame () {
    this.focusArtwork = this.artworksService.getFocusedArtwork();
    const focusedFrame = this.frameService.createFocusFrame( this.focusArtwork );
    focusedFrame.position.z = -10;
    this.scene.add( focusedFrame );

    animate( {
      from: focusedFrame.position.z,
      to: -4,
      duration: 3000,
      ease: easeInOut,
      onUpdate: latest => focusedFrame.position.z = latest,
      onComplete: () => this.addMan()
    } );

    this.focusedFrame = focusedFrame;

  }

  createLayout () {

    this.layout.gridLayout( {
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
    const artworks = this.artworksService.artworks();
    for ( let i = 0; i < 50; i++ ) {

      const box = this.frameService.createSmallFrame( { artwork: artworks[i % 20] } );

      box.position.x = w * Math.random() - w / 2;
      box.position.y = h * Math.random() - h / 2;
      box.position.z = d * Math.random() - d / 2;
      boxes.push( box );
      this.addToScene( box );
    }

    this.frames = boxes;

    setTimeout( () => {
      this.createLayout();
    }, 500 );

  }

  addMan () {
    // Load the Man model
    this.man = this.loadersService.loadGLTF( {
      path: '/assets/models/man.glb',
      onLoadCB: this.onLoad.bind( this ),
    } );

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

    // Floor
    const geoFloor = new BoxGeometry( 2000, 0.1, 2000 );
    const matStdFloor = new MeshStandardMaterial( { color: 0xfffff, roughness: 0.1, metalness: 0 } );
    const mshStdFloor = new Mesh( geoFloor, matStdFloor );
    this.scene.add( mshStdFloor );

  }

  addRectLights () {

    // Area Lights
    RectAreaLightUniformsLib.init();
    const rectLights = new Group();
    const rectLight1 = new RectAreaLight( 0xff0000, 5, 4, 10 );
    rectLight1.position.set( - 5, 5, -5 );
    rectLights.add( rectLight1 );

    const rectLight2 = new RectAreaLight( 0x00ff00, 5, 4, 10 );
    rectLight2.position.set( 0, 5, -5 );
    rectLights.add( rectLight2 );

    const rectLight3 = new RectAreaLight( 0x0000ff, 5, 4, 10 );
    rectLight3.position.set( 5, 5, -5 );
    rectLights.add( rectLight3 );
    // rectLights.rotation.y = Math.PI;
    rectLights.position.z = 15;
    this.scene.add( rectLights );
    this.scene.add( new RectAreaLightHelper( rectLight1 ) );
    this.scene.add( new RectAreaLightHelper( rectLight2 ) );
    this.scene.add( new RectAreaLightHelper( rectLight3 ) );
  }

  onLoad ( model: Object3D ) {
    model.position.z = -5;
    this.scene.add( model );
  }

}
