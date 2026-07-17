import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantNotificationsComponent } from './important-notifications.component';

describe('ImportantNotificationsComponent', () => {
  let component: ImportantNotificationsComponent;
  let fixture: ComponentFixture<ImportantNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportantNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportantNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
