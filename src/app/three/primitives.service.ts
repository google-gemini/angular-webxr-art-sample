import { Injectable } from '@angular/core';

import { BoxGeometry, CanvasTexture, InstancedMesh, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, PlaneGeometry, RepeatWrapping, SphereGeometry, Vector2 } from 'three';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js';

@Injectable( {
  providedIn: 'root'
} )
export class PrimitivesService {
  public material = new MeshBasicMaterial( { color: 0x00ff00 } );
  public floorMaterial = new MeshPhongMaterial( { color: 'white', depthWrite: false } );
  constructor() { }

  createInstancedMesh ( options: any ) {
    const ops = Object.assign( {}, { geometry: new BoxGeometry(), material: this.material, count: 100 } );
    // ops.geometry.scale( 0.2, 0.2, 0.2 );
    const mesh = new InstancedMesh( ops.geometry, ops.material, ops.count );
    // mesh.instanceMatrix.setUsage( DynamicDrawUsage );
    mesh.matrixWorldNeedsUpdate = true;
    console.log( 'Mesh ', mesh );
    return mesh;
  }

  createPlane ( ops: any ) {
    const geo = ops.size ? new PlaneGeometry( ops.width, ops.height ) : new PlaneGeometry();
    const mesh = new Mesh( geo, ops.material || this.floorMaterial );
    return mesh;
  }

  createBox ( ops: any ) {
    const boxGeo = new BoxGeometry( ops.x, ops.y, ops.z );
    const normalMap3 = new CanvasTexture( new FlakesTexture() );
    normalMap3.wrapT = RepeatWrapping;
    normalMap3.wrapS = RepeatWrapping;
    normalMap3.repeat.x = 50;
    normalMap3.repeat.y = 30;
    normalMap3.anisotropy = 16;
    let material = ops.material || new MeshPhysicalMaterial( {
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      metalness: 0.9,
      roughness: 0.5,
      color: 0x00ffff,
      normalMap: normalMap3,
      normalScale: new Vector2( 0.15, 0.15 )
    } );
    //const material = ops.material || new MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: 0 } );//new MeshNormalMaterial();//new MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new Mesh( boxGeo, material );
    cube.position.y = 1;
    return cube;
  }

  createSphere ( ops: any ) {
    const geo = new SphereGeometry( 0.2 );
    const material = new MeshNormalMaterial();
    const sphere = new Mesh( geo, material );
    return sphere;
  }
}
