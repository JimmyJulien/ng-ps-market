import { TestBed } from '@angular/core/testing';

import { ModaleMiseEnVenteObjetService } from './modale-mise-en-vente-objet.service';

describe('ModaleMiseEnVenteObjetService', () => {
  let service: ModaleMiseEnVenteObjetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModaleMiseEnVenteObjetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
