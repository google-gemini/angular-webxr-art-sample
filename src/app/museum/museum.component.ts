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
