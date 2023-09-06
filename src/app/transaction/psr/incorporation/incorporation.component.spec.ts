import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncorporationComponent } from './incorporation.component';

describe('IncorporationComponent', () => {
  let component: IncorporationComponent;
  let fixture: ComponentFixture<IncorporationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncorporationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncorporationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
