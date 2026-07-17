import { Component, OnInit } from "@angular/core";
import { BaseUrlClass } from "../../common/index";
import { DataRoomService } from "../../services/index";
import { ToastrService } from "ngx-toastr";
import { SpinnerVisibilityService } from "ng-http-loader";
import {
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { TimezoneService } from "../../services/timezone.service";
@Component({
  selector: "app-recent-documents",
  templateUrl: "./recent-documents.component.html",
  styleUrls: ["./recent-documents.component.css"],
})
export class RecentDocumentsComponent implements OnInit {

  all_root_folder_list: any;
  timezone: any;
  dataroomId: number;
  baseUrl: any;
  statusId: any;
  show_spinner = true;
  size: any;
  startLoader: boolean;
  p: number = 1;
  is_disabled_delete_button: boolean;
  deletes: string;
  dataroom_date: any;
  usertimezone: string;
  token: any = "";
  constructor(
    private baseUrlClass: BaseUrlClass,
    private dataRoomService: DataRoomService,
    private spinner: SpinnerVisibilityService,
    private toastr: ToastrService,
    private timeZone: TimezoneService
  ) {

    this.token = localStorage.getItem("token");
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
    this.baseUrl = this.baseUrlClass.baseUrl;
    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    this.getDateWise();
    this.initializeDeleteForm();
    this.getUserInfo();
    this.getAllDataRooms();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
    this.getFeatures(this.dataroomId);
  }
  datarooms_indexing: any = { hide_file_indexing: "" };
  getAllDataRooms() {
    this.dataRoomService.getAllDatarooms().subscribe((res) => {
      this.datarooms_indexing = res;
      this.dataroom_date = res.created_date.slice(0, 10);
      this.datarooms_indexing = this.datarooms_indexing.filter(
        (res) => res.id == this.dataroomId
      );
      this.datarooms_indexing = this.datarooms_indexing[0];
      console.log(this.datarooms_indexing, "indexing");
    });
  }

    
  features: any;
  getFeatures(dataroomId) {
    this.dataRoomService.get_dataroom_features(dataroomId).subscribe((res) => {
      if (res[0] === undefined) {

        this.features = {
          auto_expire: true,
          bulk_users_upload: true,
          country_perm: true,
          custom_external_link: true,
          custom_logo: true,
          custom_watermarking: true,
          desktop_unlimit_upload: true,
          doculink_perm: true,
          dropbox_upload: true,
          email_to_dataroom_upload: true,
          favourites: true,
          google_drive_upload: true,
          id: 2,
          la_admin_access: true,
          module_perm: true,
          one_drive_upload: true,
          proj_management: true,
          proj_overview: true,
          proj_updates: true,
          proj_video_intro: true,
          qa_submit: true,
          qa_with_cat: true,
          redaction: true,
          sharepoint_upload: true,
          two_factor_auth: true,
          voting_perm: true,
          auto_logout: true,
          co_current_logins: true,
          voting_report_perm: true,
          index_report_others: true,
          self_upload_status: true,
          all_user_upload_status: true,
          activity_tracker_perm: true,
          file_view_limit: true,
          viewer_support: true,
          fence_viewer: true,
          print_screen_perm: true,
        }
      } else {
        this.features = res[0];
      }
      console.log("features>>", this.features)
    });
  }
  user: any;
  getUserInfo() {
    this.dataRoomService
      .getUserProfileDatroom(this.dataroomId)
      .subscribe((res) => {
        this.user = res;
        console.log(this.user, "User Info Recent");
      });
  }

  getAllRecentDocument(pageno) {
    this.show_spinner = true;
    this.show_spinnerr = true;
    this.p = pageno;
    this.all_root_folder_list = null;
    this.dataRoomService
      .getAllActivityDocuments(this.dataroomId, pageno)
      .subscribe((res) => {
        this.show_spinner = false;
        this.get_dataroom_usage_details();
        this.size = res.size;
        const newdata = res.data;
        this.all_root_folder_list = newdata.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00' }));
        this.all_root_folder_list.forEach((res) => {
          res.icons = this.getIcons(res.folder__name, res.folder__file_content_type, res.folder__is_folder
          );
        });
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


  onKeyCheckDelete(event) {
    console.log("data is ", event);
    if (event.toLowerCase() == "delete") {
      this.is_disabled_delete_button = true;
    }
  }


  show_spinnerr: boolean = true;
  storage_data: any[];
  too_date: any
  curr: Date;
  get_dataroom_usage_details() {
    this.show_spinnerr = true;
    this.too_date = new Date();
    var year = this.too_date.getFullYear();
    var mes = this.too_date.getMonth() + 1;
    var dia = this.too_date.getDate();
    this.curr = new Date();
    var todays = year + "-" + mes + "-" + dia;

    this.dataRoomService
      .get_dataroom_usage_details_for_graph(
        this.dataroomId,
        this.dataroom_date,
        todays
      )
      .subscribe((res) => {
        this.storage_data = res;

        console.log(this.from_date, "in main from_date");
        console.log(this.to_date, "in main to_date");
        console.log("this.data doument-right-side ", this.storage_data);
        this.show_spinnerr = false;

      });
  }

  DownloadFiles(folder) {
    this.dataRoomService
      .getDownloadFiles(folder.folder_id, "download")
      .subscribe((res: any) => {
        console.log(folder, "resresresresres");
        //console.log(res['name'], "name", res, "rem response here");

        // console.log(res.headers.get('content-disposition'));
        if (res.size == 0) {
          this.msg = "You dont have access to download this file ";
          this.showInfo();
        } else if (res.size > 0 && res['as_pdf'] == true) {
          this.msg = "File successfully Downloaded";
          this.showInfo();
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>downloadfile", res['name'])
          const link = document.createElement('a');
          link.setAttribute('target', '_blank');
          link.setAttribute('href', this.baseUrl + '/media/fileviewcatche/' + res['name']);
          link.setAttribute('download', res['name']);
          document.body.appendChild(link);
          link.click();
          link.remove();
          // this.closeDialogNote();
        } else {
          this.msg = "File successfully Downloaded";
          this.showInfo();
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>downloadfile", res['name'])
          const link = document.createElement('a');
          link.setAttribute('target', '_blank');
          link.setAttribute('href', this.baseUrl + '/media/' + res['name']);
          link.setAttribute('download', res['name']);
          document.body.appendChild(link);
          link.click();
          link.remove();
          //this.closeDialogNote();
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
          const url = window.URL.createObjectURL(res); 
          var W = window.open(url);
          W.window.print();
          window.close();
        }
      });
  }

  goToViewerPage(folder) {
    let token = localStorage.getItem("token");
    document.cookie = "token=" + token;
    //
    console.log("folder id is", folder);
    this.dataRoomService
      .getFilesUpdated(folder.folder.id, "view")
      .subscribe((res) => {});
  }

  getIcons(name, folder__file_content_type, is_folder) {
    if (is_folder == true) {
      let url = "assets/images/ICONS_PNG/folder.png";
      return url;
    } else {
      if (
        name.endsWith(".avi") ||
        name.endsWith(".mov") ||
        name.endsWith(".3gp") ||
        name.endsWith(".mpeg") ||
        folder__file_content_type == "video/msvideo" ||
        folder__file_content_type == "video/avi" ||
        folder__file_content_type == "video/x-msvideo"
      ) {
        let url = "assets/images/ICONS_PNG/avi.png";
        return url;
      } else if (folder__file_content_type == "text/css" || name.endsWith(".css")) {
        let url = "assets/images/ICONS_PNG/css.png";
        return url;
      } else if (folder__file_content_type == "text/csv" || name.endsWith(".csv")) {
        let url = "assets/images/ICONS_PNG/csv.png";
        return url;
      } else if (
        folder__file_content_type == "application/msword" ||
        name.endsWith(".doc")
      ) {
        let url = "assets/images/ICONS_PNG/doc.png";
        return url;
      } else if (
        name.endsWith(".docx") ||
        folder__file_content_type ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        let url = "assets/images/ICONS_PNG/docx.png";
        return url;
      } else if (
        folder__file_content_type == "application/vnd.ms-excel" ||
        name.endsWith(".xls")
      ) {
        let url = "assets/images/ICONS_PNG/xls.png";
        return url;
      } else if (
        folder__file_content_type ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        name.endsWith(".xlsx")
      ) {
        let url = "assets/images/ICONS_PNG/xlsx.png";
        return url;
      } else if (
        folder__file_content_type == "application/pdf" ||
        name.endsWith(".pdf")
      ) {
        let url = "assets/images/ICONS_PNG/pdf.png";
        return url;
      } else if (
        folder__file_content_type == "audio/mp3" ||
        name.endsWith(".mp3") ||
        name.endsWith(".wav") ||
        name.endsWith(".m4a") ||
        name.endsWith(".wma")
      ) {
        let url = "assets/images/ICONS_PNG/mp3.png";
        return url;
      } else if (folder__file_content_type == "video/mp4" || name.endsWith(".mp4")) {
        let url = "assets/images/ICONS_PNG/mp4.png";
        return url;
      } else if (
        folder__file_content_type == "image/jpeg" ||
        folder__file_content_type == "image/jpg" ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg")
      ) {
        let url = "assets/images/ICONS_PNG/jpg.png";
        return url;
      } else if (folder__file_content_type == "image/png" || name.endsWith(".png")) {
        let url = "assets/images/ICONS_PNG/png.png";
        return url;
      } else if (
        folder__file_content_type == "text/plain" ||
        name.endsWith(".txt")
      ) {
        let url = "assets/images/ICONS_PNG/txt.png";
        return url;
      } else {
        let url = "assets/images/ICONS_PNG/default.png";
        return url;
      }
    }
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
      this.getAllRecentDocument(this.p);
      this.showSuccess();
    });
  }

  to_date: any;
  from_date: any;
  changeDateWise(from_date, to_date) {
    this.to_date = to_date;
    this.from_date = from_date;
    this.getAllRecentDocument(this.p);
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
    this.getAllRecentDocument(this.p);
  }


  selectAll(checked) {
    let all_root_folder_list = this.all_root_folder_list.filter((res) => res.download_permission === true)
    if (checked == true) {
      all_root_folder_list.forEach((res) => {
        res.checked = true
      });
      console.log("all_root_folder_list>>>>>>>>>>>>...", all_root_folder_list.length)
      if (all_root_folder_list.length == 1) {
        this.BulkDelete = false;
      } else if (all_root_folder_list.length > 0) {

        this.BulkDelete = true;
      } else {
        this.BulkDelete = false;
      }
      //this.BulkDelete = true;
    } else {
      all_root_folder_list.forEach((res) => {
        res.checked = false;
      });
      this.BulkDelete = false;
    }
  }

  BulkDelete: boolean = false;
  showBulkDownload() {
    console.log("all_root_folder_list in bulk download", this.all_root_folder_list);
    var checked_list = this.all_root_folder_list.filter(
      (res) => res.checked === true
    );
    if(checked_list.length == 1){
      this.BulkDelete = false;
    }else if (checked_list.length > 0) {

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
        .deleteFolderOrFile(res.folder__dataroom_folder_uuid)
        .subscribe((ress) => {
          this.getAllRecentDocument(this.p);
          this.deletes = '';
        });
    });
    this.msg =
      "Folder/file successfully deleted but Unless permanently deleted, items in trash add to your current storage !! Please wait for the Content to update!!";
    this.showSuccess();
  }

  DownloadSelectedFiles() {
    let url = '/#/download-status-documents'
    console.log('url', url)
    window.open(url, '_blank');
    var checked_list = this.all_root_folder_list.filter(
      (res) => res.checked === true
    );
    console.log(checked_list);
    var finalData = {};
    this.spinner.hide();
    this.dataRoomService.bulkDownloadStatus(this.dataroomId).subscribe(async res => {
      this.spinner.hide();
      this.statusId = await res;
      var checked_list = this.all_root_folder_list.filter(
        (res) => res.checked === true
      );
      var notifyemailvar = localStorage.getItem("notifyemail")
      finalData['statusid'] = this.statusId;
      var uniq = {};
      const data = checked_list.filter(obj => !uniq[obj.folder_id] && (uniq[obj.folder_id] = true));
      console.log("Data>>>>", data)
      finalData['data'] = data.filter(
        (res) => res.checked === true
      );

      finalData['token'] = localStorage.getItem("token")
      finalData['notifyemail'] = notifyemailvar;
      this.spinner.hide();
      this.dataRoomService
        .bulkDownloadRecentDoc(JSON.stringify(finalData), data.length)
        .subscribe((ress) => {
          console.log(ress, "in response");
          if (ress.name == undefined) {
            console.log(ress, "in if bulkdownload1");
            // this.msg = "You dont have access to download this files";
            // this.showInfo();
          } else {
            console.log(ress, "in else bulkdownload2");
            var zip_file_path = this.baseUrl + "/" + ress.path;
            var zip_file_name = ress.name;
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
    })
  }
}
