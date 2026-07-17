// offline.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-offline',
  template: `
    <div class="offline-message">
      <h1>You are currently offline</h1>
      <p>Please check your internet connection and try again.</p>
    </div>
  `,
  styles: [`
    .offline-message {
      text-align: center;
      padding: 20px;
      background-color: #ffcccc;
    }
  `]
})
export class OfflineComponent {}
