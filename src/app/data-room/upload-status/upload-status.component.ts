import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";

import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { TimezoneService } from "../../services/timezone.service";
import { SpinnerVisibilityService } from "ng-http-loader";
import { CookieService } from "ngx-cookie-service";
@Component({
  selector: "app-upload-status",
  templateUrl: "./upload-status.component.html",
  styleUrls: ["./upload-status.component.css"],
})
export class UploadStatusComponent implements OnInit {
  all_root_folder_list: any = [];
  dataroomId: number;
  baseUrl: any;
  moment: any = moment;
  show_spinner: boolean = true;
  data: boolean = false;
  token: any = '';
  timezone: any;
  p: number = 1;
  p1: number = 1;
  show_loader: boolean;
  usertimezone: string;
  constructor(
    private baseUrlClass: BaseUrlClass,
    private apiListClass: ApiListClass,
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private timeZone: TimezoneService,
    private spinner :SpinnerVisibilityService,
  ) {
    this.token = localStorage.getItem("token");
    this.baseUrl = this.baseUrlClass.baseUrl;
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    this.show_spinner = true;

    this.getAllUploadStatusDocument(this.p);
    this.initializeDeleteForm();
    this.getUserInfo();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  user: any;
  size: number = 0;
  getUserInfo() {
    //this.dataRoomService.getUserProfile().subscribe((res) => {
      this.user = JSON.parse(localStorage.getItem("currentUser"));
    //});
  }
  selectedIndex: number = 0;
  tab: boolean = false;
  tab1: boolean = false;

  overview_tab: boolean = true;

  loop_upload: any;

  ViewerMore(item) {
    this.tab = true;
    this.tab1 = false;

    this.overview_tab = false;
    this.dataRoomService.bulkupload_files_check(item).subscribe((res) => {
      this.loop_upload = res.bulksuccessdata;
      if (res.bulksuccessdata != undefined) {
        this.show_spinner = false;
      }

      console.log(res.bulksuccessdata, "batch upload");
    });
  }
  loop_upload1: any;

  ViewerMoreFail(item) {
    this.tab1 = true;
    this.tab = false;
    this.overview_tab = false;
    this.dataRoomService.bulkupload_files_check(item).subscribe((res) => {
      this.loop_upload1 = res.bulkfaildata;
      if (res.bulkfaildata != undefined) {
        this.show_spinner = false;
      }

      console.log(res.bulkfaildata, "batch upload");
    });
  }

  BackTab() {
    this.overview_tab = true;
    this.tab = false;
    this.tab1 = false;
  }

  getAllUploadStatusDocument(pagenumber) {
    this.data = true;
   this.show_loader=true;
    this.p = pagenumber;
    this.p1 = pagenumber;
    this.dataRoomService
      .getUploadStatusDocuments(this.dataroomId, pagenumber)
      .subscribe((res) => {
        this.show_loader=false;
        //this.all_root_folder_list = res.data;
        const newdata = res.data;

        this.all_root_folder_list = newdata.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00' }));
     
        console.log(this.all_root_folder_list, "upload status");
        this.size = res.size;
        this.spinner.hide();
      });
  }

  goToViewerPage(folder) {
    console.log("folder id is", folder);
    this.dataRoomService.getFilesUpdated(folder, "view").subscribe((res) => {
      let token = localStorage.getItem("token");
      document.cookie = "token=" + token;

    
    });
  }

  msg: string;
  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  showInfo() {
    this.toastr.info(this.msg);
  }

  DownloadFiles(folder) {
    this.dataRoomService
      .getDownloadFiles(folder.id, "download")
      .subscribe((res) => {
        this.msg = "File successfully Downloaded";
        this.showInfo();
        const url = window.URL.createObjectURL(res); // <-- work with blob directly
        // create hidden dom element (so it works in all browsers)
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);

        // create file, attach to hidden element and open hidden element
        a.href = url;
        a.download = folder.name;
        a.click();
        return url;
      });
  }

  printFiles(folder) {
    this.dataRoomService
      .getDownloadFiles(folder.id, "print")
      .subscribe((res) => {
        const url = window.URL.createObjectURL(res);

        var W = window.open(url);
        W.window.print();
        window.close();
      });
  }



  deleteForm: FormGroup;

  initializeDeleteForm() {
    this.deleteForm = new FormGroup({
      delete: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
  }

  delete_folder_or_file(folder_id, i) {
    this.dataRoomService.deleteFolderOrFile(folder_id).subscribe((res) => {
      this.msg =
        "Folder/file successfully deleted but Unless permanently deleted, items in trash add to your current storage";
      this.all_root_folder_list.splice(i, 1);
      this.showSuccess();
    });
  }
}
