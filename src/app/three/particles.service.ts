import { Injectable } from '@angular/core';
import { LoadersService } from './loaders.service';
import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three/src/Three';

@Injectable( {
  providedIn: 'root'
} )
export class ParticlesService {

  smokeParticles: any[] = [];
  constructor( private loadersService: LoadersService ) { }

  createSmoke ( scene: any ) {
    const smokeTexture = this.loadersService.loadTexture( 'assets/textures/smoke.png' );
    const smokeMaterial = new MeshLambertMaterial( { color: 0x00ffdd, map: smokeTexture, transparent: true } );
    const smokeGeo = new PlaneGeometry( 300, 300 );

    for ( let p = 0; p < 80; p++ ) {
      var particle = new Mesh( smokeGeo, smokeMaterial );
      particle.position.set( Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 120 );
      particle.rotation.z = Math.random() * 360;
      scene.add( particle );
      this.smokeParticles.push( particle );
    }

    return this.animateSmoke.bind( this );
  }

  animateSmoke ( delta: any ) {
    var sp = this.smokeParticles.length;
    while ( sp-- ) {
      this.smokeParticles[sp].rotation.z += ( delta * 0.2 );
    }
  }
}
