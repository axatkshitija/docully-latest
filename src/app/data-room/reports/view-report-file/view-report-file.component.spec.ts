import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReportFileComponent } from './view-report-file.component';

describe('ViewReportFileComponent', () => {
  let component: ViewReportFileComponent;
  let fixture: ComponentFixture<ViewReportFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReportFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReportFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
