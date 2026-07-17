import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataroomLockComponent } from './dataroom-lock.component';

describe('DataroomLockComponent', () => {
  let component: DataroomLockComponent;
  let fixture: ComponentFixture<DataroomLockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataroomLockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataroomLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
