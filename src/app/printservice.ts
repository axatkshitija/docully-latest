import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() {
    this.preventPrinting();
  }

   preventPrinting() {
    window.addEventListener('beforeprint', (event) => {
      event.preventDefault();
      console.log("Printing is disabled for this application.");
    });
  }
}
