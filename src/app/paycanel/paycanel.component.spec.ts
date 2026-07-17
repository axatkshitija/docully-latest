import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaycanelComponent } from './paycanel.component';

describe('PaycanelComponent', () => {
  let component: PaycanelComponent;
  let fixture: ComponentFixture<PaycanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaycanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaycanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
