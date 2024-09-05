import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleModificationVenteComponent } from './modale-modification-vente.component';

describe('ModaleModificationVenteComponent', () => {
  let component: ModaleModificationVenteComponent;
  let fixture: ComponentFixture<ModaleModificationVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleModificationVenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModaleModificationVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
