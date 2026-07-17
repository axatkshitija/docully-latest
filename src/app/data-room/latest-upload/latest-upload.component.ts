import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  Inject,
} from "@angular/core";
import {
  UploadInput,
  humanizeBytes,
  UploaderOptions,
} from "ngx-uploader";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { SharedService } from "../../services/index";
import { interval, Subscription } from "rxjs";
import { SpinnerVisibilityService } from "ng-http-loader";
import {
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
  NgxFileDropEntry,
} from "ngx-file-drop";
import { DataRoomService } from "../../services/index";

import {
  HttpEvent,
  HttpEventType,
  HttpClient,
  HttpHeaders,
} from "@angular/common/http";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

declare var OneDrive: any;
export interface DialogData {
  yes: string;
  no: string;
  ok: string;
}



declare global {
  interface Window {
    GoogleDriveFunction: any;
    OneDriveFunction: any
  }
}

@Component({
  selector: 'app-latest-upload',
  templateUrl: './latest-upload.component.html',
  styleUrls: ['./latest-upload.component.css']
})
export class LatestUploadComponent {

  formData: FormData;
  tempObj: {};
  files;
  uploadInput: EventEmitter<UploadInput>;
  @Output() valueChange = new EventEmitter();
  humanizeBytes: Function;
  dragOver: boolean;
  msg: string;
  options: UploaderOptions;
  token: any;
  @Input() folder_id: number = parseInt(localStorage.getItem("sendfolderIdTOUpload"));

  dataroomId: string;
  baseUrl: string;
  start_upload: boolean = false;
  signleFileUpload;
  percentFile: any;
  allParentsItems;
  clickeventtransferfiles;
  unsub: any;
  accessToken: string;
  filesshare: any[];
  dataroomName: any;
  single_folder_data: any;
  single_perm: any;
  uploadrestriction: boolean = true
  google: any = false;

  constructor(
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private baseUrlClass: BaseUrlClass,
    private apiListClass: ApiListClass,
    public dialog: MatDialog,
    public dialognote: MatDialog,
    private sharedService: SharedService,
    private spinner: SpinnerVisibilityService,
  ) {
    this.dataroomId = this.route.snapshot.paramMap.get('dataroom');
    this.google = this.route.snapshot.paramMap.get('google');
    this.getFeatures(this.dataroomId)
    this.token = localStorage.getItem("token");
    this.options = { concurrency: 1 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
    this.baseUrl = this.baseUrlClass.baseUrl;
    this.token = "token " + localStorage.getItem("token");
  }

  _id = this.route.snapshot.paramMap.get('id')
  uploadFilepath = localStorage.getItem("upload_file_name");
  uploadParentFilepath = localStorage.getItem("upload_parent_file_name");
  checkAllParentsNull: boolean = true;

  ngOnInit() {
    this.getSingleFolderDetails();
    this.getSingleDataroom(this.dataroomId)
    window.GoogleDriveFunction = this.GoogleDriveFunction.bind(this);
    window.OneDriveFunction = this.OneDriveFunction.bind(this);
    this.allParentsItems = localStorage.getItem("upload_parent_folder_list");
    console.warn("---------------", this.allParentsItems)
    this.dataRoomService.CheckUploadRestriction(this.folder_id, this.dataroomId).subscribe((res) => {
      this.uploadrestriction = res;
    })
  }

  popRestriction() {
    this.openDialogRestriction();
    console.log('resss>>>>>>>>>>>>>>>>>>>>>')
  }

  file: any;
  hide_modal: boolean = false;
  display = "none";
  filepath: any;
  onUploadOutput(event, event1) {
    this.dataRoomService.CheckUploadRestriction(this.folder_id, this.dataroomId).subscribe((res) => {
      this.uploadrestriction = res;
      if (this.uploadrestriction == false) {
        console.log('res>>>>>>>>>>>>>>', this.uploadrestriction);
        this.openDialogRestriction();
      } else {
        this.signleFileUpload = true;
        this.file = event;
        this.filepath = event1;
        console.log(event1.target.files.length, "file path");
        console.log(2930293, this.file);
        if (this.file.length > 0) {
          this.openDialog();
        }

      }
    })
  }

  

  launchOndrivePicker() {
    this.dataRoomService.CheckUploadRestriction(this.folder_id, this.dataroomId).subscribe((res) => {
      this.uploadrestriction = res;
      if (this.uploadrestriction == false) {
        console.log(this.uploadrestriction);
        this.openDialogRestriction();
      } else {
        (window as any).launchPicker();
      }
    })

  }

  goToNextFolder(folder_id) {
    this.router.navigate(["/folder_detail", folder_id]);
  }

  uploadError(error) {
    if (error.status === 403) {
      this.msg =
        "Storage Limit exceed. Contact your TeamAdmin.";
      this.showError();
    } else if (error.status === 405) {
      this.msg =
        "Dataroom Limit exceed. Upgrade Your Plan To Upload More Files.";
      this.showError();
    } else if (error.status === 406) {
      this.msg =
        "An empty folder cannot be uploaded on the data room. Remove the empty folder to continue to upload.";
      this.showError();
    } else {
      this.msg =
        "File upload Failed due to certain reason ,pls upload your documents again.";
      this.showError();
    }
    this.folderRedirect();
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

  public async OneDriveFunction(files) {
    this.spinner.show();
    this.bulkUploadId = await this.dataRoomService.getUploadStatusId(this.dataroomId)
    console.log("Global function called from index.html", files);

    const formData = new FormData();
    const filedatas = []
    this.fil = files;
    for (let i = 0; i < files.length; i++) {
      filedatas.push({
        filename: this.fil[i].name,
        totalfilecount: files.length,
        filepath: this.fil[i].name,
      });
      this.filedata = filedatas;
    }
    files.forEach((droppedFile, index) => {


      if (files.length == this.filedata.length) {
        var filedatas1 = {
          data: this.filedata,
          count: this.filedata.length,
        };
        formData.append("filedata", JSON.stringify(filedatas1));
      }

      formData.append("file", droppedFile['@content.downloadUrl'])
      formData.append("path", droppedFile.name);
      formData.append("size", droppedFile.size);
      formData.append("folder", "No");
      formData.append("dataroomId", this.dataroomId);
      formData.append("uploadstatusid", this.bulkUploadId);
      console.log(formData)

      if (files.length == index + 1) {
        this.unsub = this.http
          .post(
            this.baseUrl +
            '/DropBoxUpload/' +
            this.folder_id +
            "/?notify=" +
            this.notify,
            formData,
            {
              headers: new HttpHeaders().set("Authorization", this.token),
              responseType: "blob",
              reportProgress: true,
              observe: "events",
            }
          )
          .subscribe(
            (events: HttpEvent<any>) => {
              switch (events.type) {
                case HttpEventType.Sent:
                  this.start_upload = true;
                  // this.openDialogNote();

                  this.upload_start(this.files);
                  // this.sharedService.stopLoader1();
                  console.log("Start");
                  // this.spinner.show()
                  break;
                case HttpEventType.Response:
                  console.log("Success");
                  this.spinner.hide();
                  this.msg =
                    "Your files have been successfully uploaded on the data room. You may track the status of the same in the Upload Status section.";
                  this.showSuccess();
                  this.folderRedirect();

                  break;
                case HttpEventType.UploadProgress:
                  break;
              }
            },
            (error) => {
              this.spinner.hide();
              //  this.uploadError(error)
            }
          );
      }
    });
  }

  getFileExtensionFromMime(mimeType) {
    // Define MIME type to extension mappings as needed
    const mimeToExtension = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "application/pdf": ".pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": '.docx',
      "application/vnd.oasis.opendocument.text": '.odt',
      "application/rtf": ".rtf",
      "text/plain": ".txt",
      "application/zip": '.zip',
      "application/epub+zip": '.epud',
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": '.xlsx',
      "application/vnd.google-apps.spreadsheet": '.xlsx',
      "application/vnd.google-apps.document": '.docx',
      "application/x-vnd.oasis.opendocument.spreadsheet": '.ods',
      "text/csv": '.csv',
      "text/tab-separated-values": '.tsv',
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": '.pptx',
      "application/vnd.oasis.opendocument.presentation": '.opd',
      "image/svg+xml": '.svg',
      "application/vnd.google-apps.script+json": '.json'
      // Add more mappings as required
    };

    // Look up the extension based on the MIME type
    const extension = mimeToExtension[mimeType];
    return extension ? extension : null;
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


  getFileExtension(fileName) {
    console.log("split>>>", /\.[^/.]+$/.test(fileName))
    return /\.[^/.]+$/.test(fileName) // Get the last part after splitting by '.'
  }


  uploadcheck() {

  }


  // Function to be called from index.html
  public async GoogleDriveFunction(files) {
    this.spinner.show();
    this.bulkUploadId = await this.dataRoomService.getUploadStatusId(this.dataroomId)
    console.log("Global function called from index.html", files);

    const formData = new FormData();
    const filedatas = []
    this.fil = files;
    for (let i = 0; i < files.length; i++) {
      filedatas.push({
        filename: this.fil[i].name,
        totalfilecount: files.length,
        filepath: this.fil[i].name,
      });
      this.filedata = filedatas;
    }
    files.forEach((droppedFile, index) => {


      if (files.length == this.filedata.length) {
        var filedatas1 = {
          data: this.filedata,
          count: this.filedata.length,
        };
        formData.append("filedata", JSON.stringify(filedatas1));
      }

      const fileExtension = this.getFileExtension(droppedFile.name);

      if (!fileExtension) {
        const extension = this.getFileExtensionFromMime(droppedFile.mimeType)
        formData.append("path", droppedFile.name + extension);
        console.log("File does not have an extension.");
        if (extension == '.xlsx') {
          formData.append("file", `https://docs.google.com/spreadsheets/export?id=${droppedFile.id}&exportFormat=xlsx`)
        } else if (extension == '.docx') {
          formData.append("file", `https://docs.google.com/document/export?id=${droppedFile.id}&exportFormat=docx`)
        } else if (extension == '.ods') {
          formData.append("file", `https://docs.google.com/spreadsheets/export?id=${droppedFile.id}&exportFormat=ods`)
        } else {
          formData.append("file", `https://www.googleapis.com/drive/v3/files/${droppedFile.id}?alt=media`)
        }

        // Handle the case where the file does not have an extension
        // You may choose to prompt the user for the file extension or handle it differently
      } else {


        console.log("File extension: ", fileExtension);
        formData.append("path", droppedFile.name);
        formData.append("file", `https://www.googleapis.com/drive/v3/files/${droppedFile.id}?alt=media`)
        // Now you can send the file with its extension to your backend
        // You can use AJAX or any other method suitable for your application
      }



      //  formData.append("file", `https://www.googleapis.com/drive/v3/files/${droppedFile.id}?alt=media`)
      formData.append("size", droppedFile.sizeBytes);
      formData.append("accessToken", localStorage.getItem('googletoken'));
      formData.append("file_id", droppedFile.id);
      formData.append("folder", "No");
      formData.append("dataroomId", this.dataroomId);
      formData.append("uploadstatusid", this.bulkUploadId);
      console.log(formData)

      if (files.length == index + 1) {
        this.unsub = this.http
          .post(
            this.baseUrl +
            '/GoogleDriveUpload/' +
            this.folder_id +
            "/?notify=" +
            this.notify,
            formData,
            {
              headers: new HttpHeaders().set("Authorization", this.token),
              responseType: "blob",
              reportProgress: true,
              observe: "events",
            }
          )
          .subscribe(
            (events: HttpEvent<any>) => {
              switch (events.type) {
                case HttpEventType.Sent:
                  this.start_upload = true;
                  // this.openDialogNote();

                  this.upload_start(this.files);
                  // this.sharedService.stopLoader1();
                  console.log("Start");
                  // this.spinner.show()
                  break;
                case HttpEventType.Response:
                  this.spinner.hide();
                  this.msg =
                    "Your files have been successfully uploaded on the data room. You may track the status of the same in the Upload Status section.";
                  this.showSuccess();
                  this.folderRedirect();
                  console.log("Success");

                  break;
                case HttpEventType.UploadProgress:
                  break;
              }
            },
            (error) => {
              this.spinner.hide();
              //  this.uploadError(error)
            }
          );
      }
    });
  }


  getSingleDataroom(dataroomId) {
    this.dataRoomService.getSingleDataroom(dataroomId).subscribe((res) => {
      this.dataroomName = res.dataroom_nameFront;
    })
  }

  async openDropBox() {
    await this.dataRoomService.CheckUploadRestriction(this.folder_id, this.dataroomId).subscribe(async (res) => {
      this.uploadrestriction = res;
      if (this.uploadrestriction == false) {
        console.log(this.uploadrestriction);
        this.openDialogRestriction();
      } else {
        this.bulkUploadId = await this.dataRoomService.getUploadStatusId(this.dataroomId)
        const options = {
          success: (files: any[]) => {
            // Handle selected files
            console.log('Selected files:', files);
            this.spinner.show();
            const formData = new FormData();
            const filedatas = []
            this.fil = files;
            for (let i = 0; i < files.length; i++) {
              filedatas.push({
                filename: this.fil[i].name,
                totalfilecount: files.length,
                filepath: this.fil[i].name,
              });
              this.filedata = filedatas;
            }
            files.forEach((droppedFile, index) => {


              if (files.length == this.filedata.length) {
                var filedatas1 = {
                  data: this.filedata,
                  count: this.filedata.length,
                };
                formData.append("filedata", JSON.stringify(filedatas1));
              }

              formData.append("file", decodeURIComponent(droppedFile.link))
              formData.append("path", droppedFile.name);
              formData.append("size", droppedFile.bytes);
              formData.append("folder", "No");
              formData.append("dataroomId", this.dataroomId);
              formData.append("uploadstatusid", this.bulkUploadId);

              console.log(formData)

              if (files.length == index + 1) {
                this.unsub = this.http
                  .post(
                    this.baseUrl +
                    '/DropBoxUpload/' +
                    this.folder_id +
                    "/?notify=" +
                    this.notify,
                    formData,
                    {
                      headers: new HttpHeaders().set("Authorization", this.token),
                      responseType: "blob",
                      reportProgress: true,
                      observe: "events",
                    }
                  )
                  .subscribe(
                    (events: HttpEvent<any>) => {
                      switch (events.type) {
                        case HttpEventType.Sent:
                          this.start_upload = true;
                          // this.openDialogNote();

                          this.upload_start(this.files);
                          // this.sharedService.stopLoader1();
                          console.log("Start");
                          // this.spinner.show()
                          break;
                        case HttpEventType.Response:
                          console.log("Success");
                          this.spinner.hide();
                          this.msg =
                            "Your files have been successfully uploaded on the data room. You may track the status of the same in the Upload Status section.";
                          this.showSuccess();
                          this.folderRedirect();

                          break;
                        case HttpEventType.UploadProgress:
                          break;
                      }
                    },
                    (error) => {
                      this.spinner.hide();
                      //  this.uploadError(error)
                    }
                  );
              }
            });

            // Process the selected files here
          },
          cancel: () => {
            console.log('Chooser was canceled');
          },
          linkType: 'direct', // or 'preview'
          multiselect: true, // or false
        };

        // Open Dropbox Chooser
        (window as any).Dropbox.choose(options);
      }

    })
  }



  folderRedirect() {
    this.router.navigate(['/folder_detail/' + this._id]);
  }


  note: any;
  filedata: any;
  percentDone;
  clickEventTransfer;
  startUpload(): void {
    const formData = new FormData();
    var i;
    var Files = [];

    console.log(this.file);
    for (i = 0; i < this.file.length; i++) {
      this.tempObj = this.file[i];
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
      // formData.append('path', droppedFile.relativePath)
      formData.append("folder", "No");
      formData.append("dataroomId", this.dataroomId);
      // formData.forEach((value, key) => {
      //   console.log(key + " " + value, "upload files");
      // });

      if (this.file.length == i + 1) {
        this.http
          .post(
            this.baseUrl +
            this.apiListClass.upload_file_inside_folder +
            this.folder_id +
            "/?notify=" +
            this.notify,
            formData,
            {
              headers: new HttpHeaders().set("Authorization", this.token),
              responseType: "blob",
              reportProgress: true,
              observe: "events",
            }
          )
          .subscribe(
            (events: HttpEvent<any>) => {
              switch (events.type) {
                case HttpEventType.Sent:
                  this.upload_start(this.file);
                  this.start_upload = true;
                  this.openDialogNote();

                  // this.sharedService.stopLoader1();
                  console.log("Start");
                  this.percentDone = 70;
                  // this.spinner.show()
                  break;
                case HttpEventType.Response:
                  console.log("Success");
                  this.percentDone = 100;
                  this.tempObj["progress"] = 100;
                  this.closeDialogNote();

                  this.interval = 1;
                  this.msg =
                    "Your files have been successfully uploaded on the data room. You may track the status of the same in the Upload Status section. Press button (Take me to the uploaded files) Press Button 2 (All Files)";
                  this.showSuccess();
                  var getPreviousPath = localStorage.getItem("previous_upload_navigation_url_folders")
                  console.error(getPreviousPath);

                  //window.open("/folder_detail/" +this._id);
                  setTimeout(
                    () =>
                      this.sharedService.sendMessage(
                        "Refresh Folder Details!",
                        0
                      ),
                    200
                  );
                  this.spinner.hide();
                  this.folderRedirect()
                  // this.sharedService.sendMessage('Refresh Folder Details!', 0);
                  break;
                case HttpEventType.UploadProgress:
                  this.percentFile = Math.round(100 * events.loaded / events.total);
                  if (this.percentFile >= 90) {
                    this.percentDone = 95;
                  } else {
                    this.percentDone = this.percentFile;
                  }
                  break;
              }
            },
            (error) => {
              console.log(error.status, "error message two");
              this.uploadError(error)
            }
          );

      }
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
    this.display = "none";
    this.notify = "No";
    // this.sharedService.sendMessage('Refresh Folder Details!');
    this.startUpload();
    // this.router.navigate(['/documents']);
  }

  cancelUpload(id: string): void {
    this.display = "none";
    this.uploadInput.emit({ type: "cancel", id: id });
  }

  removeFile(id: string): void {
    this.display = "none";
    this.uploadInput.emit({ type: "remove", id: id });
  }

  removeAllFiles(): void {
    this.display = "none";
    this.uploadInput.emit({ type: "removeAll" });
  }


  // start button click  after upload
  // clickEventTransfer;
  transfer;
  showListOnDrop: boolean = false;
  hideAllAboveUploadStatus: boolean = false;
  startUploadOnclick(event: NgxFileDropEntry[]) {
    this.dataRoomService.CheckUploadRestriction(this.folder_id, this.dataroomId).subscribe((res) => {
      this.uploadrestriction = res;
      if (this.uploadrestriction == false) {
        console.log("res>>>>>>>>>", this.uploadrestriction)
        this.openDialogRestriction();
      } else {
        this.files = event;
        console.log('droppped called......', event)
        this.clickEventTransfer = event;
        this.clickeventtransferfiles = this.files.sort((a, b) => a.relativePath.localeCompare(b.relativePath, 'en', { numeric: true }))
        // this.transfer = event.files;

        console.log(this.transfer);
        this.showListOnDrop = true;
        if (this.clickeventtransferfiles.length > 500) {
          this.msg = "You can upload maximum of 500 files."
          this.showError();
          return;
        }
        console.log("click event transfer : " + this.clickEventTransfer);
      }

    })

  }

  onclickStart() {
    // this.clickEventTransfer.event.files = this.transfer.files;
    this.dataRoomService.CheckUploadRestriction(this.folder_id, this.dataroomId).subscribe((res) => {
      if (this.uploadrestriction == false) {
        console.log("res>>>>>>>>>", this.uploadrestriction)
        this.openDialogRestriction();
      } else {
        this.hideAllAboveUploadStatus = true;
        this.dropped(this.clickEventTransfer);
      }
    })


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

  cancelUploading() {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.bulkUploadId)


    this.dataRoomService.uploadcancel(this.bulkUploadId).subscribe(
      (res) => {
        console.log("upload cancel", "success");
        // if (this.grand_total != 0) {
      })
  }


  getSingleFolderDetails() {
    this.dataRoomService
      .getSubSingleFolderDetails(this.folder_id)
      .subscribe((res) => {
        // this.getAllSubfolderList();
        this.single_folder_data = res;
        this.single_perm = res.perm;
        console.log(this.single_perm, "single perm");
        this.single_folder_data.parent_folders.reverse();
      });
  }


  length: any;
  fil: any;
  uploadStatusSubscription: Subscription;
  bulkUploadId;
  public event: NgxFileDropEntry[] = [];

  async dropped(event: NgxFileDropEntry[]) {
    console.log('droppped called......')
    if (this.clickeventtransferfiles.length > 500) {
      this.msg = "You can upload maximum of 500 files."
      this.showError();
      return;
    }
    var filedatas = [];
    this.files = this.clickeventtransferfiles.reverse();


    if (this.clickeventtransferfiles[0]) {
      if (!this.modal_action) {
        this.openDialogs(event);
      } else if (this.clickeventtransferfiles[0]["fileEntry"].isDirectory === true) {

        this.msg = "An empty folder cannot be uploaded on the data room. Remove the empty folder to continue to upload";
        this.showError();
        this.folderRedirect()
      }
      console.log(this.files, "dragged");
    }

    const formData = new FormData();
    if (this.modal_action) {
      this.bulkUploadId = await this.dataRoomService.getUploadStatusId(this.dataroomId)
      if (this.clickeventtransferfiles.length > 1) {
        this.signleFileUpload = false;
        console.log(this.signleFileUpload)
        console.log(this.dataroomId)
        // this.bulkUploadId = await this.dataRoomService.getUploadStatusId(this.dataroomId)
        console.log(this.bulkUploadId)
        this.clickeventtransferfiles.map(function (obj) {
          obj["progress"] = 0;
          obj['uploaded'] = false;
        });

        this.fil = this.clickeventtransferfiles;
        for (let i = 0; i < this.clickeventtransferfiles.length; i++) {
          filedatas.push({
            filename: this.fil[i].fileEntry.name,
            totalfilecount: this.clickeventtransferfiles.length,
            filepath: this.fil[i].relativePath,
          });
          this.filedata = filedatas;
        }

        this.clickeventtransferfiles.forEach((droppedFile, index) => {
          // Is it a file?
          console.log('dropped file', droppedFile)
          if (droppedFile.fileEntry.isFile) {
            console.log('111111111111111111111')
            const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
            fileEntry.file((file: File) => {
              console.log(fileEntry, "fileEntry");

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
              }

              formData.append("file", file);
              formData.append("path", droppedFile.relativePath);
              formData.append("folder", folder_path);
              formData.append("dataroomId", this.dataroomId);
              formData.append("uploadstatusid", this.bulkUploadId);
              // formData.forEach((value, key) => {
              //   console.log(key + " " + value, "upload folder");
              // });

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
                      headers: new HttpHeaders().set("Authorization", this.token),
                      responseType: "blob",
                      reportProgress: true,
                      observe: "events",
                    }
                  )
                  .subscribe(
                    (events: HttpEvent<any>) => {
                      switch (events.type) {
                        case HttpEventType.Sent:
                          this.start_upload = true;
                          // this.openDialogNote();

                          this.upload_start(this.files);
                          // this.sharedService.stopLoader1();
                          console.log("Start");
                          // this.spinner.show()
                          break;
                        case HttpEventType.Response:
                          console.log("Success");


                          break;
                        case HttpEventType.UploadProgress:
                          break;
                      }
                    },
                    (error) => {

                      console.log(error.status, "error message two");
                      this.uploadError(error)

                      console.log(error);
                    }
                  );


              }
            });
          } else {
            console.log('22222222222222222222')
            // It was a directory (empty directories are added, otherwise only files)
            const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
            console.log(droppedFile.relativePath, fileEntry);
            formData.append("folder", "Yes");
            formData.append("path", droppedFile.relativePath);
            formData.append("dataroomId", this.dataroomId);
            formData.append("uploadstatusid", this.bulkUploadId);
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
                    headers: new HttpHeaders().set("Authorization", this.token),
                    responseType: "blob",
                    reportProgress: true,
                    observe: "events",
                  }
                )
                .subscribe(
                  (events: HttpEvent<any>) => {
                    switch (events.type) {
                      case HttpEventType.Sent:
                        this.start_upload = true;
                        // this.openDialogNote();

                        this.upload_start(this.files);
                        // this.sharedService.stopLoader1();
                        console.log("Start");
                        break;
                      case HttpEventType.Response:
                        console.log("Success 2");

                        break;
                      case HttpEventType.UploadProgress:
                        break;
                    }
                  },
                  (error) => {
                    console.log(error.status, "error message two");
                    this.uploadError(error)
                    console.log(error);
                  }
                );
            }
          }
        });
      } else {
        console.log('event', event)
        let droppedFile = event[0];
        if (droppedFile.fileEntry.isFile) {
          this.signleFileUpload = true;
          this.singleFileName = droppedFile.relativePath;
          console.log(this.signleFileUpload)
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
            console.log(fileEntry, "fileEntry");

            // Here you can access the real file
            if (droppedFile.relativePath.indexOf("/") >= 0) {
              var folder_path = "Yes";
            } else {
              var folder_path = "No";
            }

            var filedatas1 = {
              data: this.filedata,
              count: 1,
            };
            formData.append("filedata", JSON.stringify(filedatas1));
            // }

            formData.append("file", file);
            formData.append("path", droppedFile.relativePath);
            formData.append("folder", folder_path);
            formData.append("dataroomId", this.dataroomId);
            formData.append("uploadstatusid", this.bulkUploadId);
            this.unsub = this.http
              .post(
                this.baseUrl +
                this.apiListClass.upload_file_inside_folder +
                this.folder_id +
                "/?notify=" +
                this.notify,
                formData,
                {
                  headers: new HttpHeaders().set("Authorization", this.token),
                  responseType: "blob",
                  reportProgress: true,
                  observe: "events",
                }
              )
              .subscribe(
                (events: HttpEvent<any>) => {
                  switch (events.type) {
                    case HttpEventType.Sent:
                      // this.upload_start(this.file);
                      this.start_upload = true;
                      console.log(this.start_upload)
                      // this.openDialogNote();

                      // this.sharedService.stopLoader1();
                      console.log("Start");
                      // this.spinner.show()
                      break;
                    case HttpEventType.Response:
                      console.log("Success");
                      // this.tempObj["progress"] = 100;
                      this.closeDialogNote();
                      this.percentDone = 100;
                      this.interval = 1;
                      this.msg =
                        "Your files have been successfully uploaded on the data room. You may track the status of the same in the Upload Status section.";
                      this.showSuccess();
                      setTimeout(
                        () =>
                          this.sharedService.sendMessage(
                            "Refresh Folder Details!",
                            0
                          ),
                        200
                      );
                      this.spinner.hide()
                      this.folderRedirect()
                      // this.sharedService.sendMessage('Refresh Folder Details!', 0);
                      break;
                    case HttpEventType.UploadProgress:
                      this.percentFile = Math.round(100 * events.loaded / events.total);
                      if (this.percentFile >= 90) {
                        this.percentDone = 95;
                      } else {
                        this.percentDone = this.percentFile;
                      }

                      console.log("This is percent done :", events);
                      // console.log('Progress ' + this.percentDone + '%');
                      break;
                  }
                },
                (error) => {
                  console.log(error.status, "error message two");
                  this.uploadError(error)
                }
              );


          });
        }
      }
    }

    if (this.bulkUploadId != undefined) {
      this.uploadStatusSubscription = interval(1000).subscribe((res) => {
        if (localStorage.getItem("token") !== null) {
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
                  "File upload Failed due to certain reason ,pls upload your documents again"
                this.showError();
                this.spinner.hide();
                console.log(res, "upload fail")
                this.folderRedirect()
              } else {
                this.msg =
                  "Files uploaded successfully. For more info refer to Upload Status section on the Documents tab. ";

                this.showSuccess();
                var getPreviousPath = localStorage.getItem("previous_upload_navigation_url")

                this.spinner.hide()

                setTimeout(
                  () =>
                    this.sharedService.sendMessage(
                      "Refresh Folder Details!",
                      0
                    ),
                  200
                );
                this.folderRedirect()
              }
            } else if (res['processcomplete'] == false) {
              console.log(res, this.files);
              this.uploadStatusResponse = res;
              console.log("This is upload status count response from file :  ", res)
              this.sampleRes = this.uploadStatusResponse['totaluploadedfiles'];
              this.percentDone = this.uploadStatusResponse['totaluploadedfiles'] / this.uploadStatusResponse['totalnumberoffiles'] * 100;
              for (let i = 0; i < this.uploadStatusResponse['totaluploadedfiles']; i++) {
                this.files[i]['uploaded'] = true;
              }
            }
          })
        }
      })
    }
  }
  public uploadStatusResponse;
  sampleRes;
  public singleFileName;

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }




  progress: number = 0;





  upload_start(files) {
    console.log(93829389);
    if (files.length > this.totalCount) {
      this.totalCount = 1;
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

  openDialog(): void {
    const dialogRef = this.dialog.open(UploadConfirmationPopupL, {
      width: "500px",
      data: { yes: true, no: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result != undefined) {
        if (result == true) {
          this.notify = "Yes";
          console.log(result);
          this.startUpload();
        }
      }
      if (!result && result != undefined) {
        this.modal_action = true;

        console.log(result);
        this.notify = "No";
        this.startUpload();
      }
    });
  }




  openDialogOndrive(): void {
    const dialogRef = this.dialog.open(UploadConfirmationOndrivePopup, {
      width: "500px",
      data: { yes: true, no: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result != undefined) {
        if (result == true) {
          this.notify = "Yes";
          console.log(result);
          this.launchOndrivePicker();
        }
      }
      if (!result && result != undefined) {
        this.modal_action = true;

        console.log(result);
        this.notify = "No";
        this.launchOndrivePicker();
      }
    });
  }


  openDialogDropbox(): void {
    const dialogRef = this.dialog.open(UploadConfirmationDropboxPopup, {
      width: "500px",
      data: { yes: true, no: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result != undefined) {
        if (result == true) {
          this.notify = "Yes";
          console.log(result);
          this.openDropBox();
        }
      }
      if (!result && result != undefined) {
        this.modal_action = true;

        console.log(result);
        this.notify = "No";
        this.openDropBox();
      }
    });
  }

  openDialogRestriction(): void {
    const dialogRef = this.dialog.open(uploadrestrictionL, {
      width: "500px",
      data: { yes: true, no: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // if (result && result != undefined) {
      //   if (result == true) {
      //   //  this.notify = "Yes";
      //     console.log(result);
      //     //this.startUpload();
      //   }
      // }
      // if (!result && result != undefined) {
      //   this.modal_action = true;

      //   console.log(result);
      //   //this.notify = "No";
      //   //this.startUpload();
      // }
    });
  }
  modal_action: boolean = false;
  openDialogs(event): void {
    const dialogRef = this.dialog.open(UploadConfirmationPopupL, {
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
    const dialogRef = this.dialognote.open(UploadConfirmationPopupsL, {
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
}
@Component({
  selector: "upload-confirmation-popup",
  templateUrl: "upload-confirmation-popup.html",
})
export class UploadConfirmationPopupL {
  constructor(
    public dialogRef: MatDialogRef<UploadConfirmationPopupL>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "upload-confirmation-popup",
  templateUrl: "uploadrestrictionpopopup.html",
})
export class uploadrestrictionL {
  constructor(
    public dialogRef: MatDialogRef<uploadrestrictionL>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: "upload-confirmation-popup",
  templateUrl: "upload-note-confirmation-popup.html",
})
export class UploadConfirmationPopupsL {
  constructor(
    public dialogRefs: MatDialogRef<UploadConfirmationPopupsL>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRefs.close();
  }
}



@Component({
  selector: "upload-confirmation-popup",
  templateUrl: "upload-confirmation-popup.html",
})
export class UploadConfirmationOndrivePopup {
  constructor(
    public dialogRef: MatDialogRef<UploadConfirmationOndrivePopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "upload-confirmation-popup",
  templateUrl: "upload-confirmation-popup.html",
})
export class UploadConfirmationDropboxPopup {
  constructor(
    public dialogRef: MatDialogRef<UploadConfirmationOndrivePopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}