import {
  Component,
  Injectable,
  OnInit,
  ViewEncapsulation,
  Inject,
} from "@angular/core";

import { BaseUrlClass, ApiListClass } from "../../common/index";
import { DataRoomService } from "../../services/index";
import { ToastrService } from "ngx-toastr";
import { TimezoneService } from "../../services/timezone.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormGroup } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { ITreeOptions } from "@bugsplat/angular-tree-component";
import { DatePipe } from "@angular/common";



export interface DialogData {
  destination: string;
  source: string;
  copy: string;
  move: string;
}

@Component({
  selector: "app-trash",
  templateUrl: "./trash.component.html",
  styleUrls: ["./trash.component.css"],
})
export class TrashComponent implements OnInit {
  is_upload_file: any;
  show__aspinner: boolean = true;
  baseUrl: any;
  timezone: any;
  all_root_folder_list: any = [];
  show_spinner: boolean = true;
  dataroomId: number;
  msg: string;
  p: number = 1;
  size: number = 0;
  restoremsg: any;
  versoinlist: any;
  deletemsg: any;
  deleteForm: FormGroup;
  selected: any;
  folder1: any;
  filesdata: any[];
  dataroom_date: any;
  usertimezone: string;

  constructor(
    private baseUrlClass: BaseUrlClass,
    private apiListClass: ApiListClass,
    private router: Router,
    public dialogdownload: MatDialog,
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private timeZone: TimezoneService,
    private datePipe: DatePipe
  ) {
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
    this.baseUrl = this.baseUrlClass.baseUrl;
    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    this.getDateWise();
    this.getFeatures(this.dataroomId);
    this.getUserInfo();
    this.show_spinner = true;
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];

  }


  initializeDeleteForm() {

  }
  nodata: boolean = false;


  getIcons(res, is_folder) {

    let name = res.folder__name ? res.folder__name : res.name

    if (is_folder == true) {

      let url = "assets/images/ICONS_PNG/folder.png";
      return url;
    } else {
      if (
        name.endsWith(".avi") ||
        name.endsWith(".mov") ||
        name.endsWith(".3gp") ||
        name.endsWith(".mpeg") ||
        res.content_type == "video/msvideo" ||
        res.content_type == "video/avi" ||
        res.content_type == "video/x-msvideo"
      ) {
        let url = "assets/images/ICONS_PNG/avi.png";
        return url;
      } else if (res.content_type == "text/css" || name.endsWith(".css")) {
        let url = "assets/images/ICONS_PNG/css.png";
        return url;
      } else if (res.content_type == "text/csv" || name.endsWith(".csv")) {
        let url = "assets/images/ICONS_PNG/csv.png";
        return url;
      } else if (
        res.content_type == "application/msword" ||
        name.endsWith(".doc")
      ) {
        let url = "assets/images/ICONS_PNG/doc.png";
        return url;
      } else if (
        name.endsWith(".docx") ||
        res.content_type ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        let url = "assets/images/ICONS_PNG/docx.png";
        return url;
      } else if (
        res.content_type == "application/vnd.ms-excel" ||
        name.endsWith(".xls")
      ) {
        let url = "assets/images/ICONS_PNG/xls.png";
        return url;
      } else if (
        res.content_type ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        name.endsWith(".xlsx")
      ) {
        let url = "assets/images/ICONS_PNG/xlsx.png";
        return url;
      } else if (
        res.content_type == "application/pdf" ||
        name.endsWith(".pdf") ||
        name.endsWith(".PDF")
      ) {
        let url = "assets/images/ICONS_PNG/pdf.png";
        return url;
      } else if (
        res.content_type == "audio/mp3" ||
        name.endsWith(".mp3") ||
        name.endsWith(".wav") ||
        name.endsWith(".m4a") ||
        name.endsWith(".wma")
      ) {
        let url = "assets/images/ICONS_PNG/mp3.png";
        return url;
      } else if (res.content_type == "video/mp4" || name.endsWith(".mp4")) {
        let url = "assets/images/ICONS_PNG/mp4.png";
        return url;
      } else if (
        res.content_type == "image/jpeg" ||
        res.content_type == "image/jpg" ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg")
      ) {
        let url = "assets/images/ICONS_PNG/jpg.png";
        return url;
      } else if (res.content_type == "image/png" || name.endsWith(".png")) {
        let url = "assets/images/ICONS_PNG/png.png";
        return url;
      } else if (
        res.content_type == "text/plain" ||
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

  showHideUploadDiv() { }

  permanant_delete_folder(folder, i) {
    if (folder.version) {
      this.dataRoomService.permanant_delete_folder_redact(folder.id).subscribe((res) => {
        console.log("permanant delete folder", res);
        this.msg = res.msg;
        this.showInfo();
        this.getAllTrashedFoldersAndFiles(this.p)
        if (this.all_root_folder_list.length == 0) {
          this.getAllTrashedFoldersAndFiles(this.p - 1)
        }

      });

    } else {
      if (folder.folder__name) {
        this.dataRoomService.permanant_delete_foldernew(folder.id).subscribe((res) => {
          console.log("permanant delete folder", res);
          this.msg = res.msg;
          this.showInfo();
          this.getAllTrashedFoldersAndFiles(this.p)
          if (this.all_root_folder_list.length == 0) {
            this.getAllTrashedFoldersAndFiles(this.p - 1)
          }

        });
      } else {
        this.dataRoomService.permanant_delete_folder(folder.id).subscribe((res) => {
          console.log("permanant delete folder", res);
          this.msg = res.msg;
          this.showInfo();
          this.getAllTrashedFoldersAndFiles(this.p)
          if (this.all_root_folder_list.length == 0) {
            this.getAllTrashedFoldersAndFiles(this.p - 1)
          }

        });
      }
    }



  }

  permanant_delete_folderNew(folder, i) {

  }

  children: any = [];
  getChildren(node: any) {
    this.getSubFolderElement(node.data.id);
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.children), 4000);
    });
  }
  getSubFolderElement(id) {
    this.dataRoomService
      .getFoldersTree(this.dataroomId, id)
      .subscribe((res) => {
        console.log(id);
        this.children = res;
        console.log(this.children);
      });
  }


  too_date: any
  storage_data: any = [];
  curr: Date;
  for_date: any;
  show_progress: boolean = true;
  get_dataroom_usage_details() {
    this.too_date = new Date();
    var year = this.too_date.getFullYear();
    var mes = this.too_date.getMonth() + 1;
    var dia = this.too_date.getDate();
    this.curr = new Date();
    var todays = year + "-" + mes + "-" + dia;


    console.log("date>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.", this.dataroom_date, todays)
    this.dataRoomService
      .get_dataroom_usage_details_for_graph(
        this.dataroomId,
        this.dataroom_date,
        todays
      )
      .subscribe((res) => {
        this.storage_data = res;
        this.show_progress = false;
        console.log(this.from_date, "in main from_date");
        console.log(this.to_date, "in main to_date");
        console.log("this.data doument-right-side ", this.storage_data);
        // show chart data

        this.show_spinner = false;


      });
  }


  nodes: any;
  data_show: boolean = false;
  showTrashFoldersTree(folder) {
    if (!folder.normal_deleted) {
      this.dataRoomService.trashShowDeletedFiles(folder.id).subscribe((res) => {
        this.nodes = res.data;
        console.log(this.nodes, "showTrashFoldersTree");
        if (this.nodes.length > 0) {
          this.data_show = true;
        }
        if (this.nodes.length == 0 || this.nodes == "") {
          this.data_show = true;
          this.nodes =[]
          // this.nodes[0] = { ok: 1 };
        }
        console.log(this.nodes, "showTrashFoldersTree");
      });
    } else {
      this.dataRoomService.trashShowDeletedFilesold(folder.id).subscribe((res) => {
        this.nodes = res.data;
        if (this.nodes.length > 0) {
          this.data_show = true;
        }
        if (this.nodes.length == 0) {
          //this.nodes[0] = { ok: 1 };
          this.data_show = true;
          this.nodes =[]
        }
        console.log(this.nodes, "showTrashFoldersTree");
      });
    }

  }

  delete_confirm_box(folder, i) {
    console.log("delete confirm box");
    if (confirm("Are you sure to permemnantly delete folder/file ?")) {
      console.log("Implement delete functionality here");
      this.permanant_delete_folder(folder, i);
    } else {
      console.log("no need to delete permanantly");
    }
  }



  restore_folders_file(folder, i) {
    console.log(folder.id, i, "folder restored");

    var files = [];
    files.push(folder);

    if (folder.version) {
      this.dataRoomService.restore_folder_redact(folder.id).subscribe((res) => {
        console.log("permanant delete folder", res);
        this.msg = res.msg;
        this.showInfo();
        this.getAllTrashedFoldersAndFiles(this.p)
        if (this.all_root_folder_list.length == 0) {
          this.getAllTrashedFoldersAndFiles(this.p - 1)
        }

      });
    } else {
      this.dataRoomService
        .restore_folders_check(folder.id, files)
        .subscribe((res) => {
          //console.log(res.error.status)
          if (res.status == 201) {
            const newData: { upload_to?: string } = { upload_to: null };
            let newArray = files.map(obj => {
              // Modify the properties of each object as needed
              return {
                ...obj, ...newData
              };
            })
            this.restore_folders_check(folder.id, newArray, folder.folder__parent_folder ? folder.folder__parent_folder : folder.parent_folder)
          }

        }, (error) => {
          console.log(error)
          if (error.status == 400) {

            this.folderTree(files, folder.id)

          }
        })
    }

  }


  restore_folders_check(folderid, files, route) {
    this.dataRoomService
      .restore_folders_files(folderid, files)
      .subscribe((res) => {
        this.msg = "Folder / File restored successfully ";
        this.showInfo();

        // this.all_root_folder_list.splice(i, 1);
        if (this.all_root_folder_list.length == 0) {
          if (this.p == 1) {
            this.getAllTrashedFoldersAndFiles(this.p)
          }
          else {
            this.getAllTrashedFoldersAndFiles(this.p - 1)
          }
        } else {
          this.getAllTrashedFoldersAndFiles(this.p)
        }
        if (!route) {
          this.router.navigate(["/documents"]);
        } else {
          this.router.navigate(["/folder_detail", route]);
        }

      }, (error) => {
        console.log(error)
      });
  }

  file_folder: any = "";

  selectedRow: number;
  editedIndex: number;
  edittedName: number;

  setClickedRow(i) {
    this.selectedRow = i;
  }


  select_destination(destination) {
    this.selected = destination;
    this.folder1 = destination;
  }

  restore_selected_folders_file() {
    //this.openDialogRestore();
    var files = this.all_root_folder_list.filter((res) => res.selected == true);
    console.log(files);

    for (let i = 0; i < files.length; i++) {
      this.file_folder = files[i].id;
    }
    // files.forEach((res)=>{
    this.dataRoomService
      .restore_folders_check(this.dataroomId, files)
      .subscribe((res) => {

        if (res.status == 201) {
          const newData: { upload_to?: string } = { upload_to: null };
          let newArray = files.map(obj => {
            // Modify the properties of each object as needed
            return {
              ...obj, ...newData
            };
          })

          this.dataRoomService
            .restore_folders_files(this.dataroomId, newArray)
            .subscribe((ress) => {
              this.msg = "Folder / File restored successfully ";
              this.showInfo();

              if (this.all_root_folder_list.length == 0) {
                if (this.p == 1) {
                  this.getAllTrashedFoldersAndFiles(this.p)
                }
                else {
                  this.getAllTrashedFoldersAndFiles(this.p - 1)
                }
              } else {
                this.getAllTrashedFoldersAndFiles(this.p)
              }

            });

        }

      }, (error) => {
        if (error.status == 400) {
          this.openDialogRestore();
        }
      }

      )


    // })
  }

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


  bulk_permanant_delete_folder() {
    var files = this.all_root_folder_list.filter((res) => res.selected == true);
    console.log(files);

    for (let i = 0; i < files.length; i++) {
      this.file_folder = files[i].id;
    }

    let newArray = files.map(obj => {
      const newData: { old_file?: boolean, redact?: boolean } = { old_file: obj.folder__name ? false : true, redact: obj.version ? true : false };
      return {
        ...obj, ...newData
      };
    })


    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>", newArray)
    this.dataRoomService
      .bulk_permanant_delete_folder(this.dataroomId, newArray)
      .subscribe((ress) => {
        this.msg = "Folders / Files deleted successfully ";
        this.showInfo();

        if (this.all_root_folder_list.length == 0) {
          if (this.p == 1) {
            this.getAllTrashedFoldersAndFiles(this.p)
          }
          else {
            this.getAllTrashedFoldersAndFiles(this.p - 1)
          }
        } else {
          this.getAllTrashedFoldersAndFiles(this.p)
        }
        this.deletes = ""
      });
  }

  reloadpage() {

    if (this.p != 1 && this.all_root_folder_list.length == 0) {
      this.getAllTrashedFoldersAndFiles(this.p - 1)
    }
  }
  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  getAllTrashedFoldersAndFiles(pageNumber) {
    this.show__aspinner = true;
    this.all_root_folder_list = null;
    var todays =
      new Date(this.to_date).getFullYear() +
      "-" +
      (new Date(this.to_date).getMonth() + 1) +
      "-" +
      new Date(this.to_date).getDate();
    var first =
      new Date(this.from_date).getFullYear() +
      "-" +
      (new Date(this.from_date).getMonth() + 1) +
      "-" +
      new Date(this.from_date).getDate();

    this.p = pageNumber;
    console.log("dataroom id is", this.dataroomId);
    this.show_spinner = true;
    this.dataRoomService
      .get_all_trashed_folder_and_files(
        this.dataroomId,
        this.deleted_by,
        pageNumber,
        todays,
        first
      )
      .subscribe((res) => {
        this.show__aspinner = false;
        this.show_spinner = false;
        this.get_dataroom_usage_details();
        this.all_root_folder_list = res.data1.concat(res.data);
        console.log(this.all_root_folder_list, "trash");
        this.size = res.size;
        var length = this.all_root_folder_list.length;
        this.show_spinner = false;

        const newdata = this.all_root_folder_list;

        this.all_root_folder_list = newdata.map((obj, i) => ({ ...obj, deleted_by_date: obj.deleted_by_date + '+04:00' }));

        if (length > 1) {
          for (let i = 0; i < this.all_root_folder_list.length; i++) {
            if (
              this.all_root_folder_list[0].is_deleted_permanent &&
              this.all_root_folder_list[length - 1].is_deleted_permanent &&
              this.all_root_folder_list[i].is_deleted_permanent

            ) {
              this.nodata = true;
            } else {
              this.nodata = false;
            }
          }
        }
        this.all_root_folder_list.forEach((res) => {
          res.selected = false;
          res.icons = this.getIcons(res, res.is_folder);
        });
      });
  }








  showInfo() {
    this.toastr.info(this.msg);
  }

  from_date: any;
  to_date: any;
  deleted_by: any = "";
  changeDateWise(from_date, to_date) {
    this.to_date = to_date;
    this.from_date = from_date;
    this.getAllTrashedFoldersAndFiles(this.p = 1);
  }


  fromdate: any;
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
    this.dataRoomService.getSingleDataroom(this.dataroomId).subscribe((res) => {
      this.fromdate = res.created_date;
      this.dataroom_date = res.created_date.slice(0, 10);
      console.log(res.created_date, "from date");
      this.from_date = new Date(this.fromdate);
      this.to_date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      this.getAllTrashedFoldersAndFiles(this.p);
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


  SelectBy() {
    this.deleted_by;

    this.getAllTrashedFoldersAndFiles(this.p);
  }

  selectedTrash() {
    var folder = this.all_root_folder_list.filter(
      (res) => res.selected === true
    );
    if (folder.length > 0) {
      this.showRestore = true;
    } else {
      this.showRestore = false;
    }
  }

  folderTree(file, folder_id) {
    this.dataRoomService.getFoldersTree(this.dataroomId, 0).subscribe((res) => {
      this.openDialogSelectFolder(res, file, folder_id);
    });
  }


  openDialogSelectFolder(nodes, files, folder_id): any {
    const dialogRef = this.dialogdownload.open(trashPopup, {
      width: "500px",
      data: nodes
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)


      if (result && result != undefined) {

        const newData: { upload_to?: string } = { upload_to: result };
        let newArray = files.map(obj => {
          return {
            ...obj, ...newData
          };
        })

        this.restore_folders_check(folder_id, newArray, result)
      }

    });
  }

  openDialogRestore(): any {
    const dialogRef = this.dialogdownload.open(RestorePopup, {
      width: "500px"
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)

    });
  }

  selectAll: boolean = false;
  showRestore: boolean = false;
  selectAllTrash(event) {
    if (event.checked == true) {
      this.showRestore = true;
      this.all_root_folder_list.forEach((res) => {
        res.selected = true;
      });
    } else {
      this.showRestore = false;
      this.all_root_folder_list.forEach((res) => {
        res.selected = false;
      });
    }
  }
}
@Component({
  templateUrl: "trashpopup.html",
})
export class trashPopup {
  dataroomId: number;
  constructor(
    public dialogRefs: MatDialogRef<trashPopup>,
    private dataRoomService: DataRoomService,

    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
  }

  nodes: any;
  getAllRootFolderTree() {
    this.dataRoomService.getFoldersTree(this.dataroomId, 0).subscribe((res) => {
      this.nodes = res;
    });
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
      })
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

  onNoClick(): void {
    this.dialogRefs.close();
  }

}



@Component({
  selector: "./document/copy-paster-popup",
  templateUrl: "./restorepopup.html",
})
export class RestorePopup {
  dataroomId: number;
  constructor(
    public dialogRefs: MatDialogRef<RestorePopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
  }


  onNoClick(): void {
    this.dialogRefs.close();
  }
}