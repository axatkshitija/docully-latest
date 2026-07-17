import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataRoomService } from "../services/index";

@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.component.html',
  styleUrls: ['./payment-successful.component.scss']
})
export class PaymentSuccessfulComponent implements OnInit {
  transactionId = undefined;

  constructor(public route: ActivatedRoute,private dataRoomService:DataRoomService ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.transactionId = param.id
    })
  }

  goToUrl() {
    this.dataRoomService.logout_data();
    
  }

}
