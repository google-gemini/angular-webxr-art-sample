import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Artwork } from '../../artworks.service';
import { GenerativeService } from '../generative.service';
import { SpeechService } from '../speech.service';

@Component( {
  selector: 'art-image-gen',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './image-gen.component.html',
  styleUrl: './image-gen.component.scss'
} )
export class ImageGenComponent {
  prompt = '';//"Describe the image and tell me what makes this artwork beautiful";
  question: string = '';// "a woman wearing kimono looking into the camera with bright colors";
  private speech = inject( SpeechService );
  private generative = inject( GenerativeService );

  newArtworkEvent = output<Artwork>();

  genImage () {
    this.prompt = this.prompt == '' ? 'a woman wearing kimono looking into the camera with bright colors' : this.prompt;
    this.question = this.question == '' ? 'Describe the image and tell me what makes this artwork beautiful' : this.question;
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

  // TODO
  speechInput () { }

};
