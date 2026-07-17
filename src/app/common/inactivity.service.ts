// inactivity.service.ts

import { Injectable } from '@angular/core';
import { Subject, Observable, timer } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private activityTimer:any = Observable<any> ;
  private stopTimer = new Subject<void>();

  constructor() {}

  // This method starts the inactivity timer
  startTimer(inactivityPeriod: number): void {
    this.activityTimer = timer(inactivityPeriod).pipe(
      debounceTime(inactivityPeriod), // Wait for a period before triggering
      takeUntil(this.stopTimer)
    );
  }

  // This method resets the inactivity timer
  resetTimer(): void {
    this.stopTimer.next();
  }

  // This method returns the observable for the inactivity timer
  getTimer(): Observable<any> {
    return this.activityTimer;
  }
}
