import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { FileClass } from "../../share-data/file-class";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TimezoneService } from "../../services/timezone.service";
import { CookieService } from "ngx-cookie-service";
@Component({
  selector: "app-update-doc",
  templateUrl: "./update-doc.component.html",
  styleUrls: ["./update-doc.component.css"],
})
export class UpdateDocComponent implements OnInit {
  recent_document_data: any;
  is_uploaded: number;
  is_updated: number;
  is_deleted: number;
  dataroomId: number;
  timezone: any;
  user: any;
  fileClass: any;
  baseUrl: any;
  usertimezone: any;
    token: any = '';
  constructor(
    private toastr: ToastrService,
    private baseUrlClass: BaseUrlClass,
    private router: Router,
    private cookieService: CookieService,
    private apiListClass: ApiListClass,
    private dataRoomService: DataRoomService,
    private route: ActivatedRoute,
    private timeZone: TimezoneService
  ) {
    this.token = localStorage.getItem("token");
    this.baseUrl = this.baseUrlClass.baseUrl;
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    // this.getRecentDocument();
    this.getAllCategories();
    this.getUserInfo();
    this.getAllDisclaimers();
    this.getUpdateList();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  updates: any = [];
  update_final: boolean = false;
  to_user: string = "";
  getUpdateList() {
    this.dataRoomService.getUpdatesList(this.dataroomId).subscribe((res) => {
     // this.updates = res;
      const newdata = res;
      this.updates = newdata.map((obj, i) => ({ ...obj, created_at: obj.created_at + '+04:00',modified_at: obj.modified_at + '+04:00' }));
      console.log(res, "new");
    });
  }

  all_disclaimers: boolean = false;
  getAllDisclaimers() {
    this.dataRoomService.getAllDisclaimers(this.dataroomId).subscribe((res) => {
      var disclaimers = res.filter(
        (res) => res.is_dataroom_disclaimer_default === true
      );

      if (disclaimers.length > 0) {
        this.all_disclaimers = false;
      } else {
        this.all_disclaimers = true;
      }
    });
  }
  showInfo() {
    this.toastr.info(this.msg);
  }

  msg: any;
  NoAccessFile(folder) {
    this.msg =
      "You dont have access for Viewing this document!! Contact your admin!!";
    this.showInfo();
  }

  getRecentDocument() {
    this.dataRoomService.recent_document(this.dataroomId).subscribe((res) => {
      this.recent_document_data = res.recent_data;

      this.is_uploaded = res.is_uploaded;
      this.is_updated = res.is_updated;
      this.is_deleted = res.is_deleted;
    });
  }

  categories_list: any;
  getAllCategories() {
    this.dataRoomService.categories_list(this.dataroomId).subscribe((res) => {
      console.log("Madum11111:----", res);
      this.categories_list = res;
      this.categories_list.forEach((res) => {
        res.checked = false;
      });
    });
  }

  cat_changed: any = {
    message: "",
    subject: "",
    categories: "",
    member: "",
  };

  remember: any;
  isChecked: any;
  changed(event, i) {
    this.categories_list[i].checked = event.target.checked;
    let truelist = this.categories_list.filter((res) => res.checked == true);
    this.dataRoomService
      .get_recent_updates(this.dataroomId, truelist)
      .subscribe((res) => {
        console.log("new recent update:---", truelist);
        this.recent_document_data = res.recent_data;
        this.user = JSON.parse(localStorage.getItem("user"));
      });
  }

  goToViewerPage(folder) {
    let token = localStorage.getItem("token");
    document.cookie = "token=" + token;
  }

  // goToViewerPage1
  goToViewerPage1(folder) {
    console.log("folder id is", folder);
    this.fileClass.file = folder;
    this.dataRoomService.getFilesUpdated(folder.id, "view").subscribe((res) => {
      // let url = '/file-views'+folder.dataroom_folder_uuid
      // window.open(url, '_blank');
      this.router.navigate(["/file-views", folder.dataroom_folder_uuid]);
    });
  }

  goToViewUpdatePage() {
    console.log("Doneeeeeeee:--------------");
    this.router.navigate(["view-update-doc"]);
  }

  user_id: number;
  getUserInfo() {
    this.dataRoomService
      .getUserProfileDatroom(this.dataroomId)
      .subscribe((res) => {
        this.user = res;
        this.user_id = res.id;
        this.getDataroomUser();
      });
  }

  primary_users_disclaimer_status: any;
  getDataroomUser() {
    this.dataRoomService
      .dataroom_mem_list(this.dataroomId, this.user_id)
      .subscribe((res) => {
        this.primary_users_disclaimer_status = res[0].disclaimer_status;
        console.log(this.primary_users_disclaimer_status, "disclaimer status");
      });
  }
}
