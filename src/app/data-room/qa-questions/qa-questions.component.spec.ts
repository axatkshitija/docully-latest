import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QaQuestionsComponent } from './qa-questions.component';

describe('QaQuestionsComponent', () => {
  let component: QaQuestionsComponent;
  let fixture: ComponentFixture<QaQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QaQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QaQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
