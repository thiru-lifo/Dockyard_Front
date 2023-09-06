import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialtypesComponent } from './trialtypes.component';

describe('TrialtypesComponent', () => {
  let component: TrialtypesComponent;
  let fixture: ComponentFixture<TrialtypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialtypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialtypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
