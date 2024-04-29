import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgZone,
} from '@angular/core';

import { Object3D } from 'three';

import { LoadersService } from '../three/loaders.service';
import { SceneComponent } from '../three/scene/scene.component';
import { XRService } from '../three/xr.service';

@Component( {
  selector: 'art-loading',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
} )
export class LoadingComponent extends SceneComponent {
  constructor( ngZone: NgZone, loadersService: LoadersService, xrService: XRService ) {
    super( ngZone, loadersService, xrService );
  }

  override ngAfterViewInit (): void {
    super.ngAfterViewInit();

    // Load the logo
    const model = this.loadersService.loadGLTF( {
      path: '/assets/models/aLogo.glb',
      onLoadCB: this.onLoad.bind( this ),
    } );

    // this.debug();
  }

  // Place and animate the logo when loaded
  onLoad ( model: Object3D ) {

    model.position.z = -100;
    model.position.y = 13;
    model.name = 'aLogo';
    this.addToScene( model );
    this.addToRender( () => {
      model.rotation.y += 0.01;
    } );
    this.controls.enabled = false;
  }
}
