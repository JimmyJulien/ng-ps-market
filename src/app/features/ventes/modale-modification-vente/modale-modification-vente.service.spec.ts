import { TestBed } from '@angular/core/testing';

import { ModaleModificationVenteService } from './modale-modification-vente.service';

describe('ModaleModificationVenteService', () => {
  let service: ModaleModificationVenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModaleModificationVenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
