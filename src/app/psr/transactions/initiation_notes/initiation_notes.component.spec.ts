import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiationNotesComponent } from '../initiation_notes/initiation_notes.component';

describe('ShipsComponent', () => {
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
