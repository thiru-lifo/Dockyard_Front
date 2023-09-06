import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiationNotesComponent } from './initiation-notes.component';

describe('InitiationNotesComponent', () => {
  let component: InitiationNotesComponent;
  let fixture: ComponentFixture<InitiationNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiationNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiationNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
