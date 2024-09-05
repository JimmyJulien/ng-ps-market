import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltresDonsComponent } from './filtres-dons.component';

describe('FiltresDonsComponent', () => {
  let component: FiltresDonsComponent;
  let fixture: ComponentFixture<FiltresDonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltresDonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltresDonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
