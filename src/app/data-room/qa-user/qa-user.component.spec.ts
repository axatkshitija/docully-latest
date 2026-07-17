import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QaUserComponent } from './qa-user.component';

describe('QaUserComponent', () => {
  let component: QaUserComponent;
  let fixture: ComponentFixture<QaUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QaUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QaUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
