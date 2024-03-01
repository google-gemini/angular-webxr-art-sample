import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  ViewChild,
} from '@angular/core';

import {
  BoxGeometry,
  Clock,
  Color,
  DirectionalLight,
  Fog,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera, Scene,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { LoadersService } from '../loaders.service';
import GUI from 'lil-gui';

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
  // @ts-ignore
  public camera: PerspectiveCamera;
  public clock = new Clock();
  // @ts-ignore
  public controls: OrbitControls;
  // @ts-ignore
  public gui: GUI;
  public scene: Scene = new Scene();

  private defaultOptions: SceneOptions = {
    width: window.innerWidth || 800,
    height: window.innerHeight || 600,
  };
  // @ts-ignore
  private renderer: WebGLRenderer;
  private renderFunctions: Function[] = [];

  @Input( { required: false } ) options: SceneOptions = {};

  @ViewChild( 'canvas', { static: true } ) canvas!: ElementRef<HTMLCanvasElement>;
  private get canvasEl (): HTMLCanvasElement {
    return this.canvas?.nativeElement;
  }

  constructor( private ngZone: NgZone, public loadersService: LoadersService ) { }

  ngAfterViewInit (): void {
    this.options = Object.assign( {}, this.defaultOptions, this.options );
    const w = this.options.width || this.canvasEl.width;
    const h = this.options.height || this.canvasEl.height;

    // Scene background
    this.scene.background = new Color( 'black' );

    // Camera
    this.camera = new PerspectiveCamera( 45, w / h, 0.1, 500 );
    this.camera.position.set( 0, 1.6, 0 );
    this.scene.add( this.camera );

    // Renderer
    this.renderer = new WebGLRenderer( {
      canvas: this.canvasEl,
      antialias: true,
      alpha: true,
    } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( w, h );

    // Lights
    this.addLight();

    // Controls
    this.addControls();

    // Animation Loop
    this.ngZone.runOutsideAngular( () =>
      this.renderer.setAnimationLoop( () => this.render() )
    );
  }

  // Render function runs on each frame
  render () {
    const delta = this.clock.getDelta();
    this.renderFunctions.forEach( ( f ) => f( delta ) );
    this.controls.update();
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

    this.controls.minDistance = -100;
    this.controls.maxDistance = 500;

    this.controls.maxPolarAngle = Math.PI / 2;
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

  // Ambient Light
  addLight () {
    const ambient = new HemisphereLight( 0xffffff, 0xbbbbff, 3 );
    this.scene.add( ambient );
  }

  debug () {
    this.gui = new GUI();
    // Add a cube to the scene for testing purposes
    // const boxGeo = new BoxGeometry( 10, 10, 10 );
    // const material = new MeshBasicMaterial( { color: 0x00ff00 } );
    // const cube = new Mesh( boxGeo, material );
    // cube.position.y = 10;
    // this.scene.add( cube );
    // this.addToRender( () => cube.rotation.y += 0.01 );

    const w = window.innerWidth;
    const camera = this.gui.addFolder( 'Camera Position' );
    camera.add( this.camera.position, 'x', -200, 200, 1 );
    camera.add( this.camera.position, 'y', 0, 2, 0.1 );
    camera.add( this.camera.position, 'z', 0, 10, 1 );
  }
}
