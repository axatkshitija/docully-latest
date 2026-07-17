// session.service.ts

import { Injectable } from '@angular/core';
import { DataRoomService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private timeoutId: any;

  constructor(private dataRoomService: DataRoomService) {}

  // Reset the timer for auto-logout
  resetTimeout() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.logout(), 60 * 60 * 1000); // 1 hour in milliseconds
  }

  // Perform logout action
  logout() {
    // Add your logout logic here, e.g., clearing user data, navigating to the login page
    console.log('User auto-logged out');
    this.dataRoomService.logout_data();
    console.log('Log Out Successfully!');
  }
}
