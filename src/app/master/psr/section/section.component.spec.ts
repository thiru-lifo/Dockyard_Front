import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SSSComponent } from './sss.component';

describe('SecondaryRolesComponent', () => {
  let component: SSSComponent;
  let fixture: ComponentFixture<SSSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SSSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SSSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
