import { TestBed } from '@angular/core/testing';

import { ModaleModificationObjetService } from './modale-modification-objet.service';

describe('ModaleModificationObjetAVendreService', () => {
  let service: ModaleModificationObjetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModaleModificationObjetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
