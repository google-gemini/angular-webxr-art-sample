import { Component, NgZone } from '@angular/core';

import { Object3D } from 'three';

import { LoadingComponent } from '../loading/loading.component';
import { LoadersService } from '../three/loaders.service';
import { PrimitivesService } from '../three/primitives.service';
import { SceneComponent } from '../three/scene/scene.component';
import { XRService } from '../three/xr.service';
import { TestComponent } from '../three/test/test.component';

@Component( {
  selector: 'art-gallery',
  standalone: true,
  imports: [SceneComponent, LoadingComponent, TestComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
} )

export class GalleryComponent extends SceneComponent {
  constructor( ngZone: NgZone, loadersService: LoadersService, private primitives: PrimitivesService, xrService: XRService ) {
    super( ngZone, loadersService, xrService );
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

    // this.debug();
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
