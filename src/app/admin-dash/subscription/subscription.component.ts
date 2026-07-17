import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataRoomService, SubscriptionService } from "../../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import { TimezoneService } from "../../services/timezone.service";
import * as XLSX from 'xlsx';
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-subscription",
  templateUrl: "./subscription.component.html",
  styleUrls: ["./subscription.component.css"],
})
export class SubscriptionComponent implements OnInit {
  usertimezone: string;
  constructor(
    private dataRoomService: DataRoomService,
    private subscribeService: SubscriptionService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private timeZone: TimezoneService,
    private toastrService: ToastrService,
    private cookieService : CookieService,
  ) {
    this.timezone = this.timeZone.userTimeZone;
  }

  msg: any;
  showError() {
    this.toastrService.error(this.msg);
  }
  ngOnInit() {
    this.route.params.subscribe(param => {
      if (param) {
        if (param.state == 'end') {
          this.msg = 'Payment failed. Please try again'
          this.showError();
        }
      }
    })
    this.getUserInfo();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  user: any;
  searchText: any;
  timezone: string;

  goToLink(url) {
    window.open(url)
  }

  fileName = 'Subscription.xlsx';
  exportExcel() {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  getUserInfo() {
   // this.dataRoomService.getUserProfile().subscribe((res) => {
      this.user = JSON.parse(    localStorage.getItem("currentUser"));
      // this.getSubscrions(this.user.id);
      this.plansubscription(this.user.id);
    //});
  }
  buyPlan() {
    console.log(42);
    this.subscribeService.getToken(this.user.id).subscribe((res) => {
      if (res.json().user) {
        window.open(
          "/billing-term",
          "_blank"
        );
      }
    });
  }

  showdata: boolean = false;
  plansubscription(user_id) {
    this.dataRoomService.plan_subscription(user_id).subscribe((res) => {
      const newdata = res.data;
      this.subscriptions = newdata.map((obj, i) => ({ ...obj, start_date: obj.start_date + '+04:00',end_date: obj.end_date + '+04:00' }));
      this.subscriptionsSize = res.size;
      let count = Object.keys(this.subscriptions).length
      if (count > 0) {
        this.showdata = true;
      }
      this.calculateExpiryDate()
      console.log(res)
    });

  }

  remainingDays;
  calculateExpiryDate() {
    var currentDate = new Date();
    var expiryDate;
    for (let i = 0; i < this.subscriptions.length; i++) {
      if(this.subscriptions[i].dataroom.is_paid == false && this.subscriptions[i].is_expired == false && this.subscriptions[i].is_plan_active == false && this.subscriptions[i].dataroom.trial_expired == false && this.subscriptions[i].dataroom.trial_expiry_date != null) {
        expiryDate = new Date(this.subscriptions[i].dataroom.trial_expiry_date);
        this.subscriptions[i]['remainingDays'] = Math.floor((expiryDate.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
      }

      if(this.subscriptions[i].is_expired == false && this.subscriptions[i].dataroom.is_expired == false && this.subscriptions[i].is_plan_active == true && this.subscriptions[i].auto_renewal == false) {
        expiryDate = new Date(this.subscriptions[i].end_date);
        this.subscriptions[i]['remainingDays'] = Math.floor((expiryDate.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
      }

      if(this.subscriptions[i].is_expired == false && this.subscriptions[i].dataroom.is_expired == false && this.subscriptions[i].is_plan_active == true && this.subscriptions[i].auto_renewal == true) {
        expiryDate = new Date(this.subscriptions[i].end_date);
        this.subscriptions[i]['remainingDays'] = Math.floor((expiryDate.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
      }
    }
  }


  subscriptions: any = [];
  subscriptionsSize;

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
    });
  }
}
