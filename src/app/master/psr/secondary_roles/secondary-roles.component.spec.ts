import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryRolesComponent } from './secondary-roles.component';

describe('SecondaryRolesComponent', () => {
  let component: SecondaryRolesComponent;
  let fixture: ComponentFixture<SecondaryRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
