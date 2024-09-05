import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleMiseEnVenteObjetComponent } from './modale-mise-en-vente-objet.component';

describe('ModaleMiseEnVenteObjetComponent', () => {
  let component: ModaleMiseEnVenteObjetComponent;
  let fixture: ComponentFixture<ModaleMiseEnVenteObjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleMiseEnVenteObjetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModaleMiseEnVenteObjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
