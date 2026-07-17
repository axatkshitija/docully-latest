import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataroomUsageComponent } from './dataroom-usage.component';

describe('DataroomUsageComponent', () => {
  let component: DataroomUsageComponent;
  let fixture: ComponentFixture<DataroomUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataroomUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataroomUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
