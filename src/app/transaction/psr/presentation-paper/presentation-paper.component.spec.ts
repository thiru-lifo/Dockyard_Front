import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationPaperComponent } from './presentation-paper.component';

describe('PresentationPaperComponent', () => {
  let component: PresentationPaperComponent;
  let fixture: ComponentFixture<PresentationPaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentationPaperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
