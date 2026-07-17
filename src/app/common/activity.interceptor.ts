// activity.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { SessionService } from './session.service';

@Injectable()
export class ActivityInterceptor implements HttpInterceptor {
  constructor(private sessionService: SessionService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Reset the auto-logout timer on HTTP requests
    this.sessionService.resetTimeout();
    return next.handle(req);
  }
}
