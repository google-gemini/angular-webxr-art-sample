import { inject, Injectable } from '@angular/core';
import { Artwork } from '../artworks.service';
import { PrimitivesService } from './primitives.service';
import { CylinderGeometry, Group, MeshPhongMaterial, SRGBColorSpace, UVMapping } from 'three';
import { LoadersService } from './loaders.service';

@Injectable( {
  providedIn: 'root'
} )
export class FrameService {
  private primitivesService = inject( PrimitivesService );
  private loadersService = inject( LoadersService );
  phongMaterial = new MeshPhongMaterial();
  // TODO: move to primitives service
  frameGeometry: any = new CylinderGeometry( 0.8, 0.7, 0.1, 64, 5 );

  createCanvas ( artwork: Artwork ) {
    const texture = this.loadersService.loadTexture( artwork.url );
    texture.colorSpace = SRGBColorSpace;
    texture.mapping = UVMapping;
    const canvasMaterial = this.phongMaterial.clone();
    canvasMaterial.needsUpdate = true;
    canvasMaterial.map = texture;

    const canvas = this.primitivesService.createBox( { x: 1, y: 1, z: 0.6, material: canvasMaterial } );
    return canvas;

  }

  createFrame ( artwork: Artwork ) {
    const frame = new Group();
    frame.name = `${artwork.title} Frame`;

    const canvas = this.createCanvas( artwork );
    const box = this.primitivesService.createBox( { x: 2, y: 2, z: 0.5 } );
    frame.add( box, canvas );
    return frame;
  }
}
