import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanpaymentComponent } from './planpayment.component';

describe('PlanpaymentComponent', () => {
  let component: PlanpaymentComponent;
  let fixture: ComponentFixture<PlanpaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanpaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
