import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRightSideBarComponent } from './admin-right-side-bar.component';

describe('AdminRightSideBarComponent', () => {
  let component: AdminRightSideBarComponent;
  let fixture: ComponentFixture<AdminRightSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRightSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRightSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
