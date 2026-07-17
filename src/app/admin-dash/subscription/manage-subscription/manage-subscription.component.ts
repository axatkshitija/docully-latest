import { Component, Inject, OnInit, } from '@angular/core';
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

import { SpinnerVisibilityService } from 'ng-http-loader';
import { CookieService } from 'ngx-cookie-service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-subscription',
  templateUrl: './manage-subscription.component.html',
  styleUrls: ['./manage-subscription.component.css']
})
export class ManageSubscriptionComponent implements OnInit {

  subscriptionId: string;
  dataroomId: string;
  website_url: string;
  msg: any;
  dvd_quantity = 0;

  // public dataDVDForm: FormGroup;
  dataDVDForm = new FormGroup({
    dvd_quantity: new FormControl('0',),
    total_cost: new FormControl(200)

  })
  dataroom_id: any;

  constructor(private dataRoomService: DataRoomService,
    private subscriptionService: SubscriptionService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private timeZone: TimezoneService,
    private cookieService: CookieService,
    private spinner: SpinnerVisibilityService,
    private baseUrl: BaseUrlClass) {
    this.timezone = this.timeZone.userTimeZone;
    console.log(this.route.snapshot.queryParams['subscriptionId']);
    console.log(this.route.snapshot.queryParams['state']);
    if (this.router.url.includes('manage-subscription')) {
      this.route.params.subscribe(params => {
        console.log(params.subscriptionId);
        this.subscriptionId = params.subscriptionId;
        this.dataroom_id = params.state
        this.getSubscription();
      });
    } else if (this.router.url.includes('subscription-new')) {
      this.route.params.subscribe(params => {
        console.log(params.dataroomId);
        this.dataroomId = params.dataroomId;
        this.getSubscriptionUsingDataroomId();
      });
    }
    this.website_url = this.baseUrl.website_url;
  }

  paymentStatus = undefined;
  transactionId = undefined;
  ngOnInit() {
    this.route.params.subscribe(param => {
      if (param) {
        if (param.state == 'dvdSuccess') {
          this.paymentStatus = 'dvdSuccess'
          this.transactionId = param.id
        } else if (param.state == 'dvdFail') {
          this.paymentStatus = 'dvdFail'
        } else if (param.state == 'overdueSuccess') {
          this.paymentStatus = 'overdueSuccess'
          this.transactionId = param.id
        } else if (param.state == 'overdueFail') {
          this.paymentStatus = 'overdueFail'
        }
      }
      console.log(this.paymentStatus);
    })
    this.getAllMyteam();
    this.getUserInfo();
    this.getAddOn();
    this.perDvdAmount()
    // this.DATADvdFunction(this.subscriptionId, this.dataDVDForm);
  }


  buyOrModifyPlan() {
    console.log(42)
    this.subscriptionService.getToken(this.user.id).subscribe((res) => {
      if (res.json().user) {
        window.open("/#/billing-term", '_blank');
      }

    })
  }
  // data DVD 
  DATADvdFunction(subscriptionId, dataDVDForm) {
    if (this.dvd_quantity >= 1) {
      this.dataRoomService.DataDvDAPI(subscriptionId, dataDVDForm.value).subscribe((res) => {
        // this all_my_teams giving issue
        // this.all_my_teams.push(res);
        this.showbuy = false;
        // this.msg = "Data DVD request has been received";
        // this.showSuccess();
        this.dataDVDForm.reset();
        window.location.href = res;
      },
        (error) => {
          console.log("dvd else", error);
        }
      );
    }
    else {

      this.msg = "Please enter quantity more than zero";
      this.showError();

    }
  }

  // data DVD 
  cancelOnAddOn() {
    console.warn("data dvd function")
    this.dataRoomService.CancelOnAddPlan(this.subscriptionId).subscribe((res) => {
      this.msg = "Plan has been cancelled successfully";
      this.getSubscription();

      this.showSuccess();
    });
  }
  ReactivatePlan(event) {
    console.log(event)
    if (event.checked == true || event == true) {
      this.dataRoomService.ReactivatePlanAddOn(this.subscriptionId).subscribe((res) => {
        this.msg = "Successfully Plan activated ";
        this.getSubscription();
        this.showSuccess();

      });
    } else if (event.checked == false || event == false) {
      this.dataRoomService.CancelOnAddPlanExpired(this.subscriptionId).subscribe((res) => {
        this.msg = "Plan cancel request received. Plan will be deactivated on expiry.";
        this.getSubscription();
        this.showSuccess();
      });
    }
  }
  cancelOnAddOnExpired() {
    console.warn("data dvd function")
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
    this.user = JSON.parse(localStorage.getItem("currentUser"));
    // })
  }
  showbuy: boolean = false
  checkCheckBoxvalue(event) {
    if (event.checked) {
      this.showbuy = true;
    }
    else {
      this.showbuy = false;
    }
  }

  getSubscription() {

    console.log(this.subscriptionId);

    this.subscriptionService.getSubscription(this.subscriptionId).subscribe((res) => {
      console.log(res)
      if (res.length == 0) {
        this.spinner.hide();
      }
      this.subscription = res;
      this.subscription_new = res;
      console.log('subsc')
      // console.warn(res.json());

      if (this.subscription_new.dataroom.plan_payment_overdue == true || this.subscription_new.dataroom.addon_payment_overdue == true) {
        this.overdueAmount()
      }
    })
  }

  getSubscriptionUsingDataroomId() {
    console.log(this.dataroomId);
    this.subscriptionService.getSubscription_new(this.dataroomId).subscribe((res) => {
      this.subscription = res;
      this.subscription_new = res;
      this.subscriptionId = res.id;
      // console.log('subsc')
      // console.warn(res.json());
    })
  }

  Upgrade() {
    // if(this.subscription_new.is_plan_active){
    //   this.router.navigate(["/upgradeplan/"+this.subscriptionId]);
    // }
    // else{
    //     this.msg = "Please Reactivate Plan";
    //     this.showSuccess();
    // }
    this.msg = "Please Reactivate Plan";
    this.showSuccess();
  }

  goToUpgradePlan() {
    localStorage.setItem("subscription_plan_id", this.subscriptionId)

    console.warn("====================================", localStorage.getItem("subscription_plan_id"));
    console.warn("========subs plan id ", this.subscriptionId)
    window.open('/#/plan/upgrade/' + this.subscriptionId);
    // window.open('/#/billing-term')
  }
  goToReactivatePlan() {
    window.open('/#/plan/reactivate/' + this.subscriptionId);
  }
  goToBillingHistory() {
    this.router.navigate(["../manage-add-ons", this.subscription_new.dataroom.id]);
    //window.open('/#/manage-add-ons/' + this.subscription_new.dataroom.id);
  }

  changePlanStatus(planId) {
    this.subscriptionService.changeStatus(planId).subscribe(
      (res) => {
        console.log(res.json());
      }
    )
  }

  payNow() {
    this.dataRoomService.payNow(this.subscription_new.id).subscribe(
      (res) => {
        window.location.href = res
      }
    )
  }

  dueAmount;
  overdueAmount() {
    this.dataRoomService.overdueAmount(this.subscription_new.id).subscribe(
      (res) => {
        this.dueAmount = res;
      }
    )
  }

  dvdAmount = 0;
  perDvdAmount() {
    this.dataRoomService.perDvdAmount().subscribe(
      (res) => {
        this.dvdAmount = res['0']['cost'];
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
        if (res.length == 0) {
          return;
        }
        console.log(res);
        this.addOn = res.addons;
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

  showError() {
    this.toastrService.error(this.msg);
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

  openAutoRenewDialog() {
    const dialogRef = this.dialog.open(AutoRenewConfirmationDialog, {
      width: '500px',
      data: { yes: true, no: false, isPlanActive: this.subscription_new.is_plan_active, cancelAtmonthend: this.subscription_new.cancel_at_monthend },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result, this.subscription_new.cancel_at_monthend);
      if (result == undefined) {
        return;
      }
      if (result == true) {
        this.ReactivatePlan(true)
      } else {
        this.ReactivatePlan(false)
      }
    })
  }

  openCancelSubscriptionDialog() {
    const dialogRef = this.dialog.open(CancelSubscriptionConfirmationDialog, {
      width: '500px',
      data: { yes: true, no: false },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result == true) {
        this.cancelOnAddOn();
      } else {
        dialogRef.close();
      }
    })
  }

  openReactivateSubscriptionDialog() {
    const dialogRef = this.dialog.open(ReactivateSubscriptionConfirmationDialog, {
      width: '500px',
      data: { yes: true, no: false },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result == true) {
        // this.ReactivatePlan(true);
        this.goToReactivatePlan();
      } else {
        dialogRef.close();
      }
    })
  }
}

export interface DialogData {
  yes: string;
  no: string;
  type: string;
  isPlanActive: boolean,
  cancelAtmonthend: boolean
}

@Component({
  selector: 'auto-renew-confirmation-dialog',
  templateUrl: 'auto-renew-confirmation-dialog.html',
})
export class AutoRenewConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<AutoRenewConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'cancel-subscription-confirmation-dialog',
  templateUrl: 'cancel-subscription-confirmation-dialog.html',
})
export class CancelSubscriptionConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<CancelSubscriptionConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'reactivate-subscription-confirmation-dialog',
  templateUrl: 'reactivate-subscription-confirmation-dialog.html',
})
export class ReactivateSubscriptionConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<ReactivateSubscriptionConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
