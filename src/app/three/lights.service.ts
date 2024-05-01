import { Injectable } from '@angular/core';
import { HemisphereLight, SpotLight } from 'three';

@Injectable( {
  providedIn: 'root'
} )
export class LightsService {
  private intensity = Math.PI;
  // color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float
  private spotLight = new SpotLight( 0xffffff, 30, 30, this.intensity / 4, 0.5 );


  createHemLight ( ops?: any ) {
    const hemLight = new HemisphereLight( 0xf6a96a, 0x9fc3f9, 0.8 );
    hemLight.color.setHSL( 0.6, 1, 0.6 );
    hemLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemLight.position.set( -0.6, -2, -6 );
    return hemLight;

  }

  createSpotLight () {
    const sLight = this.spotLight.clone();
    // sLight.castShadow = true;
    // sLight.shadow.bias = -0.001;
    // sLight.shadow.mapSize.width = 512;
    // sLight.shadow.mapSize.height = 512;
    // sLight.shadow.camera.near = 0.1;
    // sLight.shadow.camera.far = 100;
    // sLight.shadow.camera.fov = 30;
    return sLight;
  }
}
