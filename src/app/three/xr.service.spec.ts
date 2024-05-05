import { TestBed } from '@angular/core/testing';

import { XRService } from './xr.service';

describe( 'XRService', () => {
  let service: XRService;

  beforeEach( () => {
    TestBed.configureTestingModule( {} );
    service = TestBed.inject( XRService );
  } );

  it( 'should be created', () => {
    expect( service ).toBeTruthy();
  } );
} );
