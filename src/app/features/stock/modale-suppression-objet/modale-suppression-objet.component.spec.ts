import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleSuppressionObjetComponent } from './modale-suppression-objet.component';

describe('ModaleSuppressionObjetComponent', () => {
  let component: ModaleSuppressionObjetComponent;
  let fixture: ComponentFixture<ModaleSuppressionObjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleSuppressionObjetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModaleSuppressionObjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
