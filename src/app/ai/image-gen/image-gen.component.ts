import { NgClass } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Artwork } from '../../artworks.service';
import { GenerativeService } from '../generative.service';
import { SpeechService } from '../speech.service';


@Component( {
  selector: 'art-image-gen',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './image-gen.component.html',
  styleUrl: './image-gen.component.scss'
} )
export class ImageGenComponent {
  private generative = inject( GenerativeService );
  private speech = inject( SpeechService );

  newArtworkEvent = output<Artwork>();
  newArtworksEvent = output<Artwork[]>();

  isLoading = signal( false );
  prompt = '';
  question: string = '';
  message = signal( 'Welcome to WebXR Generative AI Art Gallery!' );


  genImage () {

    this.prompt = this.prompt == '' ? 'A steampunk era science lab with a stylish figure in silhouette with dramatic lighting and vibrant colors dominated with copper hue' : this.prompt;
    this.question = this.question == '' ? 'Describe the image and tell me what makes this artwork beautiful' : this.question;

    // Call the service to generate image and emit the new image info
    this.generative.generateImage( { prompt: this.prompt, question: this.question } ).subscribe( ( response ) => {
      console.log( response );
      const image = {
        // @ts-expect-error
        url: `data:image/png;base64,${response.image}`,
        // @ts-expect-error
        description: response.caption
      };

      this.newArtworkEvent.emit( image );

    } );

  }

  genImages () {
    this.message.set( 'Generating your artwork...' );
    this.isLoading.set( true );
    this.prompt = this.prompt == '' ? 'A steampunk era science lab with a stylish figure in silhouette with dramatic lighting and vibrant colors dominated with copper hue' : this.prompt;
    this.question = this.question == '' ? 'Describe the image and tell me what makes this artwork beautiful' : this.question;

    // Call the service to generate image and emit the new image info
    this.generative.generateImages( { prompt: this.prompt, question: this.question } ).subscribe( ( response ) => {
      // console.log( response );

      // To test with fake five images
      // const response: any[] = this.generative.generateImages( { prompt: this.prompt, question: this.question } );
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

  // TODO:
  speechInput () { }

};
