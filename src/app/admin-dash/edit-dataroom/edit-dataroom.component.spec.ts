import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDataroomComponent } from './edit-dataroom.component';

describe('EditDataroomComponent', () => {
  let component: EditDataroomComponent;
  let fixture: ComponentFixture<EditDataroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDataroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDataroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
