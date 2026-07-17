import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRightSideMenuComponent } from './document-right-side-menu.component';

describe('DocumentRightSideMenuComponent', () => {
  let component: DocumentRightSideMenuComponent;
  let fixture: ComponentFixture<DocumentRightSideMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentRightSideMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentRightSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
