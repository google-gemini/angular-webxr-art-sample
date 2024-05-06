import { Component, effect, inject, input, signal, WritableSignal } from '@angular/core';

import { Material, Object3D, Object3DEventMap, PointLight } from 'three';

import { ImageGenComponent } from '../ai/image-gen/image-gen.component';
import { Artwork, ArtworksService } from '../artworks.service';
import { LoadingComponent } from '../loading/loading.component';
import { FrameService } from '../three/frame.service';
import { MaterialsService } from '../three/materials.service';
import { SceneComponent } from '../three/scene/scene.component';
import { UIService } from '../three/ui.service';

@Component( {
  selector: 'art-gallery',
  standalone: true,
  imports: [SceneComponent, LoadingComponent, ImageGenComponent,],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
} )

export class GalleryComponent extends SceneComponent {
  // Services
  private frameService: FrameService = inject( FrameService );
  private materialsService: MaterialsService = inject( MaterialsService );
  private ui: UIService = inject( UIService );

  public artworks = input.required<Artwork[]>();

  constructor() {

    super();

    effect( () => {
      this.frameService.updateFrames( this.artworks() );
    } );

  }

  override ngAfterViewInit (): void {

    super.ngAfterViewInit();

    // Focus frame
    this.createFrames();

    // Environment
    this.createEnv();

  };

  createFrames () {

    const frames = this.frameService.createFrames( this.artworks() );
    this.addToRender( this.ui.update );
    this.scene.add( frames );

  }

  createEnv () {

    // Lights
    this.addCornerLights();

    // Add Models
    // Model for Floor
    const model = this.loadersService.loadGLTF( {
      path: "assets/models/floorModel.glb",
      onLoadCB: ( model: Object3D<Object3DEventMap> ) => {
        this.onModelLoaded( model );
      },
    } );

    // Model for Walls
    const modelWalls = this.loadersService.loadGLTF( {
      path: "assets/models/galleryInnerWalls.glb",
      onLoadCB: ( model: Object3D<Object3DEventMap> ) => {
        this.onLoadWallsLoaded( model );
      },
    } );

  }

  onModelLoaded ( model: Object3D<Object3DEventMap> ) {

    let meshesCount = 0;
    let material: Material = this.materialsService.createMeshPhysicalMaterial();

    model.position.z = -0;
    model.scale.set( 3, 3, 3 );
    model.traverse( ( obj: any ) => {

      if ( obj.isMesh ) {
        meshesCount += 1;
        if ( obj.name == 'Floor' ) {
          material = this.materialsService.createFloorMaterial();
        }

        obj.material = material;

        obj.castShadow = true;
        obj.receiveShadow = true;
        obj.castShadow = true;
        obj.receiveShadow = true;

        if ( obj.material.map ) { obj.material.map.anisotropy = 16; }
      }

    } );

    this.addToScene( model );

  }

  onLoadWallsLoaded ( model: Object3D<Object3DEventMap> ) {

    model.position.z = -0;
    model.scale.set( 3, 3, 3 );

    this.addToScene( model );

  }

  addCornerLights () {

    // Corner lights in each inner walls
    const pointLight = new PointLight( 0xffffff, Math.PI, 13, 1 );
    pointLight.position.y = 3.2;
    pointLight.position.z = -10;

    const pointLight1 = pointLight.clone();
    pointLight1.position.set( 10, 3.2, 7.6 );

    const pointLight2 = pointLight.clone();
    pointLight2.position.set( -10, 3.2, 7.6 );
    this.scene.add( pointLight, pointLight1, pointLight2 );

  }

};
