import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component( {
  selector: 'art-image-gen',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './image-gen.component.html',
  styleUrl: './image-gen.component.scss'
} )
export class ImageGenComponent {
  protected prompt = '';

  generateImage () {
    console.info( 'Querying the model with prompt', this.prompt );

  }

  speechInput () { }

}
