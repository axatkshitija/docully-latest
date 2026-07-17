import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveByFilesComponent } from './active-by-files.component';

describe('ActiveByFilesComponent', () => {
  let component: ActiveByFilesComponent;
  let fixture: ComponentFixture<ActiveByFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveByFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveByFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
