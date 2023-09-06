import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptDesignComponent } from './concept-design.component';

describe('ConceptDesignComponent', () => {
  let component: ConceptDesignComponent;
  let fixture: ComponentFixture<ConceptDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConceptDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
