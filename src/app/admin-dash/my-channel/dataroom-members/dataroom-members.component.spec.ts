import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataroomMembersComponent } from './dataroom-members.component';

describe('DataroomMembersComponent', () => {
  let component: DataroomMembersComponent;
  let fixture: ComponentFixture<DataroomMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataroomMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataroomMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
