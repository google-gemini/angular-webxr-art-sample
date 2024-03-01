import { TestBed } from '@angular/core/testing';

import { MaterialsService } from './materials.service';

describe('MaterialsService', () => {
  let service: MaterialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
