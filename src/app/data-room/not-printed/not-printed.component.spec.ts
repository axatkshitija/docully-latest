import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotPrintedComponent } from './not-printed.component';

describe('NotPrintedComponent', () => {
  let component: NotPrintedComponent;
  let fixture: ComponentFixture<NotPrintedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotPrintedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotPrintedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
