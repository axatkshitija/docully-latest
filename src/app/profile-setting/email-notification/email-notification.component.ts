import {
  Component,
  OnInit,
  ViewEncapsulation,
  EventEmitter,
} from "@angular/core";
import { DataRoomService } from "../../services/index";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import {
  UploadOutput,
  UploadInput,
  UploadFile,
  humanizeBytes,
  UploaderOptions,
  UploadStatus,
} from "ngx-uploader";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { Location } from "@angular/common";

@Component({
  selector: "email-notification-info",
  templateUrl: "./email-notification.component.html",
  styleUrls: ["./email-notification.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class EmailNotificationComponent implements OnInit {
  user: any;
  msg: string;
  errors: any;
  fileToUpload: File = null;
  _base_url: string = "";
  token: string = "";
  avatarUrl: string;

  constructor(
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private location: Location,
    private router: Router,
    private baseUrlClass: BaseUrlClass,
  ) {
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    this._base_url = this.baseUrlClass.baseUrl;
    this.token = "token " + localStorage.getItem("token");
  }

  ngOnInit() {
    this.getUserInfo();
  }

  goBack() {
    this.location.back();
  }
  getUserInfo() {
   // this.dataRoomService.getUserProfile().subscribe((res) => {
      //console.log("res.start_email_notification",res.start_email_notification);
      this.user =  JSON.parse(    localStorage.getItem("currentUser"));
      console.log(this.user, "Personal Info");
      this.avatarUrl = this.user.avatar;
      console.log("this getuser infor ");
      this.avatarUrl = this.avatarUrl.replace("//media/", "/media/");
      this.update = {
        receive_email: this.user.receive_email,
        receive_notification: this.user.start_email_notification,
      };
    //});
  }

  is_profile_editable: boolean = false;

  makeProfileEditable() {
    this.is_profile_editable = !this.is_profile_editable;
  }

  editUserProfile(update) {
    console.log(update, "update");
    this.dataRoomService.receive_email(update).subscribe(
      (res) => {
        this.msg = "Data Saved!";
        this.showSuccess();
        this.getUserInfo();
        //this.router.navigate["/user-personal-info"];
      },
      (error) => {
        this.msg = "Internal error occurred !";
        this.errors = error;
        console.log(error);
        this.showError();
      },

      () => {
        // No errors, route to new page
      }
    );
  }
  // File upload
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  //
  uploadFileToActivity() {
    console.log("uploadFileToActivity");
    // this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
    //   // do something, if upload success
    //   }, error => {
    //     console.log(error);
    //   });
  }

  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  // file upload code
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  onUploadOutput(output: UploadOutput): void {
    if (output.type === "allAddedToQueue") {
      // when all files added in queue
      // uncomment this if you want to auto upload files when added
      // const event: UploadInput = {
      //   type: 'uploadAll',
      //   url: '/upload',
      //   method: 'POST',
      //   data: { foo: 'bar' }
      // };
      // this.uploadInput.emit(event);
      console.log("files are ", this.files);
    } else if (
      output.type === "addedToQueue" &&
      typeof output.file !== "undefined"
    ) {
      // add file to array when added
      this.files.push(output.file);
    } else if (
      output.type === "uploading" &&
      typeof output.file !== "undefined"
    ) {
      // update current data in files array for uploading file
      const index = this.files.findIndex(
        (file) =>
          typeof output.file !== "undefined" && file.id === output.file.id
      );
      this.files[index] = output.file;
    } else if (output.type === "removed") {
      // remove file from array when removed
      this.files = this.files.filter(
        (file: UploadFile) => file !== output.file
      );
    } else if (output.type === "dragOver") {
      this.dragOver = true;
    } else if (output.type === "dragOut") {
      this.dragOver = false;
    } else if (output.type === "drop") {
      this.dragOver = false;
    }
    this.files = this.files.filter(
      (file) => file.progress.status !== UploadStatus.Done
    );
  }
  toggle: boolean = false;
  toggle1: boolean = false;

  selectedFolderList: any = [];
  isActionBar: boolean = false;
  selected_folder_list_count: number = 0;

  update: any = {
    receive_email: "",
    receive_notification: "",
  };

  onChangeSelect(toggle) {
    console.log(toggle, "toggle test");
  }
  onChangeSelect1(toggle) {}

  start_upload: boolean = false;
  startUpload(): void {
    this.start_upload = true;

    let token = "token " + localStorage.getItem("token"); // <----  get token
    console.log("token is", token);
    console.log("base url is", this._base_url + "/upload_profile_pic/");
    const event: UploadInput = {
      type: "uploadFile",
      url: this._base_url + "/upload_profile_pic/",
      method: "POST",
      headers: { Authorization: token }, // <----  set headers
      data: { foo: "bar" },
      file: this.files[0],
    };
    this.uploadInput.emit(event);
    //  this.msg = "Profile Pic successfully updated!";
    //  this.showSuccess();
  }
  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: "cancel", id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: "remove", id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: "removeAll" });
  }
}
