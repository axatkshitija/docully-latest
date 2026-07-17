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
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';

@Component({
  selector: 'app-versionshistory',
  templateUrl: './versionshistory.component.html',
  styleUrls: ['./versionshistory.component.css']
})
export class VersionshistoryComponent {
  all_root_folder_list: any;
  dataroomId: number;
  baseUrl: any;
  timezone: any;
  p: number = 1;
  statusId: any;
  show_spinner: boolean = true;
  folderId: any;
  fileId: any;
  usertimezone: string;
  constructor(
    private baseUrlClass: BaseUrlClass,
    private apiListClass: ApiListClass,
    private router: Router,
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private timeZone: TimezoneService,
    private cookieService: CookieService,
    private location: Location,
    private route: ActivatedRoute,
  ) {
    //this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
    this.baseUrl = this.baseUrlClass.baseUrl;
    this.timezone = this.timeZone.userTimeZone;
    this.route.params.subscribe(params => {
      console.log(params);
      this.dataroomId = params.dataroomId;
      this.folderId = params.folderId;
      this.fileId = params.fileId;

      //this.subscriptionId = params.subscriptionId;
      // this.getSubscription();
    });
  }

  ngOnInit() {
    this.getAllFavourites();
    this.initializeDeleteForm();
    this.getUserInfo();
    this.usertimezone = localStorage.getItem("currentUser")
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
    // this.getAllDataRooms();
  }




  setCurrentVersion(id) {
    this.dataRoomService.setCurrentVersion(id).subscribe((res) => {
      console.log(res);
      this.getAllFavourites();
    });
  }

  removeCurrentVersion(id) {
    this.dataRoomService.removeCurrentVersion(id).subscribe((res) => {
      console.log(res);
      this.getAllFavourites();
    });
  }


  downloadVersion(folder) {
    this.dataRoomService.redact_single_downlaod(folder.id).subscribe((res) => {
      console.log(res);
      if (res.size == 0) {
        this.msg =
          "You dont have access to download this file " + folder.name;
        this.showInfo();
      } else {
        this.msg = "File successfully Downloaded";
        this.showInfo();
        const url = window.URL.createObjectURL(res); // <-- work with blob directly
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        var filenamee = folder.name;
        var fileExt = filenamee.split(".");
        a.href = url;
        a.download = fileExt[0] + ".pdf";
        a.click();
        return url;
      }
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
  size: number = 0;
  startLoader = true;
  resetType = false;
  changeType(value) {
    this.type = value;
    this.startLoader = false
    this.resetType = true;
    this.getAllFavourites();
  }
  getAllFavourites() {
    this.show_spinner = true;
    this.all_root_folder_list = null;


    console.log("dataroom id is", this.dataroomId);
    this.dataRoomService
      .getAllRedactPdf(this.fileId)
      .subscribe((res) => {
        this.show_spinner = false;
        this.startLoader = true;
        const newdata = res;

        this.all_root_folder_list = newdata.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00' }));
        // this.all_root_folder_list = res;

        this.size = res.count;
        console.log(res);
        this.all_root_folder_list.forEach((res) => {
          res.checked = false;
          res.icons = this.getIcons(res, res.is_folder);
          this.startLoader = false
        });
      });
  }

  favoutiefolder: any = []

  is_disabled_delete_button: boolean = false;
  deletes: string = '';
  onKeyCheckDelete(event) {
    console.log("data is ", event);
    if (event.toLowerCase() == "delete") {
      this.is_disabled_delete_button = true;
    } else {
      this.is_disabled_delete_button = false;
    }
  }

  remove_favourite_all_files() {

    console.log(this.all_root_folder_list)
    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.checked === true
    );


    let result = all_root_folder.map(({ id }) => id);
    if (all_root_folder[0]['version'] && all_root_folder.length == 1) {
      this.msg = "This file can't delete from here!"
      this.showInfo();
    } else if (all_root_folder.length == 1) {
      this.remove_favourite_single_files(all_root_folder[0]['id'])
    } else {
      this.dataRoomService
        .delete_redacte_pdf(this.dataroomId, result)
        .subscribe((res) => {
          this.getAllFavourites()
          this.BulkDelete = false;
          this.msg =
            "Folders/files deleted successfully!";
          this.showError();

        });
    }




  }

  remove_favourite_single_files(id) {
    this.favoutiefolder.push(id)
    this.dataRoomService
      .delete_redacte_pdf(this.dataroomId, this.favoutiefolder)
      .subscribe((res) => {
        this.favoutiefolder = [];
        this.msg =
        "Folders/files deleted successfully!";
        this.showSuccess();
        this.getAllFavourites();

      });
  }


  goToNextFolder(folder_id) {
    this.router.navigate(["/folder_detail", folder_id]);
    //this.getAllSubfolderList();
  }

  goBack() {
    this.router.navigate(["/folder_detail", this.folderId]);
  }


  getIcons(res, is_folder) {
    console.log(res.name);
    const filename = res.name;
    if (res.folder__is_folder == true) {
      let url = "assets/images/ICONS_PNG/folder.png";
      return url;
    } else {
      if (
        filename.endsWith(".avi") ||
        filename.endsWith(".mov") ||
        filename.endsWith(".3gp") ||
        filename.endsWith(".mpeg") ||
        res.content_type == "video/msvideo" ||
        res.content_type == "video/avi" ||
        res.content_type == "video/x-msvideo"
      ) {
        let url = "assets/images/ICONS_PNG/avi.png";
        return url;
      } else if (res.content_type == "text/css" || filename.endsWith(".css")) {
        let url = "assets/images/ICONS_PNG/css.png";
        return url;
      } else if (res.content_type == "text/csv" || filename.endsWith(".csv")) {
        let url = "assets/images/ICONS_PNG/csv.png";
        return url;
      } else if (
        res.content_type == "application/msword" ||
        filename.endsWith(".doc")
      ) {
        let url = "assets/images/ICONS_PNG/doc.png";
        return url;
      } else if (
        filename.endsWith(".docx") ||
        res.content_type ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        let url = "assets/images/ICONS_PNG/docx.png";
        return url;
      } else if (
        filename.endsWith(".ppt")
      ) {
        let url = "assets/images/ICONS_PNG/ppt.png";
        return url;
      } else if (
        filename.endsWith(".pptx")
      ) {
        let url = "assets/images/ICONS_PNG/pptx.png";
        return url;
      } else if (
        res.content_type == "application/vnd.ms-excel" ||
        filename.endsWith(".xls")
      ) {
        let url = "assets/images/ICONS_PNG/xls.png";
        return url;
      } else if (
        res.content_type ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        filename.endsWith(".xlsx")
      ) {
        let url = "assets/images/ICONS_PNG/xlsx.png";
        return url;
      } else if (
        res.content_type == "application/pdf" ||
        filename.endsWith(".pdf") ||
        filename.endsWith(".PDF")
      ) {
        let url = "assets/images/ICONS_PNG/pdf.png";
        return url;
      } else if (
        res.content_type == "audio/mp3" ||
        filename.endsWith(".mp3") ||
        filename.endsWith(".wav") ||
        filename.endsWith(".m4a") ||
        filename.endsWith(".wma")
      ) {
        let url = "assets/images/ICONS_PNG/mp3.png";
        return url;
      } else if (res.content_type == "video/mp4" || filename.endsWith(".mp4")) {
        let url = "assets/images/ICONS_PNG/mp4.png";
        return url;
      } else if (
        res.content_type == "image/jpeg" ||
        res.content_type == "image/jpg" ||
        filename.endsWith(".jpg") ||
        filename.endsWith(".jpeg")
      ) {
        let url = "assets/images/ICONS_PNG/jpg.png";
        return url;
      } else if (res.content_type == "image/png" || filename.endsWith(".png")) {
        let url = "assets/images/ICONS_PNG/png.png";
        return url;
      } else if (
        res.content_type == "text/plain" ||
        filename.endsWith(".txt")
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

  openRedactor(file_id, id) {
    window.open('/#/file-editor/' + this.dataroomId + "/" + this.folderId + '/' + file_id + '/' + id + '/' + true);
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

  to_date: any;
  from_date: any;
  changeDateWise(from_date, to_date) {
    this.to_date = to_date;
    this.from_date = from_date;
    this.getAllFavourites();
  }

  getDateWise() {
    var today = new Date();
    this.to_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    this.from_date = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    this.getAllFavourites();
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
          this.getAllFavourites();

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


    var checked_list = this.all_root_folder_list.filter(
      (res) => res.checked === true
    );

    if (checked_list.length == 1) {
      this.downloadVersion(checked_list[0]);
    } else {

      console.log(checked_list);
      var finalData = {};
      let url = '/#/download-status-documents'
      console.log('url', url)
      window.open(url, '_blank')

      this.dataRoomService.bulkDownloadStatus(this.dataroomId).subscribe(async res => {
        console.log(res);
        this.statusId = await res;
        var checked_list = this.all_root_folder_list.filter(
          (res) => res.checked === true
        );

        var notifyemailvar = localStorage.getItem("notifyemail")
        finalData['statusid'] = this.statusId
        const alldata = this.all_root_folder_list.filter(
          (res) => res.checked === true
        );
        finalData['data'] = alldata.map(obj => {
          const newData: { dataroom?: number, file_id?: number, } = { dataroom: obj.dataroom_Id, file_id: obj.id };
          return {
            ...obj, ...newData
          };
        })
        finalData['token'] = localStorage.getItem("token")
        finalData['notifyemail'] = notifyemailvar;
        console.log('final data 2: ', finalData)
        console.log(finalData, "the final data list")
        console.log("************************** not print");
        this.dataRoomService
          .bulkDownloadRedact(JSON.stringify(finalData), checked_list.length)
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
}
