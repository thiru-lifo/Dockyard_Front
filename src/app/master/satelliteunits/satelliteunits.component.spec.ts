import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatelliteunitsComponent } from './satelliteunits.component';

describe('SatelliteunitsComponent', () => {
  let component: SatelliteunitsComponent;
  let fixture: ComponentFixture<SatelliteunitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SatelliteunitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SatelliteunitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
