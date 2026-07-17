import {
  Component,
  OnInit,
  ViewEncapsulation,
  EventEmitter,
} from "@angular/core";
import { DataRoomService } from "../../services/index";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { UploadOutput, UploadInput, UploadFile, UploadStatus, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { Location } from "@angular/common";


@Component({
  selector: "app-personal-info",
  templateUrl: "./personal-info.component.html",
  styleUrls: ["./personal-info.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class PersonalInfoComponent implements OnInit {
  options: UploaderOptions;
  user: any;
  msg: any;
  errors: any;
  fileToUpload: any = File;
  _base_url: string = "";
  token: string = "";
  avatarUrl: any;
  userdata: any;
  timezone: any = [];



  constructor(
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private location: Location,
    private router: Router,
    private baseUrlClass: BaseUrlClass,

  ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
    this._base_url = this.baseUrlClass.baseUrl;
    this.token = "token " + localStorage.getItem("token");
  }

  ngOnInit() {
    this.getUserInfo();
    this.gettimezonelist()
  }

  goBack() {
    this.location.back();
  }



  gettimezonelist() {
    this.dataRoomService.get_time_zones_list().subscribe((res) => {
      console.log('timezone>>>>>>>>>', res)
      this.timezone = res;
    })
  }
  selectedValue: any = 377;
  getUserInfo() {
    this.dataRoomService.getUserProfile().subscribe((res) => {
      localStorage.setItem("currentUser", JSON.stringify(res));
      console.log("getdata profiel>>>.", res)
      this.user = res;
      this.selectedValue = this.user['user_time_zone'][0]['time_zone_id'];
      this.avatarUrl = this.user.avatar;
      this.avatarUrl = this.avatarUrl.replace("//media/", "/media/");
    });

  }

  searchQuery: string = '';

  filteredItems = [...this.timezone]; // Initialize with all items

  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredItems = this.timezone.filter(item =>
      item.country.toLowerCase().includes(query) || item.tz.toLowerCase().includes(query)
    );
  }

  getTimezone(value) {
    console.log(value);
    this.selectedValue = value;
    const country = this.timezone.find(x => x.id === value).country;
    const tz = this.timezone.find(x => x.id === value).tz;
    console.log(country + tz);
    this.searchQuery = country + ' ' + tz;
  }

  is_profile_editable: boolean = false;

  makeProfileEditable() {
    this.is_profile_editable = !this.is_profile_editable;
  }
  edituser: any = []



  editUserProfile(user: any) {
    console.log(user)
    user['tz_id'] = this.selectedValue;

    // this.edituser.push();
    this.dataRoomService.updateUserProfile(user).subscribe(
      (res) => {

        this.getUserInfo();
        this.is_profile_editable = false;

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
  }

  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }



  // file upload code

  formData: any = FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: any;
  onUploadOutput(output: UploadOutput): void {
    console.log(">>>>>>>>>>output", output)

    if (output.type === 'allAddedToQueue') {
      // Triggered when all files are added to the queue
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      // Triggered when a new file is added to the queue
      console.log('File added:', output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // Triggered while the file is uploading
      console.log('File uploading:', output.file);
    } else if (output.type === 'done' && typeof output.file !== 'undefined') {
      // Triggered when the file is successfully uploaded
      this.editUserProfile(this.userdata)
      if (output.file.responseStatus == 400) {
        this.msg = output.file.response.msg;
        console.log(output.file.response.msg);
        this.showError();
      } else if (output.file.responseStatus == 200) {
        setTimeout(window.location.reload.bind(window.location), 1000);
        this.msg = "Profile successfully saved!!";
        this.showSuccess();
      }

      console.log('File uploaded successfully:', output.file.response.msg);

    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      // Triggered when a file is rejected (e.g., due to size, type, etc.)
      console.error('File rejected:', output.file);
    }


    if (output.type === "allAddedToQueue") {
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
  start_upload: boolean = false;
  startUpload(user: any): void {
    this.userdata = user;
    console.log(user)
    if (this.files.length == 0) {
      this.editUserProfile(user)
    }
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
