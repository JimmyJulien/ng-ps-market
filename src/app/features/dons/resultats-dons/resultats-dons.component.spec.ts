import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsDonsComponent } from './resultats-dons.component';

describe('ResultatsDonsComponent', () => {
  let component: ResultatsDonsComponent;
  let fixture: ComponentFixture<ResultatsDonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatsDonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultatsDonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
