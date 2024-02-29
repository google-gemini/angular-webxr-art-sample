import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgZone,
} from '@angular/core';

import { Object3D, PlaneGeometry } from 'three';

import { LoadersService } from '../three/loaders.service';
import { SceneComponent } from '../three/scene/scene.component';

@Component({
  selector: 'art-loading',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent extends SceneComponent {
  @Input() delta = 0;
  constructor(ngZone: NgZone, loadersService: LoadersService) {
    super(ngZone, loadersService);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    // Load the logo
    const model = this.loadersService.loadGLTF({
      path: '/assets/models/aLogo.glb',
      onLoadCB: this.onLoad.bind(this),
    });
  }

  // Place and animate the logo when loaded
  onLoad(model: Object3D) {
    model.position.z = -50;
    model.position.y = 1;
    model.name = 'aLogo';
    this.addToScene(model);
    this.addToRender(() => {
      model.rotation.y += 0.01;
    });
  }
}
