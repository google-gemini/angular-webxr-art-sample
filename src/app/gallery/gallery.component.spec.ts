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

import { ComponentFixture, DeferBlockState, TestBed } from '@angular/core/testing';

import { GalleryComponent } from './gallery.component';
import { Component } from '@angular/core';

describe( 'GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach( async () => {
    await TestBed.configureTestingModule( {
      imports: [GalleryComponent]
    } )
      .compileComponents();

    fixture = TestBed.createComponent( GalleryComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  } );

  it( 'should create', () => {
    expect( component ).toBeTruthy();
  } );

  // it( 'should render a defer block in different states', async () => {
  //   // @Component( {
  //   //   template: `
  //   //   @defer {
  //   //     <large-component />
  //   //   } @loading {
  //   //     Loading...
  //   //   }
  //   // `
  //   // } )
  //   // Create component fixture.
  //   // const componentFixture = TestBed.createComponent( Gallery );
  //   // Retrieve the list of all defer block fixtures and get the first block.
  //   const deferBlockFixture = fixture.getDeferBlocks()[0];
  //   // Render loading state and verify rendered output.
  //   await deferBlockFixture.render( DeferBlockState.Loading );
  //   expect( fixture.nativeElement.innerHTML ).toContain( 'Loading' );
  //   // Render final state and verify the output.
  //   await deferBlockFixture.render( DeferBlockState.Completed );
  //   expect( fixture.nativeElement.innerHTML ).toContain( '<large-component>' );
  // } );
} );
