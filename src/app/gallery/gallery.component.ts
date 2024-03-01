import { Component, NgZone } from '@angular/core';

import { Object3D } from 'three';

import { LoadingComponent } from '../loading/loading.component';
import { LoadersService } from '../three/loaders.service';
import { SceneComponent } from '../three/scene/scene.component';
import { PrimitivesService } from '../three/primitives.service';

@Component( {
  selector: 'art-gallery',
  standalone: true,
  imports: [SceneComponent, LoadingComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
} )
export class GalleryComponent extends SceneComponent {
  constructor( ngZone: NgZone, loadersService: LoadersService, private primitives: PrimitivesService ) {
    super( ngZone, loadersService );
  }

  override ngAfterViewInit (): void {
    super.ngAfterViewInit();


    // Load the logo
    const model = this.loadersService.loadGLTF( {
      path: '/assets/models/aLogo.glb',
      onLoadCB: this.onLoad.bind( this ),
    } );
    this.createEnv();
  }

  createEnv () {
    this.addLights();
    const floor = this.primitives.createPlane( { size: 20 } );
    floor.position.set( 0, 0, 0 );
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add( floor );

    this.debug();
    const floorG = this.gui.addFolder( 'Floor Rotation' );
    floorG.add( floor.rotation, 'x', 0, 180, 10 );

  }

  addLights () {

  }

  // Place and animate the logo when loaded
  onLoad ( model: Object3D ) {
    model.position.z = -50;
    model.position.y = 1;
    model.name = 'aLogo';
    this.addToScene( model );
    this.addToRender( () => {
      model.rotation.y += 0.01;
    } );
  }
}
