import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlsDocumentGenerationComponent } from './gls-document-generation.component';

describe('GlsDocumentGenerationComponent', () => {
  let component: GlsDocumentGenerationComponent;
  let fixture: ComponentFixture<GlsDocumentGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlsDocumentGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlsDocumentGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
