import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleAnnulationVenteComponent } from './modale-annulation-vente.component';

describe('ModaleAnnulationVenteComponent', () => {
  let component: ModaleAnnulationVenteComponent;
  let fixture: ComponentFixture<ModaleAnnulationVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleAnnulationVenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModaleAnnulationVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
