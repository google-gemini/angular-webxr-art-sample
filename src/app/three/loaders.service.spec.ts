import { TestBed } from '@angular/core/testing';

import { LoadersService } from './loaders.service';

describe('LoadersService', () => {
  let service: LoadersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
