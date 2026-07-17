import {
  Component, OnInit, ViewEncapsulation,
  Input,
  Output,
} from '@angular/core';


import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataRoomService, SubscriptionService } from "../../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import { TimezoneService } from "../../services/timezone.service";
import { BaseUrlClass } from '../../common/base_url';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-add-ons',
  templateUrl: './add-ons.component.html',
  styleUrls: ['./add-ons.component.css']
})
export class AddOnsComponent implements OnInit {

  subscriptionId: string;
  // subscriptionId: string;

  website_url: string;

  constructor(private dataRoomService: DataRoomService,
    private subscribeService: SubscriptionService,
    private toastr: ToastrService,
    private cookieService : CookieService,
    private router: Router,
    private route: ActivatedRoute,
    private timeZone: TimezoneService,
    private baseUrl: BaseUrlClass) {
    this.timezone = this.timeZone.userTimeZone;
    console.log(this.route.snapshot.queryParams['subscriptionId']);

    this.route.params.subscribe(params => {
      console.log(params.subscriptionId);
      this.subscriptionId = params.subscriptionId;
      // this.getSubscription();
    });
    this.website_url = this.baseUrl.website_url;

  }


  ngOnInit() {
    this.getUserInfo();

  }


  user: any;
  searchText: any;
  timezone: string;

  goBack() {
    this.router.navigate(["./manage-subscription/"+this.subscriptionId]);
  }

  Allsubscription(){
   this.router.navigate(["./subscription"]); 
  }

  getUserInfo() {
   // this.dataRoomService.getUserProfile().subscribe((res) => {
      this.user = JSON.parse(    localStorage.getItem("currentUser"));
      // this.getSubscrions(this.user.id);
      this.Plandetails(this.subscriptionId);
   // });
  }
  buyPlan() {
    console.log(42);
    this.subscribeService.getToken(this.user.id).subscribe((res) => {
      if (res.json().user) {
        window.open(
          "https://services.docullyvdr.com/#/billing-term",
          "_blank"
        );
      }
    });
  }
  subscriptions1: any = [];
  showdata: boolean = false;
  Plandetails(subscriptionId) {
    this.dataRoomService.getAddondetail(subscriptionId).subscribe((res) => {
      this.subscriptions1 = res.data;
      this.subscriptionsSize = res.size;
      console.log(this.subscriptionsSize)
      let count = Object.keys(this.subscriptions1).length
      if(count > 0){
        this.showdata = true;
      }
    });
  }

  subscriptions: any = [];
  subscriptionsSize: any = undefined;

  getSubscrions(user_id) {
    this.subscribeService.getSubscriptionList(user_id).subscribe((res) => {
      console.log(res.json());
      // this.subscriptions = res.json().user_plan;
      var data = res.json().user_trial_plan;
      data["plan"] = "Trial";
      data["start_date"] = "";
      data["end_date"] = "";
      data["plan_status"] = "0";
      data["price"] = "-";
      console.log(data);
      // res.json().user_trial_plan['plan'] = "Trial";
      // this.subscriptions.push(data);
    });
  }
}


