import { Injectable } from '@angular/core';

import { Vector3, Object3D, Scene, PerspectiveCamera, MeshBasicMaterial, WebGLRenderTarget, MeshPhongMaterial, DirectionalLight } from 'three';
import { PrimitivesService } from './primitives.service';

@Injectable( {
  providedIn: 'root'
} )
export class RenderTargetService {


  constructor( private primitives: PrimitivesService ) { }

  // Takes a render target object position
  createRenderTarget ( ops: any ) {
    const functionsToRender = [];
    // Scene
    const scene: Scene = new Scene();


    // WebGL Render Target 
    const renderTargetWidth = ops.width * 512;
    const renderTargetHeight = ops.height * 512;
    const renderTarget = new WebGLRenderTarget( renderTargetWidth, renderTargetHeight );

    // Camera
    const camera = new PerspectiveCamera( ops.camera.fov, ops.width / ops.height, ops.camera.near, ops.camera.far );
    camera.position.set( ops.position.x, ops.position.y, ops.position.z );
    camera.lookAt( new Vector3( ops.width / 2, ops.height / 2, -5 ) );

    // Target Plane
    const targetPlane = this.primitives.createPlane( {
      width: ops.width,
      height: ops.height,
      material: new MeshPhongMaterial( {
        map: renderTarget.texture,
      } )
    } );

    targetPlane.position.set( ops.position.x, ops.position.y, ops.position.z );
    targetPlane.rotation.y = ops.rotation || 0;
    ops.scene.add( targetPlane );

    return [
      () => {
        camera.rotation.x = ops.camera.rotation.x;
        camera.rotation.y = ops.camera.rotation.y;
        camera.rotation.z = ops.camera.rotation.z;
        ops.renderer.setRenderTarget( renderTarget );
        // console.log( 'Running target render func ', camera.rotation.z, ops.camera.rotation.z );
        ops.renderer.render( scene, camera );
        ops.renderer.setRenderTarget( null );
      },
      targetPlane,
      scene
    ];
  }

  addToTargetScene ( ops: any ) {

  }
  // Needs the main scene camera position, renderer, render target position & size.
  // Creates Render Target Scene, Camera Lighting
  // Creates Render Target Object
  // Creates WebGLRenderTarget with the target object width and height
  // Sets the target camera to the target plane position
  // Sets the camera LookAt target to be inside the target plane
  // Maps the target render to the plane material map
  // Adds the target plane to the scene
  // Renders the render target and
  // sets the Render target to null before the primary scene renders.
  // Returns the render target texture to be mapped and 

}
