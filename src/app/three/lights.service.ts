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
