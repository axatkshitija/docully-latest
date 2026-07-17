import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { DataRoomService } from "../../../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  UploadOutput,
  UploadInput,
  UploadFile,
  humanizeBytes,
  UploaderOptions,
  UploadStatus,
} from "ngx-uploader";
import { BaseUrlClass, ApiListClass } from "../../../common/index";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-disclaimer-page",
  templateUrl: "./disclaimer-page.component.html",
  styleUrls: ["./disclaimer-page.component.css"],
})
export class DisclaimerPageComponent implements OnInit {
  formData: FormData;
  _base_url: string = "";
  dataroomId: any;
  token: string = "";
  msg: string = "";
  fileToUpload: File = null;
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  files: UploadFile[];
  options: UploaderOptions;
  defaultdisclaimer: any =[];

  constructor(
    private dataRoomService: DataRoomService,
    private baseUrlClass: BaseUrlClass,
    private apiListClass: ApiListClass,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) {
    this._base_url = this.baseUrlClass.baseUrl;
    this.dataroomId =localStorage.getItem("currentDataroomId");
    this.token = localStorage.getItem("token");
    this.options = { concurrency: 1 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.getAllDisclaimer();
    this.getSingleDataroomOverviewDetail();
  }

  overview: any;
  getSingleDataroomOverviewDetail() {
    let data = { dataroomId: this.dataroomId };
    this.dataRoomService.get_single_dataroom_overview(data).subscribe((res) => {
      this.overview = res;
      // this.cleansed_data_overview_data(res);
    });
  }

  all_dataroom_disclaimers: any[] = [];
  getAllDisclaimer() {
    this.dataRoomService.getAllDisclaimers(this.dataroomId).subscribe((res) => {
      console.log(res);
  
      this.defaultdisclaimer = res.filter(
        (res) => res.is_dataroom_disclaimer_default == true
      );

      if(this.defaultdisclaimer.length==0){
        this.overview.show_multiple_times_disclaimer = false;
      }
  

      console.log("defaultdisclaimer",this.defaultdisclaimer)
      this.all_dataroom_disclaimers = res;
    });
  }

  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  download_dataroom_disclaimer(disclaimer) {
    console.log(disclaimer.id);
    this.dataRoomService
      .download_dataroom_disclaimer(disclaimer.id)
      .subscribe((res) => {
        console.log("download dataroom disclaimer 1");
        var blob = new Blob([res], { type: "blob" });
        var url = window.URL.createObjectURL(blob); // <-- work with blob directly
        // create hidden dom element (so it works in all browsers)
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);

        // create file, attach to hidden element and open hidden element
        a.href = url;
        a.download = disclaimer.dataroom_disclaimer_name;
        a.click();
        return url;
        // this.downloadFile(res);
        //
      });
  }

  goToSignedDisclaimer() {
    this.route.params.subscribe((params) => {
      console.log("dataroom id is--- call from overview compomemt");
      console.log(params.dataroomId);
      if (typeof params.dataroomId === "undefined") {
        // this.dataroomId = (localStorage.getItem("currentDataroomId")).toString();
        this.router.navigate(["../signed-disclaimer"]);
      } else {
        this.router.navigate(["../../signed-disclaimer"]);
      }
    });
  }

  // downloadFile(data: Response) {
  //   var blob = new Blob([data], { type: "blob" });
  //   var url = window.URL.createObjectURL(blob);
  //   window.open(url);
  // }

  is_dataroom_disclaimer_default: boolean = false;
  make_default_dataroom_disclaimer(disclaimer_id) {
    this.dataRoomService
      .make_default_dataroom_disclaimer(disclaimer_id)
      .subscribe((res) => {
        if (res.is_dataroom_disclaimer_default) {
          this.is_dataroom_disclaimer_default = true;
          this.msg = "Dislaimer successfully changed";
          this.showSuccess();
          this.getAllDisclaimer();
        } else {
          this.is_dataroom_disclaimer_default = false;
        }
      });
  }

  // delete dataroom disclaimer
  delete_dataroom_disclaimer(disclaimer_id, i) {
    this.dataRoomService
      .delete_dataroom_disclaimer(disclaimer_id)
      .subscribe((res) => {
        console.log("delete dataroom disclaimer");
        this.all_dataroom_disclaimers.splice(i, 1);
        this.msg = "Disclaimer deleted successfully.";
        this.showSuccess();
      });
  }
  file_size: any;
  // handle file input
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(files[0].size, this.fileToUpload, "Disclaimer file");
    this.file_size = files[0].size;
    //check file is valid
    if (!this.validateFile(this.fileToUpload.name)) {
      console.log("Selected file format is not supported");
      alert("Selected file format is not supported");
      return false;
    }
    this.uploadFileToActivity();
  }

  // upload validator

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf(".") + 1);
    if (ext.toLowerCase() == "pdf") {
      return true;
    } else if (ext.toLowerCase() == "doc") {
      return true;
    } else {
      return false;
    }
  }

  // upload disclaimer
  uploadFileToActivity() {
    this.dataRoomService
      .uploadDisclaimer(this.fileToUpload, this.dataroomId, this.file_size)
      .subscribe(
        (data) => {
          console.log("File is successfully added");
          this.msg = "Disclaimer added successfully.";
          this.showSuccess();
          this.getAllDisclaimer();

          // do something, if upload success
          // this.all_dataroom_disclaimers.push(data.data);
          console.log("data is ", data.data);
        },
        (error) => {
          console.log(error);
          this.msg = "Error in uploading File";
          this.showError();
        }
      );
  }

  onUploadOutput(output: UploadOutput): void {
    console.log(output.type);
    if (output.type === "allAddedToQueue") {
      if (this.files.length > 0) {
        if (this.files[0]["name"].indexOf(".pdf") != -1) {
          this.file_size = this.files[0].size;
          this.startUpload();
        } else {
          this.msg = "Please upload pdf file only.";
          this.showError();
        }
      }
      this.getAllDisclaimer();
    } else if (
      output.type === "addedToQueue" &&
      typeof output.file !== "undefined"
    ) {
      this.files.push(output.file);
    } else if (
      output.type === "uploading" &&
      typeof output.file !== "undefined"
    ) {
      const index = this.files.findIndex(
        (file) =>
          typeof output.file !== "undefined" && file.id === output.file.id
      );
      this.files[index] = output.file;
    } else if (output.type === "removed") {
      this.files = this.files.filter(
        (file: UploadFile) => file !== output.file
      );
    } else if (output.type === "dragOver") {
      this.dragOver = true;
    } else if (output.type === "dragOut") {
      this.dragOver = false;
    } else if (output.type === "drop") {
      this.dragOver = false;
    } else if (
      output.type === "rejected" &&
      typeof output.file !== "undefined"
    ) {
      console.log(output.file.name + " rejected");
    }
    this.files = this.files.filter(
      (file) => file.progress.status !== UploadStatus.Done
    );
  }

  startUpload(): void {
    const formData: FormData = new FormData();

    formData.append("file_size", this.file_size);
    let token = "token " +localStorage.getItem("token");
    const event: UploadInput = {
      type: "uploadAll",
      url:
        this.baseUrlClass.baseUrl +
        this.apiListClass.add_new_dataroom_disclaimer +
        this.dataroomId +
        '/',
      method: "POST",
      data: { file_size: this.file_size },
      headers: { Authorization: token },
      // data: { dataroomId: this.dataroomId }
    };

    this.uploadInput.emit(event);
    this.msg = "Disclaimer added successfully.";
    this.showSuccess();
    this.getAllDisclaimer();
    // this.router.navigate(['/documents']);
  }

  goToDislaimers(disclaimer) {
    localStorage.setItem("is_view_disclaimer", "ok")
   
    sessionStorage.setItem('is_disclaimer_available', JSON.stringify(true));
    window.open("/#/disclaimer-popup/" + disclaimer);
  }

  getAllTimeDisclaimer(event) {
    //
    var defaults = this.all_dataroom_disclaimers.filter(
      (res) => res.is_dataroom_disclaimer_default === true
    );
    if (defaults.length > 0) {
      this.overview.show_multiple_times_disclaimer = event;
      this.overview.dataroomId = this.dataroomId;
      this.dataRoomService
        .update_multiple_disclaime_overview(this.overview)
        .subscribe((res) => {
          if (res.show_multiple_times_disclaimer == false) {
            this.msg = "Single time Disclaimer shown Succesfully!";
            this.showSuccess();
          } else {
            this.msg = "Multiple times Disclaimer shown Succesfully!";
            this.showSuccess();
          }
        });
    } else {
      this.msg = "Make Sure you have default disclaimer!!";
      this.showError();
    }
  }
}
