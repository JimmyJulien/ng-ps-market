import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleAjoutReferentielComponent } from './modale-ajout-referentiel.component';

describe('ModaleAjoutReferentielComponent', () => {
  let component: ModaleAjoutReferentielComponent;
  let fixture: ComponentFixture<ModaleAjoutReferentielComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleAjoutReferentielComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModaleAjoutReferentielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
