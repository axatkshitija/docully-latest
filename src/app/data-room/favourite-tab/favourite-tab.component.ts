import { Component, Inject, OnInit } from "@angular/core";
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
import { Router } from "@angular/router";
import { saveAs } from "file-saver";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

export interface DialogData {
  filecount: any;
  size: any;
  ok: string;
  popup_dataroom_name: string;
}

@Component({
  selector: 'app-favourite-tab',
  templateUrl: './favourite-tab.component.html',
  styleUrls: ['./favourite-tab.component.css']
})
export class FavouriteTabComponent {
  all_root_folder_list: any;
  dataroomId: number;
  baseUrl: any;
  timezone: any;
  p: number = 1;
  statusId: any;
  show_spinner: boolean = true;
  token: any = '';
  download_popup_dataroom_name: string;
  constructor(
    private baseUrlClass: BaseUrlClass,
    public dialogdownload: MatDialog,
    private router: Router,
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private timeZone: TimezoneService,
  ) {
    
    this.token = localStorage.getItem("token");
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
    this.baseUrl = this.baseUrlClass.baseUrl;
    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    this.getAllFavourites(this.p);
    this.initializeDeleteForm();
    this.getUserInfo();
    this.getAllDataRooms();
  }

  datarooms_indexing: any = { hide_file_indexing: "" };
  getAllDataRooms() {
    this.dataRoomService.getAllDatarooms().subscribe((res) => {
      this.datarooms_indexing = res;
      this.datarooms_indexing = this.datarooms_indexing.filter(
        (res) => res.id == this.dataroomId
      );
      this.datarooms_indexing = this.datarooms_indexing[0];
      // console.log(this.datarooms_indexing, "not viewed documents");
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
    this.getAllFavourites(this.p);
  }
  getAllFavourites(pagenumber) {
    this.show_spinner = true;
    this.all_root_folder_list = null;

    if (this.resetType == true) {
      this.p = 1
      this.resetType = false;
    } else {
      this.p = pagenumber;
    }
    console.log("dataroom id is", this.dataroomId);
    this.dataRoomService
      .getAllFavourites(this.dataroomId, this.p)
      .subscribe((res) => {
        this.show_spinner = false;
        this.startLoader = true;
        this.all_root_folder_list = res.data;
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

  remove_favourite_all_files() {
    // this.deletes = "";

    console.log(this.all_root_folder_list)
    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.checked === true
    );


    let result = all_root_folder.map(({ folder_id }) => folder_id)

    this.dataRoomService
      .delete_favourite_all_selected_files(this.dataroomId, result)
      .subscribe((res) => {
        this.getAllFavourites(this.p)
        this.BulkDelete = false;
        this.msg =
          "Folders/files successfully removed from favourite.";
        this.showSuccess();

      });
  }

  remove_favourite_single_files(id) {
    this.favoutiefolder.push(id)
    this.dataRoomService
      .delete_favourite_all_selected_files(this.dataroomId, this.favoutiefolder)
      .subscribe((res) => {
        this.favoutiefolder = [];
        this.msg =
          "Folder/file successfully removed from Favourites.";
        this.showSuccess();
        this.getAllFavourites(this.p)

      });
  }


  goToNextFolder(folder_id) {
    this.router.navigate(["/folder_detail", folder_id]);
    //this.getAllSubfolderList();
  }

  getIcons(res, is_folder) {
    console.log(res.name);
    const filename = res.folder__name;
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

  DownloadFiles(folder) {

    this.dataRoomService
      .getDownloadFiles(folder.folder_id, "download")
      .subscribe((res) => {
        console.log(folder, "resresresresres");
        console.log(res.type, "type", res, "rem response here");
        var typedata = res.type;
        // console.log(res.headers.get('content-disposition'));
        if (res.size == 0) {
          this.msg = "You dont have access to download this file ";
          this.showInfo();
        } else if (res.size > 0 && typedata == "application/pdf") {
          this.msg = "File successfully Downloaded";
          this.showInfo();

          const url = window.URL.createObjectURL(res); // <-- work with blob directly
          // create hidden dom element (so it works in all browsers)
          const a = document.createElement("a");
          a.setAttribute("style", "display:none;");
          document.body.appendChild(a);

          // create file, attach to hidden element and open hidden element
          var filenamee = folder.folder__name;

          const dotIndex = filenamee.lastIndexOf('.');
          if (dotIndex !== -1) {
            var filedownload = filenamee.substring(0, dotIndex) + '.' + ".pdf";
          } else {
            var filedownload = filenamee + '.' + ".pdf";
          }
          a.href = url;
          a.download = filedownload;
          // a.download = folder.folder__name;
          a.click();
          // this.closeDialogNote();
          return url;
        } else {
          this.msg = "File successfully Downloaded";
          this.showInfo();

          const url = window.URL.createObjectURL(res); // <-- work with blob directly
          // create hidden dom element (so it works in all browsers)
          const a = document.createElement("a");
          a.setAttribute("style", "display:none;");
          document.body.appendChild(a);

          // create file, attach to hidden element and open hidden element
          const filenamee = folder.folder__name;
          const fileExt = filenamee.split(".").pop();
          console.log(filenamee, "filenamee");
          console.log(fileExt, "fileExt");
          a.href = url;
          // a.download = fileExt + ".pdf";
          a.download = folder.folder__name;
          a.click();
          // this.closeDialogNote();

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

  to_date: any;
  from_date: any;
  changeDateWise(from_date, to_date) {
    this.to_date = to_date;
    this.from_date = from_date;
    this.getAllFavourites(this.p);
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
    this.getAllFavourites(this.p);
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
          this.getAllFavourites(this.p);
        });
    });
    this.msg =
      "Folder/file successfully deleted but Unless permanently deleted, items in trash add to your current storage !! Please wait for the Content to update!!";
    this.showSuccess();
  }



  downloadShortcut(id) {
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

  selectedDownload: any
  singleFile: boolean;

  downloadShortcutBulk() {
    this.selectedDownload = [];
    this.singleFile = false;

    const data = this.all_root_folder_list.filter(
      (res) => res.checked === true
    );

    if(data.length == 1 && data[0]['folder__is_folder'] == false){
      this.downloadShortcut(data[0]['folder_id'])
    }else{
      console.log(data, "Docully Drm");
      if (data.length > 0) {
        console.log(data, "Docully Drm1111");
        var finalData = {};
        finalData['data'] = data.map(obj => {
          const newData: { is_folder?: boolean, id?: any, index?: number, dataroom?: number, name?: string, parent_folder?: number, file_size_mb?: number, perm?: any } = {
            is_folder: obj.folder__is_folder,
            id: obj.folder_id,
            index: obj.index,
            dataroom: this.dataroomId,
            name: obj.folder__name,
            parent_folder: obj.folder__parent_folder,
            file_size_mb: obj.folder__file_size_mb,
            perm: obj.perm
          };
          return {
            ...newData
          };
        })
        finalData['token'] = localStorage.getItem("token")
  
        if (this.selectedDownload.length == 1) {
          if (!this.selectedDownload[0]["is_folder"]) {
            console.log(this.selectedDownload[0].id, "file_drm");
            this.downloadShortcut(
              this.selectedDownload[0].id,
            );
            this.singleFile = true;
          }
        }
  
  
  
  
        if (!this.singleFile) {
          console.log(finalData)
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
    
  }


  statusCount;
  folderdownload(data) {
    let url = '/#/download-status-documents'
    console.log('url', url)
    window.open(url, '_blank')
    var finalData = {};
    var notifyemailvar = localStorage.getItem("notifyemail")
    finalData['data'] = []
    var obj = {};
    obj['id'] = data.folder_id
    obj['is_folder'] = data.folder__is_folder
    obj['index'] = data.index
    obj['dataroom'] = this.dataroomId
    obj['name'] = data.folder__name
    obj['parent_folder'] = data.folder__parent_folder
    obj['file_size_mb'] = data.folder__file_size_mb
    obj['perm'] = data.perm,
      finalData['data'].push(obj);
    finalData['token'] = localStorage.getItem("token")
    finalData['notifyemail'] = notifyemailvar;
    console.log('final data 2: ', finalData)
    this.dataRoomService.bulkDownloadCount(this.dataroomId, JSON.stringify(finalData)).subscribe(async res => {
      console.log(res, "bulkdownload");
      this.startLoader = false;
      this.statusCount = await res;


      this.dataRoomService.bulkDownloadStatus(this.dataroomId).subscribe(async res => {
        console.log(res);
        this.statusId = await res;

        finalData['statusid'] = this.statusId

        this.dataRoomService
          .bulkDownload(JSON.stringify(finalData), this.statusCount.filecount)
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

      })
    })




  }


  select_download = [];
  BulkDownloadDrm(folder) {
    console.log("bulk download", folder.folder__is_folder);

    var finalData1 = {
      data: [{
        is_folder: folder.folder__is_folder,
        id: folder.folder_id,
        index: folder.index,
        dataroom: this.dataroomId,
        name: folder.folder__name,
        parent_folder: folder.folder__parent_folder,
        file_size_mb: folder.folder__file_size_mb,
        perm: folder.perm,
        is_shortcut: folder.perm.is_shortcut,
      }],
      token: localStorage.getItem("token")
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
          if (this.user.member.is_end_user) {
            this.msg =
              "Depending on your access, folders & files permitted to be downloaded by the admin will be downloaded shortly from your selection. Please check your Downloads folder on your device.";
            this.showInfo();
          }

        } else {
          this.msg = "You dont have access to download this file " + ress.name;
          this.showInfo();
        }
      });
  }




  // Download confirm popup
  openDialogDownload() {
    // console.log("This is data room popup and data room name "+ popup_data_room_name);
    console.log(this.statusCount)
    this.download_popup_dataroom_name = localStorage.getItem("get_dataroomname_popup");
    const size = this.statusCount.size;
    const dialogRef = this.dialogdownload.open(downloadPopupFav, {
      width: "500px",
      data: { ok: true, filecount: this.statusCount.filecount, size: size, popup_dataroom_name: this.download_popup_dataroom_name },
      // data_room_name:localStorage.getItem("get_dataroomname_popup")
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result != undefined) {
        if (result == true) {
          console.log(result, "result");
          this.DownloadSelectedFiles();
        }
      }
      if (!result && result != undefined) {
        console.log(result, "result");

      }
    });
  }


  download_popup() {
    const data = this.all_root_folder_list.filter(
      (res) => res.checked === true
    );

    if (data.length == 1 && !data[0].folder__is_folder) {
      this.DownloadFiles(data[0]);
    } else {
      var finalData = {};
      var notifyemailvar = localStorage.getItem("notifyemail");

      finalData['data'] = data.map(obj => {
        const newData: { is_folder?: boolean, id?: any, index?: number, dataroom?: number, name?: string, parent_folder?: number, file_size_mb?: number, perm?: any } = {
          is_folder: obj.folder__is_folder,
          id: obj.folder_id,
          index: obj.index,
          dataroom: this.dataroomId,
          name: obj.folder__name,
          parent_folder: obj.folder__parent_folder,
          file_size_mb: obj.folder__file_size_mb,
          perm: obj.perm
        };
        return {
          ...newData
        };
      });

      finalData['token'] = localStorage.getItem("token")
      finalData['notifyemail'] = notifyemailvar;
      console.log('final data 2: ', finalData)
      console.log(finalData, "the final data list")

      this.dataRoomService.bulkDownloadCount(this.dataroomId, JSON.stringify(finalData)).subscribe(async res => {
        console.log(res);
        this.startLoader = false;
        this.statusCount = await res;
        console.error("This is response of popup", res)
        this.openDialogDownload();

      })
    }
  }

  singlefolder: boolean = false
  singlefolderdownlaod;
  downloadsinglefolder(folder) {
    this.singlefolder = true
    const data = folder;
    console.log(folder)
    var finalData = {};
    var notifyemailvar = localStorage.getItem("notifyemail")
    finalData['data'] = []
    var obj = {};
    obj['id'] = data.folder_id
    obj['is_folder'] = data.folder__is_folder
    obj['index'] = data.index
    obj['dataroom'] = this.dataroomId
    obj['name'] = data.folder__name
    obj['parent_folder'] = data.folder__parent_folder
    obj['file_size_mb'] = data.folder__file_size_mb
    obj['perm'] = data.perm,
    finalData['data'].push(obj);
      finalData['token'] = localStorage.getItem("token")
    finalData['notifyemail'] = notifyemailvar;
    console.log('final data 2: ', finalData)
    console.log(finalData, "the final data list")

    this.singlefolderdownlaod = finalData;

    this.dataRoomService.bulkDownloadCount(this.dataroomId, JSON.stringify(finalData)).subscribe(async res => {
      console.log(res);
      this.startLoader = false;
      this.statusCount = await res;
      console.error("This is response of popup", res)
      this.openDialogDownload();

    })
  
}






DownloadSelectedFiles() {
  let url = '/#/download-status-documents'
  console.log('url', url)
  window.open(url, '_blank')
  const data = this.all_root_folder_list.filter(
    (res) => res.checked === true
  );

  if(data.length==0){
    var finalData = this.singlefolderdownlaod;
  }else{
    finalData = {};
    var notifyemailvar = localStorage.getItem("notifyemail")
    finalData['data'] = data.map(obj => {
      const newData: { is_folder?: boolean, id?: any, index?: number, dataroom?: number, name?: string, parent_folder?: number, file_size_mb?: number, perm?: any } = {
        is_folder: obj.folder__is_folder,
        id: obj.folder_id,
        index: obj.index,
        dataroom: this.dataroomId,
        name: obj.folder__name,
        parent_folder: obj.folder__parent_folder,
        file_size_mb: obj.folder__file_size_mb,
        perm: obj.perm
      };
      return {
        ...newData
      };
    })
    finalData['token'] = localStorage.getItem("token")
    finalData['notifyemail'] = notifyemailvar;
    console.log('final data 2: ', finalData)
    console.log(finalData, "the final data list")
  }



  this.dataRoomService.bulkDownloadStatus(this.dataroomId).subscribe(async res => {
    console.log(res);
    this.statusId = await res;

    finalData['statusid'] = this.statusId


    console.log("************************** not print");
    this.dataRoomService
      .bulkDownload(JSON.stringify(finalData), this.statusCount.filecount)
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
  })
}



}


@Component({
  selector: "download-popup-confirm",
  templateUrl: "download.html",
})
export class downloadPopupFav {
  constructor(
    public dialogRefs: MatDialogRef<downloadPopupFav>,

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