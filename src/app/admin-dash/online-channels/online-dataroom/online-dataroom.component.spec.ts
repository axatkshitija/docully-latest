import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineDataroomComponent } from './online-dataroom.component';

describe('OnlineDataroomComponent', () => {
  let component: OnlineDataroomComponent;
  let fixture: ComponentFixture<OnlineDataroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineDataroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineDataroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
