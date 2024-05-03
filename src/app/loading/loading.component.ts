import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import { CanvasTexture, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, Object3D, PointLight, SphereGeometry, Vector2 } from 'three';

import { SceneComponent } from '../three/scene/scene.component';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';

@Component( {
  selector: 'art-loading',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
} )
export class LoadingComponent extends SceneComponent {
  particleLight: Mesh;

  constructor() {
    super();
  }

  override ngAfterViewInit (): void {
    super.ngAfterViewInit();

    // Load the logo
    const model = this.loadersService.loadGLTF( {
      path: '/assets/models/aLogo.glb',
      onLoadCB: this.onLoad.bind( this ),
    } );

    this.createLight();

  };

  createLight () {

    this.particleLight = new Mesh(
      new SphereGeometry( .05, 8, 8 ),
      new MeshBasicMaterial( { color: 0xffffff } )
    );
    this.scene.add( this.particleLight );
    const pointLight = new PointLight( 0xffffff, 30 );
    this.particleLight.add( pointLight );
    pointLight.rotation.x = -Math.PI / 2;
    this.particleLight.position.z = -90;
    this.scene.add( this.particleLight );

    this.addToRender( this.animate.bind( this ) );

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

  animate () {
    const timer = Date.now() * 0.00025;

    this.particleLight.position.x = Math.sin( timer * 7 ) * 3;
    this.particleLight.position.y = Math.cos( timer * 5 ) * 4;
    this.particleLight.position.z = Math.cos( timer * 3 ) * 3;

  }
}
