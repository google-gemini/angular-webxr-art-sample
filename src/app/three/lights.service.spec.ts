import { TestBed } from '@angular/core/testing';

import { LightsService } from './lights.service';

describe('LightsService', () => {
  let service: LightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
