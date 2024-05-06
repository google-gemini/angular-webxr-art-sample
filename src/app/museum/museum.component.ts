import { Component, inject, signal, WritableSignal } from '@angular/core';
import { NgClass } from '@angular/common';

import { ImageGenComponent } from '../ai/image-gen/image-gen.component';
import { Artwork, ArtworksService } from '../artworks.service';
import { GalleryComponent } from '../gallery/gallery.component';
import { LoadingComponent } from '../loading/loading.component';

@Component( {
  selector: 'art-museum',
  standalone: true,
  imports: [LoadingComponent, ImageGenComponent, GalleryComponent, NgClass],
  templateUrl: './museum.component.html',
  styleUrl: './museum.component.scss'
} )
export class MuseumComponent {
  private artworksService = inject( ArtworksService );

  artworks: WritableSignal<Artwork[]> = this.artworksService.getArtworks( 5 );
  isHidden = signal( false );

  onArtworks ( artworks: Artwork[] ) {
    this.artworksService.updateArtworks( artworks );
    this.isHidden.set( true );
  }

}
