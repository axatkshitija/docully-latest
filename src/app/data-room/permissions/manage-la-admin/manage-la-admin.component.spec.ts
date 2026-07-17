import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLaAdminComponent } from './manage-la-admin.component';

describe('ManageLaAdminComponent', () => {
  let component: ManageLaAdminComponent;
  let fixture: ComponentFixture<ManageLaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
