import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsVentesComponent } from './resultats-ventes.component';

describe('ResultatsVentesComponent', () => {
  let component: ResultatsVentesComponent;
  let fixture: ComponentFixture<ResultatsVentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatsVentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultatsVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
