import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineChannelComponent } from './online-channel.component';

describe('OnlineChannelComponent', () => {
  let component: OnlineChannelComponent;
  let fixture: ComponentFixture<OnlineChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
