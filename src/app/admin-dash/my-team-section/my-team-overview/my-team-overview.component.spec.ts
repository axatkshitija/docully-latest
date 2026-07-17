import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTeamOverviewComponent } from './my-team-overview.component';

describe('MyTeamOverviewComponent', () => {
  let component: MyTeamOverviewComponent;
  let fixture: ComponentFixture<MyTeamOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTeamOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTeamOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
