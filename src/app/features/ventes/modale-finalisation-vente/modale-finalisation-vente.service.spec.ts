import { TestBed } from '@angular/core/testing';

import { ModaleFinalisationVenteService } from './modale-finalisation-vente.service';

describe('ModaleFinalisationVenteService', () => {
  let service: ModaleFinalisationVenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModaleFinalisationVenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
