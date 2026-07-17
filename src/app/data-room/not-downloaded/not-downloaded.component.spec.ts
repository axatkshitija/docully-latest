import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotDownloadedComponent } from './not-downloaded.component';

describe('NotDownloadedComponent', () => {
  let component: NotDownloadedComponent;
  let fixture: ComponentFixture<NotDownloadedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotDownloadedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotDownloadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
