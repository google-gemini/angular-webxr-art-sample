import { TestBed } from '@angular/core/testing';

import { PrimitivesService } from './primitives.service';

describe('PrimitivesService', () => {
  let service: PrimitivesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrimitivesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
