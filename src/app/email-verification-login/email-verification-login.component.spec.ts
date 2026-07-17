import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationLoginComponent } from './email-verification-login.component';

describe('EmailVerificationLoginComponent', () => {
  let component: EmailVerificationLoginComponent;
  let fixture: ComponentFixture<EmailVerificationLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailVerificationLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerificationLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
