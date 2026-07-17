import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFoldersComponent } from './upload-folders.component';

describe('UploadFoldersComponent', () => {
  let component: UploadFoldersComponent;
  let fixture: ComponentFixture<UploadFoldersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFoldersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
