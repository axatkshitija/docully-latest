import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionshistoryComponent } from './versionshistory.component';

describe('VersionshistoryComponent', () => {
  let component: VersionshistoryComponent;
  let fixture: ComponentFixture<VersionshistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VersionshistoryComponent]
    });
    fixture = TestBed.createComponent(VersionshistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
