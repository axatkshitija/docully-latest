import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotViewedComponent } from './not-viewed.component';

describe('NotViewedComponent', () => {
  let component: NotViewedComponent;
  let fixture: ComponentFixture<NotViewedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotViewedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotViewedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
