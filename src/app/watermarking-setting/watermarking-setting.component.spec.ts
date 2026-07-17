import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatermarkingSettingComponent } from './watermarking-setting.component';

describe('WatermarkingSettingComponent', () => {
  let component: WatermarkingSettingComponent;
  let fixture: ComponentFixture<WatermarkingSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatermarkingSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatermarkingSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
