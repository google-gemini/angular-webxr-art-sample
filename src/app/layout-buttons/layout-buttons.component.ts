import { Component, Input } from '@angular/core';

import { Object3D } from 'three';

import { LayoutService } from '../three/layout.service';

@Component( {
  selector: 'art-layout-buttons',
  standalone: true,
  imports: [],
  templateUrl: './layout-buttons.component.html',
  styleUrl: './layout-buttons.component.scss'
} )
export class LayoutButtonsComponent {
  layouts: any[] = [{ name: 'scatter', positions: [] }, { name: 'grid', positions: [] }, { name: 'sphere', positions: [] }, { name: 'cylinder', positions: [] }];

  constructor( private layoutService: LayoutService ) { }

  @Input( { required: true } ) objects: Object3D[] = [];

  calculatePositions ( layout: number ) {

    let positions: any[] = [];
    switch ( this.layouts[layout].name ) {
      case 'scatter':
        positions = this.layoutService.scatterLayout( { objects: this.objects } );
        break;
      case 'grid':
        positions = this.layoutService.gridLayout( {
          objects: this.objects,
          width: 100,
          height: 100,
          depth: 300
        } );
        break;
      case 'sphere':
        positions = this.layoutService.sphereLayout( {
          objects: this.objects,
          n: 4,
          width: 100,
          height: 100,
          depth: 300
        } );
        break;
      case 'sphere':
        positions = this.layoutService.cylindricalLayout( {
          objects: this.objects,
          n: 4,
          width: 100,
          height: 100,
          depth: 300
        } );
        break;
      default:
        this.layouts[0].positions = this.layoutService.scatterLayout( { objects: this.objects } );
    }

    this.layouts[layout].positions = positions;
    return positions;
  }

  changeLayout ( layout: number ) {

    const duration = 2000;
    const positions = this.calculatePositions( layout );
    for ( let i = 0; i < this.objects.length; i++ ) {
      const object = this.objects[i];
    };
  }

}
