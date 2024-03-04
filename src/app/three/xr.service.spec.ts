import { TestBed } from '@angular/core/testing';

import { XrService } from './xr.service';

describe('XrService', () => {
  let service: XrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
