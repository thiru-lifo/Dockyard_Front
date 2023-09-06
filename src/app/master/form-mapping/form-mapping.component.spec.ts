import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMappingComponent } from './form-mapping.component';

describe('FormMappingComponent', () => {
  let component: FormMappingComponent;
  let fixture: ComponentFixture<FormMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
