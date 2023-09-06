import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartmentComponent } from './compartment.component';

describe('CompartmentComponent', () => {
  let component: CompartmentComponent;
  let fixture: ComponentFixture<CompartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
