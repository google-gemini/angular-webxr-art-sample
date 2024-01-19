import { Component } from '@angular/core';
import { LoadersService } from '../three/loaders.service';
import { SceneComponent } from '../three/scene/scene.component';
import { LoadingComponent } from '../loading/loading.component';

@Component( {
  selector: 'art-gallery',
  standalone: true,
  imports: [SceneComponent, LoadingComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
} )
export class GalleryComponent {
  constructor( public loadersService: LoadersService ) { };

}
