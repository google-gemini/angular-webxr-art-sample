import { inject, Injectable } from '@angular/core';

import { Group, MeshPhongMaterial, SRGBColorSpace, UVMapping } from 'three';

import { Artwork } from '../artworks.service';
import { LoadersService } from './loaders.service';
import { PrimitivesService } from './primitives.service';

@Injectable( {
  providedIn: 'root'
} )
export class FrameService {
  private primitivesService = inject( PrimitivesService );
  private loadersService = inject( LoadersService );
  canvasMaterial: MeshPhongMaterial = new MeshPhongMaterial();

  createCanvas ( options: any ) {
    const ops = Object.assign( {}, { x: 2, y: 2, z: 0.6 }, options, );
    const texture = this.loadersService.loadTexture( ops.artwork.url );
    texture.colorSpace = SRGBColorSpace;
    texture.mapping = UVMapping;
    const canvasMaterial = this.canvasMaterial.clone();
    canvasMaterial.map = texture;

    const canvas = this.primitivesService.createBox( { x: ops.x, y: ops.y, z: ops.z, material: canvasMaterial } );
    canvas.name = `Focused Canvas`;

    return canvas;

  }

  createFrame ( artwork: Artwork ) {
    const frame = new Group();
    frame.name = `Focused Frame`;

    const canvas = this.createCanvas( { artwork: artwork } );
    const box = this.primitivesService.createBox( { x: 4, y: 4, z: 0.5 } );
    frame.add( box, canvas );
    frame.position.y = 1;

    return frame;
  }

  createSmallFrame ( ops: any ) {

    const frame = new Group();
    frame.name = 'Small frame group';
    const box = this.primitivesService.createBox( { x: 2, y: 2, z: 0.3 } );
    const canvas = this.createCanvas( { artwork: ops.artwork, x: 1, y: 1, z: 0.35 } );
    frame.add( box, canvas );

    return frame;

  }

  updateFrame ( ops: any ) {

    const material = ops.frame.children[1].getObjectByName( `Focused Canvas` ).material;
    const texture = this.loadersService.loadTexture( ops.texture );
    texture.colorSpace = SRGBColorSpace;
    texture.mapping = UVMapping;
    material.map = texture;
    material.map.userData = { url: ops.texture };
    material.needsUpdate = true;

  }
}
