import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DataRoomService } from "../../../services/dataroom_service";
import { BaseUrlClass, ApiListClass } from "../../../common/index";
import { Spinkit } from "ng-http-loader";
import { TimezoneService } from "../../../services/timezone.service";
import * as moment from "moment";
import { Location } from "@angular/common";
import { SpinnerVisibilityService } from "ng-http-loader";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-member-info",
  templateUrl: "./member-info.component.html",
  styleUrls: ["./member-info.component.css"],
})
export class MemberInfoComponent implements OnInit {
  // public spinkit = Spinkit;
  id: any;
  dataroomId: any;
  timezone: any;
  moment: any = moment;
  p: number = 1;
  show_spinner: boolean = true;
  baseUrl: any;
  usertimezone: string;
  activitydata: any;
  token: any = "";
  
  constructor(
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private dataRoomService: DataRoomService,
    private baseUrlclass: BaseUrlClass,
    private spinner: SpinnerVisibilityService,
    private location: Location,

    private timeZone: TimezoneService
  ) {
    this.dataroomId = localStorage.getItem("currentDataroomId").toString();
    this.baseUrl = this.baseUrlclass.baseUrl;
    this.timezone = this.timeZone.userTimeZone;
    this.token = localStorage.getItem("token");
    this.route.params.subscribe((params) => {
      this.id = params.id;
    });

  }

  ngOnInit() {
    this.usertimezone = localStorage.getItem("currentUser")
    this.usertimezone = JSON.parse(this.usertimezone)
    console.log('>>>>>>>>.', this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
    this.spinner.show();
    this.getUserInfo();
    this.getUserLastView();
    this.getUsersMember();
    this.getUserActivity();
  }
  currentuser: any;
  getUserInfo() {
    this.currentuser = JSON.parse(localStorage.getItem("currentUser"));
  }


  goBack() {
    this.location.back();
  }

  user: any;
  getUsersMember() {
    this.dataRoomService
      .GetUserGroups(0, this.dataroomId, false, this.p)
      .subscribe((res) => {
        console.log(res);
        const newdata = res.users.map((obj, i) => ({ ...obj, invitatation_acceptance_date: obj.invitatation_acceptance_date + '+04:00' }));
        this.user = newdata.filter(
          (res) => res.member.id === parseInt(this.id)
        )[0];

      });
  }

  activity: any;
  last_viewd: any;

  getUserLastView() {
    this.dataRoomService
      .GetUserDataroomLastView(this.dataroomId, this.id)
      .subscribe((res) => {
        this.last_viewd = res.created_date + '+04:00';
        console.log(res, "last viewed");
      });
  }

  getUserActivity() {

    this.dataRoomService
      .getActivityUser(this.dataroomId, this.id)
      .subscribe((res) => {
        this.show_spinner = false;
        this.activity = res;
        const newdata = res.activity.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00' }));
        this.activitydata = newdata;
        console.log('>>>>>>>>>>>>>>>', newdata)
        this.spinner.hide();
        console.log(res, "member info change");
      });
  }

  // alertFunc() {

  // }
  ConvertToCSV(objArray: any): string {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";

    for (var index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }

  exportUserActivitycsv() {
    this.spinner.show();
    this.dataRoomService
      .exportUserActivity(this.dataroomId, this.id)
      .subscribe((res) => {
        this.spinner.hide();
      });
  }
  goToViewerPage(folder) {
    console.log("folder id is", folder);

  }
}
