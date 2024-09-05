import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleSuppressionReferentielComponent } from './modale-suppression-referentiel.component';

describe('ModaleSuppressionReferentielComponent', () => {
  let component: ModaleSuppressionReferentielComponent;
  let fixture: ComponentFixture<ModaleSuppressionReferentielComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleSuppressionReferentielComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModaleSuppressionReferentielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
