import { TestBed } from '@angular/core/testing';

import { ParticlesService } from './particles.service';

describe('ParticlesService', () => {
  let service: ParticlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
