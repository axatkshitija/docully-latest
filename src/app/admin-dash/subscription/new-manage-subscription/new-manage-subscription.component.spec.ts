import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewManageSubscriptionComponent } from './new-manage-subscription.component';

describe('NewManageSubscriptionComponent', () => {
  let component: NewManageSubscriptionComponent;
  let fixture: ComponentFixture<NewManageSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewManageSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewManageSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
