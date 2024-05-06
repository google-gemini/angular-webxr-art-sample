import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input, InputSignal,
  NgZone,
  Signal,
  viewChild
} from '@angular/core';

import GUI from 'lil-gui';
import {
  ACESFilmicToneMapping,
  Clock,
  Color, Fog, GridHelper, HemisphereLight, Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera, Scene,
  Vector2,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { update } from 'three/examples/jsm/libs/tween.module.js';
import { GPUStatsPanel } from 'three/examples/jsm/utils/GPUStatsPanel.js';
import { XRButton } from 'three/examples/jsm/webxr/XRButton.js';

import { InteractionsService } from '../interactions.service';
import { LightsService } from '../lights.service';
import { LoadersService } from '../loaders.service';
import { XRService } from '../xr.service';

export interface SceneOptions {
  width?: number;
  height?: number;
}

@Component( {
  selector: 'art-scene',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './scene.component.html',
  styleUrl: './scene.component.scss',
} )
export class SceneComponent {
  // Services to inject
  protected interactions = inject( InteractionsService );
  protected lightsService = inject( LightsService );
  protected loadersService = inject( LoadersService );
  private ngZone: NgZone = inject( NgZone );
  protected xrService = inject( XRService );

  public camera: PerspectiveCamera;
  public clock = new Clock();
  public controls: OrbitControls;
  public gui: GUI;
  public scene: Scene = new Scene();

  private defaultOptions: SceneOptions = {
    width: window.innerWidth || 800,
    height: window.innerHeight || 400,
  };

  public renderer: WebGLRenderer;
  private renderFunctions: Function[] = [];

  sceneOptions: InputSignal<SceneOptions> = input();
  canvas: Signal<ElementRef<HTMLCanvasElement>> = viewChild( 'canvas' );
  rect: DOMRect;
  private pointer = new Vector2();


  ngAfterViewInit (): void {
    const canvasEl = this.canvas().nativeElement;

    const options = Object.assign( {}, this.defaultOptions, this.sceneOptions );
    const w = options.width || canvasEl.width;
    const h = options.height || canvasEl.height;

    // Scene background
    this.scene.background = new Color( 'black' );
    this.scene.backgroundBlurriness = 0.3;

    // Camera
    this.camera = new PerspectiveCamera( 45, w / h, 0.1, 500 );
    this.camera.position.set( 0, 1.6, 0 );
    this.scene.add( this.camera );


    // Renderer
    this.renderer = new WebGLRenderer( {
      canvas: canvasEl,
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
    } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( w, h );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5;
    this.renderer.xr.enabled = true;

    this.rect = this.renderer.domElement.getBoundingClientRect();
    // Lights
    this.addLights();

    // Controls
    this.addControls();

    // Interactions Manager
    const interactionsUpdate = this.interactions.initInteractionManager( this.renderer, this.camera, canvasEl );
    this.renderFunctions.push( interactionsUpdate );

    // Animation Loop
    this.ngZone.runOutsideAngular( () =>
      this.renderer.setAnimationLoop( () => this.render() )
    );

    this.afterInit();
  };

  afterInit () {
    // XR 
    // Add XR button even if WebXR is not supported
    const xrButton = XRButton.createButton( this.renderer );
    xrButton.addEventListener( 'click', ( e ) => {
      console.log( 'clicked xrButton ', e );
    } );
    document.body.appendChild( xrButton );

    // Check XR Support and determine if the session is AR or VR
    // Initiate a session if supported
    this.xrService.checkXRSupport( { renderer: this.renderer, camera: this.camera, scene: this.scene } );
  }

  // Render function runs on each frame
  render () {
    const delta = this.clock.getDelta();
    this.renderFunctions.forEach( ( f ) => f( delta ) );
    this.controls?.update();
    // Run Tween animations
    update();
    this.renderer.render( this.scene, this.camera );
  }

  // Add a function to the render loop
  addToRender ( f: Function ) {
    this.renderFunctions.push( f );
  }

  removeFromRender ( f: Function ) {
    this.renderFunctions = this.renderFunctions.filter( ( fn ) => fn !== f );
  }

  // Add an object to the scene
  addToScene ( obj: Object3D ) {
    this.scene.add( obj );
  }

  removeFromScene ( obj: Object3D ) {
    this.scene.remove( obj );
  }

  addControls () {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.listenToKeyEvents( window ); // optional

    // Set the controls target to the camera/user position
    this.controls.target.set( 0, 1.6, -5 );
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;

    this.controls.screenSpacePanning = false;

    this.controls.minDistance = 5;
    this.controls.maxDistance = 60;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // prevent camera below ground
    this.controls.minPolarAngle = Math.PI / 4;        // prevent top down view
    this.controls.update();
  }

  // Resize the canvas when the window is resized
  onResize ( e: Event ) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Set the camera's aspect ratio
    this.camera.aspect = w / h;

    // update the camera's frustum
    this.camera.updateProjectionMatrix();

    // update the size of the renderer & the canvas
    this.renderer.setSize( w, h );

    // set the pixel ratio (for mobile devices)
    this.renderer.setPixelRatio( window.devicePixelRatio );
  }

  addLights () {

    // Camera Lights
    const cameraLight: any = this.lightsService.createSpotLight();
    cameraLight.position.set( 0, -2, 0.64 );
    this.camera.add( cameraLight );

    // Ambient Light
    const ambient = new HemisphereLight( 0xffffff, 0xbbbbff, 0.5 );
    this.scene.add( ambient );

  }

  fog ( ops?: any ) {

    // Heavy fog for test
    const setcolor = ops.color || 0xF02050;
    this.scene.background = new Color( setcolor );
    this.scene.fog = new Fog( setcolor, 12, 20 );
  }

  debug () {

    const helper = new GridHelper( 100, 40, 0x000000, 0x000000 );
    this.scene.add( helper );

    // GUI
    this.gui = new GUI();
    const w = window.innerWidth;
    const camera = this.gui.addFolder( 'Camera Position' );
    camera.add( this.camera.position, 'x', -200, 200, 1 );
    camera.add( this.camera.position, 'y', 0, 2, 0.1 );
    camera.add( this.camera.position, 'z', 0, 10, 1 );

    // Stats panel
    const stats = new Stats();
    document.body.appendChild( stats.dom );

    // Perf panel
    const gpuPanel = new GPUStatsPanel( this.renderer.getContext() );
    stats.addPanel( gpuPanel );
    stats.showPanel( 0 );
    this.addToRender( () => stats.update() );

  }

  onTouchStart ( e: TouchEvent ) {

    this.pointer.x = ( ( e.touches[0].clientX - this.rect.left ) / ( this.rect.right - this.rect.left ) ) * 2 - 1;
    this.pointer.y = - ( ( e.touches[0].clientY - this.rect.top ) / ( this.rect.bottom - this.rect.top ) ) * 2 + 1;
    this.interactions.intersectObjects( { pointer: this.pointer, camera: this.camera, scene: this.scene, select: true } );

  }

  onPointerDown ( e: PointerEvent ) {

    this.pointer.x = ( ( e.clientX - this.rect.left ) / ( this.rect.right - this.rect.left ) ) * 2 - 1;
    this.pointer.y = - ( ( e.clientY - this.rect.top ) / ( this.rect.bottom - this.rect.top ) ) * 2 + 1;
    this.interactions.intersectObjects( { pointer: this.pointer, camera: this.camera, scene: this.scene } );

  }
}
