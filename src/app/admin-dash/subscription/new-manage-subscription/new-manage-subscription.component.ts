import { Component, OnInit, } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  NgForm,
} from "@angular/forms";
import { DataRoomService, SubscriptionService } from '../../../services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { TimezoneService } from '../../../services/timezone.service';
import { BaseUrlClass } from '../../../common/base_url';
import { ToastrService } from "ngx-toastr";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-new-manage-subscription',
  templateUrl: './new-manage-subscription.component.html',
  styleUrls: ['./new-manage-subscription.component.css']
})
export class NewManageSubscriptionComponent implements OnInit {

  subscriptionId: string;
  subscriptionId_new: string;

  website_url: string;
  msg: any;

  // public dataDVDForm: FormGroup;
  dataDVDForm = new FormGroup({
    dvd_quantity: new FormControl(0),
    total_cost: new FormControl(200)

  })

  constructor(private dataRoomService: DataRoomService,
    private subscriptionService: SubscriptionService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private cookieService : CookieService,
    private timeZone: TimezoneService,
    private baseUrl: BaseUrlClass) {
    this.timezone = this.timeZone.userTimeZone;
    console.log(this.route.snapshot.queryParams['subscriptionId']);

    this.route.params.subscribe(params => {
      console.log(params.subscriptionId);
      this.subscriptionId = params.subscriptionId;
      // this.getSubscription_new();
    });
    this.website_url = this.baseUrl.website_url;

  }

  ngOnInit() {
    this.getSubscription_new();

    this.getAllMyteam();
    this.getUserInfo();
    this.getAddOn();

  }

  // Upgrade() {
  //   window.location.href = "https://docully.com/#/planupgrade/" + this.subscriptionId + "/";
  // }

    Upgrade() {
    this.msg = "Please Reactivate Plan";
    this.showSuccess();
  }

  buyOrModifyPlan() {
    console.log(42)
    this.subscriptionService.getToken(this.user.id).subscribe((res) => {
      if (res.json().user) {
        window.open('https://services.docullyvdr.com/billing-term' , '_blank');
      }

    })
  }
  // data DVD 
  DATADvdFunction(subscriptionId, dataDVDForm) {
    console.warn("data dvd function")
    console.warn(dataDVDForm.value)
    this.dataRoomService.DataDvDAPI(subscriptionId, dataDVDForm.value).subscribe((res) => {
      this.all_my_teams.push(res);
      this.msg = "Data DVD request has been received";
      this.showSuccess();
      this.dataDVDForm.reset();
    });
  }

  // data DVD 
  cancelOnAddOn() {
    this.dataRoomService.CancelOnAddPlan(this.subscriptionId).subscribe((res) => {
      // this.msg = "Successfully Cancelled ";
      this.msg = "Plan has been cancelled successfully";
      this.getSubscription();

      this.showSuccess();
    });
  }
  ReactivatePlan() {
    this.dataRoomService.ReactivatePlanAddOn(this.subscriptionId).subscribe((res) => {
      this.msg = "Successfully Plan activated ";
      this.getSubscription();
      this.showSuccess();

    });
  }
  cancelOnAddOnExpired() {
    this.dataRoomService.CancelOnAddPlanExpired(this.subscriptionId).subscribe((res) => {
      this.msg = "Plan cancel request received. Plan will be deactivated on expiry.";
      this.getSubscription();
      this.showSuccess();
    });
  }

  user: any;
  searchText: any;
  timezone: string;
  subscription: any = {};
  subscription_new: any = {};


  getUserInfo() {
    //this.dataRoomService.getUserProfile() .subscribe((res) => {
        this.user = JSON.parse(    localStorage.getItem("currentUser"));
     // })
  }

  getSubscription_new() {

    console.log(this.subscriptionId);

    this.subscriptionService.getSubscription_new(this.subscriptionId).subscribe((res) => {

      this.subscription = res;
      this.subscription_new = res;
      this.subscriptionId = res.id;
      console.log('subsc')
      // console.warn(res.json());
    })


  }

  getSubscription() {

    console.log(this.subscriptionId);

    this.subscriptionService.getSubscription(this.subscriptionId).subscribe((res) => {

      this.subscription = res;
      this.subscription_new = res;
      this.subscriptionId = res.id;
      console.log('subsc')
      // console.warn(res.json());
    })


  }

  changePlanStatus(planId) {
    this.subscriptionService.changeStatus(planId).subscribe(
      (res) => {
        console.log(res.json());
      }
    )
  }

  cancelOnExpiry() {
    this.subscriptionService.cancelOnExpiry(this.subscription.team_id, this.subscription.id).subscribe(
      (res) => {
        console.log(res.json())
      })

  }


  addOn: any = [];

  getAddOn() {
    this.subscriptionService.getAddOn().subscribe(
      (res) => {
        console.log(res);
        this.addOn = res.json().addons;
        for (var i = 0; i < this.addOn.length; i++) {
          this.addOn[i]['quantity'] = 0;
          this.addOn[i]['total'] = 0;
          this.addOn[i]['team_id'] = this.subscription.team_id;
          this.addOn[i]['portal_id'] = this.user.id;
        }

      }
    )
  }
  all_my_teams: any = [];
  my_team_id: string = '';
  team_id: string = '115';
  dataroom_storage_allocated: string = '0';
  dataroom_allowed: string = '0';
  getAllMyteam() {
    this.dataRoomService.getAllMyteams()
      .subscribe((res) => {
        this.all_my_teams = res;
        console.log(this.all_my_teams, res);
        if (this.all_my_teams.length > 0) {
          this.my_team_id = this.all_my_teams[0].id
          console.log(this.my_team_id);
        }
      })
  }


  addInTotal(quantity, price, index, addonkey) {
    console.log(quantity);
    this.addOn[index].total = (Number(quantity) * Number(price));
    if (this.addOn[index]['addonkey'] === 'dataroom_storage_allocated') {
      console.log(quantity);
      this.dataroom_storage_allocated = quantity;
    }

    if (this.addOn[index]['addonkey'] === 'dataroom_allowed') {
      console.log(quantity);
      this.dataroom_allowed = quantity;
    }

  }
  showSuccess() {
    this.toastrService.success(this.msg);
  }
  saveAddOn(data) {
    console.log(this.addOn, data, this.my_team_id);
    this.dataRoomService.addAddOn('?dataroom_id=' + this.subscription.team_id + '&dataroom_storage_allocated=' + this.dataroom_storage_allocated + '&dataroom_allowed=' + this.dataroom_allowed + '&team_id=' + this.subscription.team_id)
      .subscribe((res) => {
        console.log(res);
      })

    this.subscriptionService.updateAddOn(this.addOn).subscribe(
      (res) => {
        console.log(res);
      }
    )
  }
}
