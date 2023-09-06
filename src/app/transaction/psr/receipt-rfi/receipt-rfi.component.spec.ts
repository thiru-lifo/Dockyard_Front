import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptRfiComponent } from './receipt-rfi.component';

describe('ReceiptRfiComponent', () => {
  let component: ReceiptRfiComponent;
  let fixture: ComponentFixture<ReceiptRfiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptRfiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptRfiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
