import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulationPaperComponent } from './formulation-paper.component';

describe('FormulationPaperComponent', () => {
  let component: FormulationPaperComponent;
  let fixture: ComponentFixture<FormulationPaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulationPaperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulationPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
