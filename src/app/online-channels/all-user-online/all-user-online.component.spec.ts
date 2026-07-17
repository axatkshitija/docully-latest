import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUserOnlineComponent } from './all-user-online.component';

describe('AllUserOnlineComponent', () => {
  let component: AllUserOnlineComponent;
  let fixture: ComponentFixture<AllUserOnlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllUserOnlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUserOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
