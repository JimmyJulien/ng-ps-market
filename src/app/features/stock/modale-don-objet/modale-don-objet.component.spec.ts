import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleDonObjetComponent } from './modale-don-objet.component';

describe('ModaleDonObjetComponent', () => {
  let component: ModaleDonObjetComponent;
  let fixture: ComponentFixture<ModaleDonObjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleDonObjetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModaleDonObjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
