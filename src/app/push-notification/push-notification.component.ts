import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PushNotificationsService, MessagingService } from '../services/index';


@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.css']
})
export class PushNotificationComponent implements OnInit {
	private title: string = 'Browser Push Notifications!';
    message;
	constructor(
            private _notificationService: PushNotificationsService, 
            private msgService: MessagingService
        ) { 
		  this._notificationService.requestPermission();
	}

	ngOnInit() {
        this.msgService.getPermission();
        this.msgService.receiveMessage();
        this.message = this.msgService.currentMessage
	}


notify(){
  
}

}
