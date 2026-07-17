import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingReportComponent } from './voting-report.component';

describe('VotingReportComponent', () => {
  let component: VotingReportComponent;
  let fixture: ComponentFixture<VotingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
