import { TestBed } from '@angular/core/testing';

import { ModaleDonObjetService } from './modale-don-objet.service';

describe('ModaleDonObjetService', () => {
  let service: ModaleDonObjetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModaleDonObjetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
