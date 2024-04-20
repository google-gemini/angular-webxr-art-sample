import { TestBed } from '@angular/core/testing';

import { ArtworksService } from './artworks.service';

describe('ArtworksService', () => {
  let service: ArtworksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtworksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
