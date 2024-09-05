import { TestBed } from '@angular/core/testing';

import { DonsService } from './dons.service';

describe('DonsService', () => {
  let service: DonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
