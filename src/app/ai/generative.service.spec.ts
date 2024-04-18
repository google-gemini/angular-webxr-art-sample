import { TestBed } from '@angular/core/testing';

import { GenerativeService } from './generative.service';

describe('GenerativeService', () => {
  let service: GenerativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerativeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
