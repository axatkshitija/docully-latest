import { Component, OnInit } from "@angular/core";
import { Chart } from "angular-highcharts";
import { ToastrService } from "ngx-toastr";
import { DataRoomService, SharedService } from "../../services/index";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";


@Component({
  selector: "app-document-right-side-menu",
  templateUrl: "./document-right-side-menu.component.html",
  styleUrls: ["./document-right-side-menu.component.css"],
  providers: [],
})
export class DocumentRightSideMenuComponent implements OnInit {
  dataroomId: any;
  from_date: any;
  to_date: any;
  dataroom_date: any;
  subscription: Subscription;
  show_spinner: boolean = true;
  message: any;
  constructor(
    private toastrService: ToastrService,
    private dataRoomService: DataRoomService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.dataroomId =localStorage.getItem("currentDataroomId").toString();
    this.subscription = this.sharedService.getMessage().subscribe((message) => {
      //
      this.message = message;
      this.get_dataroom_usage_details();
      if (this.message.text == "Refresh Documents!") {
        // this.get_dataroom_usage_details();
        this.getCountPages();
        this.getHierarchy();
      }
    });
    this.getFeatures(this.dataroomId);
  }
  options = {};

  ngOnInit() {
    //

    this.dataRoomService.getSingleDataroom(this.dataroomId).subscribe((res) => {
      this.dataroom_date = res.created_date.slice(0, 10);
      this.getDateWise();
      console.log(res, "res in document");
      console.log(this.dataroom_date, "in get_dataroom _res.created_date");
      // this.date = new Date().toISOString().slice(0,10)
    });

    // this.getCountPages();

    this.getUserInfo();
    this.show_spinner = true;
    // this.getHierarchy();
    // this.options = {};
  }

  user: any;
  getUserInfo() {
    this.dataRoomService
.getUserProfileDatroom(this.dataroomId)
      .subscribe((res) => {
        this.user = res;
      });
  }

  nodes: any;

  getHierarchy() {
    this.dataRoomService
      .getFoldersHierarchy(parseInt(this.dataroomId))
      .subscribe((res) => {
        this.nodes = res;
        console.log(this.nodes);
      });
  }

  filterFolders(i) {}

  chart: any;
  data: any[];

  get_dataroom_usage_details() {
    this.to_date= new Date();
    var year = this.to_date.getFullYear();
    var mes = this.to_date.getMonth() + 1;
    var dia = this.to_date.getDate();
    var todays =  year+ "-"  +  mes + "-"+dia ;
    var first =
      this.from_date.getFullYear() +
      "-" +
      this.from_date.getMonth() +
      "-" +
      this.from_date.getDate();
    console.log("first from getActivityUser documents", first);
    console.log("todays documents", todays);
    console.log("final date created", this.dataroom_date);
    console.log(typeof first);
    first = "2020-2-25";
    // this.from_date = "2020-5-25";
    // this.to_date = "2020-6-25";

    this.dataRoomService
      .get_dataroom_usage_details_for_graph(
        this.dataroomId,
        this.dataroom_date,
        todays
      )
      .subscribe((res) => {
        this.data = res;

        console.log(this.from_date, "in main from_date");
        console.log(this.to_date, "in main to_date");
        console.log("this.data doument-right-side ", this.data);
        // show chart data

        this.show_spinner = false;

        // this.chart = new Chart({
        //   chart: {
        //     plotBackgroundColor: null,
        //     plotBorderWidth: null,
        //     plotShadow: false,
        //     type: "pie",
        //   },
        //   title: {
        //     text: "",
        //   },
        //   tooltip: {
        //     pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
        //   },
        //   plotOptions: {
        //     pie: {
        //       allowPointSelect: true,
        //       cursor: "pointer",
        //       dataLabels: {
        //         enabled: false,
        //       },
        //       showInLegend: true,
        //     },
        //   },
        //   credits: {
        //     enabled: false,
        //   },
        //   series: [
        //     {
        //       name: "Usage(MB)",
        //       data: [
        //         {
        //           name: "Used(MB)",
        //           y: res.dataroom_consumed,
        //         },
        //         {
        //           name: "Free(MB)",
        //           y: res.dataroom_free,
        //         },
        //       ],
        //     },
        //   ],
        // });
      });
  }

  
  features: any;
  getFeatures(dataroomId) {
    this.dataRoomService.get_dataroom_features(dataroomId).subscribe((res) => {
      if (res[0] === undefined) {

        this.features = {
          auto_expire:true,
          bulk_users_upload:true,
          country_perm:true,
          custom_external_link:true,
          custom_logo:true,
          custom_watermarking:true,
          desktop_unlimit_upload:true,
          doculink_perm:true,
          dropbox_upload:true,
          email_to_dataroom_upload:true,
          favourites:true,
          google_drive_upload:true,
          id:2,
          la_admin_access:true,
          module_perm:true,
          one_drive_upload:true,
          proj_management:true,
          proj_overview:true,
          proj_updates:true,
          proj_video_intro:true,
          qa_submit:true,
          qa_with_cat:true,
          redaction:true,
          sharepoint_upload:true,
          two_factor_auth:true,
          voting_perm:true,
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

  count: any;
  getCountPages() {
    console.log('66666666666')
    this.to_date= new Date();
    var year = this.to_date.getFullYear();
    var mes = this.to_date.getMonth() + 1;
    var dia = this.to_date.getDate();
    var todays =  year+ "-"  +  mes + "-"+dia ;
    var first =
      this.from_date.getFullYear() +
      "-" +
      this.from_date.getMonth() +
      "-" +
      this.from_date.getDate();
    this.dataRoomService.getCountPages(this.dataroomId,first,todays).subscribe((res) => {
      this.count = res;
      console.log(this.count, "count pages");
      this.show_spinner = false;
    });
  }

  clickDocuments() {
    if (location.hash == "#/documents") {
      this.sharedService.sendMessage("Refresh Documents!", 1);
    } else {
      this.router.navigate(["/documents"]);
    }
  }
  // curr: any;
  curr: Date;
  currmonth;
  curryear;
  getDateWise() {
    this.curr = new Date(); // get current date
    // this.from_date = this.curr.getDate() - this.curr.getDay(); // First day is the day of the month - the day of the week
    this.currmonth = this.curr.getMonth();
    this.curryear = this.curr.getFullYear();
    this.currmonth = this.currmonth + 1;
    console.log("getdate1======>", this.curr.getDate());
    console.log("getmonth======>", this.curr.getMonth());
    // this.to_date = this.from_date + 6; // last day is the first day + 6
    this.from_date = new Date(
      this.curr.getFullYear(),
      this.curr.getMonth() - 1,
      this.curr.getDate()
    );
    this.to_date = new Date(
      this.curr.getFullYear(),
      this.curr.getMonth() + 1,
      this.curr.getDate()
    );
    console.log("in documents=====>", this.from_date);
    console.log("in documents2=====>", this.to_date);

    this.get_dataroom_usage_details();
  }
}
