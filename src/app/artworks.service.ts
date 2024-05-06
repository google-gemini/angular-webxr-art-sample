/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
      url: "assets/artworks/d2.webp",
    },
    {
      id: 1,
      title: "Designer_0",
      description:
        "",
      url: "assets/artworks/d0.jpeg",
    },
    {
      id: 2,
      title: "Almond Blossom",
      description:
        "",
      url: "assets/artworks/d3.jpeg",
    },
    {
      id: 3,
      title: "The Bedroom",
      description:
        "",
      url: "assets/artworks/d1.jpeg",
    },
    {
      id: 4,
      title: "Sunflowers",
      description:
        "",
      url: "assets/artworks/d6.jpeg",
    }
  ];

  public artworks: WritableSignal<Artwork[]> = signal( this.artworksArray );
  public focusedArtwork: WritableSignal<Artwork> = signal( this.artworksArray[0] );

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
