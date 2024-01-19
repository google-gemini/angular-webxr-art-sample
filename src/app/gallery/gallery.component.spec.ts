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
