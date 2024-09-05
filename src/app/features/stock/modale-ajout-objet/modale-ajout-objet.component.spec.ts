import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleAjoutObjetComponent } from './modale-ajout-objet.component';

describe('ModaleAjoutObjetComponent', () => {
  let component: ModaleAjoutObjetComponent;
  let fixture: ComponentFixture<ModaleAjoutObjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleAjoutObjetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModaleAjoutObjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
