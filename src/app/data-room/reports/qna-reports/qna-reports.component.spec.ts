import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QnaReportsComponent } from './qna-reports.component';

describe('QnaReportsComponent', () => {
  let component: QnaReportsComponent;
  let fixture: ComponentFixture<QnaReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QnaReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QnaReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
