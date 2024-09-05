import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleModificationReferentielComponent } from './modale-modification-referentiel.component';

describe('ModaleModificationReferentielComponent', () => {
  let component: ModaleModificationReferentielComponent;
  let fixture: ComponentFixture<ModaleModificationReferentielComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleModificationReferentielComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModaleModificationReferentielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
