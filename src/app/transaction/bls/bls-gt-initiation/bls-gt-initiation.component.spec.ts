import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlsGtInitiationComponent } from './bls-gt-initiation.component';

describe('BlsGtInitiationComponent', () => {
  let component: BlsGtInitiationComponent;
  let fixture: ComponentFixture<BlsGtInitiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlsGtInitiationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlsGtInitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
