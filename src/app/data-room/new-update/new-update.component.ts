import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-new-update",
  templateUrl: "./new-update.component.html",
  styleUrls: ["./new-update.component.css"],
})
export class NewUpdateComponent implements OnInit {
  is_upload_file: any;
  dataroom_user_list: any;
  dataroom_user: any = [];
  dataroom_groups: any;
  msg: string;
  file_attached: string;
  file: any;
  // is_updated: number;
  // is_deleted: number;
  dataroomId: number;
  mem_list: boolean = true;
  group_list: boolean = true;
  check_mem_button: string;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private baseUrlClass: BaseUrlClass,
    private apiListClass: ApiListClass,
    private dataRoomService: DataRoomService,
    private cookieService:CookieService,
    private route: ActivatedRoute
  ) {
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));

    if (this.route.snapshot.params.fid) {
      this.update.file = this.route.snapshot.params.fid;
      this.show_file = true;
    }
  }

  ngOnInit() {
    this.getDataroomUser();
    this.getDataroomUserList();
    this.getDataroomGroupList();
    if (this.route.snapshot.params.fid) {
      this.getFilesList();
    }
  }

  show_file: boolean = false;

  files: any;
  getFilesList() {
    this.dataRoomService.getFilesList(this.dataroomId).subscribe((res) => {
      this.files = res;
      console.log(this.files)
      for (let file in this.files) {
        if (this.files[file].id == this.update.file) {
          this.fileName = this.files[file].name
          console.log(this.fileName)
        }
      }
    });
  }

  fileList;
  getFilesOnSearch(event) {
    this.dataRoomService.getFilesOnSearch(this.dataroomId, event.target.value).subscribe((res) => {
      console.log(res, "search response");
      this.fileList = res;
    });
  }

  fileName;
  getFileName(value) {
    console.log(value)
    this.fileName = value.name
    this.update.file = value.id
  }

  getDataroomUser() {
    this.dataRoomService.categories_list(this.dataroomId).subscribe((res) => {
      this.dataroom_user_list = res; //JSON.parse(res.folder_data);
      this.checkMemButton("group_list");
    });
  }

  getDataroomUserList() {
    this.dataRoomService
      .getDataroomMembers(this.dataroomId)
      .subscribe((res) => {
        let response = res; //JSON.parse(res.folder_data);
        for (let i = 0; i < response.length; i++) {
          console.log(response[i])
          this.dataroom_user.push(response[i])
        }
        console.log(
          "dataroom_user:-",
          res.memberactivestatus,
          this.dataroom_user
        );
      });
  }

  getDataroomGroupList() {
    this.dataRoomService
      .dataroom_group_list(this.dataroomId)
      .subscribe((res) => {
        this.dataroom_groups = res; //JSON.parse(res.folder_data);
        console.log("dataroom_groups:-", this.dataroom_groups);
      });
  }

  // Check mem Button Status
  checkMemButton(check_mem_button) {
    // this.mem_list = true;
    // if(item.type == 2){
    if (check_mem_button == "mem_list") {
      this.mem_list = true;
      this.group_list = false;
      // this.newUpdate();
    }

    if (check_mem_button == "group_list") {
      this.mem_list = false;
      this.group_list = true;
      // this.newUpdate();
    }
  }

  update: any = {
    message: "",
    subject: "",
    categories: "",
    member: "",
    send_update_email: true,
    file: "",
  };

  update_group: any = {
    message: "",
    subject: "",
    categories: "",
    member: "",
    send_update_email: true,
  };

  fileInput(event) {
    const fileSelected: File = event.target.files[0];
    this.file = fileSelected;
    this.file_attached = "File attached";
    // this.myFileUploadService.uploadFile(fileSelected)
    // .subscribe( (response) => {
    //    console.log('set any success actions...');
    //    return response;
    //  }.
    //   (error) => {
    //     console.log('set any error actions...');
    //   });
  }

  goToUpdateDocListPage() {
    console.log("Doneeeeeeee:--------------");
    this.router.navigate(["update-doc"]);
  }

  event: any;
  error_subject: boolean = false;
  error_message: boolean = false;
  newUpdate() {
    console.log("Hello Friends:----------", this.update.member);
    if (this.update.member == "") {
      this.msg = "Please select a group or member to create an update.";
      this.showError();
    }else{
      this.dataRoomService
      .newUpdate(this.update, this.dataroomId)
      .subscribe((res) => {
        console.log("updates:-", this.update, res);
        if (this.update.subject === "") {
          this.error_subject = true;
        } else {
          this.error_subject = false;
        }
        if (this.update.message === "") {
          this.error_message = true;
        } else {
          this.error_message = false;
        }

        if (res !== undefined) {
          // call here update list page
          this.goToUpdateDocListPage();
          this.update = {
            message: "",
            subject: "",
            send_update_email: true,

            categories: "",
            member: "",
          };

          this.msg = "New Update sent successfully.";
          this.showSuccess();
        }
      });
    }

  }

  showSuccess() {
    console.log("dog:-", this.msg);
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  showInfo() {
    this.toastr.info(this.msg);
  }
}
