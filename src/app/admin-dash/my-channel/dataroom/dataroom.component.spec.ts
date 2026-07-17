import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataroomComponent } from './dataroom.component';

describe('DataroomComponent', () => {
  let component: DataroomComponent;
  let fixture: ComponentFixture<DataroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
