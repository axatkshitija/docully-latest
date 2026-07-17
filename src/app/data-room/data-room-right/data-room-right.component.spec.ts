import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRoomRightComponent } from './data-room-right.component';

describe('DataRoomRightComponent', () => {
  let component: DataRoomRightComponent;
  let fixture: ComponentFixture<DataRoomRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRoomRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRoomRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
