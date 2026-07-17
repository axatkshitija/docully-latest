import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRoomLeftComponent } from './data-room-left.component';

describe('DataRoomLeftComponent', () => {
  let component: DataRoomLeftComponent;
  let fixture: ComponentFixture<DataRoomLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRoomLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRoomLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
