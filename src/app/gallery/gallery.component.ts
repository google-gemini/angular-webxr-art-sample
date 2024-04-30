import { Component, inject, input, InputSignal } from '@angular/core';

import { Object3D } from 'three';

import { ImageGenComponent } from '../ai/image-gen/image-gen.component';
import { LoadingComponent } from '../loading/loading.component';
import { SceneComponent } from '../three/scene/scene.component';
import { TestComponent } from '../three/test/test.component';
import { Artwork, ArtworksService } from '../artworks.service';
import { FrameService } from '../three/frame.service';

@Component( {
  selector: 'art-gallery',
  standalone: true,
  imports: [SceneComponent, LoadingComponent, TestComponent, ImageGenComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
} )

export class GalleryComponent extends SceneComponent {
  // Services
  private frameService = inject( FrameService );
  private artworksService = inject( ArtworksService );

  public artworks = this.artworksService.getArtworks();
  // TODO: clean up
  private focusedFrame: any;
  focusArtwork = this.artworksService.getFocusedArtwork();

  constructor() {
    super();
  }

  override ngAfterViewInit (): void {
    super.ngAfterViewInit();

    // Focus frame
    this.createFrames();

    // Environment
    this.createEnv();

    // Lights
    this.addLights();

    // TODO:Add Camera movement 
  };

  createFrames () {

    const frames = this.frameService.createFrames( this.artworks() );
    this.scene.add( frames );

  }

  createEnv () {
    this.addLights();

    // Add Model
    // Add Frames
    // Add UI

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

  addLogo () {
    // Load the logo
    const model = this.loadersService.loadGLTF( {
      path: '/assets/models/aLogo.glb',
      onLoadCB: this.onLoad.bind( this ),
    } );
  }
}
