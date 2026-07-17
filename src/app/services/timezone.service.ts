import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {
	public userTimeZone: string;
   constructor() {
   	
  this.userTimeZone = new Date().toString().match(/([-\+][0-9]+)\s/)[1];
  
}
}
