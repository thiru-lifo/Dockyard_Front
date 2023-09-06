import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiationComponent } from './initiation.component';

describe('InitiationComponent', () => {
  let component: InitiationComponent;
  let fixture: ComponentFixture<InitiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
