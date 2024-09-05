import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltresStockComponent } from './filtres-stock.component';

describe('FiltresStockComponent', () => {
  let component: FiltresStockComponent;
  let fixture: ComponentFixture<FiltresStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltresStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltresStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
