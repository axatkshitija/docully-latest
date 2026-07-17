import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { DataRoomService } from "../../services/index";
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
} from "ngx-uploader";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { Editor, toDoc, toHTML, Toolbar } from "ngx-editor";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class OverviewComponent implements OnInit, OnDestroy {
  is_disclaimer_available: boolean = false;
  dataroomId: any = "";
  dataroom_detail: any;
  msg: any;
  ifDataroomVideoExist: boolean = false;
  overviewForm: any;
  overview_headings: any[] = [];
  overview_links: any[] = [];
  areControlsEnabled: boolean = true;
  editor: Editor;
  html = '';
  _base_url: string = "";
  toolbar: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['blockquote',],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear'],
  ];
  editorConfig = {
    editable: true,
  };
  userr: boolean;
  useer: boolean;
  commondetail: any;
  sentOtp: string;
  dataroom_overview_head: any;

  constructor(
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private baseUrlClass: BaseUrlClass,
  ) {
    this.route.params.subscribe((params) => {
      console.log("dataroom id is--- call from overview compomemt");
      console.log(params.dataroomId);
      if (typeof params.dataroomId === "undefined") {
        this.dataroomId = localStorage.getItem("currentDataroomId").toString();
      } else {
        this.dataroomId = params.dataroomId.toString();
        localStorage.setItem("currentDataroomId", this.dataroomId)

      }
    });
    this.getFeatures(this.dataroomId);
    this._base_url = this.baseUrlClass.baseUrl;
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;

    let disclaimer = sessionStorage.getItem('is_disclaimer_available');
    this.is_disclaimer_available = JSON.parse(disclaimer);
    sessionStorage.removeItem('is_disclaimer_available');
  }

  deleteDataroom(dataroom_detail) {
    this.is_disclaimer_available = false;
    this.dataRoomService
      .deleteSingleDataroom(dataroom_detail.id)
      .subscribe((res) => {
        console.log(res, "deleteDataroom");
        this.getSingleDataroom(dataroom_detail.id);
        if (this.dataroom_detail.is_request_for_deletion) {
          this.msg = " Dataroom Cancel delete request successfully send !";
        } else {
          this.msg =
            "Your request to delete the data room has been sent successfully to the support team. You will receive an email confirmation once it is processed successfully.";
        }

        this.showSuccess();
      });
  }

  archiveDataroom() {
    this.dataRoomService.archiveDataroom(this.dataroomId).subscribe((res) => {
      console.log("Archive dataroom", res);

      this.msg =
        "Your request to archive the data room has been sent successfully to the support team. You will recieve an email confirmation once it is processed successfully.";
      this.showSuccess();
    });
  }
  blocks: { title: string; content: any; editor: Editor }[] = [];

  ngOnInit() {
    this.editor = new Editor();
    this.getSingleDataroomOverviewDetail();
    this.Check2fa();
    this.getUserInfo();
    this.getAllDisclaimers();
   // this.addBlock();
  }



  addBlock(title: string = '', html: string = '') {
    const editor = new Editor();
    const doc = toDoc(html); // Convert HTML to ProseMirror JSON
  
    editor.setContent(doc); // Set editor content
  
    const block = {
      title,
      content: doc,
      editor
    };
  
    this.blocks.push(block);
  
    const index = this.blocks.length - 1;
  
    editor.valueChanges.subscribe(value => {
      this.blocks[index].content = value;
      this.onChange();
    });
  }

  onTitleChange(index: number, value: string): void {
    this.blocks[index].title = value;
    this.onChange();
  }

  onChange(): void {
    const formatted = this.blocks.map(block => ({
      overview_heading: block.title,
      overview_content: toHTML(block.content)
    }));

    this.overviewForm.dataroom_overview_heading = formatted;
    console.log('Current data:', formatted);
  }

  removeBlock(index: number): void {
    this.blocks[index].editor.destroy();
    this.blocks.splice(index, 1);
    this.onChange();
  }

  ngOnDestroy(): void {
    this.blocks.forEach(b => b.editor.destroy());
  }

  all_disclaimers: boolean = false;
  getAllDisclaimers() {
    this.useer = true;
    this.dataRoomService.getAllDisclaimers(this.dataroomId).subscribe((res) => {


      var disclaimers = res.filter(
        (res) => res.is_dataroom_disclaimer_default === true
      );

      if (disclaimers.length > 0) {
        this.all_disclaimers = false;
      } else {
        this.all_disclaimers = true;
      }
    });
  }

  getSingleDataroom(dataroomId) {
    this.dataRoomService.getSingleDataroom(dataroomId).subscribe((res) => {
      this.dataroom_detail = res;
      console.log(this.dataroom_detail, "getSingleDataroom");
    });
  }


  Check2fa() {
    this.dataRoomService
      .check_2fa_permission(this.dataroomId)
      .subscribe((res) => {
        this.overviewForm.permissiom = res;
      })
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


  getSingleDataroomOverviewDetail() {
    let data = { dataroomId: this.dataroomId };
    this.dataRoomService.get_single_dataroom_overview(data).subscribe((res) => {
      console.log(res);
      this.cleansed_data_overview_data(res);
    });
  }

  addNewLinks() {
    let links = {
      link_title: "",
      link: "",
    };
    if (this.overviewForm.dataroom_custom_links == null) {
      this.overviewForm.dataroom_custom_links = [];
    }
    this.overviewForm.dataroom_custom_links.push(links);
  }

  addNewParagraph() {
    let paragraphs = {
      overview_heading: "",
      overview_content: "",
    };
    if (this.overviewForm.dataroom_overview_heading == null) {
     this.overviewForm.dataroom_overview_heading = [];
      this.overviewForm.dataroom_overview_heading.push(paragraphs);
      console.log("para");
    } else {
      this.overviewForm.dataroom_overview_heading.push(paragraphs);
      console.log(this.overviewForm.dataroom_overview_heading, "para");
    }
  }

  getHtmlContent(htmlContent) {
    console.log("Html content is", htmlContent);
  }

  deleteParagraph(paragraph) {
    console.log("paragraph index is ", paragraph);
    const index = this.overviewForm.dataroom_overview_heading.indexOf(
      paragraph
    );
    this.overviewForm.dataroom_overview_heading.splice(index, 1);
  }

  deleteLink(link) {
    console.log("link index is ", link);
    const index = this.overviewForm.dataroom_custom_links.indexOf(link);
    this.overviewForm.dataroom_custom_links.splice(index, 1);
  }

  deletionRequestForDataroom(data) {
    this.dataRoomService
      .deletionRequestForDataroom(data.id)
      .subscribe((res) => {
        this.msg = "Dataroom deletion request successfully send !";
        this.dataroom_detail.is_request_for_deletion = true;
        this.showSuccess();
      });
  }

  archivedRequestForDataroom(dataroom) {
    this.is_disclaimer_available = false;

    console.log("Archived requets for dataroom ", dataroom.id);
    this.dataRoomService
      .archivedRequestForDataroom(dataroom.id)
      .subscribe((res) => {
        console.log("Archived requets ", res);
        this.getSingleDataroom(dataroom.id);
        this.dataroom_detail.is_request_for_archive =
          res.is_request_for_archive;
        if (res.is_request_for_archive) {
          this.msg = "Dataroom archive request successfully send !";
        } else {
          this.msg = " Dataroom Cancel archive request successfully send !";
        }
        this.showSuccess();
      });
  }



  OverviewFormSubmit() {
    console.log("onsubmit form");
    console.log("overviewForm", this.overviewForm);
    this.dataRoomService
      .update_dataroom_overview_setting(this.overviewForm, this.dataroomId)
      .subscribe((res) => {
        //alert(res);
        console.log(this.overviewForm, "Rest");
        //    this.cleansed_data_overview_data(res);
        this.msg = "Dataroom overview information successfully saved !";
        this.showSuccess();
      });

    let data = {
      type: 'dataroom',
      id: this.dataroomId,
      flag: this.overviewForm.send_daily_email_updates
    }
    this.dataRoomService.handleNotificationStatus(data).subscribe(res => {
      console.log(res);
    })

    let per = {
      perm_obj: this.overviewForm.permissiom
    }

    this.dataRoomService.set_2fa_permission(this.dataroomId, per).subscribe(res => {
      console.log(res);
    })
  }



  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  openInNewTab(link) {
    let url: string = "";
    if (!/^http[s]?:\/\//.test(link)) {
      url += "https://";
    }

    url += link;
    window.open(url, "_blank");
  }

  // file upload code

  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  validateFile(name: any) {
    let bytes = name;
    if (bytes === 0) {
      return "0 Byte";
    }
    var k = 1024;
    var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    var filesize = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    if (filesize <= 100) {
      return true;
      //return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    } else {
      return false;
    }
  }

  // calcualte file size

  // hide_file_upload_progress : boolean = true;
  onUploadOutput(output: UploadOutput): any {
    if (output.type === "allAddedToQueue") {
      // when all files added in queue

      // put fil limit validation here

      console.log("Human size bytes", this.humanizeBytes);
      var size = this.files[0].size;

      if (!this.validateFile(size)) {
        console.log("Selected file format is not supported");
        // this.hide_file_upload_progress = false;
        alert("Selected file size is greater than 100 Mb.");
        this.files = [];
        return false;
      } else {
        // this.hide_file_upload_progress = true;
        this.startUpload();
        console.log("files are ", this.files[0]);
        if (this.files[0].responseStatus === 200) {
          console.log("router url is ", this.router.url);
          this.router.navigate([this.router.url]);
          this.msg = this.files[0].response.msg;
          this.showSuccess();
        } else {
          console.log("cleansed dataroom data");
        }
      }
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
  }

  startUpload(): void {
    let token = "token " + localStorage.getItem("token"); // <----  get token
    console.log("token is", token);
    console.log(
      "base url is",
      this._base_url + "upload_dataroom_overview_video/"
    );
    const event: UploadInput = {
      type: "uploadFile",
      url: this._base_url + "/upload_dataroom_overview_video/",
      method: "POST",
      headers: { Authorization: token }, // <----  set headers
      data: { dataroom_id: this.dataroomId },
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

  backOverview() {
    this.is_disclaimer_available = false;
    console.log(this.is_disclaimer_available)
  }

  show_data: boolean;
  perm: any;
  gotoURl() {
    //this.dataRoomService.getMembersPermission(dataroomId).subscribe((res) => {

    if (this.perm == undefined || this.perm == null) {
      this.dataRoomService.getMembersPermission(this.dataroomId).subscribe((res) => {
        this.perm = res;
        if (this.perm.is_overview) {
          this.show_data = true;
        } else {
          this.show_data = false;
        }

        console.log("permnull")
      })
    } else if (this.perm.is_overview) {
      this.show_data = true;
    } else {
      this.show_data = false;
    }

  }

  removeOverviewVideo() {
    this.dataRoomService
      .removeDataroomOverviewvideo(this.dataroomId)
      .subscribe((res) => {
        console.log("Overview video succeessfully deleted");

        this.msg = res.msg;
        this.cleansed_data_overview_data(res.data);
        this.showSuccess();
        this.files = [];
      });
  }
  auth: any;
  cleansed_data_overview_data(res) {
    let dataroom_overview_heading: any[];
    let dataroom_custom_links: any[];
    let change_video_ppt: string = "";
    this.overviewForm = res;

    this.overviewForm.dataroom_overview_heading.forEach(item => {
      this.addBlock(item.overview_heading, item.overview_content);
    });

    if (typeof res.dataroom_custom_links === "string") {
      dataroom_custom_links = JSON.parse(res.dataroom_custom_links);
      dataroom_overview_heading = JSON.parse(res.dataroom_overview_heading);
      this.dataroom_overview_head = dataroom_overview_heading
      console.log("get single dataroom", dataroom_overview_heading);
    } else {
      dataroom_custom_links = res.dataroom_custom_links;
      dataroom_overview_heading = res.dataroom_overview_heading;
      this.dataroom_overview_head = dataroom_overview_heading
      console.log(res.dataroom_overview_heading, "Overview Data Room");
    }

    this.overviewForm.dataroom_custom_links = dataroom_custom_links;
    this.overviewForm.dataroom_overview_heading = dataroom_overview_heading;
    console.log("dataroom_custom_links", typeof res.dataroom_custom_links);
    if (this.overviewForm.change_video_ppt === null) {
      change_video_ppt = "";
      console.log("this overview form");
    } else {
      // this.auth =
      //   "?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=4000-07-18T16:31:37Z&st=2020-07-18T08:31:37Z&spr=https&sig=aylrk2bVvDPXRyuw71YXS6fzG7chArJF%2F%2FYrX1lYrrE%3D";
      console.log(
        "change vidoe ppt",
        (res.change_video_ppt + this.auth).replace("//media/", "/media/")
      );
      change_video_ppt = (res.change_video_ppt).replace(
        "//media/",
        "/media/"
      );
    }

    this.overviewForm.change_video_ppt = change_video_ppt;

    //this.showSuccess();
  }

  // show disclaimer page
  showDisclaimerPage(is_disclaimer = true) {
    this.is_disclaimer_available = is_disclaimer;
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

  user: any;
  user_id: number;
  getUserInfo() {
    // this.dataRoomService
    //   .getUserProfileDatroom(this.dataroomId)
    //   .subscribe((res) => {

    //     this.user = res;
    //     console.log(res, "user info");
    //     this.user_id = res.id;
    //     this.getDataroomUser();
    //   });
  }


  receiveAutoMsgHandler(p) {
    this.user = p.userdetail;
    this.dataroom_detail = p.singledataroom;
    console.log(this.user, "overview");
    console.log(p, "overview???????????????????????????????/");
    this.user_id = p.userdetail.id;
    this.getDataroomUser();
    this.perm = p.memberpermission;
    this.commondetail = p;
    this.gotoURl();
  }



  primary_users_disclaimer_status: any;
  getDataroomUser() {
    this.dataRoomService
      .dataroom_mem_list(this.dataroomId, this.user_id)
      .subscribe((res) => {
        console.log(res[0], "member list");
        this.primary_users_disclaimer_status = res[0].disclaimer_status;
      });
  }
}

export class OverviewModel {
  send_daily_email_updates: boolean = false;
  choose_overview_default_page: boolean = false;
  hide_file_indexing: boolean = false;
  dataroom_overview_heading: any = [
    {
      id: 1,
      overview_heading: "",
      overview_content: "",
    },
  ];
  overview_links: any = [
    {
      id: 1,
      link_title: "",
      link: "",
    },
  ];
}