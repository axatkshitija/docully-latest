import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRestrictionsComponent } from './upload-restrictions.component';

describe('UploadRestrictionsComponent', () => {
  let component: UploadRestrictionsComponent;
  let fixture: ComponentFixture<UploadRestrictionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadRestrictionsComponent]
    });
    fixture = TestBed.createComponent(UploadRestrictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
