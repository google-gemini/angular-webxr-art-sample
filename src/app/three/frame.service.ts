/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { inject, Injectable, signal, WritableSignal } from '@angular/core';

import { animate, easeInOut } from 'popmotion';
import { BoxGeometry, CylinderGeometry, Group, MathUtils, Mesh, MeshPhongMaterial, Object3DEventMap, SRGBColorSpace, UVMapping, Vector3 } from 'three';

import { SpeechService } from '../ai/speech.service';
import { Artwork } from '../artworks.service';
import { LightsService } from './lights.service';
import { LoadersService } from './loaders.service';
import { UIService } from './ui.service';

@Injectable( {
  providedIn: 'root'
} )
export class FrameService {

  private lightsService: LightsService = inject( LightsService );
  private loadersService: LoadersService = inject( LoadersService );
  private UIService: UIService = inject( UIService );
  private speech: SpeechService = inject( SpeechService );

  private angle: number = Math.PI * 6;
  private frameDistance: number = 7;
  frames: Group<Object3DEventMap> = new Group();
  frameGeometry: CylinderGeometry = new CylinderGeometry( 1, 0.85, 0.1, 64, 5 );
  phongMaterial: MeshPhongMaterial = new MeshPhongMaterial();
  focusFactor: number = 4;
  focusedFrame: WritableSignal<number> = signal( 0 );
  buttons = [
    {
      name: "Next Button",
      text: "Next",
      onClick: ( ind: number ) => {
        this.changeSelection( ind, 1 );
      },
      position: { x: -0.75, y: 0, z: -0.0 },
      rotation: {},
    },
    {
      name: "Info Button",
      text: "Info",
      onClick: ( ind: number ) => {
        this.playInfo( ind );
      },
      position: { x: -0.8, y: 0.8, z: -0.1 },
      rotation: {},
    },
    {
      name: "Previous Button",
      text: "Previous",
      onClick: ( ind: number ) => {
        this.changeSelection( ind, -1 );
      },
      position: { x: 0.75, y: 0, z: -0 },
      rotation: {},
    },
  ];

  /**
   * 
   * @param artworks 
   * @returns 
   */
  createFrames ( artworks: Artwork[], cb?: Function ) {

    this.frames.name = 'Frames Group';
    // Angle between frames
    this.angle = ( Math.PI * 2 ) / artworks.length || 5;

    const frames = artworks.map( ( artwork, i ) => {
      const f = this.placeFrame( this.createFrame( artwork ), i );
      f.name = `Frame ${i}`;
      return f;
    } );

    this.frames.add( ...frames );

    this.frames.position.set( 0, 1.6, 0 );
    this.focusFrame( 0 );

    return this.frames;

  }

  /**
   * Creates single frame with Canvas and UI
   * @param artwork 
   * @returns 
   */
  createFrame ( artwork: Artwork ) {
    const frame = new Group();
    frame.name = `${artwork.title} frame group`;

    // Create the frame geometry & canvas geometry
    this.frameGeometry.rotateX( Math.PI / 2 );
    const canvasGeometry = new BoxGeometry( 1, 1, 0.12 );

    // Create the canvas material with the texture
    const texture = this.loadersService.loadTexture( artwork.url );
    texture.colorSpace = SRGBColorSpace;
    texture.mapping = UVMapping;
    const canvasMaterial = this.phongMaterial.clone();
    canvasMaterial.name = 'Canvas Material';
    canvasMaterial.map = texture;

    // Create the frame & canvas mesh
    const frameMaterial = this.phongMaterial.clone();
    frameMaterial.color.set( "rgb(165, 187, 206)" );
    frameMaterial.needsUpdate = true;
    const frameMesh = new Mesh( this.frameGeometry, frameMaterial );

    const canvasMesh = new Mesh( canvasGeometry, canvasMaterial );
    frameMesh.name = `${artwork.title} frame mesh` || 'frame';
    canvasMesh.name = 'Canvas';

    const light = this.lightsService.createSpotLight();
    light.target = canvasMesh;
    light.position.y = 2;

    frame.add( frameMesh, canvasMesh, light );
    frame.rotateY( Math.PI );

    const buttons = this.createUI( artwork );
    frame.add( buttons );

    frame.userData['description'] = artwork.description;

    return frame;

  }

  createUI ( artwork: Artwork ) {
    const buttonsPanel = this.UIService.createInteractiveButtons( { buttons: this.buttons, id: artwork.id } );
    buttonsPanel.position.x = 0;
    buttonsPanel.position.y = -0.7;
    buttonsPanel.position.z = -0.2;

    buttonsPanel.rotateY( Math.PI );
    buttonsPanel.rotateX( -0.55 );

    return buttonsPanel;
  }

  /**
   * Distributes frames based on their index
   * @param frame artframe
   * @param i index
   * @returns frame with location
   */
  placeFrame ( frame: Group, i: number = 0 ) {

    const alpha = i * this.angle;
    const x = Math.sin( alpha ) * this.frameDistance;// 0 - 1
    const z = -Math.cos( alpha ) * this.frameDistance;// 0 - 0
    frame.position.set( x, 0, z );
    frame.scale.set( 1.3, 1.3, 1.3 );
    frame.rotation.y = alpha;
    frame.userData['originalPosition'] = frame.position.clone();

    return frame;

  }

  updateFrames ( artworks: Artwork[] ) {

    this.frames.children.forEach( ( frame, i ) => {
      this.updateFrame( { frame: frame, i: i, texture: artworks[i].url } );
      frame.userData['description'] = artworks[i].description;
    } );

  }

  updateFrame ( ops: any ) {

    const material = ops.frame.children[1].getObjectByName( `Canvas` ).material;
    const texture = this.loadersService.loadTexture( ops.texture );
    texture.colorSpace = SRGBColorSpace;
    texture.mapping = UVMapping;
    material.map = texture;
    material.needsUpdate = true;

    ops.frame.userData['url'] = ops.texture;

  }

  playInfo ( index: number ) {

    const description = this.frames.children[index].userData['description'];
    this.speech.say( description );

  }

  changeSelection ( index: number, position: number ) {

    const length = this.frames.children.length;
    this.resetPosition( this.focusedFrame() );
    let i;
    if ( position === 1 ) {
      // Rotate to Next frame
      i = index < length - 1 ? index + 1 : 0;
      this.rotateFrames( 72 );
      this.focusedFrame.set( i );
    } else if ( position === -1 ) {
      // Rotate to Previous
      i = index === 0 ? length - 1 : index - 1;
      this.rotateFrames( -72 );
      this.focusedFrame.set( i );
    }

    this.focusedFrame.set( i );
    this.focusFrame( i );

  }

  moveFrame ( f: any, p: any ) {

    const to = new Vector3( p.x, p.y, p.z );
    animate( {
      from: f.position,
      to: to,
      duration: 2500,
      ease: easeInOut,
      onUpdate: latest => {
        f.position.x = latest.x;
        f.position.y = latest.y;
        f.position.z = latest.z;
      }
    } );

  }

  focusFrame ( i: number ) {

    const f = this.frames.children[i];
    const x = f.position.x / this.frameDistance * this.focusFactor;
    const z = f.position.z / this.frameDistance * this.focusFactor;
    const p = new Vector3( x, f.position.y, z );
    this.moveFrame( f, p );

  }

  resetPosition ( i: number ) {

    const f = this.frames.children[i];
    const p = f.userData['originalPosition'];
    this.moveFrame( f, p );

  }

  rotateFrames ( angle: number = 72 ) {

    // angle between frames and the current group rotation
    const y = MathUtils.degToRad( angle ) + this.frames.rotation.y;
    animate( {
      from: this.frames.rotation.y,
      to: y,
      duration: 1000,
      ease: easeInOut,
      onUpdate: latest => this.frames.rotation.y = latest
    } );

  }

}
