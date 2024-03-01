import { Component, NgZone } from '@angular/core';

import { SceneComponent } from '../scene/scene.component';
import { LoadersService } from '../loaders.service';
import { PrimitivesService } from '../primitives.service';
import { Color, DirectionalLight, DirectionalLightHelper, Fog, HemisphereLight, HemisphereLightHelper, Mesh, MeshPhongMaterial, Object3D, PlaneGeometry } from 'three';

@Component( {
  selector: 'art-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
} )
export class TestComponent extends SceneComponent {

  constructor( ngZone: NgZone, loadersService: LoadersService, private primitives: PrimitivesService ) {
    super( ngZone, loadersService );
  }

  override ngAfterViewInit (): void {
    super.ngAfterViewInit();

    // Environment
    this.addEnvironment();

    // Lights
    this.addLights();

    console.log( this.camera );

    // Load the Man model
    const model = this.loadersService.loadGLTF( {
      path: '/assets/models/man.glb',
      onLoadCB: this.onLoad.bind( this ),
    } );

    // this.debug();
  }

  addEnvironment () {

    // Scene background
    // this.scene.background = new Color( 0xa0a0a0 );
    // this.scene.fog = new Fog( 0xa0a0a0, 10, 50 );

    // ground
    const mesh = new Mesh( new PlaneGeometry( 20, 20 ), new MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add( mesh );
  }

  addLights () {
    const hemiLight = new HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
    hemiLight.position.set( 0, 20, 0 );

    const hHelper = new HemisphereLightHelper( hemiLight, 5, 'orange' );
    this.scene.add( hemiLight, hHelper );

    const dirLight = new DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( 3, 10, 10 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;

    const dHelper = new DirectionalLightHelper( dirLight, 5, );
    this.scene.add( dirLight, dHelper );


    const light = new DirectionalLight();
    light.position.set( 0.2, 1.5, -2 );

    const helper = new DirectionalLightHelper( light, 5, 'red' );
    this.scene.add( light, helper );
  }

  onLoad ( model: Object3D ) {
    model.position.z = -5;
    this.scene.add( model );
  }

}
