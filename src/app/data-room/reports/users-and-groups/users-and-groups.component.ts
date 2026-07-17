import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../../services/dataroom_service";
import * as moment from "moment";
import { TimezoneService } from "../../../services/timezone.service";
import { SpinnerVisibilityService } from "ng-http-loader";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-users-and-groups",
  templateUrl: "./users-and-groups.component.html",
  styleUrls: ["./users-and-groups.component.css"],
})
export class UsersAndGroupsComponent implements OnInit {
  group: any = 0;
  removed: boolean = false;
  timezone: any;
  dataroomId: any;
  show_spinner: boolean = true;
  p: any = 1;
  size: any;
  dataroom_detail: any;
  current_date: any;
  dataroom_name: any;
  usertimezone: string;

  constructor(
    private dataRoomService: DataRoomService,
    private spinner: SpinnerVisibilityService,
    private cookieService: CookieService,
    private timeZone: TimezoneService
  ) {
    this.dataroomId = localStorage.getItem("currentDataroomId").toString();
    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    this.usertimezone = localStorage.getItem("currentUser");
    this.usertimezone = JSON.parse(this.usertimezone);
    console.log('>>>>>>>>.',this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }
  receiveAutoMsgHandler(p) {
    this.dataroom_detail = p.singledataroom;
    let todays_date = new Date();
    this.current_date = moment(todays_date).format("YYYY-MM-DD hh-mm-ss a");
    this.getAllGroups();
  }

  groups: any;
  getAllGroups() {
    this.dataRoomService.getAllGroups(this.dataroomId).subscribe((res) => {
      this.groups = res;

      this.getUsersMember(this.p);
    });
  }

  groupType(event) {
    this.group = event;
    this.getUsersMember(this.p);
  }

  RemovedMembers(event) {
    this.removed = event;
    this.getUsersMember(this.p);
  }
  users: any;
  getUsersMember(page) {
    this.p = page
    this.dataRoomService
      .GetUserGroups(this.group, this.dataroomId, this.removed, this.p)
      .subscribe((res) => {
        this.show_spinner = false
        const newdata = res.users;
        this.users = newdata.map((obj, i) => ({ ...obj, invitatation_acceptance_date: obj.invitatation_acceptance_date + '+04:00' }));
        this.size = res.count;
        console.log(res.users.length, "users report");
      });
  }

  oviewViewStatus: any;
  downloadStatus() {
    this.dataRoomService.ReportStatus(this.dataroomId, "user_and_grp").subscribe(res => {
      this.oviewViewStatus = res;
      this.ExportUsersGroups();
      let url = '/#/download-status-documents'
      window.open(url, '_blank');
    })
  }

  finalData: any = {};
  months: number = 1;
  ExportUsersGroups() {
    this.finalData['statusid'] = this.oviewViewStatus;
    this.finalData['mohthscount'] = this.months;
    this.spinner.show();
    this.dataRoomService
      .ExportUsersGroups(
        this.group,
        this.dataroomId,
        this.removed,
        JSON.stringify(this.finalData)
      )
      .subscribe((res) => {
        this.spinner.hide();
      });
  }



}
