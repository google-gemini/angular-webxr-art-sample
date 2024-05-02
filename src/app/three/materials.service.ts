import { inject, Injectable } from '@angular/core';

import { MeshPhysicalMaterial, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace } from 'three';
import { LoadersService } from './loaders.service';

@Injectable( {
  providedIn: 'root'
} )
export class MaterialsService {

  private loadersService = inject( LoadersService );

  constructor() { }

  createPhongMaterial ( ops: any ) {

  }

  createMeshPhysicalMaterial ( ops?: any ) {
    let material = new MeshPhysicalMaterial( {
      // clearcoat: 0,
      clearcoatRoughness: 0.1,
      // metalness: 0,
      roughness: 0.9,
      color: 0x54001b// Teal: 0x004a54,
      // normalScale: new Vector2(0.15, 0.15)
    } );

    return material;
  };


  createFloorMaterial () {

    const floorMat = new MeshStandardMaterial( {
      roughness: 0.8,
      color: 0xffffff,
      metalness: 0.2,
      bumpScale: 0.0005
    } );

    // Diffuse 
    this.loadersService.textureLoader.load( 'assets/textures/hardwood_diffuse.jpg', ( map ) => {
      map.wrapS = RepeatWrapping;
      map.wrapT = RepeatWrapping;
      map.anisotropy = 16;
      map.repeat.set( 10, 24 );
      map.colorSpace = SRGBColorSpace;
      floorMat.map = map;
      floorMat.needsUpdate = true;
    },
      undefined,
      // onError callback
      function ( err ) {
        console.error( 'Bump texture failed to load.' );

      }
    );

    this.loadersService.textureLoader.load( 'assets/textures/hardwood_bump.jpg', function ( map ) {

      map.wrapS = RepeatWrapping;
      map.wrapT = RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set( 10, 24 );
      floorMat.bumpMap = map;
      floorMat.needsUpdate = true;

    },
      undefined,
      // onError callback
      function ( err ) {
        console.error( 'Bump texture failed to load.' );

      } );

    this.loadersService.textureLoader.load( 'assets/textures/hardwood_roughness.jpg', function ( map ) {

      map.wrapS = RepeatWrapping;
      map.wrapT = RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set( 10, 24 );
      floorMat.roughnessMap = map;
      floorMat.needsUpdate = true;

    },
      undefined,
      // onError callback
      function ( err ) {
        console.error( 'Bump texture failed to load.' );

      }
    );

    return floorMat;

  }

}
