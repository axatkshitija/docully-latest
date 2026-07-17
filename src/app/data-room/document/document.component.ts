import {
  Component,
  OnInit,
  ViewEncapsulation,
  Inject,
} from "@angular/core";

import { ToastrService } from "ngx-toastr";
import { DataRoomService, SharedService } from "../../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
declare var $: any;
import { BaseUrlClass } from "../../common/index";
import {Subscription } from "rxjs";
import { saveAs } from "file-saver";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ITreeOptions } from '@bugsplat/angular-tree-component';
import { TimezoneService } from "../../services/timezone.service";


export interface DialogData {
  filecount: any;
  size: any;
  destination: string;
  source: string;
  copy: string;
  move: string;
  ok: string;
  popup_dataroom_name: string;
}

@Component({
  selector: "app-document",
  templateUrl: "./document.component.html",
  styleUrls: ["./document.component.css"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class DocumentComponent implements OnInit {
  is_upload_file: boolean = false;
  public newFolderForm: FormGroup; // our form model
  msg: string = "";
  dataroomId: any;
  filterQuery: any;
  deleteForm: FormGroup;
  baseUrl: any;
  message: any;
  timezone: any;
  p: any = 1;
  p1: any = 1;
  download_popup_dataroom_name;
  subscription: Subscription;
  getfolderdata: boolean = false;
  selectdatarom: boolean;
  dataroom_date: any;
  usertimezone: string;
  token: any=''; 
  countryToFullStandardName: string;
  constructor(
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    // public userpermission: ManageGroupPermissionComponent,
    public dialogdownload: MatDialog,
    public bulkfaildownload: MatDialog,
    private _fb: FormBuilder,
    public baseUrlclass: BaseUrlClass,
    private sharedService: SharedService,
    public dialog: MatDialog,
    public dialognote: MatDialog,
    public dialogshortcut: MatDialog,

    private timeZone: TimezoneService
  ) {
    this.token = localStorage.getItem("token");
    this.baseUrl = this.baseUrlclass.baseUrl;
    this.timezone = this.timeZone.userTimeZone;
    if (localStorage.getItem("currentDataroomId") !== null) {
      this.dataroomId = localStorage.getItem("currentDataroomId").toString();
    }
    this.route.params.subscribe((params) => {
      console.log("dataroom id is-- call from document component");
      console.log(params);
    });

    this. getFeatures(this.dataroomId);
    this.subscription = this.sharedService.getMessage().subscribe((message) => {
      //
      this.message = message;
      if (
        this.message.text == "Refresh Documents!" ||
        this.message.text == "Refresh Folder Details!"
      ) {
        this.showDocuments = true;
        this.showSearchDocuments = false;
        this.search = "";
        this.createFolder = true;
        this.back = false;
        this.getAllFolderList();
        //this.showHideUploadDiv();
        this.getDateWise();
      }

    });
  }

  nodes: any;
  getHierarchy() {
    this.dataRoomService
      .getFoldersHierarchy(parseInt(this.dataroomId))
      .subscribe((res) => {
        console.log(res, "dataRoomService");
        this.nodes = res;
      });
  }

  ngOnInit() {
    this.initializeUserForm();
    this.getDateWise();
    this.initializeDeleteForm();
    this.getUserInfo();
    this.getAllDisclaimers();
    this.getAllFolderList();
    this.usertimezone = localStorage.getItem("currentUser");
    this.usertimezone = JSON.parse(this.usertimezone);
    this.usertimezone = this.usertimezone['user_time_zone'][0];
    this.countryToFullStandardName = localStorage.getItem('countryToFullStandardName');
    console.log('countryToFullStandardName>>>>',this.countryToFullStandardName);
  }

  giveSearchValue(value) {
    this.search = value;
    this.getSearchResult();
  }

  // Notify Email Checkbox to send notification on download ready 
  isNotifyCheck: boolean = false;

  // -------------------------------
  showDocuments: boolean = true;
  showSearchDocuments: boolean = false;
  search_result: any;
  search_files: any;
  search_folders: any;
  search: any = "";
  deletes: any = "";
  createFolder: boolean = true;
  back: boolean = false;
  getSearchResult() {
    let value = this.search; //$event.target.value;
    var start_date;
    var end_date;
    if (this.from_date == "" || this.from_date == null) {
      start_date = "";
    } else {
      start_date =
        this.from_date.getFullYear() +
        "-" +
        (this.from_date.getMonth() + 1) +
        "-" +
        this.from_date.getDate();
    }
    if (this.to_date == "" || this.to_date == null) {
      end_date = "";
    } else {
      end_date =
        this.to_date.getFullYear() +
        "-" +
        (this.to_date.getMonth() + 1) +
        "-" +
        this.to_date.getDate();
    }
    this.dataRoomService
      .getSearchFolderFilesList(
        this.dataroomId,
        this.search_by_name,
        this.search_by_type,
        this.search_by_uploaded_by,
        start_date,
        end_date,
        value
      )
      .subscribe((res) => {
        this.search_result = res;

        //this.search_files = res.files.filter((res) => res.is_view_only == true);
        const newdatafile = res.files.filter((res) => res.is_view_only == true);

        this.search_files = newdatafile.map((obj, i) => ({ ...obj, updated_date: obj.updated_date + '+04:00' }));
        this.search_folders = res.folders.filter(
          (res) => res.is_view_only == true
        );
        const newdata = this.search_folders;
        this.search_folders = newdata.map((obj, i) => ({ ...obj, updated_date: obj.updated_date + '+04:00' }));
        this.showDocuments = false;
        this.createFolder = false;
        this.showSearchDocuments = true;
        this.back = true;
      });
  }



  features: any;
  getFeatures(dataroomId) {
    this.dataRoomService.get_dataroom_features(dataroomId).subscribe((res) => {
      if (res[0] === undefined) {

        this.features = {
          auto_expire:true,
          bulk_users_upload:true,
          country_perm:true,
          custom_external_link:true,
          custom_logo:true,
          custom_watermarking:true,
          desktop_unlimit_upload:true,
          doculink_perm:true,
          dropbox_upload:true,
          email_to_dataroom_upload:true,
          favourites:true,
          google_drive_upload:true,
          id:2,
          la_admin_access:true,
          module_perm:true,
          one_drive_upload:true,
          proj_management:true,
          proj_overview:true,
          proj_updates:true,
          proj_video_intro:true,
          qa_submit:true,
          qa_with_cat:true,
          redaction:true,
          sharepoint_upload:true,
          two_factor_auth:true,
          voting_perm:true,
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

  all_root_folder_list1: any = [];

  getAllSubfolderList(folder) {
    var start_date;
    var end_date;
    if (this.from_date == "" || this.from_date == null) {
      start_date = "";
    } else {
      start_date =
        this.from_date.getFullYear() +
        "-" +
        (this.from_date.getMonth() + 1) +
        "-" +
        this.from_date.getDate();
    }
    if (this.to_date == "" || this.to_date == null) {
      end_date = "";
    } else {
      end_date =
        this.to_date.getFullYear() +
        "-" +
        (this.to_date.getMonth() + 1) +
        "-" +
        this.to_date.getDate();
    }
    this.dataRoomService
      .getAllSubfolderList(folder, "", "", "", start_date, end_date)
      .subscribe((res) => {
        console.log(res);
        this.all_root_folder_list1 = res.filter(
          (res) => res.perm.is_view_only == true
        );
        console.log(this.all_root_folder_list1, "this.all_root_folder_list");
      });
  }

  downloadShortcut(id, name) {
    this.dataRoomService.getShortcutFiles(id, "download").subscribe((res) => {
      console.log(res, "ressss");
      console.log(res.size);
      console.log(typeof res);
      var keys = Object.keys(res);
      console.log(keys.length, "keys");
      if (keys.length > 0) {
        var blob = new Blob([res.text], {
          type: "data:text/plain;charset=utf-8," + encodeURIComponent(res.text),
        });
      } else {
        console.log("ELSE in");
        this.msg = "You dont have access to download this file " + res.name;
        this.showInfo();
      }
      saveAs(blob, res.path);
    });
  }
  select_download = [];
  BulkDownloadDrm(folder) {
    console.log("bulk download", folder);
    this.select_download.push(folder);
    var finalData1 = {
      data: this.select_download,
      token: localStorage.getItem("token"),
    };

    console.log(finalData1, "Docwnload Shortcut");

    this.dataRoomService
      .bulkDownloadDrm(JSON.stringify(finalData1))
      .subscribe((ress) => {
        if (ress.name) {
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
        } else {
          this.msg = "You dont have access to download this file " + ress.name;
          this.showInfo();
        }
      });
  }
  downloadShortcutBulk() {
    this.selectedDownload = [];
    this.singleFile = false;

    let all_root_folder1 = this.all_root_folder_list.filter(
      (x) => x.selected === true
    );
    console.log(all_root_folder1, "Docully Drm");
    if (all_root_folder1.length > 0) {
      all_root_folder1.forEach((res) => {
        console.log(res, res.name, "shortcut");
        this.selectedDownload.push(res);
      });
      var finalData = {
        data: this.selectedDownload,
        token: localStorage.getItem("token"),
      };
      console.log(finalData, "Docwnload Shortcut");
      if (this.selectedDownload.length == 1) {
        if (!this.selectedDownload[0]["is_folder"]) {
          console.log(this.selectedDownload[0].id, "file_drm");
          this.downloadShortcut(
            this.selectedDownload[0].id,
            this.selectedDownload[0].name
          );
          this.singleFile = true;
        }
      }

      if (!this.singleFile) {
        this.dataRoomService
          .bulkDownloadDrm(JSON.stringify(finalData))
          .subscribe((ress) => {
            if (ress.name) {
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
            } else {
              this.msg =
                "You dont have access to download this file " + ress.name;
              this.showInfo();
            }
          });
      }
    }
  }

  showHideBackSearch() {
    this.back = false;
    this.createFolder = true;
    this.showDocuments = true;
    this.showSearchDocuments = false;
  }

  changeDateWise() {
    document.getElementById("filterPopup").style.display = "block";
  }

  search_by_name: any = "";
  search_by_uploaded_by: any = "";
  from_date: any = "";
  search_by_type: any = "";
  to_date: any = "";

  ResetFields() {
    this.search_by_name = "";
    this.search_by_uploaded_by = "";
    this.from_date = "";
    this.to_date = "";
    this.search_by_type = "";
  }

  goToViewerPage(folder) {
    console.log("folder id is", folder);
    let token = localStorage.getItem("token");
    document.cookie = "token=" + token;
  }

  goToNextFolder(folder_id) {
    this.router.navigate(["/folder_detail", folder_id]);
  }

  refresh() {
    window.location.reload();
  }
  all_folders: any = [];
  all_folder: any = [];
  getAllFolderList() {
    this.dataRoomService.getAllFolders(this.dataroomId).subscribe((res) => {
      this.all_folders = res;
      console.log("all_folder_list:-", this.all_folders);
      this.all_folders = this.all_folders.data.filter(
        (res) => res.is_root_folder === true
      );
      this.all_folder = this.all_folders;
    });
  }

  folder1: any;
  copyFile(file_id) {
    this.folder1 = this.selected;
    console.log("mango:-", this.folder1, file_id);

    if (this.folder1 !== undefined && this.folder1 !== file_id) {
      this.startLoader = true;
      this.dataRoomService.copyFile(this.folder1, file_id).subscribe((res) => {
        this.msg = "Selected Folders / Files copied successfully.";
        this.showSuccess();
        this.startLoader = false;
        this.goToNextFolder(this.selected);
      });
    } else {}
  }
  note: any;
  //Download Files
  DownloadFiles(folder) {
    let url = this.router.serializeUrl(this.router.createUrlTree(['/download-status-documents']))
    console.log('url', url)
    window.open(url, '_blank')
    this.dataRoomService
      .getDownloadFiles(folder.id, "download")
      .subscribe((res) => {
        this.openDialogNote();
        console.log(res, "here is resssss111111");
        if (res.size == 0) {
          console.log("here is resssss22221");
          this.msg = "You dont have access to download this file ";
          this.showInfo();
        } else {
          console.log(res, "here is resssss33333");
          this.msg = "File successfully Downloaded";
          this.showInfo();

          const url = window.URL.createObjectURL(res); // <-- work with blob directly
          // create hidden dom element (so it works in all browsers)
          const a = document.createElement("a");
          a.setAttribute("style", "display:none;");
          document.body.appendChild(a);

          // create file, attach to hidden element and open hidden element
          a.href = url;
          a.download = folder.names;
          a.click();
          this.closeDialogNote();
          return url;
        }
      });
  }

  selectedDownload = [];
  statusArray = [];
  singleFile = false;
  a: any;
  statusId: any;
  download_all_files() {
    debugger
    this.startLoader = true;

    this.selectedDownload = [];
    this.singleFile = false;

    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.selected === true
    );
    if (all_root_folder.length > 0) {
      all_root_folder.forEach((res) => {
        this.selectedDownload.push(res);
      });
      var finalData = {
        data: this.selectedDownload,
        token: localStorage.getItem("token"),
      };

      if (this.selectedDownload.length == 1) {
        console.log(this.selectedDownload[0]);
        if (!this.selectedDownload[0]["is_folder"]) {
          this.DownloadFiles(this.selectedDownload[0]);
          this.singleFile = true;
        }
      }

      if (!this.singleFile) {

        let url = '/#/download-status-documents'
        console.log('url', url)
        window.open(url, '_blank')

        this.dataRoomService.bulkDownloadStatus(this.dataroomId).subscribe(async res => {
          console.log(res);
          this.statusId = await res;
          var notifyemailvar = localStorage.getItem("notifyemail")
          finalData['statusid'] = this.statusId;
          finalData['notifyemail'] = notifyemailvar;
          console.log('final data 2: ', finalData)

          this.dataRoomService.bulkDownload(JSON.stringify(finalData), this.statusCount.filecount).subscribe(
            (ress) => {
              console.log(ress, "document -ts");

            },

          );
        });
      }
    }
  }

  download_all_filesuser() {
    this.selectedDownload = [];
    this.singleFile = false;

    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.selected === true
    );
    if (all_root_folder.length > 0) {
      all_root_folder.forEach((res) => {
        this.selectedDownload.push(res);
        var notifyemailvar = localStorage.getItem("notifyemail")
        this.selectedDownload['notifyemail'] = notifyemailvar;

      });
      var finalData = {
        data: this.selectedDownload,
        token: localStorage.getItem("token"),
      };

      if (this.selectedDownload.length == 1) {
        console.log(this.selectedDownload[0]);
        if (!this.selectedDownload[0]["is_folder"]) {
          this.DownloadFiles(this.selectedDownload[0]);
          this.singleFile = true;
        }
      }

      if (!this.singleFile) {
        // Newly added code 
        // var notifyemailvar = localStorage.getItem("notifyemail")
        // console.log("notify email var is here",notifyemailvar);
        // finalData['notifyemail'] =notifyemailvar;
        // console.log("final data var is here",finalData);
        // Newly added code 
        this.dataRoomService
          .bulkDownload(JSON.stringify(finalData))
          .subscribe((ress) => {
            console.log(ress, "document -ts");
            if (ress.name == undefined) {
              this.msg = "You don't have Download access to one or more files";
              this.showInfo();
            } else {
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
      }
    } else {
      this.msg = "Only files can be Download... ";
      this.showInfo();
    }
  }

  //Download Single Folder

  download_single_folder(data) {
    this.selectedDownload = [];

    console.log(data);
    this.selectedDownload.push(data);

    var finalData = {
      data: this.selectedDownload,
      token: localStorage.getItem("token"),
    };

    this.dataRoomService
      .bulkDownload(JSON.stringify(finalData))
      .subscribe((ress) => {
        if (ress.name) {
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
        } else {
          this.msg = "You dont have access to download this file " + ress.name;
          this.showInfo();
        }
      });
  }
  selected: any;
  checked: boolean = true;
  selectdvalue: any;
  var: any;
  select_destination(destination) {
    this.selected = destination;
    this.folder1 = destination;
  }

  CopySelectedFile() {
    this.folder1 = this.selected;

    if (this.folder1 !== undefined) {
      var folder_list = this.all_root_folder_list.filter(
        (res) => res.selected === true
      );
      console.log(folder_list);

      for (var i = 0; i < folder_list.length; ++i) {
        if (folder_list[i]["id"] === this.folder1) {
          this.msg = "Source & Destination should not be same";
          this.startLoader = false;
          this.showInfo();
          return 0;
        }
      }
      this.startLoader = true;
      this.dataRoomService
        .copySelectedFile(this.folder1, folder_list)
        .subscribe((res) => {
          // this.all_folder_list = res;

          this.msg = "Selected Folders / Files copied successfully.";
          this.showSuccess();
          this.startLoader = false;
          this.goToNextFolder(this.folder1);
        },(error)=>{
          this.msg = "Something wents wrong!";
          this.showError();
        });
    }
  }

  MoveSelectedFile() {
    this.folder1 = this.selected;
    console.log(this.selected);
    console.log("move selected file>>>>>>>>>>>>>>>>>>>>>>>>>")

    if (this.folder1 !== undefined) {
      var folder_list = this.all_root_folder_list.filter(
        (res) => res.selected === true
      );
      for (var i = 0; i < folder_list.length; ++i) {
        if (folder_list[i]["id"] === this.folder1) {
          this.msg = "Source & Destination should not be same";
          this.startLoader = false;
          this.showInfo();
          return 0;
        }
      }
      this.startLoader = true;
      this.dataRoomService
        .moveSelectedFile(this.folder1, folder_list)
        .subscribe((res) => {
          // this.all_folder_list = res;

          this.msg = "Selected Folders / Files moved successfully.";
          this.showSuccess();
          // this.getAllRootFolders();
          this.startLoader = false;
          this.goToNextFolder(this.folder1);
        });
    } else {}
  }

  moveFile(file_id) {
    this.folder1 = this.selected;
    if (this.folder1 !== undefined && this.folder1 !== file_id) {
      console.log("mango:-", this.folder1, file_id);
      this.startLoader = true;
      this.dataRoomService.moveFile(this.folder1, file_id).subscribe((res) => {
        this.msg = "Selected Folders / Files moved successfully.";
        this.showSuccess();
        this.getAllRootFolders();
        this.startLoader = false;
        this.goToNextFolder(this.selected);
      });
    } else {}
  }

  user: any;
  user_id: number;
  getUserInfo() {}


  receiveAutoMsgHandler(p) {
    this.getDataroomUser();
    this.user = p.userdetail;
    this.datarooms_indexing = p.singledataroom;
    if (p.singledataroom == null || p.singledataroom == undefined) {
      this.getSingleDataroom();
    }
    console.log(this.user, "overview");
    const d_date = p.singledataroom;
    this.dataroom_date = d_date.created_date.slice(0, 10);
    console.log(p, "overview???????????????????????????????/");
    this.user_id = p.userdetail.id;
    this.perm = p.memberpermission;
    this.gotoURl(this.dataroomId);
  }


  create_folder = true;
  showHideUploadDiv() {

    window.open("/#/upload-folders-sections/" + this.dataroomId)

  }

  folder_name_validation = '^[^\\/?%*:|"<>]+$';
  initializeUserForm() {
    this.newFolderForm = this._fb.group({
      folder_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(this.folder_name_validation),
        ],
      ],
    });
  }

  all_root_folder_list: any = [];
  createNewFolder() {
    // this.newFolderForm.disable();
    console.log("new folder name ", this.newFolderForm.value.folder_name);
    this.dataRoomService
      .create_new_folder(this.dataroomId, this.newFolderForm.value.folder_name)
      .subscribe((res) => {
        if (res.msg) {
          this.msg = res.msg;
          // location.reload();
          this.showInfo();
        } else {
          this.msg = "Folder successfully created!";
          // this.userpermission.UpdateFoldersFilesPermission();
          res.icons = "assets/images/ICONS_PNG/folder.png";
          this.all_root_folder_list.push(res);
          location.reload();
          this.showSuccess();
        }

        // this.newFolderForm.enable();
        this.newFolderForm.reset();
      });
  }

  getAllRootFolders() {
    var todays = ""; 
    var first = "";
    console.log("dataroom id", this.dataroomId);
    this.dataRoomService
      .get_all_root_folders(this.dataroomId, todays, first)
      .subscribe((res) => {
        this.get_dataroom_usage_details();
        this.getfolderdata = true;
        const newdata = res;
        this.all_root_folder_list = newdata.map((obj, i) => ({ ...obj, updated_date: obj.updated_date + '+04:00' }));

        console.log(this.all_root_folder_list, "folder list");
        this.all_root_folder_list = this.all_root_folder_list.filter(
          (res) => res.is_view_only === true
        );

        this.all_root_folder_list.forEach((res) => {
          res.icons = "assets/images/ICONS_PNG/folder.png"
          if ((res.is_view_and_print_and_download && !res.is_folder) || (res.is_view_and_print_and_download && res.is_folder) || (res.is_shortcut && res.is_folder) || (this.user.member.is_dataroom_admin ||
            this.user.member.is_la_user)) {
            res['isActionEnabled'] = true
          } else {
            res['isActionEnabled'] = false
          }
        });
        console.log(this.all_root_folder_list, "folder list 2");

        this.gotoURl(this.dataroomId);
      });
  }

  getIcons() {
      let url = "assets/images/ICONS_PNG/folder.png";
      return url;
  }

  initializeDeleteForm() {
    this.deleteForm = new FormGroup({
      delete: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
  }

  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  showInfo() {
    this.toastr.info(this.msg);
  }
  showNote() {
    this.toastr.info(this.note);
  }
  is_disabled_delete_button: boolean = false;
  // delete folder or id
  onKeyCheckDelete(event) {
    console.log("data is ", event);
    if (event.toLowerCase() == "delete") {
      this.is_disabled_delete_button = true;
    }
  }

  delete_folder_or_file(folder_id, i) {
    //  this.deletes = "";
    console.log("Result before single deletion is", folder_id);
    this.dataRoomService.deleteFolderOrFile(folder_id).subscribe((res) => {
      console.log("Result after single deletion is", res);
      this.msg =
        "Folders & Files have been deleted successfully and are moved to Trash. To restore or permanently delete them from the server, please go to Trash folder. Data remaining in your Trash adds up to your total storage consumption.";
      this.getAllRootFolders();

      // this.all_root_folder_list = res;//.splice(i, 1);
      this.showSuccess();
      this.deletes = "";
      // this.ngOnInit();
      location.reload();
    });
  }

  is_edit_folder_name: boolean = false;
  is_edit_index_number: boolean = false;

  // is edit folder name
  isEditFolderName(i) {
    this.edittedName = i;
    this.is_edit_folder_name = true;
  }

  isEditIndexNumber(i) {
    this.editedIndex = i;
    this.is_edit_index_number = true;
  }

  selectedRowGride: number;
  editedIndexGride: number;
  edittedNameGride: number;
  is_edit_folder_name_gride: boolean = false;
  is_edit_index_number_gride: boolean = false;

  isEditIndexNumberGride(i) {
    this.editedIndexGride = i;
    this.is_edit_index_number_gride = true;
  }

  editFolderName(folder) {
    this.dataRoomService
      .update_folder_or_file_name(folder)
      .subscribe((res: any) => {
        this.is_edit_folder_name = false;
        this.msg = "Folder / File name is successfully updated!";
        this.showInfo();
        this.edittedName = -1;
        location.reload();
      });
  }

  editIndexNumber(folder) {
    this.dataRoomService
      .edit_index_of_root_folder(this.dataroomId, folder)
      .subscribe(
        (res) => {
          console.log("data is", res);
          this.is_edit_index_number = false;
          this.msg = res.msg;
          // this.all_root_folder_list = res.data;
          this.getAllRootFolders();
          this.showInfo();
          this.editedIndex = -1;
          location.reload();
        },

        (err) => {
          this.msg = err.error.msg;
          this.showError();
          console.log("error is", err);
          location.reload();
        }
      );
  }

  selectedRow: number;
  editedIndex: number;
  edittedName: number;

  setClickedRow(i) {
    console.log(i);
    console.log(this.nodes);
    this.selectedRow = i;
  }

  all_folder_file_list: number[] = [];
  toggle: boolean = false;
  selectedFolderList: any = [];
  isActionBar: boolean = false;
  selected_folder_list_count: number = 0;

  onChangeSelect() {
    this.toggle = !this.toggle;
    let counter = -1;
    this.all_root_folder_list.forEach((folder) => {
      folder.selected = this.toggle;
      this.all_folder_file_list.push(counter + 1);
    });
    //bulk download
    let all_root_folders = this.all_root_folder_list.filter(
      (x) => x.selected === true
    );
    if (all_root_folders.length > 0) {
      if (all_root_folders[0].is_view_and_print_and_download) {
        console.log("download access");
        this.select = true;
      }
      if (all_root_folders[0].is_view_and_print_and_download == false) {
        this.select = false;
      }

      if (all_root_folders[0].is_shortcut) {
        this.selectshortcut = true;
      }
      if (all_root_folders[0].is_shortcut == false) {
        this.selectshortcut = false;
      }
    }

    if (all_root_folders.length > 1) {
      for (let i = 0; i < all_root_folders.length; i++) {
        console.log(all_root_folders[0].is_view_and_print_and_download, all_root_folders[1].is_view_and_print_and_download, all_root_folders[i].is_view_and_print_and_download)
        if (
          all_root_folders[0].is_view_and_print_and_download == true ||
          all_root_folders[1].is_view_and_print_and_download ||
          all_root_folders[i].is_view_and_print_and_download ||
          this.select
        ) {
          this.select = true;
          console.log("download access", this.select);
        } else {
          this.select = false;
        }

        if (
          all_root_folders[0].is_shortcut == true ||
          all_root_folders[1].is_shortcut ||
          all_root_folders[i].is_shortcut ||
          this.selectshortcut
        ) {
          this.selectshortcut = true;
        } else {
          this.selectshortcut = false;
        }
      }
    }


    if (all_root_folders.length === 0) {
      this.selectshortcut = false;
      console.log(all_root_folders, "all_root_folder");

      this.select = false;
    }

    if (this.toggle === true) {
      let all_root_folder = this.all_root_folder_list.filter(
        (res) => res.selected === true
      );
      this.selected_folder_list_count = all_root_folder.length;
      if (all_root_folder.length >= 1) {
        this.isActionBar = true;
      } else {
        this.selected_folder_list_count = 0;
        this.isActionBar = false;
      }
    } else {
      this.isActionBar = false;
      this.selected_folder_list_count = 0;
      let all_root_folder = this.all_root_folder_list.filter(
        (res) => (res.selected = false)
      );
    }
    this.all_root_folder_list.forEach((res) => {
      console.log("check this data", res);
      // alert("this function")
      if (res.selected == true) {
        console.log("check select", res.isAction);
        res.isAction = true;
        console.log("check select 2", res.isAction);
      } else {

        res.isAction = false;
      }
    });
    console.log("download ", this.select);

  }

  // check box selection
  select: boolean = false;
  selectshortcut: boolean = false;
  selectedDownloads = [];
  selected_folder__count: any;
  checkbox_value(folder: any, i) {
    console.log(folder);
    this.getAllSubfolderList(folder.id);
    folder.selected = folder.selected ? false : true;
    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.selected === true
    );
    console.log(all_root_folder, "all_root_folder");
    if (all_root_folder.length == this.all_root_folder_list.length) {
      this.toggle = true;
    } else {
      this.toggle = false;
    }

    if (all_root_folder.length > 0) {
      if (all_root_folder[0].is_view_and_print_and_download) {
        console.log(
          this.all_root_folder_list[0].is_view_and_print_and_download,
          "download access"
        );
        this.select = true;
      }
      if (all_root_folder[0].is_view_and_print_and_download == false) {
        this.select = false;
      }
      if (this.all_root_folder_list1.length > 0) {
        console.log(this.all_root_folder_list1, "download access");
      }

      if (all_root_folder[0].is_shortcut) {
        this.selectshortcut = true;
      }
      if (all_root_folder[0].is_shortcut == false) {
        this.selectshortcut = false;
      }
    }

    if (all_root_folder.length > 1) {
      for (let i = 0; i < all_root_folder.length; i++) {
        if (
          all_root_folder[0].is_view_and_print_and_download == true ||
          all_root_folder[1].is_view_and_print_and_download ||
          all_root_folder[i].is_view_and_print_and_download
        ) {
          console.log("download access");
          this.select = true;
        } else {
          this.select = false;
        }
        if (
          all_root_folder[0].is_shortcut == true ||
          all_root_folder[1].is_shortcut ||
          all_root_folder[i].is_shortcut
        ) {
          this.selectshortcut = true;
        } else {
          this.selectshortcut = false;
        }
      }
    }
    if (all_root_folder.length === 0) {
      this.selectshortcut = false;
      console.log(all_root_folder, "all_root_folder");

      this.select = false;
    }

    let length = all_root_folder.length;
    if (length >= 1) {
      this.isActionBar = true;
      // this.selected_folder_list_count = length;
      if (all_root_folder.is_folder) {
      } else {
        this.selected_folder_list_count = length;
      }
    } else {
      this.isActionBar = false;
      this.selected_folder_list_count = length;
    }

    this.all_root_folder_list.forEach((res) => {
      if (res.selected === true) {
        res.isAction = true;
      } else {
        res.isAction = false;
      }
    });
  }
  delete: any;
  delete_all_files() {
    //this.deletes = "";

    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.selected === true
    );
    this.dataRoomService
      .delete_all_folder_or_files(all_root_folder)
      .subscribe((res) => {
        this.getAllRootFolders();
        this.msg =
          "Folders & Files have been deleted successfully and are moved to Trash. To restore or permanently delete them from the server, please go to Trash folder. Data remaining in your Trash adds up to your total storage consumption.";
        this.showInfo();
        this.isActionBar = false;
        this.deletes = "";
      });
  }

  deletefolder: any = []
  delete_folder(root_folder) {
    //this.deletes = "";
    Object.assign(root_folder, { "selected": true, "isAction": true });
    this.deletefolder.push(root_folder)
    this.deletefolder.push()
    debugger
    this.dataRoomService
      .delete_all_folder_or_files(this.deletefolder)
      .subscribe((res) => {
        console.log(res, " the folder is deleted")
        this.getAllRootFolders();
        this.msg =
          "Folders & Files have been deleted successfully and are moved to Trash. To restore or permanently delete them from the server, please go to Trash folder. Data remaining in your Trash adds up to your total storage consumption.";
        this.showInfo();
        this.isActionBar = false;
        this.deletes = "";
      });
  }

  // hide edIt index

  hideEditIndex(i) {
    this.is_edit_folder_name = false;
    this.is_edit_index_number = false;
    this.editedIndex = -1;
    this.edittedName = -1;
    //
    if (this.all_folders.length > 0) {
      this.all_folder = this.all_folders.filter(
        (res) => res.id !== this.all_root_folder_list[i].id
      );
    }
  }

  show_data: boolean;
  perm: any;
  gotoURl(dataroomId) {
    //this.dataRoomService.getMembersPermission(dataroomId).subscribe((res) => {
    //this.perm = res;

    if (this.perm == undefined || this.perm == null) {
      this.dataRoomService.getMembersPermission(this.dataroomId).subscribe((res) => {
        this.perm = res;
        if (this.perm.is_edit_index) {
          this.show_data = true;
        } else {
          this.show_data = false;
        }

        console.log("permnull")
      })
    } else if (this.perm.is_edit_index) {
      this.show_data = true;
    } else {
      this.show_data = false;
    }

    console.log('----------Show Data ', this.show_data);
    // });
  }


  favoutiefolder: any = []

  favourite_single_files(id,favourite) {
    this.favoutiefolder.push(id);
    if(favourite){
      this.dataRoomService
      .delete_favourite_all_selected_files(this.dataroomId, this.favoutiefolder)
      .subscribe((res) => {
        this.favoutiefolder = [];
        this.getAllRootFolders();
        this.msg =
        "Folder/file successfully removed Favourites.";
        this.showInfo();
        this.isActionBar = false;
      });
    }else{
      this.dataRoomService
      .favourite_all_selected_files(this.dataroomId, this.favoutiefolder)
      .subscribe((res) => {
        this.favoutiefolder = [];
        this.getAllRootFolders();
        this.msg =
          "Folder/file successfully added Favourites.";
        this.showInfo();
        this.isActionBar = false;
      });
    }

  }

  favourite_all_files() {
    // this.deletes = "";

    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.selected === true  && x.favourite === false
    );

    let result = all_root_folder.map(({ id }) => id)

    this.dataRoomService
      .favourite_all_selected_files(this.dataroomId, result)
      .subscribe((res) => {
        this.getAllRootFolders();
        this.msg =
          "Folder/file successfully added to Favourite.";
        this.showInfo();
        this.deletes = "";
        this.isActionBar = false;
      });
  }




  datarooms_indexing;
  getSingleDataroom() {
    this.dataRoomService.getSingleDataroom(this.dataroomId).subscribe((res) => {
      this.datarooms_indexing = res;
      this.dataroom_date = res.created_date.slice(0, 10);
      console.log(this.datarooms_indexing)
    });
  }

  primary_users_disclaimer_status: any;
  getDataroomUser() {
    this.dataRoomService
      .dataroom_mem_list(this.dataroomId, this.user_id)
      .subscribe((res) => {
        this.primary_users_disclaimer_status = res[0].disclaimer_status;

        console.log('----------Primary User Disclaimer ', this.primary_users_disclaimer_status);
      });
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
        // show chart storage_data

        this.show_spinnerr = false;

    });
  }

  getDateWise() {
    var today = new Date();
    // this.to_date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    // this.from_date = new Date(today.getFullYear(), (today.getMonth()-1), today.getDate());
    this.getAllRootFolders();
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

      console.log('----------All Disclaimer ', this.all_disclaimers);
    });
  }

  //Open Copy Or Move Popup
  startLoader: boolean = false;
  copyAction: boolean = false;
  moveAction: boolean = false;
  openDialog(id, action): void {
    console.log(action);
    if (action == "copy") {
      this.copyAction = true;
      this.moveAction = false;
    } else {
      this.moveAction = true;
      this.copyAction = false;
    }

    console.log(this.copyAction, this.moveAction);

    const dialogRef = this.dialog.open(CopyPastePopup_1, {
      width: "500px",
      data: { copy: this.copyAction, move: this.moveAction, id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(3434);
      console.log(result);
      if (action == "copy" && id == "multi") {
        this.selected = result;
        this.CopySelectedFile();
        // this.startLoader=true;
      }

      if (action == "move" && id == "multi") {
        this.selected = result;
        this.MoveSelectedFile();
        console.log(">>>>>>>>>>>>>>>>>multi")
        // this.startLoader=true;
      }

      if (action == "move" && id != "multi") {
        this.selected = result;
        this.moveFile(id);
        console.log("<<<<<<<<<<<<<<<<<notmulti")
        // this.startLoader=true;
      }

      if (action == "MoveSelectedFile" && id != "multi") {
        this.selected = result;
        this.moveFile(id);
        console.log("<<<<<<<<<<<<<<<<<notmulti")
        // this.startLoader=true;
      }

      if (action == "copy" && id != "multi") {
        this.selected = result;
        this.copyFile(id);
        console.log("<<<<<<<<<<<<<<<<<copy")
        // this.startLoader=true;
      }

      this.copyAction = false;
      this.moveAction = false;
    });
  }


  downloadsingle_popup(data) {
    this.download_popup_dataroom_name = localStorage.getItem("get_dataroomname_popup");
    console.log(this.download_popup_dataroom_name, "download popup");

    this.selectedDownload = [];
    this.selectedDownload.push(data);

    console.log(data, "this is single download")


    var finalData = {
      data: this.selectedDownload,
      token: localStorage.getItem("token"),
      selectall: true
    };


    this.startLoader = true;
    console.log('final data 1: ', finalData)
    this.dataRoomService.bulkDownloadCount(this.dataroomId, JSON.stringify(finalData)).subscribe(async res => {
      console.log(res, "bulkdownload");
      this.statusCount = await res;
      this.startLoader = false;
      this.checkbox_value(data, 0)
      console.error("This is response of popup", res)
      this.openDialogDownload();
      // if(res.filecount>500)
      // {
      //   this.openFileLimitPopup();
      // }else{

      // }
    })

  }

  statusCount;
  download_popup() {
    this.download_popup_dataroom_name = localStorage.getItem("get_dataroomname_popup");
    console.log(this.download_popup_dataroom_name);


    this.selectedDownload = [];
    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.selected === true
    );
    if (all_root_folder.length > 0) {
      all_root_folder.forEach((res) => {
        this.selectedDownload.push(res);
      });
 
      console.log('final data 1: ', finalData)
      if(this.all_root_folder_list.length == this.selectedDownload.length){
        this.selectdatarom = true
        console.log(">>>>>>>>>>>all",this.all_root_folder_list.length,">>>>>>>>>>>select",this.selectedDownload.length )
      }else{
        this.selectdatarom = false
      }
  
      var finalData = {
        data: this.selectedDownload,
        token: localStorage.getItem("token"),
        selectAll : this.selectdatarom
      };
      
      this.startLoader = true;
      this.dataRoomService.bulkDownloadCount(this.dataroomId, JSON.stringify(finalData)).subscribe(async res => {
        console.log(res);
        this.startLoader = false;
        this.statusCount = await res;
        console.error("This is response of popup", res)
        // if(res.filecount>500)
        // {
        //   this.openFileLimitPopup();
        // }else{
        this.openDialogDownload();

      })
    }
  }

  downloadshortut_popup(): void {
    // console.log(folder, "folder detail");
    this.openDialogDownloadShortcut();
  }

  openDialogNote(): void {
    const dialogRef = this.dialognote.open(documentNoteConfirmPopup, {
      width: "500px",
      data: { ok: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result != undefined) {
        if (result == true) {
          // this.notify = "Yes";
          console.log(result);
          //  this.startUpload();
        }
      }
      if (!result && result != undefined) {
        console.log(result);
        // this.notify = "No";
        // this.startUpload();
      }
    });
  }
  closeDialogNote(): void {
    this.dialognote.closeAll();
  }
  failbulkDownload(): void {
    const dialogRef = this.bulkfaildownload.open(bulkDownloadFail, {
      width: "500px",
      //  data: { ok: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result != undefined) {
        if (result == true) {
          console.log(result, "result");
          //      this.download_all_files();
        }
      }
      if (!result && result != undefined) {
        console.log(result, "result");
        // this.notify = "No";
        // this.startUpload();
      }
    });
  }


  // File Limit Popup
  openFileLimitPopup() {
    console.error("file limit exceed");
    const dialogRef = this.dialogdownload.open(fileLimitPopup, {
      width: "500px",
      data: { ok: true, filecount: this.statusCount.filecount, size: this.statusCount.size, popup_dataroom_name: this.download_popup_dataroom_name },
      // data_room_name:localStorage.getItem("get_dataroomname_popup")
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result != undefined) {
        if (result == true) {
          console.log(result, "result");
          // this.download_all_files();
        }
      }
      if (!result && result != undefined) {
        console.log(result, "result");
        // this.notify = "No";
        // this.startUpload();
      }
    });
  }

  // Download confirm popup
  openDialogDownload() {
    // console.log("This is data room popup and data room name "+ popup_data_room_name);
    const dialogRef = this.dialogdownload.open(downloadPopup, {
      width: "500px",
      data: { ok: true, filecount: this.statusCount.filecount, size: this.statusCount.size, popup_dataroom_name: this.download_popup_dataroom_name,countryToFullStandardName:this.countryToFullStandardName,countrycode:this.usertimezone['time_zone__abbreviation'] },
      // data_room_name:localStorage.getItem("get_dataroomname_popup")
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result != undefined) {
        if (result == true) {
          console.log(result, "result");
          this.download_all_files();
        }
      }
      if (!result && result != undefined) {
        console.log(result, "result");

      }
    });
  }
  openDialogDownloadShortcut(): void {
    const dialogRef = this.dialogshortcut.open(downloadShortcutPopup, {
      width: "500px",
      data: { ok: true,countryToFullStandardName:this.countryToFullStandardName,countrycode:this.usertimezone['time_zone__abbreviation'] },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result != undefined) {
        if (result == true) {
          console.log(result, "result");
          this.downloadShortcutBulk();
        }
      }
      if (!result && result != undefined) {
        console.log(result, "result");
        // this.notify = "No";
        // this.startUpload();
      }
    });
  }
}

@Component({
  selector: "./copy-paster-popup",
  templateUrl: "./copy-paster-popup.html",
})
export class CopyPastePopup_1 {
  nodes: any[] = [];
  dataroomId: number;
  constructor(
    public dialogRef: MatDialogRef<CopyPastePopup_1>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataRoomService: DataRoomService
  ) {
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
  }

  ngOnInit() {
    this.getAllRootFolderTree();
  }

  getAllRootFolderTree() {
    this.dataRoomService.getFoldersTree(this.dataroomId, 0).subscribe((res) => {
      this.nodes = res;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  options: ITreeOptions = {
    getChildren: this.getChildren.bind(this),
    useCheckbox: false,
  };

  asyncChildren = [
    {
      name: "child1",
      hasChildren: true,
    },
    {
      name: "child2",
    },
  ];
  children: any = [];
  getChildren(node: any) {
    this.getSubFolderElement(node.data.id);
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.children), 2000);
    });
  }

  getSubFolderElement(id) {
    this.dataRoomService
      .getFoldersTree(this.dataroomId, id)
      .subscribe((res) => {
        this.children = res;
        console.log(this.children);
      });
  }

  selected: any;
  checked: boolean = true;
  selectdvalue: any;
  var: any;
  folder1: any;
  select_destination(destination) {
    this.selected = destination;
    this.folder1 = destination;
  }
}

@Component({
  selector: "./upload-confirmation-popup",
  templateUrl: "document-note-confirmation-popup.html",
})
export class documentNoteConfirmPopup {
  isNotifyCheck: boolean = false;
  constructor(
    public dialogRefs: MatDialogRef<documentNoteConfirmPopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRefs.close();
  }
  // notifyEmail()
  // {
  //   this.isNotifyCheck = true;
  //   console.log("Notify Has been checked.....",this.isNotifyCheck);
  // }

}
@Component({
  selector: "download-popup-confirm",
  templateUrl: "../folder-detail/download-popup-confirm.html",
})

export class downloadPopup {
  constructor(
    public dialogRefs: MatDialogRef<downloadPopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    // this.dialogRefs.close();
    this.dialogRefs.close();
  }
  isNotifyCheck: boolean = false;
  notifyEmail() {
    this.isNotifyCheck = !this.isNotifyCheck;
    console.log("Notify Has been checked.....", this.isNotifyCheck);
    this.isNotifyCheck
    String(this.isNotifyCheck);
    localStorage.setItem("notifyemail", String(this.isNotifyCheck))
  }
}
@Component({
  selector: "file-limit-popup",
  templateUrl: "file-limit-popup.html",
})

export class fileLimitPopup {
  constructor(
    public dialogRefs: MatDialogRef<fileLimitPopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRefs.close();
  }

}
@Component({
  selector: "./upload-confirmation-popup",
  templateUrl: "../folder-detail/download-shortcut-popup-confirm.html",
})
export class downloadShortcutPopup {
  constructor(
    public dialogRefs: MatDialogRef<downloadShortcutPopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRefs.close();
  }
}
@Component({
  selector: "./upload-confirmation-popup",
  templateUrl: "bulkdownload_fail.html",
})
export class bulkDownloadFail {
  constructor(
    public dialogRefs: MatDialogRef<bulkDownloadFail>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRefs.close();
  }
}

