import { TestBed } from '@angular/core/testing';

import { ModaleAnnulationVenteService } from './modale-annulation-vente.service';

describe('ModaleAnnulationVenteService', () => {
  let service: ModaleAnnulationVenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModaleAnnulationVenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
