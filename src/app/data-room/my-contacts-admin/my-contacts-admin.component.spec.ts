import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyContactsAdminComponent } from './my-contacts-admin.component';

describe('MyContactsAdminComponent', () => {
  let component: MyContactsAdminComponent;
  let fixture: ComponentFixture<MyContactsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyContactsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyContactsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
