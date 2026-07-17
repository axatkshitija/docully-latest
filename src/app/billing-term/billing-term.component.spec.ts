import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingTermComponent } from './billing-term.component';

describe('BillingTermComponent', () => {
  let component: BillingTermComponent;
  let fixture: ComponentFixture<BillingTermComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingTermComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
