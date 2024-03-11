import { Injectable } from '@angular/core';
import { Vector3 } from 'three';

@Injectable( {
  providedIn: 'root'
} )
export class LayoutService {

  targets = { scatter: [], sphere: [], grid: [] };

  constructor() { }

  // TODO: Sphere, Cylinder, grid, Plane, scatter, Grid, Prism Layouts

  /**
   * parent object is anchored to the top/middle/bottom and left/center/right of the collection. 
   * Layout order: https://learn.microsoft.com/en-us/windows/mixed-reality/mrtk-unity/mrtk2/features/ux-building-blocks/object-collection?view=mrtkunity-2022-05#gridobjectcollection-layout-order
   */
  gridLayout ( ops: any ) {
    const n = ops.n || 4;
    for ( let i = 0; i < ops.objects.length; i++ ) {
      ops.objects[i].position.x = ( ( i % 5 ) * n ) - 2 * n;
      ops.objects[i].position.y = ( - ( Math.floor( i / 5 ) % 5 ) * n ) + 2 * n;
      ops.objects[i].position.z = ( Math.floor( i / 25 ) ) * n - 2 * n;
    }
  }
  /**
   * Takes number of objects and their width
   * Returns a sphere Layout
   * */
  sphereLayout ( ops: any ) {
    const vector = new Vector3();
    for ( let i = 0, l = ops.objects.length; i < l; i++ ) {
      const object = ops.objects[i];
      const phi = Math.acos( - 1 + ( 2 * i ) / l );
      const theta = Math.sqrt( l * Math.PI ) * phi;
      object.position.setFromSphericalCoords( 8, phi, theta );

      vector.copy( object.position ).multiplyScalar( 2 );

      object.lookAt( vector );
      object.position.matrixWorldNeedsUpdate = true;
    }
  }
  /**
   * 
   * @param ops Takes an array of objects and a range
   * returs scattered objects 
   */
  scatterLayout ( ops: any ) {
    let w = ops.width || window.innerWidth;
    let h = ops.width || window.innerHeight;
    let d = ops.depth || 200;
    for ( let i = 0; i < ops.objects.length; i++ ) {
      ops.objects[i].position.x = w * Math.random() - w / 2;
      ops.objects[i].position.y = h * Math.random() - h / 2;
      ops.objects[i].position.z = d * Math.random() - d / 2;
    }
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
