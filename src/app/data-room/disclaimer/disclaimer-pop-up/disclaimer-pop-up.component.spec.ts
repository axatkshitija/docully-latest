import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclaimerPopUpComponent } from './disclaimer-pop-up.component';

describe('DisclaimerPopUpComponent', () => {
  let component: DisclaimerPopUpComponent;
  let fixture: ComponentFixture<DisclaimerPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclaimerPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclaimerPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
