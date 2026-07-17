import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclaimerViewerComponent } from './disclaimer-viewer.component';

describe('DisclaimerViewerComponent', () => {
  let component: DisclaimerViewerComponent;
  let fixture: ComponentFixture<DisclaimerViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclaimerViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclaimerViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
