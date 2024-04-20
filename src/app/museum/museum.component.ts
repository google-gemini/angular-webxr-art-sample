import { Component, inject, signal, WritableSignal } from '@angular/core';

import { LoadingComponent } from '../loading/loading.component';
import { ImageGenComponent } from '../ai/image-gen/image-gen.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { TestComponent } from '../three/test/test.component';
import { Artwork, ArtworksService } from '../artworks.service';


@Component( {
  selector: 'art-museum',
  standalone: true,
  imports: [LoadingComponent, ImageGenComponent, GalleryComponent, TestComponent],
  templateUrl: './museum.component.html',
  styleUrl: './museum.component.scss'
} )
export class MuseumComponent {
  private artworksService = inject( ArtworksService );
  artworks: Artwork[] = [];
  focusArtwork: WritableSignal<Artwork> = signal( this.artworksService.getFocusedArtwork() );


  addArtwork ( artwork: Artwork ) {
    this.focusArtwork.set( artwork );
    // this.artworksService.addArtwork( artwork );
    // this.focusArtwork = signal( artwork );
    // console.log( 'Artworks array addedv', this.artworks );
  }


}
