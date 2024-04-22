import { Injectable } from '@angular/core';

import { Color } from 'three';
import { range } from 'three/examples/jsm/nodes/nodes.js';

@Injectable( {
  providedIn: 'root'
} )
export class MaterialsService {
  phongDefaults = {

  };
  // random colors between instances from 0x000000 to 0xFFFFFF

  randomColors: any = range( new Color( 0x000000 ), new Color( 0xFFFFFF ) );
  constructor() { }

  createPhongMaterial ( ops: any ) {

  }

}
