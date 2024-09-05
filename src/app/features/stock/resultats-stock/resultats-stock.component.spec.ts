import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsStockComponent } from './resultats-stock.component';

describe('ResultatsStockComponent', () => {
  let component: ResultatsStockComponent;
  let fixture: ComponentFixture<ResultatsStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatsStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultatsStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
