import { Injectable, signal, WritableSignal } from '@angular/core';
import { WebGLRenderer } from 'three';

@Injectable( {
  providedIn: 'root'
} )
export class XRService {
  vrSupported = false;
  arSupported = false;
  xrMode: WritableSignal<string> = signal( 'inline' );
  webXRManager: any;

  constructor() { }

  // Check XR Support and determine if the session is AR or VR

  checkXRSupport ( renderer: WebGLRenderer ) {
    if ( this.vrSupported || this.arSupported ) { return true; }
    else if ( navigator.xr ) {
      // Starts the inline session and init AR/VR depending on xrMode

      navigator.xr.isSessionSupported( 'immersive-vr' ).then( ( supported ) => {
        this.vrSupported = true;
        this.xrMode.set( 'immersive-vr' );
        console.log( 'VR supported ', supported );
      } );

      navigator.xr.isSessionSupported( 'immersive-ar' ).then( ( supported ) => {
        this.arSupported = true;
        console.log( 'AR supported ', supported );
        this.xrMode.set( 'immersive-ar' );
      } );
      this.webXRManager = renderer.xr;


      this.initXR();
      return true;
    }
    return false;
  }

  // Initiate an XR session 
  initXR () {
    this.webXRManager.enabled = true;

  }
}
