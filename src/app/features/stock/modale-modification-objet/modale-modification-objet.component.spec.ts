import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleModificationObjetComponent } from './modale-modification-objet.component';

describe('ModaleModificationObjetAVendreComponent', () => {
  let component: ModaleModificationObjetComponent;
  let fixture: ComponentFixture<ModaleModificationObjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleModificationObjetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModaleModificationObjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
