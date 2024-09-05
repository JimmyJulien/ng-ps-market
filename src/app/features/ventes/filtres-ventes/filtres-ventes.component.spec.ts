import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltresVentesComponent } from './filtres-ventes.component';

describe('FiltresVentesComponent', () => {
  let component: FiltresVentesComponent;
  let fixture: ComponentFixture<FiltresVentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltresVentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltresVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
