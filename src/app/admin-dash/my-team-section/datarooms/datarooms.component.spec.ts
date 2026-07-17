import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataroomsComponent } from './datarooms.component';

describe('DataroomsComponent', () => {
  let component: DataroomsComponent;
  let fixture: ComponentFixture<DataroomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataroomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
