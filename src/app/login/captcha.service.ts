// captcha.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {
  private captchaCode: any;

  generateCaptcha(): string {
    // Generate a random alphanumeric string for the captcha
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 6;
    this.captchaCode = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return this.captchaCode;
  }

  verifyCaptcha(userInput: string): boolean {
    // Verify if the user input matches the generated captcha code
    return userInput === this.captchaCode;
  }
}
