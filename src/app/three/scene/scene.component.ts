import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { BoxGeometry, Clock, Color, DirectionalLight, HemisphereLight, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LoadersService } from '../loaders.service';

export interface SceneOptions {
  width: 800;
  height?: 600;
  model?: string;
}

@Component( {
  selector: 'art-scene',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './scene.component.html',
  styleUrl: './scene.component.scss'
} )
export class SceneComponent {
  public camera: any;
  public clock = new Clock();
  model: any;
  box: any;
  private renderer: any;
  public scene: Scene = new Scene();
  renderFunctions: Function[] = [];
  defaultOptions = {
    width: window.innerWidth || 800,
    height: window.innerHeight || 600,
    model: 'assets/model.glb'
  };

  @Input( { required: false } ) options: any = {};

  @ViewChild( 'canvas', { static: true } ) canvas!: ElementRef<HTMLCanvasElement>;
  private get canvasEl (): HTMLCanvasElement {
    return this.canvas?.nativeElement;
  }

  constructor(
    private ngZone: NgZone,
  ) { }

  ngAfterViewInit (): void {

    this.options = Object.assign( {}, this.defaultOptions, this.options );
    const w = this.options.width || this.canvas.nativeElement.width;
    const h = this.options.height || this.canvasEl.height;

    this.camera = new PerspectiveCamera( 70, w / h, 0.1, 100 );
    this.scene.add( this.camera );
    this.scene.background = new Color( 'black' );

    this.renderer = new WebGLRenderer( { canvas: this.canvasEl, antialias: true, alpha: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( w, h );

    const ambient = new HemisphereLight( 0xffffff, 0xbbbbff, 3 );
    this.scene.add( ambient );

    const light = new DirectionalLight();
    light.position.set( 0.2, 1, 1 );
    this.scene.add( light );

    if ( this.options.model ) {
      // this.loadersService.loadGLTF( this.options.model ).then( ( gltf ) => {

      // } );
      // Load model or just get the model?
      // this.scene.add( this.options.model );

    }

    // To test the scene
    this.box = new Mesh(
      new BoxGeometry( 1, 1, 1 ),
      new MeshBasicMaterial( { color: 0x00ff00 } )
    );
    this.box.position.z = - 3;
    this.scene.add( this.box );

    const controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.ngZone.runOutsideAngular( () => this.renderer.setAnimationLoop( () => this.render() ) );

  }

  addToRender ( f: Function ) {
    this.renderFunctions.push( f );
  }

  removeFromRender ( f: Function ) {
    this.renderFunctions = this.renderFunctions.filter( ( fn ) => fn !== f );
  }

  render () {
    const delta = this.clock.getDelta();
    this.box.rotation.y += 0.01;
    this.renderFunctions.forEach( ( f ) => f( delta ) );
    this.renderer.render( this.scene, this.camera );
  }

  addToScene ( obj: any ) {
    this.scene.add( obj );
    console.log( 'added to scene ', this.scene, obj );

  }

  removeFromScene ( obj: any ) {
    this.scene.remove( obj );
  }

}
