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

import { inject, Injectable, signal, WritableSignal } from '@angular/core';

import * as m from 'gl-matrix';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Ray, RingGeometry, Vector3, WebGPURenderer } from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { InteractionsService } from './interactions.service';


@Injectable( {
  providedIn: 'root'
} )
export class XRService {
  private interactions = inject( InteractionsService );

  vrSupported = false;
  arSupported = false;
  xrMode: WritableSignal<string> = signal( 'inline' );
  // webXRManager: any; // Likely not used directly with WebGPURenderer
  renderer: WebGPURenderer;
  session: any; // This will be an XRSession
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

  async checkXRSupport ( ops: { renderer: WebGPURenderer, camera: any, scene: any; } ) {
    if ( navigator.xr ) {
      try {
        const vrSupported = await navigator.xr.isSessionSupported( 'immersive-vr' );
        this.vrSupported = vrSupported;
        if (vrSupported) this.xrMode.set( 'immersive-vr' );

        const arSupported = await navigator.xr.isSessionSupported( 'immersive-ar' );
        this.arSupported = arSupported;
        // AR might take precedence or be preferred depending on device
        if (arSupported) this.xrMode.set( 'immersive-ar' );

        // TODO: initXR logic needs to be called after a session is started,
        // not directly here. The XRButton usually handles session request.
        // this.initXR( ops );

      } catch (e) {
        console.error("Error checking XR support:", e);
        return false;
      }
      return this.vrSupported || this.arSupported;
    }
    return false;
  }

  // Initiate an XR session - This will be called by XRButton or similar UI
  // The renderer needs to be associated with the session.
  async startXRSession ( session: any /*XRSession*/ ) {
    this.session = session;
    // For WebGPURenderer, we might need to set the session on the renderer
    // or configure its context/layers. This part is speculative.
    // await this.renderer.setReferenceSpaceType( 'local-floor' ); // Or other appropriate space
    // await this.renderer.xr.setSession(session); // This is WebGL style, find WebGPU equivalent

    // The animation loop should handle render calls.
    // Ensure the renderer's animation loop is XR compatible.

    this.initXRControllers();
  }

  initXRControllers () {
    // Controller setup will change as renderer.xr.getController is WebGL specific.
    // Input sources are obtained from the XRSession.
    this.session.addEventListener('inputsourceschange', this.onInputSourcesChange.bind(this));

    // Initial setup for connected controllers
    this.session.inputSources.forEach((inputSource: any) => {
      this.addController(inputSource);
    });
  }

  addController(inputSource: any) {
    // Simplified: In a real app, you'd check handedness etc.
    // and create appropriate controller models.
    if (!this.controllerLeft && inputSource.handedness === 'left') {
      this.controllerLeft = this.initController(inputSource, 0);
    } else if (!this.controllerRight && inputSource.handedness === 'right') {
      this.controllerRight = this.initController(inputSource, 1);
    }
  }

  removeController(inputSource: any) {
    if (this.controllerLeft && this.controllerLeft.inputSource === inputSource) {
      // Clean up scene, event listeners for controllerLeft
      this.scene.remove(this.controllerLeft);
      this.controllerLeft = null;
    }
    if (this.controllerRight && this.controllerRight.inputSource === inputSource) {
      // Clean up scene, event listeners for controllerRight
      this.scene.remove(this.controllerRight);
      this.controllerRight = null;
    }
  }

  onInputSourcesChange(event: any) {
    event.added.forEach((inputSource: any) => this.addController(inputSource));
    event.removed.forEach((inputSource: any) => this.removeController(inputSource));
  }


  initController ( inputSource: any, i: number ) {
    // The old method took a Three.js WebXRController object.
    // New method takes an XRInputSource.
    // We need to create the visual representation (line, model) and add it to the scene.
    // The ray (line) and model are usually parented to a controller object that gets its pose from the inputSource.

    const controller = new Object3D(); // Using Object3D as a placeholder for the controller.
    controller.userData.inputSource = inputSource; // Keep track of the source
    this.scene.add(controller);

    // Setup event listeners directly on the inputSource if possible, or manage through session events
    // 'selectstart', 'select', 'selectend' are standard XRInputSource events
    // The original code added listeners to controller objects obtained from renderer.xr.getController()
    // For WebGPU, you'd typically handle this from session.onselectstart etc. or by checking inputSource.gamepad.buttons

    // Example: Ray
    const geometry = new BufferGeometry().setFromPoints( [new Vector3( 0, 0, 0 ), new Vector3( 0, 0, - 1 )] );
    const line = new Line( geometry );
    line.name = 'line';
    line.scale.z = 5;
    controller.add( line.clone() );

    // Controller model (simplified)
    const controllerModelFactory = new XRControllerModelFactory();
    if (inputSource.gripSpace) {
        // This part needs the renderer to get the grip which might be an issue.
        // The gripSpace from XRInputSource should be used.
        // const controllerGrip = this.renderer.xr.getControllerGrip( i ); // This is WebGL specific
        // For now, let's assume we can create a model and add it.
        // This part needs more investigation for WebGPURenderer.
    }

    // Update controller pose in the render loop based on inputSource.targetRaySpace and inputSource.gripSpace
    // This is a significant change from the WebGL path.
    // The render loop in SceneComponent will need to call a method here to update controller poses.

    // Add event listeners (conceptual, actual implementation might differ)
    // This replaces controller.addEventListener(...)
    // selectstart, select, selectend events are on the XRSession
    this.session.addEventListener('selectstart', (event: any) => {
      if (event.inputSource === inputSource) this.onSelectStart(event);
    });
    this.session.addEventListener('select', (event: any) => {
      if (event.inputSource === inputSource) this.onSelect(event);
    });
    this.session.addEventListener('selectend', (event: any) => {
      if (event.inputSource === inputSource) this.onSelectEnd(event);
    });

    return controller; // Return the Object3D representing the controller
  }


  updateControllerPoses(referenceSpace: any) {
    if (!this.session) return;

    // Update left controller
    if (this.controllerLeft && this.controllerLeft.userData.inputSource) {
      const inputSource = this.controllerLeft.userData.inputSource;
      const pose = this.session.frame?.getPose(inputSource.targetRaySpace, referenceSpace);
      if (pose) {
        this.controllerLeft.position.copy(pose.transform.position);
        this.controllerLeft.quaternion.copy(pose.transform.orientation);
      }
    }

    // Update right controller
    if (this.controllerRight && this.controllerRight.userData.inputSource) {
      const inputSource = this.controllerRight.userData.inputSource;
      const pose = this.session.frame?.getPose(inputSource.targetRaySpace, referenceSpace);
      if (pose) {
        this.controllerRight.position.copy(pose.transform.position);
        this.controllerRight.quaternion.copy(pose.transform.orientation);
      }
    }
  }

  onSqueze ( e: any ) { // This was unused

  };

  onSelectStart ( event: any ) { // event is now XRInputSourceEvent
    this.userData.isSelecting = true;
    // Pass the inputSource to intersectObjects, or the corresponding controller Object3D
    const controller = event.inputSource === this.controllerLeft?.userData.inputSource ? this.controllerLeft : this.controllerRight;
    if (controller) {
      this.interactions.intersectObjects( { controller: controller, scene: this.scene } );
    }
  };

  onSelect ( event: any ) { // event is now XRInputSourceEvent
    const controller = event.inputSource === this.controllerLeft?.userData.inputSource ? this.controllerLeft : this.controllerRight;
    if (controller) {
      this.interactions.intersectObjects( { controller: controller, scene: this.scene, select: true } );
    }
  }

  onSelectEnd ( event: any ) { // event is now XRInputSourceEvent
    this.userData.isSelecting = false;
    const controller = event.inputSource === this.controllerLeft?.userData.inputSource ? this.controllerLeft : this.controllerRight;
    if (controller) {
      // Original logic only used controllerLeft for select end. Replicating that.
      this.interactions.intersectObjects( { controller: this.controllerLeft, scene: this.scene } );
    }
  }

  initAR () {
    // AR initialization might also need changes, similar to VR.
    // navigator.xr.requestSession('immersive-ar', { optionalFeatures: ['local-floor', 'bounded-floor'] })
    // and then handle the session.
  }

  // updateInputSources is largely superseded by the new controller update mechanism
  // and event handling. It was very WebGL specific.
  // Keeping it here for reference, but it should be removed or refactored.
  /* updateInputSources ( session = this.session, frame: any, refSpace: any, scene = this.scene ) {

    let vec3 = m.vec3;
    for ( let inputSource of session.inputSources ) {
      let targetRayPose = frame.getPose( inputSource.targetRaySpace, refSpace );

    let vec3 = m.vec3;
    for ( let inputSource of session.inputSources ) {
      let targetRayPose = frame.getPose( inputSource.targetRaySpace, refSpace );

      // ... (rest of the old updateInputSources method) ...
    }

  }
*/
}
