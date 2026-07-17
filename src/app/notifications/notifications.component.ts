import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../services/index";
import { BaseUrlClass, ApiListClass } from "../common/index";
import { Router, ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { Spinkit, SpinnerVisibilityService } from "ng-http-loader";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent implements OnInit {
  public spinkit = Spinkit;
  data: any;
  dataroomId: number;
  baseUrl: any;
  timezone: any;
  data1: boolean = false;
  moment: any = moment;
  config: any = {};
  p: number = 1;
  startLoader: boolean = true;
  usertimezone: string;
  token: any = '';

  constructor(
    private dataRoomService: DataRoomService,
    public baseUrlclass: BaseUrlClass,
    private router: Router,
    private spinner: SpinnerVisibilityService
  ) {
    this.token = localStorage.getItem("token");
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
    this.getSingleDataroom(this.dataroomId);
    this.baseUrl = this.baseUrlclass.baseUrl;
  }

  ngOnInit() {
    this.getUserInfo();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }
  update() {
    this.router.navigate(["../update-doc"]);
  }

  user: any;
  getUserInfo() {
    //this.dataRoomService.getUserProfile().subscribe((res) => {
    this.user = JSON.parse(localStorage.getItem('currentUser'));

    this.getSingleDataroomNotification(1);

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

  getRecentDocument() {
    this.dataRoomService.recent_document(this.dataroomId).subscribe((res) => {
      this.data = res.folder_data; //JSON.parse(res.folder_data);

      console.log("recent data:-", this.data);
    });
  }

  showNotification() {
    this.router.navigateByUrl("/push-notification");
  }

  dataroom: any;
  getSingleDataroom(dataroomId) {
    this.dataRoomService.getSingleDataroom(dataroomId).subscribe((res) => {
      this.dataroom = res;
    });
  }

  dataroom_notification: any;
  
  size: number = 0;
  getSingleDataroomNotification(pagenumber) {
    this.startLoader=true
    this.spinner.show();
    this.p = pagenumber;
    this.dataRoomService
      .getSingleDataroomNotificationList(
        this.dataroomId,
        "All&page=" + pagenumber
      )
      .subscribe((res) => {
        this.startLoader=false;
        this.size = res.size;
        const newdata =  res.data;
        this.dataroom_notification = newdata.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00'}));
        this.data1 = true;
        console.log(this.dataroom_notification, "Res Data length");
        if (this.user.is_superadmin || this.user.is_admin) {
          this.dataroom_notification;
        } else {
          this.dataroom_notification = this.dataroom_notification.filter(
            (res) => res.user === this.user.id
          );
        }
        this.spinner.hide();
      });
  }

  goToViewerPage(folder) {
    console.log("folder id is", folder);

  }

  perm: any;
  getToDetailedPage(dataroomId) {
    localStorage.setItem("currentDataroomId", dataroomId.toString());
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

  goToQnaPage(item) {
    localStorage.setItem("currentDataroomId", item.dataroom.id.toString());
    this.router.navigate(["../qa-questions", item.qna.id]);
  }
}
