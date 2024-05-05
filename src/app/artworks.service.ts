import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable( {
  providedIn: 'root'
} )
export class ArtworksService {

  private artworksArray: Artwork[] = [
    {
      id: 0,
      title: "Designer ",
      description:
        "",
      url: "assets/artworks/Designer_1.webp",
    },
    {
      id: 1,
      title: "Designer_0",
      description:
        "",
      url: "assets/artworks/Designer_0.webp",
    },
    {
      id: 2,
      title: "Almond Blossom",
      description:
        "",
      url: "assets/artworks/Designer.webp",
    },
    {
      id: 3,
      title: "The Bedroom",
      description:
        "",
      url: "assets/artworks/Designer_2.webp",
    },
    {
      id: 4,
      title: "Sunflowers",
      description:
        "",
      url: "assets/artworks/Designer_6.jpeg",
    }
  ];

  public artworks = signal( this.artworksArray );
  public focusedArtwork = signal( this.artworksArray[0] );

  getFocusedArtwork () {
    return this.focusedArtwork();
  }

  getArtworks ( number?: number ) {
    if ( number ) { this.artworks.set( this.artworksArray.splice( 0, number ) ); }
    return this.artworks;
  }

  // For multiple image creation at once
  updateArtworks ( artworks: Artwork[] ) {
    this.artworks.set( artworks );
  }

  setFocusedArtwork ( artwork: Artwork ) {
    this.focusedArtwork.set( artwork );
  }
}

export interface Artwork {
  audio?: string;
  defaultPosition?: any;
  defaultRotation?: any;
  description?: string;
  id?: number;
  prompt?: string;
  title?: string;
  url: string;
}
