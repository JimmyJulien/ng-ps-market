import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltresReferentielsComponent } from './filtres-referentiels.component';

describe('FiltresReferentielsComponent', () => {
  let component: FiltresReferentielsComponent;
  let fixture: ComponentFixture<FiltresReferentielsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltresReferentielsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltresReferentielsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
