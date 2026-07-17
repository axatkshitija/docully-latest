import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { Router, ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { TimezoneService } from "../../services/timezone.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-new-notification",
  templateUrl: "./new-notification.component.html",
  styleUrls: ["./new-notification.component.css"],
})
export class NewNotificationComponent implements OnInit {
  config: any = {};
  data: any;
  dataroomId: number;
  moment: any = moment;
  timezone: any;
  baseUrl: any;
  p: number = 1;
  usertimezone: any;
  token: any = '';
  constructor(
    private baseUrlClass: BaseUrlClass,
    private apiListClass: ApiListClass,
    private cookieService : CookieService,
    private dataRoomService: DataRoomService,
    private router: Router,
    private timeZone: TimezoneService
  ) {
    this.token = localStorage.getItem("token");
    this.baseUrl = this.baseUrlClass.baseUrl;
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
    this.timezone = this.timeZone.userTimeZone;
    // this.getSingleDataroom(this.dataroomId);
  }

  ngOnInit() {
    this.getUserInfo();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  user: any;
  getUserInfo() {
    //this.dataRoomService.getUserProfile().subscribe((res) => {
      this.user = JSON.parse(    localStorage.getItem("currentUser"));
      this.getAllNotification(1);
    //});
  }
  selectedIndex: number = 0;
  tab: boolean = false;
  overview_tab: boolean = true;

  loop_upload: any;

  ViewerMore(item) {
    this.tab = true;
    this.overview_tab = false;
    this.dataRoomService.bulkupload_files_check(item.id).subscribe((res) => {
      this.loop_upload = res.bulksuccessdata;
      console.log(res.bulksuccessdata, "batch upload");
    });
  }
  BackTab() {
    this.overview_tab = true;
    this.tab = false;
  }

  allNotification: any;
  size: number = 0;
  getAllNotification(pagenumber) {
    this.p = pagenumber;
    this.dataRoomService
      .getAllNotificationList("All&page=" + pagenumber)
      .subscribe((res) => {
        const newdata = res.data.reverse();
        this.allNotification = newdata.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00' }));
        this.size = res.size;
        console.log(res, "allNotification");
      });
  }

  datarooms: any;
  getAllDataRooms() {
    this.dataRoomService.getAllDatarooms().subscribe((res) => {
      this.datarooms = res;
      if (this.user.is_superadmin == true || this.user.is_admin == true) {
        this.datarooms;
      } else {
        this.datarooms = this.datarooms.filter(
          (res) => res.is_dataroom_on_live === true
        );
      }

      this.allNotification.forEach((res) => {
        var datarooms = this.datarooms.filter(
          (ress) => ress.id == res.dataroom.id
        );
        if (datarooms.length > 0) {
          res.show = true;
        } else {
          res.show = false;
        }
      });
    });
  }

  perm: any;
  getToDetailedPage(dataroomId) {
    this.dataRoomService.getMembersPermission(dataroomId).subscribe((res) => {
      this.perm = res;
      if (this.perm.is_overview) {
        this.router.navigate(["../overview", dataroomId]);
      } else if (this.perm.is_edit_index) {
        this.router.navigate(["../documents"]);
      } else {
        this.router.navigate(["../documents"]);
      }

      this.getDataroomViewed(dataroomId);
    });
  }
  getDataroomViewed(dataroomId) {
    this.dataRoomService.GetAllDataroomView(dataroomId).subscribe((res) => {
      console.log("Dataroom Viewed" + dataroomId);
    });
  }
  update() {
    this.router.navigate(["../update-doc"]);
  }

  goToViewerPage(folder) {
    console.log("folder id is", folder);

  }

  goToQnaPage(item) {

   localStorage.setItem("currentDataroomId", item.dataroom.id.toString())
    this.router.navigate(["../qa-questions", item.qna.id]);
  }
}
