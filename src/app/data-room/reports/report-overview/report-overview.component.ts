import { Component, Inject, OnInit } from "@angular/core";
import { DataRoomService } from "../../../services/dataroom_service";
import { Chart } from "angular-highcharts";
import { BaseUrlClass, ApiListClass } from "../../../common/index";
import * as moment from "moment";
import { TimezoneService } from "../../../services/timezone.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SpinnerVisibilityService } from "ng-http-loader";
import { DialogData } from "../../document/document.component";
import { CookieService } from "ngx-cookie-service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
@Component({
  selector: "app-report-overview",
  templateUrl: "./report-overview.component.html",
  styleUrls: ["./report-overview.component.css"],
})
export class ReportOverviewComponent implements OnInit {
  from_date: any;
  to_date: any;
  dataroomId: any;
  timezone: any;
  moment: any = moment;
  baseUrl: any;
  p: number = 1;
  p1: number = 1;
  activity: any;
  activitySize: any;
  d = new Date();
  selectedIndex: number = 0;
  tab: boolean = false;
  overview_tab: boolean = true;
  loop_upload: any;
  show_spinner: boolean = true;
  response: any;
  from_day: Date;
  loop_drm: any;
  tab1: boolean = false;
  months: any;
  user: any;
  user_id: number;
  primary_users_disclaimer_status: any;
  str_date: any;
  enddate: Date;
  max_day_value: number;
  enddatesate: any;
  str_date2: Date;
  usertimezone: string;
  token: any = '';

  constructor(
    private dataRoomService: DataRoomService,
    public baseUrlclass: BaseUrlClass,
    private timeZone: TimezoneService,
    private spinner: SpinnerVisibilityService,
    private router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.dataroomId = localStorage.getItem("currentDataroomId");
    this.baseUrl = this.baseUrlclass.baseUrl;
    this.timezone = this.timeZone.userTimeZone;
    this.token = localStorage.getItem("token");
  }


  charts: any;
  ngOnInit() {
    this.spinner.hide();
    console.log("usertime>>>>>>>>>>>>>>>>>>>>>>>>>>>",this.usertimezone)
    this.getAllDisclaimers();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  convertToIST(utcDate) {
    // UTC date string, e.g., '2024-10-30T09:00:00Z'
    return this.datePipe.transform(utcDate, 'yyyy-MM-dd hh:mm a',this.usertimezone['time_zone__offset']); // 'Asia/Kolkata' offset
  }


  receiveAutoMsgHandler(p) {
    this.user = p.userdetail;
    console.log("user>>>>>>>>>>>>>>>>",p.userdetail)
    this.dataroom_detail = p.singledataroom;
    console.log("this.dataroom_detail => ", this.dataroom_detail);

    console.log(this.current_date, "overview");
    console.log(p, "overview???????????????????????????????/");
    this.user_id = p.userdetail.id;
    this.perm = p.memberpermission;
    if (this.dataroom_detail == null || this.dataroom_detail == undefined) {
      this.getSingleDataroom(this.dataroomId);
    } else {
      this.getDataroomUser();
      this.getDateWise();
      const date_today = new Date();
      const today_ist = this.convertToIST(date_today);
      const today = new Date(today_ist)
      console.log('>>>>>>>>>>>>>.today', date_today , today)
      this.from_date = new Date(today);
      this.from_date.setDate(this.from_date.getDate() - 7);
      console.log(this.from_date, "from date changed");
      this.to_date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      this.changeDateWise(this.from_date, this.to_date)

      this.maxDate = new Date();
      this.minDate = new Date(this.dataroom_detail.created_date);
      console.log(this.minDate, this.maxDate)
    }

  }


  ViewerMoredrm(event) {
    this.selectedIndex = 1;
    this.tab1 = true;
    this.overview_tab = false;
    this.tab = false;
    this.dataRoomService.Viewbulk_files(event.id).subscribe((res) => {
      this.loop_drm = res.Files[0].files;
    });
  }


  ViewerMore(event) {
    this.selectedIndex = 1;
    this.tab = true;
    this.tab1 = false;
    this.overview_tab = false;
    this.dataRoomService.bulkupload_files_check(event.id).subscribe((res) => {
      this.loop_upload = res.bulksuccessdata;
    });
  }
  BackTab() {
    this.overview_tab = true;
    this.tab = false;
    this.tab1 = false;
  }






  getActivityUser(pageno) {
    this.show_spinner = true;
    this.p = pageno;
    var todays =
      new Date(this.to_date).getFullYear() +
      "-" +
      (new Date(this.to_date).getMonth() + 1) +
      "-" +
      (new Date(this.to_date).getDate());
    var first =
      new Date(this.from_date).getFullYear() +
      "-" +
      (new Date(this.from_date).getMonth() + 1) +
      "-" +
      (new Date(this.from_date).getDate());
    this.dataRoomService
      .getActivityDataroom(this.dataroomId, first, todays, this.p)
      .subscribe((res) => {
        this.show_spinner = false;
        res.data.map((obje) => {
          return obje;
        })
        const newdata = res.data;
        this.activity = newdata.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00' }));
        console.log('>>>>>>>>>>>>>>>>>>>>>time', this.activity);

        this.activitySize = res.size;
        console.log(this.activity, "User Overview");
      });
  }


  perm: any;

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


  getDataroomUser() {
    this.dataRoomService
      .dataroom_mem_list(this.dataroomId, this.user_id)
      .subscribe((res) => {
        this.primary_users_disclaimer_status = res[0];
      });
  }

  curr: any;
  fromdate: any;
  maxDate;
  minDate;
  getDateWise() {
    // console.log("getDateWise is called");
    var today = new Date();
    this.to_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    this.from_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
  }

  data: any;
  getCharts() {
    // alert("here chart is called");
    var todays = new Date(
      new Date(this.to_date).getFullYear() +
      "-" +
      ("0" + (new Date(this.to_date).getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + new Date(this.to_date).getDate()).slice(-2)
    );
    var first = new Date(
      new Date(this.from_date).getFullYear() +
      "-" +
      ("0" + (new Date(this.from_date).getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + new Date(this.from_date).getDate()).slice(-2)
    );

    this.dataRoomService
      .GetBarchartDataroomView(this.dataroomId, first, todays)
      .subscribe((res) => {
        this.spinner.hide();
        this.data = res;
        this.getBarChart();
      });
  }


  changeDateWise(from_date, to_date) {
    console.log('$$$$$$$$$', to_date)
    this.from_date = from_date;
    this.to_date = to_date;
    this.getActivityUser(this.p);
    this.getCharts();
    //this.test();
  }

  getBarChart() {
    // console.log("this chart is called");
    this.charts = new Chart({
      chart: {
        type: "column",
      },
      title: {
        text: "Dataroom Views",
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: this.data.dates_list,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: "Counts",
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: "Views",
          data: this.data?.dataroom_views,
          type: 'column'
        },
      ],
    });
  }

  ExportOverviewReportA(a, b) {
    this.finalData['statusid'] = this.oviewViewStatus;
    this.finalData['mohthscount'] = this.months;
    console.log("finalData=>", this.finalData)
    this.spinner.show();

    var todays =
      new Date(b).getFullYear() +
      "-" +
      (new Date(b).getMonth() + 1) +
      "-" +
      new Date(b).getDate();
    var first =
      new Date(a).getFullYear() +
      "-" +
      (new Date(a).getMonth() + 1) +
      "-" +
      new Date(a).getDate();

    // var dt = new Date(first);
    // dt.setDate( dt.getDate() - 7 );
    let sub = this.dataRoomService
      .ExportOverviewReport(
        this.dataroomId,
        first,
        todays,
        JSON.stringify(this.finalData)
      )
      .subscribe((res) => {
        this.response = res;
        this.spinner.hide();
      });


  }





  Downloadfun() {

    debugger
    this.str_date = new Date(this.from_date);
    this.str_date2 = new Date(this.from_date);
    this.enddate = new Date(this.to_date);
    this.enddatesate = new Date();
    let month = this.str_date.getMonth() + 1;
    const end_month = this.enddate.getMonth() + 1;
    let year = this.str_date.getFullYear();
    const end_year = this.enddate.getFullYear();
    const monthDiff = this.enddate.getMonth() - this.str_date.getMonth();
    const yearDiff = this.enddate.getFullYear() - this.str_date.getFullYear();
    this.months = (monthDiff + yearDiff * 12) + 1;


    for (let i = 0; i < this.months; i++) {
      month = new Date(this.str_date).getMonth() + 1;
      if (month != end_month) {
        console.log(">>>>>>>>>>>>>>mont != end_month", new Date(this.str_date), ">>>>>>>>>>>>>month", month);

        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
          this.enddatesate.setFullYear(year, month - 1, 31)
          this.ExportOverviewReportA(new Date(this.str_date), this.enddatesate);
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
          this.enddatesate.setFullYear(year, month - 1, 30);
          this.ExportOverviewReportA(new Date(this.str_date), this.enddatesate);
        } else if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
          this.enddatesate.setFullYear(year, month - 1, 29);
          this.ExportOverviewReportA(new Date(this.str_date), this.enddatesate)
        } else {
          this.enddatesate.setFullYear(year, month - 1, 28);
          this.ExportOverviewReportA(new Date(this.str_date), this.enddatesate);
        }

        this.str_date = this.enddatesate.setDate(this.enddatesate.getDate() + 1);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>start date", new Date(this.str_date));
        year = new Date(this.str_date).getFullYear();

      } else if (month == end_month && year != end_year) {

        console.log(">>>>>>>>>>>>>mont != end_month", new Date(this.str_date), ">>>>>>>>>>>>month", month);

        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
          this.enddatesate.setFullYear(year, month - 1, 31)
          this.ExportOverviewReportA(new Date(this.str_date), this.enddatesate);
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
          this.enddatesate.setFullYear(year, month - 1, 30);
          this.ExportOverviewReportA(new Date(this.str_date), this.enddatesate);
        } else if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
          this.enddatesate.setFullYear(year, month - 1, 29);
          this.ExportOverviewReportA(new Date(this.str_date), this.enddatesate)
        } else {
          this.enddatesate.setFullYear(year, month - 1, 28);
          this.ExportOverviewReportA(new Date(this.str_date), this.enddatesate);
        }

        this.str_date = this.enddatesate.setDate(this.enddatesate.getDate() + 1);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>start date", new Date(this.str_date));
        year = new Date(this.str_date).getFullYear();

      } else if (month == end_month && year == end_year) {
        this.ExportOverviewReportA(new Date(this.str_date), new Date(this.enddate));
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>mont == end_month")
      }
    }
  }



  oviewViewStatus: any;
  downloadStatus() {

    this.dataRoomService.ReportStatus(this.dataroomId, "overview").subscribe(res => {
      this.oviewViewStatus = res;
      this.Downloadfun();
      let url = '/#/download-status-documents'
      console.log('url', url)
      window.open(url, '_blank');
      console.log("oviewViewStatus=>", res)
    })
  }


  finalData: any = {};
  ExportOverview() {
    this.finalData['statusid'] = this.oviewViewStatus;
    this.finalData['mohthscount'] = this.months;
    console.log("finalData=>", this.finalData)
    this.spinner.show();
    var todays =
      new Date(this.to_date).getFullYear() +
      "-" +
      (new Date(this.to_date).getMonth() + 1) +
      "-" +
      new Date(this.to_date).getDate();
    var first =
      new Date(this.from_date).getFullYear() +
      "-" +
      (new Date(this.from_date).getMonth() + 1) +
      "-" +
      new Date(this.from_date).getDate();
    let sub = this.dataRoomService
      .ExportOverviewReport(
        this.dataroomId,
        first,
        todays,
        JSON.stringify(this.finalData)
      )
      .subscribe((res) => {
        this.response = res;
        this.spinner.hide();
      });
  }





  dataroom_detail: any;
  current_date: any;
  getSingleDataroom(dataroomId) {
    this.dataRoomService.getSingleDataroom(dataroomId).subscribe((res) => {
      this.dataroom_detail = res;
      this.getDataroomUser();
      this.getDateWise();
      const date_today = new Date();
      const today_ist = this.convertToIST(date_today);
      const today = new Date(today_ist)
      this.from_date = new Date(today);
      this.from_date.setDate(this.from_date.getDate() - 7);
      console.log(this.from_date, "from date changed");
      this.to_date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      this.changeDateWise(this.from_date, this.to_date)
      this.maxDate = new Date();
      this.minDate = new Date(this.dataroom_detail.created_date);
      console.log(this.minDate, this.maxDate)

    });
  }

  openDialogTimeout(): void {
    const dialogRef = this.dialog.open(TimeOutPopupR, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log(result);
      if (result && result != undefined) {

        if (result.result == true) {
          console.log(result.result, "result true");


          // this.download_all_files();
        } else if (result.result == false) {
          this.ExportOverview();
          console.log(result.result, "result false");
        } else {
          console.log(result, "result none");
        }
      }
      if (!result && result != undefined) {
        console.log(result, "result");
      }
    });
  }
}

@Component({
  selector: "./timeout-popup.html",
  templateUrl: "./timeout-popup.html",
})

export class TimeOutPopupR {
  constructor(
    public dialogRefs: MatDialogRef<TimeOutPopupR>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRefs.close({ result: true });
  }

  onYesClick(): void {
    this.dialogRefs.close({ result: false });
  }
}
