import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndUserGroupComponent } from './end-user-group.component';

describe('EndUserGroupComponent', () => {
  let component: EndUserGroupComponent;
  let fixture: ComponentFixture<EndUserGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndUserGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndUserGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
