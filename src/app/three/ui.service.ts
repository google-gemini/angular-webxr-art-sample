import { inject, Injectable } from '@angular/core';

import { Color } from 'three';
import * as ThreeMeshUI from 'three-mesh-ui';
import { InteractionsService } from './interactions.service';

@Injectable( {
  providedIn: 'root'
} )
export class UIService {

  private interactions = inject( InteractionsService );

  private title: any;
  public selectState = false;
  private FontJSON = 'assets/fonts/Roboto-msdf.json';
  private FontImage = 'assets/fonts/Roboto-msdf.png';
  private container: any;
  private description: any;

  private buttonOptions = {
    width: 0.4,
    height: 0.15,
    justifyContent: 'center',
    offset: 0.05,
    margin: 0.02,
    borderRadius: 0.075
  };

  private defaultOptions = {
    name: 'Button Panel Container',
    buttons: [{
      name: 'Next Button',
      text: 'Next',
      onHover: ( e: Event ) => { console.log( `Next Button is hovered` ); },
      buttonOptions: {
        width: 0.4,
        height: 0.15,
        justifyContent: 'center',
        offset: 0.05,
        margin: 0.02,
        borderRadius: 0.075
      }
    }, {
      name: 'Prev Button',
      text: 'Previous',
      onHover: ( e: Event ) => { console.log( `Previous Button is hovered` ); },
      buttonOptions: {
        width: 0.4,
        height: 0.15,
        justifyContent: 'center',
        offset: 0.05,
        margin: 0.02,
        borderRadius: 0.075
      }
    }]

  };

  private idleStateAttributes = {
    state: 'idle',
    attributes: {
      width: 0.4,
      height: 0.15,
      offset: 0.035,
      backgroundColor: new Color( 0x666666 ),
      backgroundOpacity: 0.3,
      fontColor: new Color( 0xffffff )
    },
    onSet: ( e: any ) => { }
  };

  private hoveredStateAttributes = {
    state: 'hovered',
    attributes: {
      width: 0.4,
      height: 0.15,
      offset: 0.035,
      backgroundColor: new Color( 0x999999 ),
      backgroundOpacity: 1,
      fontColor: new Color( 0xffffff )
    },
    onSet: ( e: any ) => {
    }
  };

  private selectedAttributes =
    {
      offset: 0.02,
      backgroundColor: new Color( 0x777777 ),
      fontColor: new Color( 0x222222 )
    };


  createInteractiveButtons ( options: any ) {

    const ops = Object.assign( {}, this.defaultOptions, options );
    const container = new ThreeMeshUI.Block(
      {
        justifyContent: 'center',
        contentDirection: 'row-reverse',
        fontFamily: this.FontJSON,
        fontTexture: this.FontImage,
        fontSize: 0.1,
        padding: 0.02,
        borderRadius: 0.11,
        height: 0.2,
        width: options.buttons.length / 2,
      }
    );
    container.name = ops.name;
    this.container = container;

    ops.buttons.forEach( ( o: any, i: number ) => {
      const button = this.createButton( ops.id, o );
      this.container.add( button );
    } );

    return container;

  };

  createButton ( id: number, ops?: any ) {
    const btn = new ThreeMeshUI.Block( this.buttonOptions );
    btn.name = `Frame ${id} ${ops.name}`;

    btn.add( new ThreeMeshUI.Text( {
      content: ops.text,
      name: `${ops.name} Text`,
    } ) );

    // @ts-ignore
    btn.setupState( {
      state: 'selected',
      attributes: this.selectedAttributes,
    } );

    // @ts-ignore
    btn.setupState( this.idleStateAttributes );
    // @ts-ignore
    btn.setupState( this.hoveredStateAttributes );

    btn.position.set( -0.5, 0, 0 );
    this.interactions.addToInteractions( btn );
    this.interactions.addToColliders( { mesh: btn, name: ops.name, cb: () => { ops.onClick( id ); } } );
    // @ts-ignore
    btn.addEventListener( 'click', () => { ops.onClick( id ); } );

    return btn;
  }

  update () {
    ThreeMeshUI.update();
  }
}
