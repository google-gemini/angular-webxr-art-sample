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

import { Injectable, WritableSignal, signal } from '@angular/core';

import { LoadingManager, Object3D, TextureLoader } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable( {
  providedIn: 'root',
} )
export class LoadersService {
  public loadingProgress: WritableSignal<number> = signal( 0 );
  private loadingManager = new LoadingManager();
  private gltfLoader = new GLTFLoader( this.loadingManager );
  public textureLoader: TextureLoader = new TextureLoader( this.loadingManager );
  private dracoLoader = new DRACOLoader( this.loadingManager );
  private loadStartTime = Date.now();

  constructor() {
    // Set up the loading manager with start, progress, load, and error functions
    this.loadingManager.onStart = (
      url: string,
      itemsLoaded: number,
      itemsTotal: number
    ) => {
      this.loadStartTime = Date.now();
      this.onStart( url, itemsLoaded, itemsTotal );
    };

    this.loadingManager.onProgress = (
      url: string,
      itemsLoaded: number,
      itemsTotal: number
    ) => {
      console.log(
        `Loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`
      );
      this.loadingProgress.set( ( itemsLoaded * 100 ) / itemsTotal );
    };

    this.loadingManager.onLoad = () => {
      this.loadingProgress.set( 100 );
      const time = Date.now();
      const elapsedSec = ( time - this.loadStartTime ) / 1000;
      console.log( `Loading complete, seconds elapsed = ${elapsedSec}` );

    };

    this.loadingManager.onError = ( url: string ) => {
      console.error( 'There was an error loading ' + url );

    };

    // Configure and create Draco decoder
    this.dracoLoader.setDecoderPath( //'/examples/jsm/libs/draco/'
      'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'
    );
    this.dracoLoader.setDecoderConfig( { type: 'js' } );
    this.dracoLoader.preload();
    this.gltfLoader.setDRACOLoader( this.dracoLoader );

  }

  // Load a GLTF model
  loadGLTF ( ops: {
    path: string;
    onLoadCB: Function;
    onLoadProgress?: Function;
  } ) {

    this.gltfLoader.load(
      ops.path,
      ( gltf ): Object3D => {
        const model = gltf.scene;
        // console.log( 'gltf ', gltf );
        ops.onLoadCB( model );
        return model;
      },
      ( xhr: any ) => {
        ops.onLoadProgress && ops.onLoadProgress( xhr );
      },
      ( err ) => {
        console.error( 'Error loading model ', err );
      }
    );

  }

  // Load a texture
  loadTexture ( path: string ) {

    return this.textureLoader.load( path );

  }

  // Loading manager function to run on every file load
  onStart ( url: string, item: any, total: any ) {

    console.log(
      `Started loading file: ${url}. Now loading item ${item} of ${total}.`
    );

  }
}
