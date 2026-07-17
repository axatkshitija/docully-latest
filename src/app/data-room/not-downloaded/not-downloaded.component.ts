import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { ToastrService } from "ngx-toastr";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { TimezoneService } from "../../services/timezone.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-not-downloaded",
  templateUrl: "./not-downloaded.component.html",
  styleUrls: ["./not-downloaded.component.css"],
})
export class NotDownloadedComponent implements OnInit {
  all_root_folder_list: any;
  dataroomId: number;
  baseUrl: any;
  timezone: any;
  p: any = 1;
  size: number = 0;
  statusId: any;
  show_spinner:boolean=true;
  usertimezone: string;
  token: any = '';
  constructor(
    private baseUrlClass: BaseUrlClass,
    private apiListClass: ApiListClass,
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private timeZone: TimezoneService  ) {
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
    this.baseUrl = this.baseUrlClass.baseUrl;
    this.timezone = this.timeZone.userTimeZone;
    this.token = localStorage.getItem("token");
  }

  ngOnInit() {
    this.startLoader=true;
    
    this.getAllNotDownloadedDocument(this.p);
    this.initializeDeleteForm();
    this.getUserInfo();
    this.getAllDataRooms();
    this.usertimezone = localStorage.getItem("currentUser");
    this.usertimezone = JSON.parse(this.usertimezone);
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  } 

  datarooms_indexing: any = { hide_file_indexing: "" };
  getAllDataRooms() {
    this.dataRoomService.getAllDatarooms().subscribe((res) => {
      this.datarooms_indexing = res;
      this.datarooms_indexing = this.datarooms_indexing.filter(
        (res) => res.id == this.dataroomId
      );
      this.datarooms_indexing = this.datarooms_indexing[0];
      console.log(this.datarooms_indexing, "not downloaded documents");
    });
  }

  user: any;
  getUserInfo() {
    this.dataRoomService
      .getUserProfileDatroom(this.dataroomId)
      .subscribe((res) => {
        this.user = res;
      });
  }

  type: any = 1;
  startLoader=true;
  resetType = false;
  changeType(value) {
    this.type = value;
    this.resetType=true;
    this.startLoader = true;
    this.getAllNotDownloadedDocument(this.p);
  }
  getAllNotDownloadedDocument(pageNumber) {
    if(this.resetType==true)
    {
      this.p=1
      this.resetType=false;
    }else
    {
    this.p = pageNumber;
    }
    this.show_spinner=true;
    this.all_root_folder_list =null
    // this.p = pageNumber;
    this.startLoader=true;
    console.log("dataroom id is", this.dataroomId);
    this.dataRoomService
      .getAllNotDownloadFiles(
        this.dataroomId,
        this.type + "&page=" + this.p
      )
      .subscribe((res) => {
        this.startLoader=true;
        this.show_spinner=false;
        const newdata = res.data;
        this.all_root_folder_list = newdata.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00' }));
        this.size = res.size;
        this.all_root_folder_list.forEach((res) => {
          res.checked = false;
          res.icons = this.getIcons(res, res.is_folder);
          this.startLoader=false
        });
      });
  }

  getIcons(res, is_folder) {
    console.log(res.name);
    if (is_folder == true) {
      let url = "assets/images/ICONS_PNG/folder.png";
      return url;
    } else {
      if (
        res.name.endsWith(".avi") ||
        res.name.endsWith(".mov") ||
        res.name.endsWith(".3gp") ||
        res.name.endsWith(".mpeg") ||
        res.content_type == "video/msvideo" ||
        res.content_type == "video/avi" ||
        res.content_type == "video/x-msvideo"
      ) {
        let url = "assets/images/ICONS_PNG/avi.png";
        return url;
      } else if (res.content_type == "text/css" || res.name.endsWith(".css")) {
        let url = "assets/images/ICONS_PNG/css.png";
        return url;
      } else if (res.content_type == "text/csv" || res.name.endsWith(".csv")) {
        let url = "assets/images/ICONS_PNG/csv.png";
        return url;
      } else if (
        res.content_type == "application/msword" ||
        res.name.endsWith(".doc")
      ) {
        let url = "assets/images/ICONS_PNG/doc.png";
        return url;
      } else if (
        res.name.endsWith(".docx") ||
        res.content_type ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        let url = "assets/images/ICONS_PNG/docx.png";
        return url;
      } else if (
        res.content_type == "application/vnd.ms-excel" ||
        res.name.endsWith(".xls")
      ) {
        let url = "assets/images/ICONS_PNG/xls.png";
        return url;
      } else if (
        res.content_type ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        res.name.endsWith(".xlsx")
      ) {
        let url = "assets/images/ICONS_PNG/xlsx.png";
        return url;
      } else if (
        res.content_type == "application/pdf" ||
        res.name.endsWith(".pdf") ||
        res.name.endsWith(".PDF")
      ) {
        let url = "assets/images/ICONS_PNG/pdf.png";
        return url;
      } else if (
        res.content_type == "audio/mp3" ||
        res.name.endsWith(".mp3") ||
        res.name.endsWith(".wav") ||
        res.name.endsWith(".m4a") ||
        res.name.endsWith(".wma")
      ) {
        let url = "assets/images/ICONS_PNG/mp3.png";
        return url;
      } else if (res.content_type == "video/mp4" || res.name.endsWith(".mp4")) {
        let url = "assets/images/ICONS_PNG/mp4.png";
        return url;
      } else if (
        res.content_type == "image/jpeg" ||
        res.content_type == "image/jpg" ||
        res.name.endsWith(".jpg") ||
        res.name.endsWith(".jpeg")
      ) {
        let url = "assets/images/ICONS_PNG/jpg.png";
        return url;
      } else if (res.content_type == "image/png" || res.name.endsWith(".png")) {
        let url = "assets/images/ICONS_PNG/png.png";
        return url;
      } else if (
        res.content_type == "text/plain" ||
        res.name.endsWith(".txt")
      ) {
        let url = "assets/images/ICONS_PNG/txt.png";
        return url;
      } else {
        let url = "assets/images/ICONS_PNG/default.png";
        return url;
      }
    }
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
        if (res.size == 0) {
          this.msg =
            "You dont have access to download this file " + folder.name;
          this.showInfo();
        } else {
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
        }
      });
  }

  printFiles(folder) {
    this.dataRoomService
      .getDownloadFiles(folder.id, "print")
      .subscribe((res) => {
        if (res.size == 0) {
          this.msg =
            "You dont have access to download this file " + folder.name;
          this.showInfo();
        } else {
          const url = window.URL.createObjectURL(res); // <-- work with blob directly
          // return url;
          // create hidden dom element (so it works in all browsers)

          var W = window.open(url);
          W.window.print();
          window.close();
        }
      });
  }

  goToViewerPage(folder) {
    console.log("folder id is", folder);

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

  selectAll(checked) {
    if (checked == true) {
      this.all_root_folder_list.forEach((res) => {
        res.checked = true;
      });
      this.BulkDelete = true;
    } else {
      this.all_root_folder_list.forEach((res) => {
        res.checked = false;
      });
      this.BulkDelete = false;
    }
  }

  BulkDelete: boolean = false;
  showBulkDownload() {
    var checked_list = this.all_root_folder_list.filter(
      (res) => res.checked === true
    );
    if (checked_list.length > 0) {
      this.BulkDelete = true;
    } else {
      this.BulkDelete = false;
    }
  }

  DeleteSelectedFiles() {
    var checked_list = this.all_root_folder_list.filter(
      (res) => res.checked === true
    );
    checked_list.forEach((res) => {
      this.dataRoomService
        .deleteFolderOrFile(res.dataroom_folder_uuid)
        .subscribe((ress) => {
          this.getAllNotDownloadedDocument(this.p);

          // this.msg = "Folder/file successfully deleted but Unless permanently deleted, items in trash add to your current storage";
          // this.all_root_folder_list.splice(i, 1);
          // this.showSuccess();
        });
    });
    this.msg =
      "Folder/file successfully deleted but Unless permanently deleted, items in trash add to your current storage !! Please wait for the Content to update!!";
    this.showSuccess();
  }

  DownloadSelectedFiles() {
    let url = '/#/download-status-documents'
    console.log('url', url)
    window.open(url, '_blank')

    var checked_list = this.all_root_folder_list.filter(
      (res) => res.checked === true
    );

    console.log(checked_list);
    var finalData = {};


    this.dataRoomService.bulkDownloadStatus(this.dataroomId).subscribe(async res => {
      console.log(res);
      this.statusId = await res;
      var checked_list = this.all_root_folder_list.filter(
        (res) => res.checked === true
      );
  
        var notifyemailvar = localStorage.getItem("notifyemail")
        finalData['statusid']  =  this.statusId
          finalData['data'] =  this.all_root_folder_list.filter(
            (res) => res.checked === true
          );;
          finalData['token']  = localStorage.getItem("token")
          finalData['notifyemail'] = notifyemailvar;
          console.log('final data 2: ', finalData)
          console.log(finalData,"the final data list")
 
    console.log("************************** not print");
    this.dataRoomService
      .bulkDownload(JSON.stringify(finalData),checked_list.length)
      .subscribe((ress) => {
        console.log(ress, "in response");
        if (ress.name == undefined) {
          console.log(ress, "in if bulkdownload1");
          this.msg = "You dont have access to download this file " + ress.name;
          this.showInfo();
        } else {
          console.log(ress, "in else bulkdownload2");
          var zip_file_path = this.baseUrl + "/" + ress.path; //put inside "" your server path with file.zip
          var zip_file_name = ress.name; //put inside "" file name or something
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = zip_file_path;
          a.download = zip_file_name;
          a.click();
          document.body.removeChild(a);

          this.msg =
            "Depending on your access, folders & files permitted to be downloaded by the admin will be downloaded shortly from your selection. Please check your Downloads folder on your device.";
          this.showInfo();
        }
      });
    // this.msg = "All files downloaded successfully";
    // this.showInfo();
  })
  }

}
