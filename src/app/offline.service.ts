// offline.service.ts

import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private online$: Observable<Event>;

  constructor() {
    this.online$ = fromEvent(window, 'online');
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  getOnlineStatus(): Observable<boolean> {
    
    return this.online$.pipe(
      // Map the event to the online status
      map(() => navigator.onLine)
    );
  }
}
