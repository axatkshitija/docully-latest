import { Component, OnInit } from '@angular/core';
import { DataRoomService, SharedService } from "../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-billingpage',
  templateUrl: './billingpage.component.html',
  styleUrls: ['./billingpage.component.css']
})
export class BillingpageComponent implements OnInit {

  plans: any;
  selectedItem = null;

  constructor(
    private router: Router,
    private cookieService : CookieService,
    private route: ActivatedRoute,
    private DataRoomService: DataRoomService) {

  }

  singleplan: any;
  billingpage(singleplan) {
    this.DataRoomService.maintainsubscriptionsession(singleplan).subscribe(
      (res) => {
        console.log("here", res);
        localStorage.setItem("selectplanid", singleplan)
        this.router.navigate(["./pay"]);
      },
      (error) => {
        console.log("error in session");
      }
    );
  }



  singleplandata: any;
  showcost: boolean = false;
  AddPlan(planitem) {
    this.selectedItem = planitem;
    this.DataRoomService.getSinglePlanDetails(planitem).subscribe(
      (res) => {
        console.log(res);
        this.singleplandata = res;
        this.showcost = true;
      },
      (error) => {
        console.log("error");
      }
    );
  }


  getplans: any;
  error: boolean = false;
  plansgetapi() {
    this.DataRoomService.getPlanDetails().subscribe(
      (res) => {
        this.getplans = res;
        this.getplans = this.getplans.sort(function (a, b): any {
          const costA = a['cost'];
          const costB = b['cost'];
          return costB > costA ? -1 : costB < costA ? 1 : 0;
        });
        if (this.trialcheck) {
          this.getplans.forEach((element, index) => {
            if (element.cost == 0) this.getplans.splice(index, 1);
          });
        }
      },
      (error) => {
        this.error = true;
        console.log("all plans error");
      }
    );
  }
  trialcheck: boolean = false;
  user_details: any;
  ngOnInit() {
    this.user_details =     localStorage.getItem("currentUser");
    if (this.user_details.is_trial) {
      this.trialcheck = true;
    }

    this.plansgetapi();
  }


  goBack() {
    this.router.navigate(["./"]);
  }

}
