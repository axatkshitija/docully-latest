import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveByDateComponent } from './active-by-date.component';

describe('ActiveByDateComponent', () => {
  let component: ActiveByDateComponent;
  let fixture: ComponentFixture<ActiveByDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveByDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
