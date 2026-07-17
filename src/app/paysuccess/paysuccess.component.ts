import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paysuccess',
  templateUrl: './paysuccess.component.html',
  styleUrls: ['./paysuccess.component.css']
})
export class PaysuccessComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	localStorage.removeItem('selectplanid');
    localStorage.removeItem("oldplanid")
    localStorage.removeItem("upgradeplanflag")
  }

}
