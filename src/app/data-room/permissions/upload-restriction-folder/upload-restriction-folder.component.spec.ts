import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRestrictionFolderComponent } from './upload-restriction-folder.component';

describe('UploadRestrictionFolderComponent', () => {
  let component: UploadRestrictionFolderComponent;
  let fixture: ComponentFixture<UploadRestrictionFolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadRestrictionFolderComponent]
    });
    fixture = TestBed.createComponent(UploadRestrictionFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
