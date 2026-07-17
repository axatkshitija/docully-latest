import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { Router, ActivatedRoute } from "@angular/router";
import * as moment from "moment";

@Component({
  selector: "app-data-room-right",
  templateUrl: "./data-room-right.component.html",
  styleUrls: ["./data-room-right.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class DataRoomRightComponent implements OnInit {
  dataroomId: any;
  baseUrl: any;
  moment: any = moment;
  data: boolean = false;
  timezone: any;
  usertimezone: string;
  token: any = '';
  constructor(
    private dataRoomService: DataRoomService,
    public baseUrlclass: BaseUrlClass,
    private router: Router,

  ) {
    this.token = localStorage.getItem("token");
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
    this.baseUrl = this.baseUrlclass.baseUrl;
  }

  ngOnInit() {
    this.getUserInfo();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  user: any;
  getUserInfo() {
      this.user = JSON.parse(localStorage.getItem("currentUser"));
      this.getSingleDataroomNotification();
  }

  dataroom_notification: any;


  getSingleDataroomNotification() {
    this.dataRoomService
      .getSingleDataroomNotificationList(this.dataroomId, "fixed&page=" + 1)
      .subscribe((res) => {
        this.data = true;
        const newdata =  res.data;
        this.dataroom_notification = newdata.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00' }));
        console.log(res.data.reverse(), "Text Notification");
        if (this.user.is_superadmin || this.user.is_admin) {
          this.dataroom_notification;
        } else {
          this.dataroom_notification = this.dataroom_notification.filter(
            (res) => res.user === this.user.id
          );
        }
      });
  }
  
  update() {
    this.router.navigate(["../update-doc"]);
  }

  goToViewerPage(folder) {
    console.log("folder id is", folder);

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

  perm: any;
  getToDetailedPage(dataroomId) {
   localStorage.setItem("currentDataroomId", dataroomId.toString())
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
   localStorage.setItem("currentDataroomId", item.dataroom.id.toString())
    this.router.navigate(["../qa-questions", item.qna.id]);
  }
}
