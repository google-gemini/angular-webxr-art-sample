import { Component } from '@angular/core';

import { LoadingComponent } from '../loading/loading.component';
import { ImageGenComponent } from '../ai/image-gen/image-gen.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { TestComponent } from '../three/test/test.component';

@Component( {
  selector: 'art-museum',
  standalone: true,
  imports: [LoadingComponent, ImageGenComponent, GalleryComponent, TestComponent],
  templateUrl: './museum.component.html',
  styleUrl: './museum.component.scss'
} )
export class MuseumComponent {

}
