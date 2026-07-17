import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrmCheckComponent } from './drm-check.component';

describe('DrmCheckComponent', () => {
  let component: DrmCheckComponent;
  let fixture: ComponentFixture<DrmCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrmCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrmCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
