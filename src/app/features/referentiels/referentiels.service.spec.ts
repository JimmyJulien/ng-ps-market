import { TestBed } from '@angular/core/testing';

import { ReferentielsService } from './referentiels.service';

describe('ReferentielsService', () => {
  let service: ReferentielsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferentielsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
