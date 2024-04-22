import { Injectable } from '@angular/core';

import { Vector3 } from 'three';
import { Tween, Easing } from 'three/examples/jsm/libs/tween.module.js';

@Injectable( {
  providedIn: 'root'
} )
export class LayoutService {

  constructor() { }

  /**
   * parent object is anchored to the top/middle/bottom and left/center/right of the collection. 
   */
  gridLayout ( ops: any ) {
    const n = ops.n || 4;
    const duration = ops.duration || 2000;
    const positions: any[] = [];
    const vector = new Vector3();
    for ( let i = 0; i < ops.objects.length; i++ ) {

      const object = ops.objects[i];

      new Tween( object.position )
        .to( {
          x: ( ( i % 5 ) * n ) - 2 * n,//positions[i].x,
          y: ( - ( Math.floor( i / 5 ) % 5 ) * n ) + 2 * n,
          z: ( Math.floor( i / 25 ) ) * n - 2 * n
        }, Math.random() * duration + duration )
        .easing( Easing.Exponential.InOut )
        .onComplete( () => {
          object.lookAt( new Vector3() );
        } )
        .start();

      // vector.copy( object.position ).multiplyScalar( 2 );

      // TODO: no need for position since the animation is happening here. It's a good idea to bring the calculated positions here
      positions.push( ops.objects[i].position );
      // TODO: needs to reset the orientation, in case if it is called after sphere
    }

    return positions;
  }
  /**
   * Takes number of objects and their width
   * Returns a sphere Layout
   * */
  sphereLayout ( ops: any ) {
    const duration = ops.duration || 2000;
    let r = 8;
    const vector = new Vector3();
    const pos = new Vector3();
    const positions: any[] = [];
    for ( let i = 0, l = ops.objects.length; i < l; i++ ) {
      const object = ops.objects[i];

      // x, y
      const phi = Math.acos( - 1 + ( 2 * i ) / l );
      // z
      const theta = Math.sqrt( l * Math.PI ) * phi;
      pos.setFromSphericalCoords( r, phi, theta );

      positions.push( ops.objects[i].position );

      new Tween( object.position )
        .to( {
          x: pos.x,
          y: pos.y,
          z: pos.z
        }, Math.random() * duration + duration )
        .easing( Easing.Exponential.InOut )
        .onComplete( () => {
          object.lookAt( vector );
        } )
        .start();


      object.position.matrixWorldNeedsUpdate = true;

    }


    return positions;
  }

  cylindricalLayout ( ops: any ) {

    const duration = ops.duration || 2000;
    let r = 8;
    const vector = new Vector3();
    const pos = new Vector3();
    const positions: any[] = [];
    for ( let i = 0, l = ops.objects.length; i < l; i++ ) {
      const object = ops.objects[i];
      let y;
      let theta;
      // TODO: paramatarize
      if ( i < 15 ) {
        y = 1;
        theta = 2 * Math.PI / 15 * i;
      }
      if ( i < 24 && i >= 15 ) {
        r = 7;
        y = r / 3 + 1;
        theta = 2 * Math.PI / 9 * ( i - 15 );
      }
      else if ( i >= 24 && i < 30 ) {
        r = 6;
        y = 2 * r / 3 + 1;
        theta = 2 * Math.PI / 6 * ( i - 24 );
      }

      pos.setFromCylindricalCoords( r, theta, y );

      positions.push( ops.objects[i].position );

      new Tween( object.position )
        .to( {
          x: pos.x,
          y: pos.y,
          z: pos.z
        }, Math.random() * duration + duration )
        .easing( Easing.Exponential.InOut )
        .onComplete( () => {
          object.lookAt( vector );
        } )
        .start();


      object.position.matrixWorldNeedsUpdate = true;
    }
    return positions;
  }

  /**
   * 
   * @param ops Takes an array of objects and a range
   * returs scattered objects 
   */
  scatterLayout ( ops: any ) {
    const positions: any[] = [];
    const duration = ops.duration || 2000;
    const n = 20;
    let w = ops.width || window.innerWidth / n;
    let h = ops.width || window.innerHeight / n;
    let d = ops.depth || window.innerWidth / n;
    for ( let i = 0; i < ops.objects.length; i++ ) {

      const object = ops.objects[i];
      new Tween( object.position )
        .to( {
          x: w * Math.random() - w / 2,
          y: h * Math.random() - h / 2,
          z: d * Math.random() - d / 2
        }, Math.random() * duration + duration )
        .easing( Easing.Exponential.InOut )
        .onComplete( () => {
          object.lookAt( new Vector3() );
        } )
        .start();
    }
    return positions;
  }

  wavesLayout ( ops: any ) {
    let positions = [];
    let scales = [];
    let i = 0, j = 0;

    for ( let ix = 0; ix < ops.amountX; ix++ ) {

      for ( let iy = 0; iy < ops.amountY; iy++ ) {

        positions[i + 1] = ( Math.sin( ( ix + ops.count ) * 0.3 ) * 50 ) +
          ( Math.sin( ( iy + ops.count ) * 0.5 ) * 50 );

        scales[j] = ( Math.sin( ( ix + ops.count ) * 0.3 ) + 1 ) * 20 +
          ( Math.sin( ( iy + ops.count ) * 0.5 ) + 1 ) * 20;

        i += 3;
        j++;

      }
    }
  }
}
