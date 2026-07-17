import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ManageGroupPermissionComponent } from "./manage-group-permission.component";

describe("ManageGroupPermissionComponent", () => {
  let component: ManageGroupPermissionComponent;
  let fixture: ComponentFixture<ManageGroupPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageGroupPermissionComponent],
    }).compileComponents();
  }));
  // asddsads
  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
