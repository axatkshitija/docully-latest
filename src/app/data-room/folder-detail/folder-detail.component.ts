import {
  Component,
  OnInit,
  Inject,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { DataRoomService } from "../../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

import { BaseUrlClass } from "../../common/index";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FileClass } from "../../share-data/file-class";
import { Subscription } from "rxjs";
import { SharedService } from "../../services/index";
import { saveAs } from "file-saver";
import { ITreeOptions } from "@bugsplat/angular-tree-component";
import { ChangeDetectorRef } from "@angular/core";
import { TimezoneService } from "../../services/timezone.service";
import { fileLimitPopup } from "../document/document.component";
export interface DialogData {
  destination: string;
  source: string;
  copy: string;
  move: string;
  ok: string;
  popup_dataroom_name: string;
  filecount: any;
  size: any;
}

@Component({
  selector: "app-folder-detail",
  templateUrl: "./folder-detail.component.html",
  styleUrls: ["./folder-detail.component.css"],
  providers: [],
})
export class FolderDetailComponent implements OnInit {
  is_upload_file: boolean = false;
  public newFolderForm: FormGroup; // our form model
  msg: string = "";
  dataroomId: any;
  folder_id: any;
  filterQuery: string;
  all_folder_list: any;
  deleteForm: FormGroup;
  copyForm: FormGroup;
  moveForm: FormGroup;
  baseUrl: any;
  timezone: any;
  create_folder: boolean = true;
  message: any;
  subs: Subscription;
  token: any = '';
  download_popup_dataroom_name: string;
  msgOnChildCompInit: any;
  gotonextfolder: boolean = false;
  checkedselect: any;
  selectall: boolean = false;
  checkedselect1: any;
  all_root_folder_downlaod: any;
  download_permission: any;
  dataroom_date: any;
  usertimezone: string;
  countryToFullStandardName: string;
  show_data: boolean;
  uploadrestriction: boolean = true;
  constructor(
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    public dialog: MatDialog,
    public dialognote: MatDialog,
    public bulkfaildownload: MatDialog,
    public dialogdownload: MatDialog,
    public dialogshortcut: MatDialog,
    //private fileClass: FileClass,
    public baseUrlclass: BaseUrlClass,
    private sharedService: SharedService,
    private timeZone: TimezoneService,
    private cd: ChangeDetectorRef
  ) {
    this.token = localStorage.getItem("token");
    this.timezone = this.timeZone.userTimeZone;

    if (this.route.snapshot.queryParams["dataroom"]) {
      localStorage.setItem(
        "currentDataroomId",
        this.route.snapshot.queryParams["dataroom"]
      );
    }

    this.subs = this.sharedService.getMessage().subscribe((message) => {
      //
      this.message = message;
      if (this.message.text == "Refresh Folder Details!") {
        this.createFolder = true;
        this.back = false;
        //this.showHideUploadDiv();
        this.getAllSubfolderList();
      }
    });
    this.baseUrl = this.baseUrlclass.baseUrl;
    this.dataroomId = localStorage.getItem("currentDataroomId");
    this.route.params.subscribe((params) => {
      this.folder_id = params.folderId;
      console.log("This is folder ID  : ", this.folder_id)
      localStorage.setItem("sendfolderIdTOUpload", this.folder_id);
      this.initializeUserForm();
      this.initializeDeleteForm();
      this.initializeCopyForm();
      if (this.gotonextfolder == false) {
        this.getSingleFolderDetails();
      }

      // this.getAllSubfolderList();
      this.getFeatures(this.dataroomId)
      this.getAllFolderList();
      this.getUserInfo();
      this.getAllDisclaimers();
      // $(document).on("click", ".dropdown-menu", function(e) {
      //   e.stopPropagation();
      // });
    });
    this.startLoader = false;

  }

  ngOnInit() {
    this.usertimezone = localStorage.getItem("currentUser");
    this.usertimezone = JSON.parse(this.usertimezone);
    this.usertimezone = this.usertimezone['user_time_zone'][0];
    this.countryToFullStandardName = localStorage.getItem('countryToFullStandardName');
    console.log('countryToFullStandardName>>>>', this.countryToFullStandardName);
    this.gotoURl(this.dataroomId);
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


  nodes: any;
  getHierarchy() {
    this.dataRoomService
      .getFoldersHierarchy(parseInt(this.dataroomId))
      .subscribe((res) => {
        for (var i = 0; i < res.length; i++) {
          console.log(1);
        }
        console.log(res);
        this.nodes = res;
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

  openRedactor(id) {
    window.open('/#/file-editor/' + this.dataroomId + "/" + this.single_folder_data.id + '/' + id);
  }

  openVersionHistory(id) {
    this.router.navigate(['/version-history', this.dataroomId, this.single_folder_data.id, id]);
    // window.open('/#/version-history/' + this.dataroomId + "/" + this.single_folder_data.id + '/' + id);
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

  giveSearchValue(value) {
    this.search = value;
    this.getSearchResult();
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

  perm: any;

  receiveAutoMsgHandler(p) {
    this.getDataroomUser();
    this.msgOnChildCompInit = p;
    this.user = p.userdetail;
    this.datarooms_indexing = p.singledataroom;
    if (p.singledataroom == null || p.singledataroom == undefined) {
      this.getSingleDataroom();
    }
    const d_date = p.singledataroom;

    this.user_id = p.userdetail.id;
    this.perm = p.memberpermission;
    this.dataroom_date = d_date.created_date.slice(0, 10);
    console.log("hello>>>>>>>>>>>>>>>>>>>>", this.msgOnChildCompInit)
  }


  // Notify Email Checkbox to send notification on download ready 
  isNotifyCheck: boolean = false;


  // ------------------------------
  showDocuments: boolean = true;
  showSearchDocuments: boolean = false;
  search_result: any;
  search_files: any;
  search_folders: any;
  search: any = "";
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

        const newdata = res.files.filter(
          (res) => res.is_view_only == true
        );

        this.search_files = newdata.map((obj, i) => ({ ...obj, updated_date: obj.updated_date + '+04:00' }));
        const newdatafile = res.folders.filter(
          (res) => res.is_view_only == true
        );
        this.search_folders = newdatafile.map((obj, i) => ({ ...obj, updated_date: obj.updated_date + '+04:00' }));
        this.showDocuments = false;
        this.createFolder = false;
        this.showSearchDocuments = true;
        this.back = true;
      });
  }

  showHideBackSearch() {
    this.back = false;
    this.createFolder = true;
    this.showDocuments = true;
    this.showSearchDocuments = false;
  }
  //primary_users_disclaimer_status: any;
  // getDataroomUser() {
  //   // this.dataRoomService
  //   //   .dataroom_mem_list(this.dataroomId, this.user_id)
  //   //   .subscribe((res) => {
  //   //     this.primary_users_disclaimer_status = res[0];
  //   //   });
  // }

  search_by_name: any = "";
  search_by_uploaded_by: any = "";
  from_date: any = "";
  to_date: any = "";

  ResetFields() {
    this.search_by_name = "";
    this.search_by_uploaded_by = "";
    this.from_date = "";
    this.to_date = "";
    this.search_by_type = "";
    // this.getAllSubfolderList();
  }
  createNewFolder() {
    // this.newFolderForm.disable();
    console.log("new folder name ", this.newFolderForm.value.folder_name);
    this.dataRoomService
      .create_new_folder(this.dataroomId, this.newFolderForm.value.folder_name)
      .subscribe((res) => {
        if (res.msg) {
          this.msg = res.msg;
          this.showInfo();
        } else {
          this.msg = "Folder successfully created!";
          res.icons = this.getIcons(res, res.is_folder);
          this.all_root_folder_list.push(res);
          location.reload()
          this.showSuccess();
        }

        // this.newFolderForm.enable();
        this.newFolderForm.reset();
      });
  }

  user: any;
  user_id: number;
  getUserInfo() {
    // this.dataRoomService
    //   .getUserProfileDatroom(this.dataroomId)
    //   .subscribe((res) => {
    //     this.user = res;
    //     this.user_id = res.id;
    //   });
  }
  // intializeDeleteForm

  initializeDeleteForm() {
    this.deleteForm = new FormGroup({
      delete: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
  }

  // intializeCopyForm
  initializeCopyForm() {
    this.copyForm = new FormGroup({
      copy: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
  }

  showHideUploadDiv() {


    // Purpose : 
    // Navigate the upload section on click of upload button
    localStorage.setItem("previous_upload_navigation_url", this.router.url);
    // let url = this.router.serializeUrl(this.router.createUrlTree(['/upload-files-sections']))
    // console.log('url', url)
    window.open("/#/upload-files-sections/" + this.dataroomId + "/" + this.single_folder_data.id)


    console.log("This is router URL of folder details : ", this.router.url);
    console.warn(localStorage.getItem("previous_upload_navigation_url"))
    console.log("this is sing folder data upload path object : ", this.single_folder_data);
    let filename = this.single_folder_data.name;
    let parentfilename = this.single_folder_data.parent_folders;
    console.log("This is fillename", filename);
    console.log("This is fillename", parentfilename);
    localStorage.setItem("upload_parent_file_name", parentfilename[0].name);
    localStorage.setItem("upload_file_name", parentfilename[0].name);
    console.log("Get Items by looping")
    var getAllParent = [];
    if (parentfilename.length != 0) {
      parentfilename.forEach((item) => {
        // console.log("These are items of parent folder",item.name);
        getAllParent.push(item.name);
        console.log(getAllParent)
      })
    }
    if (getAllParent != null) {
      console.log("getall parameter has items");
      localStorage.setItem("upload_parent_folder_list", JSON.stringify(getAllParent));
    }
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
  folder_name: any;
  // this function will create subfolders and files
  createNewSubFolder(newFolderForm) {
    console.log("folder id is:", this.folder_id);
    // disabled form value
    // this.newFolderForm.disable();
    //console.log("new folder name ", newFolderForm.value.folder_name);
    this.dataRoomService
      .create_new_sub_folder(
        this.dataroomId,
        newFolderForm.value.folder_name,
        this.folder_id
      )
      .subscribe((res) => {
        if (res.msg) {
          this.msg = res.msg;
          this.showInfo();
        } else {
          this.msg = "Folder successfully created!";
          res.icons = this.getIcons(res, res.is_folder);
          this.getAllSubfolderList();
          location.reload();
          this.showSuccess();
        }

        this.newFolderForm.reset();
      });
  }
  //

  showSuccess() {
    this.startLoader = false;
    this.cd.detectChanges();
    this.toastr.success(this.msg);
  }

  showError() {
    this.startLoader = false;
    this.cd.detectChanges();
    this.toastr.error(this.msg);
  }

  showInfo() {
    this.startLoader = false;
    this.cd.detectChanges();
    this.toastr.info(this.msg);
  }
  showNote() {
    this.toastr.info(this.note);
  }

  single_folder_data: any;
  single_perm: any;
  // get single folder details
  getSingleFolderDetails() {
    this.dataRoomService
      .getSubSingleFolderDetails(this.folder_id)
      .subscribe((res) => {
        this.getAllSubfolderList();
        this.single_folder_data = res;
        this.single_perm = res.perm;
        console.log(this.single_perm, "single perm");
        this.single_folder_data.parent_folders.reverse();
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

  folder1: any;
  // result:any;
  copyFile(file_id, parent_folder) {
    console.log("mango:-", this.selected, file_id, parent_folder);
    // console.log(this.selected);
    this.folder1 = this.selected;
    if (this.folder1 === undefined) {
      this.startLoader = false;
      return 0;
    }

    if (this.folder1 !== parent_folder && this.folder1 != undefined) {
      this.startLoader = true;
      this.dataRoomService.copyFile(this.folder1, file_id).subscribe((res) => {
        // this.all_folder_list = res;
        console.log("all_folder_list:-", this.all_folder_list);

        this.msg = "Selected Folders / Files copied successfully.";
        this.showSuccess();
        this.startLoader = false;
        this.goToNextFolder(this.folder1);
      });
    } else {
      // this.msg = "Source & Destination should not be same";
      // this.startLoader = false;
      // this.showError();
    }
  }

  CopySelectedFile() {
    this.folder1 = this.selected;

    var folder_list = this.all_root_folder_list.filter(
      (res) => res.selected === true
    );

    if (this.folder1 === undefined) {
      this.startLoader = false;
      return 0;
    }

    for (var i = 0; i < folder_list.length; ++i) {
      if (folder_list[i]["id"] === this.folder1) {
        this.msg = "Source & Destination should not be same";
        this.showInfo();
        this.startLoader = false;
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
      }, (error) => {
        this.msg = "Something wents wrong!";
        this.showError();
      }
      );
  }

  MoveSelectedFile() {
    this.folder1 = this.selected;
    var folder_list = this.all_root_folder_list.filter(
      (res) => res.selected === true
    );
    if (this.folder1 === undefined) {
      this.startLoader = false;
      return 0;
    }
    for (var i = 0; i < folder_list.length; ++i) {
      if (folder_list[i]["id"] === this.folder1) {
        this.msg = "Source & Destination should not be same";
        this.showInfo();
        this.startLoader = false;
        return 0;
      }
    }
    this.startLoader = true;
    this.dataRoomService
      .moveSelectedFile(this.folder1, folder_list)
      .subscribe((res) => {
        // this.all_folder_list = res;
        console.log(res, "Multi File");
        this.msg = "Selected Folders / Files moved successfully.";
        this.showSuccess();
        // this.getAllSubfolderList();
        this.startLoader = false;
        this.goToNextFolder(this.folder1);
      });
  }

  moveFile(file_id, parent_folder) {
    this.folder1 = this.selected;
    console.log("mango:-", this.folder1, file_id);
    if (this.folder1 !== parent_folder && this.folder1 != undefined) {
      this.startLoader = true;
      this.dataRoomService.moveFile(this.folder1, file_id).subscribe((res) => {
        // this.all_folder_list = res;
        console.log("move FIle", this.all_folder_list);

        this.msg = "Selected Folders / Files moved successfully.";
        this.showSuccess();
        this.startLoader = false;
        this.goToNextFolder(this.folder1);
        // this.getAllSubfolderList();
      });
    } else { }
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
  all_folders: any;
  all_foldersSize: any = undefined;
  getAllFolderList() {
    // getAllFolders
    this.dataRoomService.getAllFolders(this.dataroomId).subscribe((res) => {
      this.all_folders = res.data;
      this.all_foldersSize = res.size;

      this.all_folders = this.all_folders.filter(
        (res) => res.id !== parseInt(this.folder_id)
      );
      this.all_folder = this.all_folders;
      console.log("all_folder_list:-", this.all_folders);

      if (!this.create_folder) {
        this.create_folder = false;
        this.showHideUploadDiv();
      }
    });
  }
  search_by_type: any = "";
  foldername: any;
  getfolderdata: boolean = false;
  getAllSubfolderList() {
    this.getfolderdata = false;
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
      .getAllSubfolderList(
        this.folder_id,
        this.search_by_name,
        this.search_by_type,
        this.search_by_uploaded_by,
        start_date,
        end_date
      )
      .subscribe((res) => {
        this.get_dataroom_usage_details();
        console.log(res);
        this.getfolderdata = true;
        this.dataRoomService.CheckUploadRestriction(this.folder_id, this.dataroomId).subscribe((res) => {
          this.uploadrestriction = res;
        })
        //const newdata = res;
        this.all_root_folder_list = res.filter(
          (res) => res.perm.is_view_only == true
        );
        this.all_root_folder_list = this.all_root_folder_list.map((obj, i) => ({ ...obj, updated_date: obj.updated_date + '+04:00' }));

        console.log(this.all_root_folder_list, "this.all_root_folder_list");
        this.all_root_folder_list.forEach((res) => {
          res.icons = this.getIcons(res, res.is_folder);
        });
        this.all_root_folder_list.forEach((res, index) => {
          if (res.is_folder) {
            console.log(res)
            this.all_root_folder_list[index] = {
              ...res,
              ...res.perm
            }
          }
        })
        console.log(this.all_root_folder_list)
      });
  }

  getIcons(res, is_folder) {
    console.log(res.content_type, "content type");
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
        res.name.endsWith(".ppt")
      ) {
        let url = "assets/images/ICONS_PNG/ppt.png";
        return url;
      } else if (
        res.name.endsWith(".pptx")
      ) {
        let url = "assets/images/ICONS_PNG/pptx.png";
        return url;
      } else if (
        res.content_type == "application/vnd.ms-excel" ||
        res.name.endsWith(".xls")
        ||
        res.name.endsWith(".XLS")
      ) {
        let url = "assets/images/ICONS_PNG/xls.png";
        return url;
      } else if (
        res.content_type ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        res.name.endsWith(".xlsx")
        ||
        res.name.endsWith(".XLSX")
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
  deletes: any = "";
  // delete folder or id
  delete_folder_or_file(folder_id, i) {
    // this.deletes = "";

    this.dataRoomService.deleteFolderOrFile(folder_id).subscribe((res) => {
      this.msg =
        "Folder/file successfully deleted but Unless permanently deleted, items in trash add to your current storage";
      // this.all_root_folder_list = res;//.splice(i, 1);
      this.getAllSubfolderList();
      this.showSuccess();
      this.deletes = "";
    });
  }

  is_edit_folder_name: boolean = false;
  is_edit_index_number: boolean = false;

  // is edit folder name
  isEditFolderName(i) {
    this.edittedName = i;
    this.is_edit_folder_name = true;
  }

  selectedRowGride: number;
  editedIndexGride: number;
  edittedNameGride: number;
  is_edit_folder_name_gride: boolean = false;
  is_edit_index_number_gride: boolean = false;
  isEditFolderNameGride(i) {
    this.edittedNameGride = i;
    this.is_edit_folder_name_gride = true;
  }

  isEditIndexNumber(i) {
    this.editedIndex = i;
    this.is_edit_index_number = true;
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

  editFolderNameGride(folder) {
    this.dataRoomService
      .update_folder_or_file_name(folder)
      .subscribe((res: any) => {
        this.is_edit_folder_name_gride = false;
        this.msg = "Folder / File name is successfully updated!";
        this.showInfo();
        this.edittedNameGride = -1;
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
          this.getAllSubfolderList();

          this.showInfo();
          this.editedIndex = -1;
        },

        (err) => {
          this.msg = err.error.msg;
          this.showError();
          console.log("error is", err);
          this.is_edit_index_number = false;
          this.editedIndex = -1;
        }
      );
  }

  selectedRow: number;
  editedIndex: number;
  edittedName: number;

  setClickedRow(i) {
    this.selectedRow = i;
  }

  // select all functionality

  all_folder_file_list: number[] = [];
  toggle: boolean = false;
  selectedFolderList: any = [];
  isActionBar: boolean = false;
  selected_folder_list_count: number = 0;

  onChangeSelect() {

    var selectedDownload1 = [];
    var selectedDownloadCount = [];

    this.toggle = !this.toggle;
    this.selectall = this.toggle;
    console.log("this.selectall = this.toggle;", this.selectall)
    let counter = -1;
    this.all_root_folder_list.forEach((folder) => {
      folder.selected = this.toggle;
      this.all_folder_file_list.push(counter + 1);
    });
    //Bulk DOwnload
    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.selected === true
    );
    console.log(all_root_folder, "all_root_folder");
    if (all_root_folder.length > 0) {
      if (all_root_folder[0].perm.is_view_and_print_and_download) {
        this.select = true;
      }
      if (all_root_folder[0].perm.is_view_and_print_and_download == false) {
        this.select = false;
      }
      if (all_root_folder[0].perm.is_shortcut) {
        this.selectshortcut = true;
      }
      if (all_root_folder[0].perm.is_shortcut == false) {
        this.selectshortcut = false;
      }
    }




    if (all_root_folder.length > 1) {

      console.log(this.download_permission)

      for (let i = 0; i < all_root_folder.length; i++) {
        if (
          all_root_folder[0].perm.is_view_and_print_and_download == true ||
          all_root_folder[1].perm.is_view_and_print_and_download ||
          all_root_folder[i].perm.is_view_and_print_and_download
        ) {
          this.select = true;
        } else {
          this.select = false;
        }
        if (
          all_root_folder[0].perm.is_shortcut == true ||
          all_root_folder[1].perm.is_shortcut ||
          all_root_folder[i].perm.is_shortcut
        ) {
          this.selectshortcut = true;
        } else {
          this.selectshortcut = false;
        }


        this.download_permission = all_root_folder.some(obj => obj.perm.is_view_and_print_and_download === false);
        if (this.download_permission == true) {
          this.select = false;
        }
        else {
          this.select = true;
        }
      }
    }
    if (all_root_folder.length === 0) {
      this.selectshortcut = false;
      this.select = false;
    }

    if (this.toggle == true) {
      console.log('toggle')
      let all_root_folder = this.all_root_folder_list.filter(
        (res) => res.selected === true
      );
      if (all_root_folder.length >= 1) {
        this.isActionBar = true;
        for (let i = 0; i < all_root_folder.length; i++) {
          if (all_root_folder[i].is_folder == true) {
            selectedDownloadCount.push(all_root_folder[i]);
            this.selectFolder = selectedDownloadCount.length;
            console.log(this.selectFolder.length, "folder true");
          } else {
            selectedDownload1.push(all_root_folder[i]);

            this.selected_folder_list_count = selectedDownload1.length;
            this.selectFolder = selectedDownloadCount.length;

            console.log(this.selectFolder, "folder false");
          }
        }
      } else {
        this.isActionBar = false;
        this.selected_folder_list_count = length;
        this.selectFolder = 0;
      }
      if (all_root_folder.length >= 1) {
        this.isActionBar = true;
      } else {
        this.selected_folder_list_count = 0;
        this.selectFolder = 0;
        this.isActionBar = false;
      }
    } else {
      this.isActionBar = false;
      this.selected_folder_list_count = 0;
      this.selectFolder = 0;

      let all_root_folder = this.all_root_folder_list.filter(
        (res) => (res.selected = false)
      );
    }
  }

  // check box selection
  selectedDownloads = [];
  select: boolean = false;
  selectshortcut: boolean = false;
  selectFolder: any;

  checkbox_value(folder: any, i) {
    var selectedDownload1 = [];
    var selectedDownloadCount = [];


    folder.selected = folder.selected ? false : true;
    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.selected === true
    );

    this.all_root_folder_downlaod = this.all_root_folder_list.filter(
      (x) => x.selected === true && x.perm.is_view_and_print_and_download === false
    );

    console.log(this.all_root_folder_downlaod, "all_root_folder_downlaod");
    this.checkedselect = all_root_folder.length;
    this.checkedselect1 = all_root_folder;
    if (all_root_folder.length == this.all_root_folder_list.length) {
      this.toggle = true;
    } else {
      this.toggle = false;
    }

    if (all_root_folder.length > 0) {
      if (all_root_folder[0].perm.is_view_and_print_and_download) {
        this.select = true;
      }
      if (all_root_folder[0].perm.is_view_and_print_and_download == false) {
        this.select = false;
      }
      if (all_root_folder[0].perm.is_shortcut) {
        this.selectshortcut = true;
      }
      if (all_root_folder[0].perm.is_shortcut == false) {
        this.selectshortcut = false;
      }
    }
    if (all_root_folder.length > 1) {

      console.log(this.download_permission)
      for (let i = 0; i < all_root_folder.length; i++) {
        if (
          all_root_folder[0].perm.is_view_and_print_and_download == true ||
          all_root_folder[1].perm.is_view_and_print_and_download ||
          all_root_folder[i].perm.is_view_and_print_and_download
        ) {
          this.select = true;
        } else {
          this.select = false;
        }
        if (
          all_root_folder[0].perm.is_shortcut == true ||
          all_root_folder[1].perm.is_shortcut ||
          all_root_folder[i].perm.is_shortcut
        ) {
          this.selectshortcut = true;
        } else {
          this.selectshortcut = false;
        }


        this.download_permission = all_root_folder.some(obj => obj.perm.is_view_and_print_and_download === false);
        if (this.download_permission == true) {
          this.select = false;
        }
        else {
          this.select = true;
        }
      }
    }
    if (all_root_folder.length === 0) {
      this.selectshortcut = false;
      this.select = false;
    }
    this.all_root_folder_list.forEach((res) => {
      if (res.selected === true) {
        res.isAction = true;
      } else {
        res.isAction = false;
      }
    });
    let length = all_root_folder.length;
    if (length >= 1) {
      this.isActionBar = true;
      for (let i = 0; i < all_root_folder.length; i++) {
        if (all_root_folder[i].is_folder == true) {
          selectedDownloadCount.push(all_root_folder[i]);
          this.selectFolder = selectedDownloadCount.length;

          console.log(this.selectFolder, "folder true");
        } else {
          selectedDownload1.push(all_root_folder[i]);

          this.selected_folder_list_count = selectedDownload1.length;
          this.selectFolder = selectedDownloadCount.length;

          console.log(this.selectFolder, "folder false");
        }
      }
    } else {
      this.isActionBar = false;
      this.selected_folder_list_count = length;
      this.selectFolder = 0;
    }
  }

  // donwload all files
  selectedDownload = [];
  singleFile = false;
  a: any;
  statusId: any;
  download_all_files() {
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

            },
          );
        });
      }
    } else {
      this.msg = "Only files can be Download... ";
      this.showInfo();
      this.startLoader = false;
    }
  }

  //Download Single Folder
  note: any;
  download_single_folder(data) {
    this.selectedDownload = [];

    console.log(data);
    this.selectedDownload.push(data);

    var finalData = {
      data: this.selectedDownload,
      token: localStorage.getItem("token"),
    };
    var notifyemailvar = localStorage.getItem("notifyemail")
    finalData.data['notifyemail'] = notifyemailvar;
    this.dataRoomService
      .bulkDownload(JSON.stringify(finalData), data.id)
      .subscribe((ress) => {
        if (ress.name) {
          this.startLoader = true;

          var zip_file_path = this.baseUrl + "/" + ress.path; //put inside "" your server path with file.zip
          var zip_file_name = ress.name; //put inside "" file name or something
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = zip_file_path;
          a.download = zip_file_name;
          this.startLoader = false;

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

  // delete all files
  delete_all_files() {
    // this.deletes = "";

    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.selected === true
    );
    this.dataRoomService
      .delete_all_folder_or_files(all_root_folder)
      .subscribe((res) => {

        this.getAllSubfolderList();
        // this.getAllSubfolderList();
        this.msg =
          "Folder/file successfully deleted but Unless permanently deleted, items in trash add to your current storage";
        this.showInfo();
        this.deletes = "";
        this.isActionBar = false;
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
        this.getAllSubfolderList();
        this.msg =
          "Folders & Files have been deleted successfully and are moved to Trash. To restore or permanently delete them from the server, please go to Trash folder. Data remaining in your Trash adds up to your total storage consumption.";
        this.showInfo();
        this.isActionBar = false;
        this.deletes = "";
      });
  }

  // go to folder
  goToNextFolder(folder_id) {
    this.gotonextfolder = true;
    this.router.navigate(["/folder_detail", folder_id]);
    this.folder_id = folder_id;
    this.initializeUserForm();
    this.getSingleFolderDetails();
    //this.getAllSubfolderList();
  }

  all_folder: any;
  hideEditIndex(i) {
    this.is_edit_folder_name = false;
    this.is_edit_index_number = false;
    this.editedIndex = -1;
    this.edittedName = -1;
    this.all_folder = this.all_folders.filter(
      (res) => res.id !== this.all_root_folder_list[i].id
    );
  }

  is_upload_new_version: boolean = false;
  // upload_new_version
  upload_new_version() {
    console.log("upload new version ");
    this.is_upload_new_version = true;
  }

  // goToViewerPage
  goToViewerPage(folder) {
    console.log("folder id is", folder);
    //this.fileClass.file = folder;
    let token = localStorage.getItem("token");
    document.cookie = "token=" + token;
  }
  DownloadPdfFiles(folder) {
    console.log(">>>>>>>>>>>>>>>>>>>folder", folder)
    this.dataRoomService
      .getDownloadFilestest(folder.id, "download", "true")
      .subscribe((res) => {

        if (res.size == 0) {
          this.msg = "File is corrupted";
          this.showInfo();
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
          this.closeDialogNote();
        }
      });
  }
  // this.openDialogNote();
  DownloadFiles(folder) {


    this.dataRoomService
      .getDownloadFiles(folder.id, "download")
      .subscribe((res: any) => {
        console.log(folder, "resresresresres");
        //console.log(res['name'], "name", res, "rem response here");

        // console.log(res.headers.get('content-disposition'));
        if (res.size && res.size == 0) {
          this.msg = "You dont have access to download this file ";
          this.showInfo();
        } else if (res['as_pdf'] == true) {
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
          console.log(link, "link");
          document.body.appendChild(link);
          link.click();
          link.remove();
          //this.closeDialogNote();
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
        console.log(res.id, res.name, "shortcut");
        this.selectedDownload.push(res);
      });
      var finalData = {
        data: this.selectedDownload,
        token: localStorage.getItem("token"),
      };

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

  printFiles(folder) {
    this.dataRoomService
      .getDownloadFiles(folder.id, "print")
      .subscribe((res) => {
        if (res.size == 0) {
          this.msg = "You dont have access to download this file "; //+res.name
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

  ngOnDestroy() { }

  is_disabled_delete_button: boolean = false;

  onKeyCheckDelete(event) {
    console.log("data is ", event);
    if (event.toLowerCase() == "delete") {
      this.is_disabled_delete_button = true;
    }
  }


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



  downloadsingle_popup(data) {
    this.download_popup_dataroom_name = localStorage.getItem("get_dataroomname_popup");
    console.log(this.download_popup_dataroom_name, "download popup");

    this.selectedDownload = [];
    this.selectedDownload.push(data);

    console.log(data, "this is single download")
    var finalData = {
      data: this.selectedDownload,
      token: localStorage.getItem("token"),
    };
    this.startLoader = true;
    console.log('final data 1: ', finalData)
    this.dataRoomService.bulkDownloadCount(this.dataroomId, JSON.stringify(finalData)).subscribe(async res => {
      console.log(res, "bulkdownload");
      this.startLoader = false;
      this.statusCount = await res;
      this.checkbox_value(data, 0)
      console.error("This is response of popup", res)
      // if (res.filecount > 500) {
      //   this.openFileLimitPopup();
      // } else {
      this.openDialogDownload();
      //}
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
      var finalData = {
        data: this.selectedDownload,
        token: localStorage.getItem("token"),
      };
      var notifyemailvar = localStorage.getItem("notifyemail")
      finalData['notifyemail'] = notifyemailvar;
      console.log('final data 1: ', finalData)
      this.startLoader = true;
      this.dataRoomService.bulkDownloadCount(this.dataroomId, JSON.stringify(finalData)).subscribe(async res => {
        console.log(res);
        this.startLoader = false;
        this.statusCount = await res;
        // if(res.filecount>500)
        // {
        //   this.openFileLimitPopup();
        // }else{
        // }
        this.openDialogDownload();
      })
    }
  }
  downloadshortut_popup() {
    // console.log(folder, "folder detail");
    this.openDialogDownloadShortcut();
  }
  folder: any;
  displayCounter(count) {
    this.is_upload_file = count;
  }

  datarooms_indexing;
  getSingleDataroom() {
    this.dataRoomService.getSingleDataroom(this.dataroomId).subscribe((res) => {
      this.datarooms_indexing = res;
      this.dataroom_date = res.created_date.slice(0, 10);
      console.log(this.datarooms_indexing)
    });
  }

  favourite_all_files() {

    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.selected === true && x.favourite === false
    );

    let result = all_root_folder.map(({ id }) => id)

    this.dataRoomService
      .favourite_all_selected_files(this.dataroomId, result)
      .subscribe((res) => {

        this.getAllSubfolderList();
        // this.getAllSubfolderList();
        this.msg =
          "Folders/files successfully added Favourite.";
        this.showInfo();
        this.deletes = "";
        this.isActionBar = false;
      });
  }


  favoutiefolder: any = []


  favourite_single_files(id, favourite) {
    this.favoutiefolder.push(id);
    if (favourite) {
      this.dataRoomService
        .delete_favourite_all_selected_files(this.dataroomId, this.favoutiefolder)
        .subscribe((res) => {
          this.favoutiefolder = [];
          this.getAllSubfolderList();
          this.msg =
            "Folder/file successfully removed Favourites.";
          this.showInfo();
          this.isActionBar = false;
        });
    } else {
      this.dataRoomService
        .favourite_all_selected_files(this.dataroomId, this.favoutiefolder)
        .subscribe((res) => {
          this.favoutiefolder = [];
          this.getAllSubfolderList();
          this.msg =
            "Folder/file successfully added Favourites.";
          this.showInfo();
          this.isActionBar = false;
        });
    }

  }

  show: boolean = false;
  showFilter() {
    this.show = !this.show;
    if (this.show == true) {
      document.getElementById("filterPopup").style.display = "block";
    } else {
      document.getElementById("filterPopup").style.display = "none";
    }
  }

  changeDateWise() {
    document.getElementById("filterPopup").style.display = "block";
  }

  send_update(folder) {
    //
    this.router.navigate(["/new-update", { fid: folder.id }]);
  }

  //Open Copy Or Move Popup
  startLoader: boolean = false;
  copyAction: boolean = false;
  moveAction: boolean = false;
  openDialog(id, action, parent_id): void {
    console.log(action);
    if (action == "copy") {
      this.copyAction = true;
      this.moveAction = false;
    } else {
      this.moveAction = true;
      this.copyAction = false;
    }
    const dialogRef = this.dialog.open(CopyCutPopup, {
      width: "500px",
      data: { copy: this.copyAction, move: this.moveAction, id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(3434);
      console.log(result, id);
      if (action == "copy" && id == "multi") {
        this.selected = result;
        this.CopySelectedFile();
        // this.startLoader=true;
      }

      if (action == "move" && id == "multi") {
        this.selected = result;
        this.MoveSelectedFile();
        // this.startLoader=true;
      }

      if (action == "move" && id != "multi") {
        this.selected = result;
        console.log("move documents");
        this.moveFile(id, parent_id);
        // this.startLoader=true;
      }

      if (action == "copy" && id != "multi") {
        this.selected = result;
        this.copyFile(id, parent_id);
        // this.startLoader=true;
      }

      this.copyAction = false;
      this.moveAction = false;
    });
  }

  openDialogNote(folder): void {
    const dialogRef = this.dialognote.open(downloadConfirmationPopups, {
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
        this.DownloadFiles(folder);
        // this.notify = "No";
        // this.startUpload();
      }
    });
  }
  closeDialogNote(): void {
    this.dialognote.closeAll();
  }

  //Checkbox of Notify Email function


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

  openDialogDownload(): void {
    console.log("This is status Count : ", this.statusCount)
    const dialogRef = this.dialogdownload.open(downloadPopups, {
      width: "500px",
      data: { ok: true, filecount: this.statusCount.filecount, size: this.statusCount.size, popup_dataroom_name: this.download_popup_dataroom_name, countryToFullStandardName: this.countryToFullStandardName, countrycode: this.usertimezone['time_zone__abbreviation'] },
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
  failbulkDownload(): void {
    const dialogRef = this.bulkfaildownload.open(bulkDownloadFails, {
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

  openDialogDownloadShortcut(): void {
    const dialogRef = this.dialogshortcut.open(downloadPopups, {
      width: "500px",
      data: { ok: true },
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
  selector: "../document/copy-paster-popup",
  templateUrl: "../document/copy-paster-popup.html",
})
export class CopyCutPopup {
  nodes: any[] = [];
  dataroomId: number;
  constructor(
    public dialogRef: MatDialogRef<CopyCutPopup>,
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
  selector: "../document/copy-paster-popup",
  templateUrl: "../document/document-note-confirmation-popup.html",
})
export class downloadConfirmationPopups {
  constructor(
    public dialogRefs: MatDialogRef<downloadConfirmationPopups>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
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
  selector: "../document/copy-paster-popup",
  templateUrl: "download-popup-confirm.html",
})
export class downloadPopups {
  constructor(
    public dialogRefs: MatDialogRef<downloadPopups>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
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
  selector: "../document/copy-paster-popup",
  templateUrl: "../document/bulkdownload_fail.html",
})
export class bulkDownloadFails {
  constructor(
    public dialogRefs: MatDialogRef<bulkDownloadFails>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRefs.close();
  }
}
