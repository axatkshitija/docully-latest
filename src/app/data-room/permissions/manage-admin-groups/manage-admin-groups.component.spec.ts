import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdminGroupsComponent } from './manage-admin-groups.component';

describe('ManageAdminGroupsComponent', () => {
  let component: ManageAdminGroupsComponent;
  let fixture: ComponentFixture<ManageAdminGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAdminGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdminGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
