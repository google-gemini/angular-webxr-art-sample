import { TestBed } from '@angular/core/testing';

import { RenderTargetService } from './render-target.service';

describe('RenderTargetService', () => {
  let service: RenderTargetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenderTargetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
