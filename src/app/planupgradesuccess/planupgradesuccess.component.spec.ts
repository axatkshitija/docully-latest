import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanupgradesuccessComponent } from './planupgradesuccess.component';

describe('PlanupgradesuccessComponent', () => {
  let component: PlanupgradesuccessComponent;
  let fixture: ComponentFixture<PlanupgradesuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanupgradesuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanupgradesuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
