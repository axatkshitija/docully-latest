import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUpdateDocComponent } from './view-update-doc.component';

describe('ViewUpdateDocComponent', () => {
  let component: ViewUpdateDocComponent;
  let fixture: ComponentFixture<ViewUpdateDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUpdateDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUpdateDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
