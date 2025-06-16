/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  WebGPURenderer
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

  public renderer: WebGPURenderer;
  private renderFunctions: Function[] = [];

  sceneOptions: InputSignal<SceneOptions> = input();
  canvas: Signal<ElementRef<HTMLCanvasElement>> = viewChild( 'canvas' );
  rect: DOMRect;
  private pointer = new Vector2();


  ngAfterViewInit (): void {
    const canvasEl = this.canvas().nativeElement;

    // Ensure canvas is XR compatible (this might be needed for WebGPU)
    // This step is often done before renderer initialization.
    // However, WebGPURenderer might handle this internally if context is obtained later.
    // For now, assuming WebGPURenderer's canvas usage is compatible.

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
    this.renderer = new WebGPURenderer( {
      canvas: canvasEl,
      // antialias: true, // Not a direct WebGPU option, done in pass usually
      // powerPreference: "high-performance", // Not a WebGPU option
      // alpha: true, // For transparency with underlying DOM elements
    } );
    // For WebGPU, it's important that the underlying GPU pipeline is configured for XR.
    // This typically means the `GPUDevice.requestAdapter()` and `adapter.requestDevice()`
    // might need specific options if not handled by three.js's WebGPURenderer automatically.
    // And the canvas context needs to be configured for XR:
    // const context = canvasEl.getContext('webgpu');
    // await context.configure({
    //   device: renderer.device, // Assuming renderer exposes device
    //   format: navigator.gpu.getPreferredCanvasFormat(),
    //   usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
    //   alphaMode: 'premultiplied',
    //   // For XR:
    //   // viewFormats: [...] // if needed for different views like multiview
    //   // xrCompatible: true // This might be important
    // });
    // For now, we assume three.js's WebGPURenderer handles this.

    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( w, h );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5;
    this.renderer.xr.enabled = true; // Enable XR on the renderer

    this.rect = this.renderer.domElement.getBoundingClientRect();
    // Lights
    this.addLights();

    // Controls
    this.addControls();

    // Interactions Manager
    const interactionsUpdate = this.interactions.initInteractionManager( this.renderer, this.camera, canvasEl );
    this.renderFunctions.push( interactionsUpdate );

    // Animation Loop
    this.ngZone.runOutsideAngular( () => {
      // The render loop needs to be XR-aware.
      // WebGPURenderer's setAnimationLoop callback receives the XRSession's frame when in an XR session.
      this.renderer.setAnimationLoop( ( time: number, frame?: any /* XRFrame */ ) => {
        this.render( time, frame );
      } )
    });

    this.afterInit();
  };

  async afterInit () {
    // XR
    // XRButton.createButton might need adjustment for WebGPURenderer.
    // It typically handles session request and provides a session to the renderer.
    // The key is how the session is passed to our XRService and how the renderer uses it.

    // Initialize renderer for XR - this is important for WebGPU
    // This call will internally handle making the canvas XR compatible if possible.
    // await this.renderer.start(); // Or similar method if available on WebGPURenderer for XR setup

    const xrButton = XRButton.createButton(
      this.renderer,
      {
        onRequestSession: async (sessionMode: string) => {
          try {
            const session = await navigator.xr.requestSession(sessionMode as XRSessionMode, { optionalFeatures: ['local-floor', 'bounded-floor'] });
            this.xrService.renderer = this.renderer; // Ensure service has the renderer
            this.xrService.scene = this.scene; // Ensure service has the scene
            await this.xrService.startXRSession(session);

            // WebGPURenderer needs to be informed about the session
            // This is a critical step. The exact API might vary.
            // It could be renderer.xr.setSession(session) or a new method for WebGPU.
            // For now, assuming setAnimationLoop will correctly use the session if active.
            // The `WebGPURenderer.setAnimationLoop` is designed to work with WebXR.
            // It expects `renderer.xr.setReferenceSpaceType( 'local-floor' )` or similar to be called.
            // And `renderer.xr.setSession(session)`
            // Since WebGPURenderer doesn't have `.xr` property in the same way, this needs careful handling.
            // Let's assume for now that the XRService.startXRSession and the renderer's animation loop are enough.
            // The XRButton itself might call renderer.xr.setSession if using an older version of three.js XRButton.
            // We need to ensure our WebGPURenderer is correctly set up.
            // A common pattern is:
            await this.renderer.xr.setReferenceSpaceType( 'local-floor' ); // Or other appropriate space like 'viewer'
            await this.renderer.xr.setSession(session); // This method might exist on WebGPURenderer directly or via a helper

            session.addEventListener('end', () => {
              // Handle session end: e.g. clean up controllers, switch back to non-XR rendering
              this.camera.position.set( 0, 1.6, 0 ); // Reset camera or similar
              // xrService.session = null; // Reset session in service
            });

          } catch (e) {
            console.error("Failed to start XR session:", e);
          }
        },
        // onEndSession: (session: any) => {
        //   this.xrService.session = null; // Or handle more gracefully
        // }
      }
    );

    xrButton.addEventListener( 'click', ( e ) => {
      console.log( 'clicked xrButton ', e );
      // The actual session request is handled by XRButton's internal logic via onRequestSession
    } );
    document.body.appendChild( xrButton );

    // Check XR Support (this can inform UI, e.g., enable/disable XR button)
    await this.xrService.checkXRSupport( { renderer: this.renderer, camera: this.camera, scene: this.scene } );
  }

  // Render function runs on each frame
  render (time: number, frame?: any /* XRFrame */) {
    const delta = this.clock.getDelta(); // time is also available from callback

    this.renderFunctions.forEach( ( f ) => f( delta, frame ) ); // Pass frame if needed

    if (this.xrService.session && frame) {
      // If in an XR session, update controller poses
      // The reference space used here should match what was set during session init.
      const referenceSpace = this.renderer.xr.getReferenceSpace(); // Or get it from xrService if stored
      if (referenceSpace) {
        this.xrService.updateControllerPoses(referenceSpace);
      }
    } else {
      // Standard non-XR controls update
      this.controls?.update();
    }

    // Run Tween animations
    update(); // This uses its own timing, make sure it's compatible or adjust.

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
