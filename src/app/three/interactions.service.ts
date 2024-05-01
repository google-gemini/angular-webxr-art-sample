import { Injectable } from '@angular/core';

import { Camera, Matrix4, Object3D, Raycaster, Vector2, Vector3, WebGLRenderer } from 'three';
import { InteractionManager } from 'three.interactive';
import { ColliderObjectModel, ColliderOptions } from './webxr.model';

@Injectable( {
  providedIn: 'root'
} )
export class InteractionsService {

  interactionManager: InteractionManager;
  intersected: any;
  colliders: any = {};
  ui: any = {};

  rect: any;
  pointer = new Vector2();
  colliderOptions: ColliderOptions = {
    name: 'object',
    mesh: null,
  };
  selectedObject: any;
  intersectedObjects: any[] = [];

  raycasterOptions: any = {
    origin: new Vector3( 0, 0, 0 ),
    direction: null,
    near: 0,
    far: 10
  };

  raycaster: Raycaster = new Raycaster();
  tempMatrix = new Matrix4();
  constructor() { }

  initInteractionManager ( renderer: WebGLRenderer, camera: Camera, canvas: HTMLCanvasElement ) {
    this.interactionManager = new InteractionManager(
      renderer,
      camera,
      canvas
    );

    return this.interactionManager.update.bind( this );
  }

  addToInteractions ( mesh: Object3D ) {
    this.interactionManager.add( mesh );
  }

  raycast () {
    const objsToTest = this.intersectedObjects;
    return objsToTest.reduce( ( closestIntersection: any, obj: any ) => {

      const intersection = this.raycaster.intersectObject( obj, true );

      if ( !intersection[0] ) return closestIntersection;

      if ( !closestIntersection || intersection[0].distance < closestIntersection.distance ) {

        intersection[0].object = obj;

        return intersection[0];

      }

      return closestIntersection;

    }, null );

  }

  /**
 * TODO: Works only for UI now
 * @param ops
 * @returns selected object
 */
  intersectObjects ( ops: any ) {

    // Find closest intersecting object

    let intersect: any;

    if ( ops.pointer && ops.pointer.x !== null && ops.pointer.y !== null ) {
      this.raycaster.setFromCamera( ops.pointer, ops.camera );

    } else {
      this.tempMatrix.identity().extractRotation( ops.controller.matrixWorld );

      this.raycaster.ray.origin.setFromMatrixPosition( ops.controller.matrixWorld );
      this.raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.tempMatrix );
      // console.log( 'setting ray from controller ', this.raycaster.ray.origin, this.raycaster.ray.direction );

    }

    intersect = this.raycast();
    return intersect && this.colliders[intersect.object['uuid']]();
  }

  removeFromColliders ( name: string ) {
    this.colliders = this.colliders.filter( ( obj: ColliderObjectModel ) => {
      return obj.name !== name;
    } );
  }

  setRay ( ops: any ) {
    this.raycaster.setFromCamera( ops.pointer, ops.camera );
  }

  addToColliders ( ops: any ) {
    this.intersectedObjects.push( ops.mesh );
    const obj = Object.assign( {}, this.colliderOptions, ops );
    this.colliders[ops.mesh.uuid] = ops.cb;

  }

  update () {
    this.interactionManager.update();
  }
}
