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
      // gtag( 'event', 'loaded', {
      //   'description': `All Assets are loaded in ${elapsedSec} seconds`,
      //   'event_category': 'loading',
      //   'event_label': 'initial_loading',
      //   'value': elapsedSec
      // } );
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
        // gtag( 'event', 'error_loading_model', {
        //   'description': `Error loading ${ops.path}`,
        //   'event_category': 'loading',
        //   'event_label': 'loading_model_error',
        //   'non_interaction': true
        // } );
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
