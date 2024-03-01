import { Injectable } from '@angular/core';
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry } from 'three';

@Injectable( {
  providedIn: 'root'
} )
export class PrimitivesService {
  public material = new MeshBasicMaterial( { color: 0x00ff00 } );
  public floorMaterial = new MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } );
  constructor() { }

  createPlane ( ops: any ) {
    const geo = ops.size ? new PlaneGeometry( ops.size, ops.size ) : new PlaneGeometry();
    const mesh = new Mesh( geo, ops.material || this.floorMaterial );
    return mesh;
  }

  createBox () {
    const boxGeo = new BoxGeometry( 10, 10, 10 );
    const material = new MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new Mesh( boxGeo, material );
    cube.position.y = 1;
    cube.rotation.x = Math.PI / 6;
    return cube;
  }
}
