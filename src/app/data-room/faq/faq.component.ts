import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { ToastrService } from "ngx-toastr";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { Location } from "@angular/common";
import { TimezoneService } from "../../services/timezone.service";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.css"],
})
export class FaqComponent implements OnInit {
  [x: string]: any;
  dataroomId: any;
  msg: string = "";
  baseUrl: any = "";
  timezone: any;
  deleteForm: FormGroup;
  faqForm: any;
  data2: boolean = false;
  token: any = '';
  question_data: any = {
    id: null,
    question: "",
    file_flag: true,
    answer: "",
    qna: "",
    folder: { id: null },
  };

  question_data1: any = {
    id: null,
    question: "",
    file_flag: true,
    answer: "",
    qna: "",
    folder: { id: null },
  };

  constructor(
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private timeZone: TimezoneService,
    public baseUrlclass: BaseUrlClass,
    private _location: Location,
    private router: Router,
  ) {

    this.token = localStorage.getItem("token");
    this.dataroomId = localStorage.getItem("currentDataroomId");
    this.baseUrl = this.baseUrlclass.baseUrl;
    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    this.getAllQuestions(false);
    this.categoriesList();
    this.getFeatures(this.dataroomId);
    this.getCategoryUserInfo();
    this.QNAAnalytics();
    this.getAllDisclaimers();
    this.getAllFAQ(false);
    this.getFilesList();
    this.initializeDeleteForm();
    this.faqForm = new FormGroup({
      question: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      answer: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      dataroom_file: new FormControl("", [
        Validators.minLength(1),
      ]),
    });
    this.usertimezone = localStorage.getItem("currentUser")
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }
  fileid: any;
  filename: any;
  onVoteFileChange(file, f1) {
    //this.fileid = this.vote.file;
    this.question_data.folder.id = file.target.value;
    console.log(file.target.value, "file id");
  }
  show_file: boolean = false;
  files: any;
  file_id: any;
  getFilesList() {
    this.dataRoomService.getFilesList(this.dataroomId).subscribe((res) => {
      this.files = res;
      this.file_id = res.id;

      console.log(this.files, "voting dataroom");
    });
  }

  fileList;
  getFilesOnSearch(event) {
    this.dataRoomService.getFilesOnSearch(this.dataroomId, event.target.value).subscribe((res) => {
      console.log(res, "search response");
      this.fileList = res;
    });
  }

  folderName;
  getFileName(value) {
    console.log(value)
    this.folderName = value.name
    this.question_data.folder.id = value.id
    console.log(this.question_data)
  }

  file_data: any;
  itemChange(file: any, detail) {
    this.file_data = file.target.value;
  }

  test2(detail) {
    console.log(this.file_data, "data test");
    this.question_data = {
      id: detail.id,
      user: detail.user,
      dataroom: detail.dataroom,
      question: detail.question,
      answer: detail.answer,
      status: detail.status,
      final: detail.final,
      file_flag: detail.file_flag,
      qna: detail.qna,
      folder: {
        id: this.file_data !== undefined ? this.file_data : detail.folder.id,
      },
      created_date: detail.created_date,
      updated_date: detail.updated_date,
      created_by: detail.created_by,
      updated_by: detail.updated_by,
      acc: detail.acc,
      is_faq: detail.is_faq,
    };
  }

  getAllQuestions(is_faq) {
    this.show_faq = true;

    if (is_faq) {
      this.show_faq = false;
    }

    this.dataRoomService.GetQna(this.dataroomId).subscribe((res) => {
      console.log(this.data, "Qna");
      // this.data = res;
      this.user;
      this.category_user;
    });
  }
  analytics;
  QNAAnalytics() {
    this.dataRoomService.QNAAnalytics(this.dataroomId).subscribe((res) => {
      this.analytics = res;
      console.log(this.analytics, "FAQ");
    });
  }

  category_user: any;
  getCategoryUserInfo() {
    this.dataRoomService
      .getCategoryUserProfile(this.dataroomId)
      .subscribe((res) => {
        this.category_user = res;
      });
  }

  data1: any[] = [];
  categories_list: any;
  categoriesList() {
    this.dataRoomService.categories_list(this.dataroomId).subscribe((res) => {
      // this.categories_list = res;
      this.categories_list = res.filter(
        (res) => res.dataroom_id == parseInt(this.dataroomId)
      );
      console.log(this.categories_list, "category list");

      this.categories_list.forEach((res) => {
        console.log(res.user, "response for category list", res);
        this.data.push({ categories: res.id, user: res.user, category: true });
        // console.log("check data",this.data)
        if (res.user.toString() == "") {
          this.data.pop();
        }
      });

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


  manageCategories() {
    this.router.navigate(["/manage-categories"]);
  }

  initializeDeleteForm() {
    this.deleteForm = new FormGroup({
      delete: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
  }

  goToViewerPage(folder) {
    console.log("folder id is", folder);
    let token = localStorage.getItem("token");
    document.cookie = "token=" + token;

  }

  user: any;
  user_id: number;
  getUserInfo() {
    this.dataRoomService
      .getUserProfileDatroom(this.dataroomId)
      .subscribe((res) => {
        this.user = res;
        console.log(this.user, "faq");
        this.user_id = res.id;
        this.getDataroomUser();
      });
  }

  receiveAutoMsgHandler(p) {
    this.user = p.userdetail;
    if (p == null) {
      this.getUserInfo();
    }
    console.log(this.user, "faq");
    this.user_id = p.userdetail.id;
    this.getDataroomUser();
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
    });
  }
  send_update(i) {
    this.dataRoomService.GetFaq(this.dataroomId).subscribe((res) => { });
  }
  data: any = [];
  show_faq: boolean = false;

  getAllFAQ(is_faq) {
    this.show_faq = true;

    if (is_faq) {
      this.show_faq = false;
    }

    this.dataRoomService.GetFaq(this.dataroomId).subscribe((res) => {
      const newdata = res.data;
      this.data = newdata.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00', updated_date: obj.updated_date + '+04:00' }));
      this.data2 = true;
      console.log(this.data, "Faq test");
    });
  }
  toggle: boolean = false;
  item: any;
  test(detail) {
    this.toggle = !this.toggle;
    this.question_data = {
      id: detail.id,
      user: detail.user,
      dataroom: detail.dataroom,
      question: detail.question,
      answer: detail.answer,
      status: detail.status,
      final: detail.final,
      file_flag: this.toggle,
      qna: detail.qna,
      folder: detail.folder,
      created_date: detail.created_date,
      updated_date: detail.updated_date,
      created_by: detail.created_by,
      updated_by: detail.updated_by,
      acc: detail.acc,
      is_faq: detail.is_faq,
    };

    console.log(this.question_data.file_flag, "file id");
  }
  test1(detail) {
    this.dataRoomService.GetFaq(this.dataroomId).subscribe((res) => {
      this.toggle = !this.toggle;
      this.question_data = {
        id: detail.id,
        user: detail.user,
        dataroom: detail.dataroom,
        question: detail.question,
        answer: detail.answer,
        status: detail.status,
        final: detail.final,
        file_flag: detail.file_flag,
        qna: detail.qna,
        folder: detail.folder,
        created_date: detail.created_date,
        updated_date: detail.updated_date,
        created_by: detail.created_by,
        updated_by: detail.updated_by,
        acc: detail.acc,
        is_faq: detail.is_faq,
      };
    });
    console.log(this.question_data.file_flag, "file id");
  }
  tim() {
    this.question_data = {
      id: null,
      question: "",
      file_flag: true,
      answer: "",
      qna: "",
      folder: { id: null },
    };
  }

  EditFaq(item) {
    console.log(item, "tes data");
    if (item.answer === "" || item.question === "") {
      this.msg = "Please add a question and an answer and then submit.";
      this.showError();
      return 0;
    }

    item["dataroom"] = this.dataroomId;
    item["user"] = this.user;
    this.test2(item);

    this.dataRoomService
      .postRequest(this.question_data, this.dataroomId)
      .subscribe((res) => {
        console.log(res);
        this.getAllFAQ(false);
        this.msg = "FAQ question updated successfully !";
        this.showSuccess();
      });
  }
  AddToFaq(item) {
    console.log(item, "question data");
    this.test1(item);

    if (item.answer === "" || item.question === "") {
      this.msg = "Please add a question and an answer and then submit.";
      this.showError();
      return 0;
    }
    item["dataroom"] = this.dataroomId;
    item["user"] = this.user;
    this.dataRoomService
      .postRequest(this.question_data, this.dataroomId)
      .subscribe((res) => {
        console.log(res);
        this.getAllFAQ(false);
        this.msg = "FAQ question updated successfully !";
        this.showSuccess();
      });
  }

  deleteFaq(item) {
    console.log(item);
    item.status = false;
    this.dataRoomService.postRequest(item, this.dataroomId).subscribe((res) => {
      console.log(res);
      this.data = res;
      this.msg = "FAQ question updated successfully !";
      this.showSuccess();
    });
  }

  update: any[] = [];

  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  showInfo() {
    this.toastr.info(this.msg);
  }

  primary_users_disclaimer_status: any;
  getDataroomUser() {
    this.dataRoomService
      .dataroom_mem_list(this.dataroomId, this.user_id)
      .subscribe((res) => {
        this.primary_users_disclaimer_status = res[0].disclaimer_status;
      });
  }
  geBack() {
    this._location.back();
  }
}
