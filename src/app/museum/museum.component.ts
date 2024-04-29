import { Component, inject, signal, WritableSignal } from '@angular/core';

import { LoadingComponent } from '../loading/loading.component';
import { ImageGenComponent } from '../ai/image-gen/image-gen.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { TestComponent } from '../three/test/test.component';
import { Artwork, ArtworksService } from '../artworks.service';
import { SpeechService } from '../ai/speech.service';

@Component( {
  selector: 'art-museum',
  standalone: true,
  imports: [LoadingComponent, ImageGenComponent, GalleryComponent, TestComponent],
  templateUrl: './museum.component.html',
  styleUrl: './museum.component.scss'
} )
export class MuseumComponent {
  private artworksService = inject( ArtworksService );
  private speechService = inject( SpeechService );

  artworks: Artwork[] = [];
  focusArtwork: WritableSignal<Artwork> = signal( this.artworksService.getFocusedArtwork() );
  promptSamples: string[] = ['Steampunk style labratory with a silluete of a character', 'streets of lake como italy in a steampunk era', 'streets of Roma Forum in year 300'];

  addArtwork ( artwork: Artwork ) {
    this.focusArtwork.set( artwork );
    this.artworksService.addArtwork( artwork );
    // this.speechService.say( artwork.description );
  }

}
