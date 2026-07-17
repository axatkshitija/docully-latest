// auth.service.ts

import { Injectable } from '@angular/core';
import { InactivityService } from './inactivity.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private inactivityService: InactivityService,private router: Router) {}

  // Call this method when the user logs in or performs any activity
  userActive() {
    // Reset the inactivity timer to one hour (3600000 milliseconds)
    this.inactivityService.resetTimer();
  }

  // Call this method to start the inactivity timer when the user logs in
  startInactivityTimer() {
    // Start the inactivity timer with a one-hour duration
    this.inactivityService.startTimer(6000);//60000 3600000

    // Subscribe to the inactivity timer observable
    this.inactivityService.getTimer().subscribe(() => {
      // Perform logout action here, e.g., navigate to the logout page
      this.logout();
    });
  }

  // Add your logout logic here
  logout() {
    debugger
    console.log("logout")
    localStorage.clear();
    //this.router.navigate(['/login']);
    // Perform logout actions, e.g., navigate to the logout page
  }
}
