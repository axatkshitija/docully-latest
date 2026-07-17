import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-planupgradesuccess',
  templateUrl: './planupgradesuccess.component.html',
  styleUrls: ['./planupgradesuccess.component.css']
})
export class PlanupgradesuccessComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    localStorage.removeItem('selectplanid');
    localStorage.removeItem("oldplanid")
    localStorage.removeItem("upgradeplanflag")
  }

}
