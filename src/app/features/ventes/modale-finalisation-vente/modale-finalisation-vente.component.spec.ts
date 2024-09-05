import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleFinalisationVenteComponent } from './modale-finalisation-vente.component';

describe('ModaleFinalisationVenteComponent', () => {
  let component: ModaleFinalisationVenteComponent;
  let fixture: ComponentFixture<ModaleFinalisationVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleFinalisationVenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModaleFinalisationVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
