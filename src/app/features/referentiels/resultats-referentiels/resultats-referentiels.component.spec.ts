import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsReferentielsComponent } from './resultats-referentiels.component';

describe('ResultatsReferentielsComponent', () => {
  let component: ResultatsReferentielsComponent;
  let fixture: ComponentFixture<ResultatsReferentielsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatsReferentielsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultatsReferentielsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
