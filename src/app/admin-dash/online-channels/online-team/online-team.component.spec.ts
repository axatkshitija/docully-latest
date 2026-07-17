import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineTeamComponent } from './online-team.component';

describe('OnlineTeamComponent', () => {
  let component: OnlineTeamComponent;
  let fixture: ComponentFixture<OnlineTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
