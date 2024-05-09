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

import { NgClass } from '@angular/common';
import { Component, inject, output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Artwork } from '../../artworks.service';
import { GenerativeService } from '../generative.service';
import { catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component( {
  selector: 'art-image-gen',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './image-gen.component.html',
  styleUrl: './image-gen.component.scss'
} )
export class ImageGenComponent {
  private generative = inject( GenerativeService );

  protected newArtworksEvent = output<Artwork[]>();
  protected prompt = '';
  protected question = '';
  protected message = signal( 'Welcome to WebXR Generative AI Art Gallery!' );
  protected requestPending = false;
  protected error = '';

  genImages () {

    this.message.set( 'Generating your artwork...' );
    this.prompt = this.prompt == '' ? 'A steampunk era science lab with a stylish figure in silhouette with dramatic lighting and vibrant colors dominated with copper hue' : this.prompt;
    this.question = this.question == '' ? 'Describe the image and tell me what makes this artwork beautiful' : this.question;

    this.requestPending = true;
    this.error = null;

    // Call the service to generate image and emit the new image info
    this.generative.generateImages( { prompt: this.prompt, question: this.question } ).pipe(catchError((error: any) => {
      this.error = error.message;
      this.requestPending = false;
      return error;
    })).subscribe( ( response ) => {

      this.requestPending = false;

      let images: Artwork[] = [];
      // @ts-expect-error
      response.map( ( data, i ) => {
        const image: Artwork = {
          id: i,
          url: `data:image/png;base64,${data.image}`,
          description: `${data.caption}`,
          title: data.title
        };
        images.push( image );

      } );

      this.newArtworksEvent.emit( images );

    } );

  }

};
