import { Injectable, signal, WritableSignal } from '@angular/core';

import * as m from 'gl-matrix';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Ray, RingGeometry, Vector3, WebGLRenderer } from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';


@Injectable( {
  providedIn: 'root'
} )
export class XRService {
  vrSupported = false;
  arSupported = false;
  xrMode: WritableSignal<string> = signal( 'inline' );
  webXRManager: any;
  renderer: WebGLRenderer;
  session: any;
  scene: any;

  inlineSession: any;
  xrImmersiveRefSpace: any;
  controllers: any;
  userData = {
    isSelecting: false,
  };
  controllerLeft: any;
  controllerRight: any;

  constructor() { }

  // Check XR Support and determine if the session is AR or VR

  checkXRSupport ( ops: { renderer: WebGLRenderer, camera: any, scene: any; } ) {
    if ( this.vrSupported || this.arSupported ) { return true; }
    else if ( navigator.xr ) {
      // Starts the inline session and init AR/VR depending on xrMode

      navigator.xr.isSessionSupported( 'immersive-vr' ).then( ( supported ) => {
        this.vrSupported = true;
        this.xrMode.set( 'immersive-vr' );
        console.log( 'VR supported ', supported );
      } );

      navigator.xr.isSessionSupported( 'immersive-ar' ).then( ( supported ) => {
        this.arSupported = true;
        console.log( 'AR supported ', supported );
        this.xrMode.set( 'immersive-ar' );
      } );


      this.initXR( ops );
      return true;
    }
    return false;
  }

  // Initiate an XR session 
  initXR ( ops: any ) {
    this.renderer = ops.renderer;
    this.scene = ops.scene;
    this.webXRManager = ops.renderer.xr;
    // console.log( 'webXRManager ', this.webXRManager );
    this.webXRManager.enabled = true;
    this.session = this.webXRManager.getSession();
    // console.log( 'xrSession ', this.session );
    this.initVR();
    if ( this.xrMode() === 'immersive-vr' ) {
      this.initVR();
    } else if ( this.xrMode() === 'immersive-ar' ) {
      this.initAR();
    }
  }

  initVR () {
    this.controllerLeft = this.initController( this.renderer.xr.getController( 0 ), 0 );
    this.controllerRight = this.initController( this.renderer.xr.getController( 1 ), 1 );
  }

  initController ( controller: any, i: number ) {

    controller.addEventListener( 'selectstart', this.onSelectStart.bind( this ) );
    controller.addEventListener( 'select', this.onSelect.bind( this ) );
    controller.addEventListener( 'selectend', this.onSelectEnd.bind( this ) );
    controller.addEventListener( 'connected', ( event: any ) => {

      let geometry, material;
      console.log( 'Controller connected', event.data.targetRayMode );

      switch ( event.data.targetRayMode ) {

        case 'tracked-pointer':

          geometry = new BufferGeometry();
          geometry.setAttribute( 'position', new Float32BufferAttribute( [0, 0, 0, 0, 0, - 1], 3 ) );
          geometry.setAttribute( 'color', new Float32BufferAttribute( [0.5, 0.5, 0.5, 0, 0, 0], 3 ) );

          material = new LineBasicMaterial( { vertexColors: true, blending: AdditiveBlending } );

          return new Line( geometry, material );

        case 'gaze':

          geometry = new RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
          material = new MeshBasicMaterial( { opacity: 0.5, transparent: true } );
          return new Mesh( geometry, material );
        default:
          geometry = new RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
          material = new MeshBasicMaterial( { opacity: 0.5, transparent: true } );
          return new Mesh( geometry, material );
      }
      // @ts-ignore
      // this.parent.add(this.buildController(event.data))
      // this.add(this.buildController(event.data));

    } );
    controller.addEventListener( 'disconnected', function () {
      console.log( 'Controller disconnected' );
      // this.remove(this.children[0]);

    } );
    const controllerModelFactory = new XRControllerModelFactory();

    const controllerGrip = this.renderer.xr.getControllerGrip( i );
    controllerGrip.add( controllerModelFactory.createControllerModel( controllerGrip ) );
    this.scene.add( controllerGrip );

    const geometry = new BufferGeometry().setFromPoints( [new Vector3( 0, 0, 0 ), new Vector3( 0, 0, - 1 )] );

    const line = new Line( geometry );
    line.name = 'line';
    line.scale.z = 5;

    controller.add( line.clone() );
    this.scene.add( controller );
    return controller;
  }


  onSqueze ( e: any ) {
    console.log( 'Squuze event VR', e );

  };

  onSelectStart ( e: any ) {
    console.log( 'Select Start VR event ', e );
    this.userData.isSelecting = true;
    // this.interactions.intersectObjects({ controller: this.controllerLeft, scene: this.scene });
    // this.interactions.intersectObjects({ controller: this.controllerRight, scene: this.scene });

  };

  onSelect ( e: Event ) {
    console.log( 'Select VR event ', e );
    // this.interactions.intersectObjects( { controller: this.controllerLeft, scene: this.scene, select: true } );
    // this.interactions.intersectObjects( { controller: this.controllerRight, scene: this.scene, select: true } );
  }

  onSelectEnd ( e: any ) {
    console.log( 'Select End VR event ', e );
    this.userData.isSelecting = false;
    // TODO: Needed for hover events only
    // this.interactions.intersectObjects({ controller: this.controllerLeft, scene: this.scene });
  }

  initAR () {
    console.log( 'Initializing AR' );

  }

  updateInputSources ( session = this.session, frame: any, refSpace: any, scene = this.scene ) {
    console.log( 'updateInputSources ', session, frame, refSpace, scene );
    let vec3 = m.vec3;
    for ( let inputSource of session.inputSources ) {
      let targetRayPose = frame.getPose( inputSource.targetRaySpace, refSpace );

      // We may not get a pose back in cases where the input source has lost
      // tracking or does not know where it is relative to the given frame
      // of reference.
      if ( !targetRayPose ) {
        continue;
      }

      if ( inputSource.targetRayMode == 'tracked-pointer' ) {
        // If we have a pointer matrix and the pointer origin is the users
        // hand (as opposed to their head or the screen) use it to render
        // a ray coming out of the input device to indicate the pointer
        // direction.
        scene.inputRenderer.addLaserPointer( targetRayPose.transform );
      }

      // If we have a pointer matrix we can also use it to render a cursor
      // for both handheld and gaze-based input sources.

      // Statically render the cursor 2 meters down the ray since we're
      // not calculating any intersections in this sample.
      let targetRay = new Ray( targetRayPose.transform );
      let cursorDistance = 2.0;
      let cursorPos = vec3.fromValues(
        targetRay.origin.x,
        targetRay.origin.y,
        targetRay.origin.z
      );
      vec3.add( cursorPos, cursorPos, [
        targetRay.direction.x * cursorDistance,
        targetRay.direction.y * cursorDistance,
        targetRay.direction.z * cursorDistance,
      ] );
      // vec3.transformMat4(cursorPos, cursorPos, inputPose.targetRay.transformMatrix);

      scene.inputRenderer.addCursor( cursorPos );

      if ( inputSource.gripSpace ) {
        let gripPose = frame.getPose( inputSource.gripSpace, refSpace );
        if ( gripPose ) {
          // If we have a grip pose use it to render a mesh showing the
          // position of the controller.
          scene.inputRenderer.addController( gripPose.transform.matrix, inputSource.handedness );
        }
      }

    }

  }

  // onXRFrame(t: any, frame: any) {
  //   let session = frame.session;
  //   let refSpace = session.isImmersive ?
  //     xrImmersiveRefSpace :
  //     this.inlineViewerHelper.referenceSpace;
  //   let pose = frame.getViewerPose(refSpace);

  //   this.scene.startFrame();

  //   session.requestAnimationFrame(this.onXRFrame);

  //   this.updateInputSources(session, frame, refSpace);

  //   this.scene.drawXRFrame(frame, pose);

  //   this.scene.endFrame();
  // }
}
