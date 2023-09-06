import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryRolesComponent } from './primary-roles.component';

describe('ShipsComponent', () => {
  let component: PrimaryRolesComponent;
  let fixture: ComponentFixture<PrimaryRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
