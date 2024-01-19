import { Component, Input, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { SceneComponent } from '../three/scene/scene.component';
import { LoadersService } from '../three/loaders.service';

@Component( {
  selector: 'art-loading',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
} )
export class LoadingComponent extends SceneComponent {
  @Input() delta = 0;
  constructor(
    ngZone: NgZone,
    loadersService: LoadersService,
  ) {
    super( ngZone );
  }

  override ngAfterViewInit (): void {
    super.ngAfterViewInit();

    // const mesh = this.loadersService.loadGLTF( '/assets/model.glb', this.onLoad.bind( this ) );

    // this.addToScene( mesh );
  }

}
