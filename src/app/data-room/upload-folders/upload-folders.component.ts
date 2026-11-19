import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  Inject,
} from "@angular/core";
import { DataRoomService } from "../../services/index";
import { Router, ActivatedRoute } from "@angular/router";

import {
  UploadOutput,
  UploadInput,
  humanizeBytes,
  UploaderOptions,
  UploadStatus,
} from "ngx-uploader";
import {
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
  NgxFileDropEntry,
} from "ngx-file-drop";
import { SharedService } from "../../services/index";
import { SpinnerVisibilityService } from "ng-http-loader";
import { ToastrService } from "ngx-toastr";
import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpClient,
  HttpHeaders,
} from "@angular/common/http";
// import {
//   Http,
//   Headers,
//   RequestOptions,
//   Response,
//   ResponseContentType,
// } from "@angular/http";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { interval, Subscription } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";

export interface DialogData {
  yes: string;
  no: string;
  ok: string;
}

@Component({
  selector: "app-upload-folders",
  templateUrl: "./upload-folders.component.html",
  styleUrls: ["./upload-folders.component.css"],
})
export class UploadFoldersComponent implements OnInit {
  formData: FormData;
  uploadedPercentage: any = 0;
  tempPercentage: any = 0;
  startProgress: any = 0;
  progress: any = 0;
  length: any = 0;
  files: any[] = [];
  complete: boolean = false;
  uploadInput: EventEmitter<UploadInput>;
  @Output() valueChange = new EventEmitter();
  humanizeBytes: Function;
  dragOver: boolean;
  msg: string;
  options: UploaderOptions;
  token: any;
  folder_id: number = 0;
  dataroomId: string;
  baseUrl: string = "";
  start_upload: boolean = false;
  uploadStatusSubscription: Subscription;
  Upload_file_folder_path;
  clickEventTransfer: any;
  clickeventtransferfiles;
  sampleRes: any;
  emptyfolder: boolean = true;
  unsub: any;
  constructor(
    private spinner: SpinnerVisibilityService,
    private dataRoomService: DataRoomService,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private baseUrlClass: BaseUrlClass,
    private apiListClass: ApiListClass,
    public dialog: MatDialog,
    public dialognote: MatDialog,
    private cookieService: CookieService,
  ) {
    this.dataroomId = this.route.snapshot.paramMap.get('dataroom')
    this.baseUrl = this.baseUrlClass.baseUrl;
    this.token = "token " + localStorage.getItem("token");
  }

  ngOnInit() {
    // console.log("Upload folder path ");
  }

  // "File upload Failed due to certain reason ,pls upload your documents again"


  file: any;
  onUploadOutput(event) {
    this.file = event;
  }

  startUpload(): void {
    const formData = new FormData();
    var Files = [];

    var i = 0;
    const len = this.file.length;
    while (i < len) {
      i++;
      Files.push({
        filename: this.file[i].name,
        totalfilecount: this.file.length,
      });
      this.filedata = Files;
      var filedatas1 = {
        data: this.filedata,
        count: this.filedata.length,
      };

      formData.append("file", this.file[i]);
      if (this.file.length == this.filedata.length) {
        formData.append("filedata", JSON.stringify(filedatas1));
      }
      formData.append("folder", "No");
      formData.append("dataroomId", this.dataroomId);
      console.log(formData);

    }
  }

  notify: any = "No";
  NotifyAllMembers() {
    // this.spinner.show();

    this.notify = "Yes";
    this.startUpload();
    // this.router.navigate(['/documents']);
  }

  DontNotifyAllMembers() {
    // this.spinner.show();

    this.notify = "No";
    // this.sharedService.sendMessage('Refresh Folder Details!');
    this.startUpload();
    // this.router.navigate(['/documents']);
  }

  display = "none";

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: "cancel", id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: "remove", id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: "removeAll" });
  }

  showSuccess() {
    this.toastr.success(this.msg);
  }
  showNote() {
    this.toastr.info(this.note);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  upload_start(files) {
    this.totalCount = 1;

    if (files.length > this.totalCount) {
      this.timeInterval = setInterval(
        () => this.manageProgress(files),
        this.interval
      );
    }
  }
  timeInterval: any;
  incr = 1;
  totalCount = 0;
  interval = 50;
  manageProgress(files) {
    if (this.progress === 100) {
      if (files.length > this.totalCount) {
        this.progress = 0;
        this.totalCount += 1;
      } else {
        clearInterval(this.timeInterval);
      }
    } else {
      this.progress = this.progress + this.incr;
      if (this.totalCount == files.length && this.progress == 75) {
        console.log(this.progress, this.totalCount, files.length);
        this.progress = 100;
        clearInterval(this.timeInterval);
      } else {
        files[this.totalCount - 1]["progress"] = this.progress;
      }
    }
  }

  showInfo() {
    this.toastr.info(this.msg);
  }
  modal_action: boolean = false;
  openDialog(event): void {
    const dialogRef = this.dialog.open(UploadConfirmationPopup_1, {
      width: "500px",
      data: { yes: true, no: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result != undefined) {
        this.modal_action = true;
        if (result == true) {
          this.notify = "Yes";
          console.log(result);
          this.dropped(event);
        }
      }
      if (!result && result != undefined) {
        this.modal_action = true;
        console.log(result);
        this.notify = "No";
        this.dropped(event);
      }
    });
  }
  openDialogNote(): void {
    const dialogRef = this.dialognote.open(UploadConfirmationPopup_2, {
      width: "500px",
      data: { close: false },
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






  // start button click  after upload
  // clickEventTransfer;
  transfer;
  showListOnDrop: boolean = false;
  hideAllAboveUploadStatus: boolean = false;
  startUploadOnclick(event: NgxFileDropEntry[]) {
    this.files = event;
    console.log('droppped called......', event)
    this.clickEventTransfer = event;
    this.clickeventtransferfiles = this.files.sort((a, b) => a.relativePath.localeCompare(b.relativePath, 'en', { numeric: true }));
    // this.transfer = this.clickeventtransferfiles;
    console.warn(this.clickeventtransferfiles.values);
    console.log(this.transfer);
    this.showListOnDrop = true;
    if (this.clickeventtransferfiles.length > 500) {
      this.msg = "You can upload maximum of 500 files."
      this.showError();
      return;
    }
    // this.clickEventTransfer.this.clickeventtransferfiles = this.transfer;
    console.log("This is upload event files" + JSON.stringify(this.clickeventtransferfiles));
    console.log("click event transfer : " + this.clickEventTransfer);
  }

  cancelUploading() {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.bulkUploadId)


    this.dataRoomService.uploadcancel(this.bulkUploadId).subscribe(
      (res) => {
        console.log("upload cancel", "success");
        // if (this.grand_total != 0) {
      })
  }

  onclickStart() {
    // this.clickEventTransfer.this.clickeventtransferfiles = this.transfer.files;
    this.dropped(this.clickEventTransfer);
    this.hideAllAboveUploadStatus = true;
  }

  getItemID(id) {
    console.log("Item ID" + id),
      console.log(this.clickEventTransfer.files[id]),
      this.clickEventTransfer.files.splice(id, 1),
      console.log(this.clickEventTransfer.files[id])
  }


  onclickCancel() {
    this.start_upload = false;
    this.unsub.unsubscribe();
    location.reload();

  }

  note: any;
  filedata: any;
  fil: any;
  bulkUploadId;



  dropped(event: NgxFileDropEntry[]) {
    console.log(event);

    if (this.clickeventtransferfiles.length > 500) {
      this.msg = "You can upload maximum of 500 files."
      this.showError();
      return;
    }
    var filedatas = [];

    if (this.clickeventtransferfiles[0]["relativePath"].indexOf("/") != -1) {
      if (!this.modal_action) {
        this.openDialog(event);
      }
    }
    else {
      console.log(">>>>>>>>>>>>>>>>>>>>>>", this.clickeventtransferfiles[0]["fileEntry"].isDirectory)
      this.msg = "Files cannot be upload from here";
      this.showInfo();

    }

    if (this.modal_action) {
      this.http.get(this.baseUrl + this.apiListClass.bulUploadStatus + this.dataroomId + '/', {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      }).subscribe(
        (res) => {
          console.log(res);
          this.bulkUploadId = res;
          console.log(this.bulkUploadId)
        }
      )
      this.files = this.clickeventtransferfiles;
      this.fil = this.clickeventtransferfiles;


      this.clickeventtransferfiles.map(function (obj) {
        obj["progress"] = 0;
        obj['uploaded'] = false;
      });

      const formData = new FormData();
      for (let i = 0; i < this.clickeventtransferfiles.length; i++) {
        if (this.fil[i].fileEntry.isDirectory === false) {
          filedatas.push({
            filename: this.fil[i].fileEntry.name,
            totalfilecount: this.clickeventtransferfiles.length,
            filepath: this.fil[i].relativePath,
          });
          this.filedata = filedatas;
        } else {
          console.log("An empty folder cannot be uploaded on the data room. Remove the empty folder to continue to upload.")
          this.emptyfolder = false;
        }
      }

      if (this.clickeventtransferfiles.length > 1) {
        setTimeout(() => {
          this.clickeventtransferfiles.forEach((droppedFile, index) => {
            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
              const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
              fileEntry.file((file: File) => {
                console.log(droppedFile, "fileEntry");

                this.length = this.clickeventtransferfiles.length;
                // Here you can access the real file

                if (droppedFile.relativePath.indexOf("/") >= 0) {
                  var folder_path = "Yes";
                } else {
                  var folder_path = "No";
                }

                if (this.clickeventtransferfiles.length == this.filedata.length) {
                  var filedatas1 = {
                    data: this.filedata,
                    count: this.filedata.length,
                  };
                  formData.append("filedata", JSON.stringify(filedatas1));
                  console.log(this.filedata.length, "file data length");
                }

                formData.append("file", file);
                formData.append("path", droppedFile.relativePath);
                formData.append("folder", folder_path);
                formData.append("dataroomId", this.dataroomId);
                formData.append("uploadstatusid", this.bulkUploadId);
                // formData.forEach((value, key) => {
                //   console.log(key + " " + value, "upload folder");
                // });

                if (folder_path == "Yes") {
                  if (this.clickeventtransferfiles.length == index + 1) {

                    this.unsub = this.http
                      .post(
                        this.baseUrl +
                        this.apiListClass.upload_file_inside_folder +
                        this.folder_id +
                        "/?notify=" +
                        this.notify,
                        formData,
                        {
                          headers: new HttpHeaders().set(
                            "Authorization",
                            this.token
                          ),
                          responseType: "blob",
                          reportProgress: true,
                          observe: "events",
                        }
                      )
                      .subscribe(
                        (events: HttpEvent<any>) => {
                          switch (events.type) {
                            case HttpEventType.Sent:
                              this.upload_start(this.files);
                              this.start_upload = true;
                              // this.openDialogNote();

                              // this.sharedService.stopLoader1();
                              console.log("Start");
                              // this.spinner.show()
                              break;
                            case HttpEventType.Response:
                              console.log("Success", events);
                              this.interval = 1;
                              this.modal_action = false;
                              this.clickeventtransferfiles[index]["progress"] = 100;
                              this.closeDialogNote();


                              break;
                            case HttpEventType.UploadProgress:

                              break;
                          }
                        },
                        (error) => {
                          if (error.status === 403) {
                            this.msg =
                              "Storage Limit exceed. Contact your TeamAdmin."; //res.message//"Upload file successfully !";
                            this.router.navigate(["../documents"]);
                            this.showError();
                          } else if (error.status === 405) {
                            this.msg =
                              "Dataroom Limit exceed. Upgrade Your Plan To Upload More Files."; //res.message//"Upload file successfully !";
                            this.router.navigate(["../documents"]);
                            this.showError();
                          } else if (error.status === 406) {
                            this.msg =
                              "An empty folder cannot be uploaded on the data room. Remove the empty folder to continue to upload."; //res.message//"Upload file successfully !";
                            this.router.navigate(["../documents"]);
                            this.showError();
                          } else {
                            this.msg =
                              "File upload Failed due to certain reason ,pls upload your documents again"; //res.message//"Upload file successfully !";
                            this.router.navigate(["../documents"]);
                            this.showError();
                          }
                        }
                      );


                  }

                } else {
                  // It was a directory (empty directories are added, otherwise only files)
                  if (this.clickeventtransferfiles[0]["fileEntry"].isDirectory === true || this.emptyfolder === false) {
                    this.msg = "An empty folder cannot be uploaded on the data room. Remove the empty folder to continue to upload";
                    this.showError();
                    console.log("---------------------------", this.clickeventtransferfiles[0]["fileEntry"].isDirectory)
                    this.router.navigate(['/documents']);
                    //this.showInfo();
                  } else {
                    this.msg = "Files cannot be upload from here";
                    console.log("----------------------------", this.clickeventtransferfiles[0]["fileEntry"].isDirectory)
                    this.router.navigate(['/documents']);
                    this.showError();
                  }
                }
              });
            } else {
              // It was a directory (empty directories are added, otherwise only files)
              if (this.clickeventtransferfiles[0]["fileEntry"].isDirectory === true || this.emptyfolder === false) {
                this.msg = "An empty folder cannot be uploaded on the data room. Remove the empty folder to continue to upload";
                console.log("---------------------------", this.clickeventtransferfiles[0]["fileEntry"].isDirectory)
                this.showError();
                this.router.navigate(['/documents']);
                //this.showInfo();
              } else {
                this.msg = "Files cannot be upload from here";
                console.log("----------------------------", this.clickeventtransferfiles[0]["fileEntry"].isDirectory)
                this.router.navigate(['/documents']);
                this.showError();
              }
            }
          });
        }, 1000);

        this.uploadStatusSubscription = interval(3000).subscribe((res) => {
          this.http.get(this.baseUrl + this.apiListClass.uploadStatusResponse + this.bulkUploadId + '/', {
            headers: new HttpHeaders().set(
              "Authorization",
              "token " + localStorage.getItem("token")
            ),
          }).subscribe((res) => {
            this.sampleRes = res['totaluploadedfiles']
            this.percentDone = res['totaluploadedfiles'] / res['totalnumberoffiles'] * 100;
            console.log(res);
            if (res['processcomplete']) {
              this.uploadStatusSubscription.unsubscribe();
              if (res['isuploadfail']) {
                this.msg =
                  "File upload Failed due to certain reason ,pls upload your documents again";
                this.showError();
                this.spinner.hide();
                console.log(res, "upload fail")
                this.router.navigate(["/documents"]);
              } else {
                this.uploadStatusResponse = res;
                this.msg =
                  "Files uploaded successfully. For more info refer to Upload Status section on the Documents tab. ";
                this.showSuccess();
                var getPreviousPath = localStorage.getItem("previous_upload_navigation_url_folders")
                console.error(getPreviousPath)
                this.router.navigate(['/documents'])
                this.spinner.hide()
                setTimeout(
                  () =>
                    this.sharedService.sendMessage(
                      "Refresh Folder Details!",
                      0
                    ),
                  200
                );
              }
            } else if (res['processcomplete'] == false) {
              console.log(res, this.files);
              this.uploadStatusResponse = res;
              this.percentDone = this.uploadStatusResponse['totaluploadedfiles'] / this.uploadStatusResponse['totalnumberoffiles'] * 100;
              for (let i = 0; i < this.uploadStatusResponse['totaluploadedfiles']; i++) {
                this.files[i]['uploaded'] = true;
              }
            }
          })
        })
      } else {
        setTimeout(() => {
          this.clickeventtransferfiles.forEach((droppedFile, index) => {
            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
              const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
              fileEntry.file((file: File) => {
                console.log(droppedFile, "fileEntry");

                this.length = this.clickeventtransferfiles.length;
                // Here you can access the real file

                if (droppedFile.relativePath.indexOf("/") >= 0) {
                  var folder_path = "Yes";
                } else {
                  var folder_path = "No";
                }

                if (this.clickeventtransferfiles.length == this.filedata.length) {
                  var filedatas1 = {
                    data: this.filedata,
                    count: this.filedata.length,
                  };
                  formData.append("filedata", JSON.stringify(filedatas1));
                  console.log(this.filedata.length, "file data length");
                }

                formData.append("file", file);
                formData.append("path", droppedFile.relativePath);
                formData.append("folder", folder_path);
                formData.append("dataroomId", this.dataroomId);
                formData.append("uploadstatusid", this.bulkUploadId);
                // formData.forEach((value, key) => {
                //   console.log(key + " " + value, "upload folder");
                // });

                if (folder_path == "Yes") {
                  if (this.clickeventtransferfiles.length == index + 1) {

                    this.unsub = this.http
                      .post(
                        this.baseUrl +
                        this.apiListClass.upload_file_inside_folder +
                        this.folder_id +
                        "/?notify=" +
                        this.notify,
                        formData,
                        {
                          headers: new HttpHeaders().set(
                            "Authorization",
                            this.token
                          ),
                          responseType: "blob",
                          reportProgress: true,
                          observe: "events",
                        }
                      )
                      .subscribe(

                        (events: HttpEvent<any>) => {
                          switch (events.type) {
                            case HttpEventType.Sent:
                              this.upload_start(this.files);
                              this.start_upload = true;
                              // this.openDialogNote();

                              // this.sharedService.stopLoader1();
                              console.log("Start");
                              // this.spinner.show()
                              break;
                            case HttpEventType.Response:
                              console.log("Success");

                              this.interval = 1;
                              this.modal_action = false;
                              this.clickeventtransferfiles[index]["progress"] = 100;
                              this.closeDialogNote();

                              this.msg =
                                "Files uploaded successfully. For more info refer to Upload Status section on the Documents tab. "; //res.message//"Upload file successfully !";
                              this.showSuccess();
                              this.router.navigate(['/documents'])
                              this.spinner.hide();

                              setTimeout(
                                () =>
                                  this.sharedService.sendMessage(
                                    "Refresh Folder Details!",
                                    0
                                  ),
                                200
                              );
                              break;
                            case HttpEventType.UploadProgress:
                              // this.progress = Math.round(100 * events.loaded / events.total)
                              // console.log(this.progress)
                              break;
                          }
                        },
                        (error) => {
                          if (error.status === 403) {
                            this.msg =
                              "Storage Limit exceed. Contact your TeamAdmin."; //res.message//"Upload file successfully !";
                            this.router.navigate(["../documents"]);
                            this.showError();
                          } else if (error.status === 405) {
                            this.msg =
                              "Dataroom Limit exceed. Upgrade Your Plan To Upload More Files."; //res.message//"Upload file successfully !";
                            this.router.navigate(["../documents"]);
                            this.showError();
                          } else if (error.status === 406) {
                            this.msg =
                              "An empty folder cannot be uploaded on the data room. Remove the empty folder to continue to upload."; //res.message//"Upload file successfully !";
                            this.router.navigate(["../documents"]);
                            this.showError();
                          } else {
                            this.msg =
                              "File upload Failed due to certain reason ,pls upload your documents again"; //res.message//"Upload file successfully !";
                            this.router.navigate(["../documents"]);
                            this.showError();
                          }
                        }
                      );
                  }

                } else {
                  if (this.clickeventtransferfiles[0]["fileEntry"].isDirectory === true || this.emptyfolder === false) {
                    this.msg = "An empty folder cannot be uploaded on the data room. Remove the empty folder to continue to upload";
                    console.log("---------------------------", this.clickeventtransferfiles[0]["fileEntry"].isDirectory)
                    this.router.navigate(['/documents']);
                    //this.showInfo();
                  } else {
                    this.msg = "Files cannot be upload from here";
                    console.log("----------------------------", this.clickeventtransferfiles[0]["fileEntry"].isDirectory)
                    this.router.navigate(['/documents']);
                    this.showError();
                  }
                }
              });
            } else {
              // It was a directory (empty directories are added, otherwise only files)
              if (this.clickeventtransferfiles[0]["fileEntry"].isDirectory === true || this.emptyfolder === false) {
                this.msg = "An empty folder cannot be uploaded on the data room. Remove the empty folder to continue to upload";
                console.log("++++++++++++++++++>>>>>>>>>>>>>>", this.clickeventtransferfiles[0]["fileEntry"].isDirectory)
                this.showError();
                this.router.navigate(['/documents']);
              } else {
                this.msg = "Files cannot be upload from here";
                console.log("++++++++++++++++++>>>>>>>>>>>>>>", this.clickeventtransferfiles[0]["fileEntry"].isDirectory)
                this.showError();
                this.router.navigate(['/documents']);
              }

            }
          });
        }, 200);
      }
    }
  }
  public uploadStatusResponse;
  public percentDone;

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }
}

@Component({
  selector: "../upload-files/upload-confirmation-popup",
  templateUrl: "../upload-files/upload-confirmation-popup.html",
})
export class UploadConfirmationPopup_1 {
  constructor(
    public dialogRef: MatDialogRef<UploadConfirmationPopup_1>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onYesClick(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}

@Component({
  selector: "../upload-files/upload-confirmation-popup",
  templateUrl: "../upload-files/upload-note-confirmation-popup.html",
})
export class UploadConfirmationPopup_2 {
  constructor(
    public dialogRef: MatDialogRef<UploadConfirmationPopup_2>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
