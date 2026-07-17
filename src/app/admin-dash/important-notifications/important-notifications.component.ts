import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import * as moment from "moment";


@Component({
  selector: "app-important-notifications",
  templateUrl: "./important-notifications.component.html",
  styleUrls: ["./important-notifications.component.css"],
})
export class ImportantNotificationsComponent implements OnInit {
  config: any = {};
  dataroomId: any;
  baseUrl: any;
  data: boolean = false;
  moment: any = moment;
  token: any = '';
  timezone: any;
  usertimezone: string;

  constructor(
    private baseUrlClass: BaseUrlClass,
    private dataRoomService: DataRoomService,
    private router: Router,

  ) {
    this.token = localStorage.getItem("token");
    const currentd:any = localStorage.getItem("currentDataroomId")
    this.dataroomId = parseInt(currentd);
    this.baseUrl = this.baseUrlClass.baseUrl;

  }

  ngOnInit() {
    this.getUserInfo();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  user: any;
  getUserInfo() {
      const currentu:any =   localStorage.getItem("currentUser")
      this.user = JSON.parse(currentu);
      this.getAllNotification();
  }

  datarooms: any;
  getAllDataRooms() {
    this.dataRoomService.getAllDatarooms().subscribe((res) => {
      this.datarooms = res.data;
      if (this.user.is_superadmin == true || this.user.is_admin == true) {
        this.datarooms;
      } else {
        this.datarooms = this.datarooms.filter(
          (res:any) => res.is_dataroom_on_live === true
        );
      }

      this.allNotification.forEach((res:any) => {
        var datarooms = this.datarooms.filter(
          (ress:any) => ress.id == res.dataroom.id
        );
        if (datarooms.length > 0) {
          res.show = true;
        } else {
          res.show = false;
        }
      });
    });
  }
  selectedIndex: number = 0;
  tab: boolean = false;
  overview_tab: boolean = true;

  loop_upload: any;

  ViewerMore(item:any) {
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
  size: any;
  getAllNotification() {
    this.dataRoomService.getAllNotificationList("fixed").subscribe((res) => {
      console.log(res);
      if (res != undefined) {
       // this.allNotification = res.data.reverse();
        const newdata = res.data.reverse();
        this.allNotification = newdata.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00' }));
        console.log(this.allNotification, "all notification");
        this.size = res.size;
        this.data = true;
      }
      this.getAllDataRooms();
    });
  }
  update() {
    this.router.navigate(["../update-doc"]);
  }
  perm: any;
  getToDetailedPage(dataroomId:any) {
    localStorage.setItem("currentDataroomId", dataroomId)
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

  goToQnaPage(item:any) {
    localStorage.setItem("currentDataroomId", this.dataroomId)
    this.router.navigate(["../qa-questions", item.qna.id]);
  }

  getDataroomViewed(dataroomId:any) {
    this.dataRoomService.GetAllDataroomView(dataroomId).subscribe((res) => {
      console.log("Dataroom Viewed" + dataroomId);
    });
  }

  goToViewerPage(folder:any) {
    console.log("folder id is", folder);
  
  }
}
