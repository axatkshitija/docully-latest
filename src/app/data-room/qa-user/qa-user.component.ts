import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { ToastrService } from "ngx-toastr";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { Router, ActivatedRoute } from "@angular/router";
import { TimezoneService } from "../../services/timezone.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-qa-user",
  templateUrl: "./qa-user.component.html",
  styleUrls: ["./qa-user.component.css"],
})
export class QaUserComponent implements OnInit {
  dataroomId: any;
  msg: string = "";
  timezone: any;
  data2: boolean = false;
  baseUrl: any = "";
  usertimezone: string;
  token: any = "";
  constructor(
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private timeZone: TimezoneService,
    public baseUrlclass: BaseUrlClass,
    private router: Router,
    private cookieService: CookieService,
  ) {
    this.token = localStorage.getItem("token");
    this.dataroomId = localStorage.getItem("currentDataroomId");
    this.baseUrl = this.baseUrlclass.baseUrl;
    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    this.getFeatures(this.dataroomId);
    this.getAllQuestions(false);
    this.categoriesList();
    this.getUserInfo();
    this.getCategoryUserInfo();
    this.getAllDisclaimers();
    this.QNAAnalytics();
    this.getAllFAQ(false);
    this.usertimezone = localStorage.getItem("currentUser")
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  analytics;
  QNAAnalytics() {
    this.dataRoomService.QNAAnalytics(this.dataroomId).subscribe((res) => {
      this.analytics = res;
      console.log(this.analytics, "QNAAnalytics");
    });
  }

  showFaq() {
    this.router.navigate(["/faq"]);
  }


  manageCategories() {
    this.router.navigate(["/manage-categories"]);
  }



  goToViewerPage(folder) {
    console.log("folder id is", folder);
    let token = localStorage.getItem("token");
    document.cookie = "token=" + token;

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

  user: any;
  user_id: number;
  getUserInfo() {
    this.dataRoomService
      .getUserProfileDatroom(this.dataroomId)
      .subscribe((res) => {
        this.user = res;
        this.user_id = res.id;
        this.getDataroomUser();
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

  data: any = [];
  dataSize: any = undefined;
  show_faq: boolean = false;
  count_faq: number = 0;
  getAllFAQ(is_faq) {
    this.show_faq = true;

    if (is_faq) {
      this.show_faq = false;
    }

    this.dataRoomService.GetFaq(this.dataroomId).subscribe((res) => {
      this.count_faq = res.size;

      console.log(res, "Faq test");
    });
  }

  getAllQuestions(is_faq) {
    this.show_faq = true;

    if (is_faq) {
      this.show_faq = false;
    }

    this.dataRoomService.GetQna(this.dataroomId).subscribe((res) => {
      const newdata = res.data;
      this.data = newdata.map((obj, i) => ({ ...obj, updated_date: obj.updated_date + '+04:00' }));
      this.dataSize = res.size;
      this.data2 = true;
      console.log(this.data, "Qna");
      this.user;
      this.category_user;
    });
  }

  data1: any[] = [];
  categories_list: any;
  categoriesList() {
    this.dataRoomService.categories_list(this.dataroomId).subscribe((res) => {
      this.categories_list = res.filter(
        (res) => res.dataroom_id == parseInt(this.dataroomId)
      );
      console.log(this.categories_list, "category list");

      this.categories_list.forEach((res) => {
        this.data1.push({ categories: res.id, user: null, category: true });
      });
    });
  }




  submitQandA() {
    console.log(this.qanda);
    this.dataRoomService.CreateQuestion(this.dataroomId, this.qanda).subscribe((res) => {
      console.log(res);
      this.msg = "Question submitted successfully";
      this.showSuccess();
      this.getAllQuestions(false);
    });
  }


  update: any[] = [];
  qanda: any = [];
  restrictSave: boolean = false;
  onChange(value) {
    console.log(value);
    if (value != undefined && value != "") {
      console.log(34334);
      this.restrictSave = true;
    } else {
      this.restrictSave = false;
    }
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

  primary_users_disclaimer_status: any;
  getDataroomUser() {
    this.dataRoomService
      .dataroom_mem_list(this.dataroomId, this.user_id)
      .subscribe((res) => {
        this.primary_users_disclaimer_status = res[0];
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

  assigned: boolean = false;
  replied: boolean = false;
  Categorieschanged(event, i) {
    var checked = event.target.checked;
    var value = event.target.value;

    if (i == undefined && checked == true) {
      if (value == "-1") {
        this.replied = false;
        this.assigned = true;
        this.categories_list.forEach((res) => {
          res.checked = false;
        });
      } else if (value === "0") {
        this.replied = true;
        this.assigned = false;
        this.categories_list.forEach((res) => {
          res.checked = false;
        });
      }
      this.dataRoomService
        .QNAFilterView(this.dataroomId, value)
        .subscribe((res) => {
          this.data = res;
        });
    } else if (i == undefined && checked == false) {
      this.getAllQuestions(false);
    } else if (checked == true) {
      this.categories_list.forEach((res) => {
        res.checked = false;
      });
      this.categories_list[i].checked = true;
      this.replied = false;
      this.assigned = false;
      this.dataRoomService
        .QNAFilterView(this.dataroomId, value)
        .subscribe((res) => {
          this.data = res;
        });
    } else {
      this.getAllQuestions(false);
    }
  }
}
