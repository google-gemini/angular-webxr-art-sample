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

import { inject, Injectable } from '@angular/core';

import { CanvasTexture, MeshPhysicalMaterial, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, Vector2 } from 'three';
import { LoadersService } from './loaders.service';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js';

@Injectable( {
  providedIn: 'root'
} )
export class MaterialsService {
  private flakesNormalMap = new CanvasTexture( new FlakesTexture() );

  private loadersService = inject( LoadersService );

  constructor() { }

  createPhongMaterial ( ops: any ) {

  }

  createLogoMaterial ( ops?: any ) {
    let material = new MeshPhysicalMaterial( {
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      metalness: 0.9,
      roughness: 0.5,
      color: ops.color || 0x0000ff,
      normalMap: this.flakesNormalMap,
      normalScale: new Vector2( 0.15, 0.15 )
    } );
    return material;
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
