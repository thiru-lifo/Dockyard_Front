import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsSrComponent } from './inputs-sr.component';

describe('InputsSrComponent', () => {
  let component: InputsSrComponent;
  let fixture: ComponentFixture<InputsSrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputsSrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsSrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
