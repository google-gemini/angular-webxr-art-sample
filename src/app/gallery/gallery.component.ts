import { Component, inject } from '@angular/core';

import { Material, Object3D, Object3DEventMap, PointLight, Vector2 } from 'three';

import { ImageGenComponent } from '../ai/image-gen/image-gen.component';
import { ArtworksService } from '../artworks.service';
import { LoadingComponent } from '../loading/loading.component';
import { FrameService } from '../three/frame.service';
import { MaterialsService } from '../three/materials.service';
import { SceneComponent } from '../three/scene/scene.component';
import { TestComponent } from '../three/test/test.component';
import { UIService } from '../three/ui.service';

@Component( {
  selector: 'art-gallery',
  standalone: true,
  imports: [SceneComponent, LoadingComponent, TestComponent, ImageGenComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
} )

export class GalleryComponent extends SceneComponent {
  // Services
  private frameService = inject( FrameService );
  private artworksService = inject( ArtworksService );
  private materialsService = inject( MaterialsService );
  private ui = inject( UIService );


  public artworks = this.artworksService.getArtworks( 5 );
  // TODO: clean up
  private focusedFrame: any;
  focusArtwork = this.artworksService.getFocusedArtwork();

  constructor() {
    super();
  }

  override ngAfterViewInit (): void {
    super.ngAfterViewInit();

    // Focus frame
    this.createFrames();

    // Environment
    this.createEnv();

    // Lights
    // this.addLights();

    // TODO:Add Camera movement 
  };

  createFrames () {

    const frames = this.frameService.createFrames( this.artworks() );
    this.addToRender( this.ui.update );
    this.scene.add( frames );

  }

  createEnv () {
    this.addCornerLights();

    // Add Models
    // Model for Floor
    const model = this.loadersService.loadGLTF( {
      path: "assets/models/floorModel.glb",
      onLoadProgress: this.onLoadProgress.bind( this ),
      onLoadCB: ( model: Object3D<Object3DEventMap> ) => {
        this.onModelLoaded( model );
      },
    } );

    // Model for Walls
    const modelWalls = this.loadersService.loadGLTF( {
      path: "assets/models/galleryInnerWalls.glb",
      onLoadProgress: this.onLoadProgress.bind( this ),
      onLoadCB: ( model: Object3D<Object3DEventMap> ) => {
        this.onLoadWallsLoaded( model );
      },
    } );

  }

  onLoadProgress () { }

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

  // Place and animate the logo when loaded
  onLoad ( model: Object3D ) {

    model.position.z = -50;
    model.position.y = 1;
    model.name = 'aLogo';
    this.addToScene( model );
    this.addToRender( () => {
      model.rotation.y += 0.01;
    } );

  }

  addLogo () {
    // Load the logo
    const model = this.loadersService.loadGLTF( {
      path: '/assets/models/aLogo.glb',
      onLoadCB: this.onLoad.bind( this ),
    } );
  }
}
