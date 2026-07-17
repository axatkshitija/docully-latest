import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocumentsGraphComponent } from './admin-documents-graph.component';

describe('AdminDocumentsGraphComponent', () => {
  let component: AdminDocumentsGraphComponent;
  let fixture: ComponentFixture<AdminDocumentsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDocumentsGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDocumentsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
