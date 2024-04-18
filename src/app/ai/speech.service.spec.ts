import { TestBed } from '@angular/core/testing';

import { SpeechService } from './speech.service';

describe('SpeechService', () => {
  let service: SpeechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
