import { Component, Inject, OnInit } from "@angular/core";
import { DataRoomService } from "../../../services/dataroom_service";
import * as moment from "moment";
import { TimezoneService } from "../../../services/timezone.service";
import { SpinnerVisibilityService } from "ng-http-loader";

import { DialogData } from "../../document/document.component";
import { CookieService } from "ngx-cookie-service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
@Component({
  selector: "app-active-by-files",
  templateUrl: "./active-by-files.component.html",
  styleUrls: ["./active-by-files.component.css"],
})
export class ActiveByFilesComponent implements OnInit {
  from_date: any;
  to_date: any;
  dataroomId: any;
  moment: any = moment;
  timezone: any;
  filterQuery: any;
  p: number = 1;
  show_spinner: boolean = true;
  response: any;
  fromdates: any;
  todates: any;
  dataroom_detail: any;
  current_date: any;
  size: number = 0;
  maxDate;
  minDate;
  firstdate: Date;
  str_date: any;
  str_date2: Date;
  enddate: Date;
  enddatesate: Date;
  months: number;
  usertimezone: string;

  constructor(
    private dataRoomService: DataRoomService,
    private spinner: SpinnerVisibilityService,
    private timeZone: TimezoneService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.dataroomId = localStorage.getItem("currentDataroomId").toString();
    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    //this.getDateWise();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0]

  }

  convertToIST(utcDate) {
    // UTC date string, e.g., '2024-10-30T09:00:00Z'
    return this.datePipe.transform(utcDate, 'yyyy-MM-dd hh:mm a', this.usertimezone['time_zone__offset']); // 'Asia/Kolkata' offset
  }

  receiveAutoMsgHandler(p) {
    this.dataroom_detail = p.singledataroom;
    this.maxDate = new Date();

    if (p.singledataroom == null || p.singledataroom == undefined) {
      this.dataRoomService.getSingleDataroom(this.dataroomId).subscribe((res) => {
        this.dataroom_detail = res;
        console.log("dataroom>>>>>>>>>>>>>>>", res)
        this.minDate = new Date(res.created_date)
      })
    } else {
      this.minDate = new Date(this.dataroom_detail.created_date)
    }
    console.log(p, "overview???????????????????????????????/");
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

    console.log(this.minDate, this.maxDate)
  }



  deleted_files: boolean = false;
  fromdate: any;
  getDateWise() {
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
  dataSize: any;



  // checkdata(a, b) {
  //   console.log(a, "Date=>", b);
  //   this.ExportActivityA(a, b);
  //   this.firstdate = new Date(b.setDate(b.getDate() + 1));
  //   console.log(" this.firstdate=>", this.firstdate)
  // }

  // loopDateA(days) {
  //   var startDate = new Date(this.from_date);
  //   var in30DaysDate = new Date(this.to_date);
  //   this.firstdate = new Date(this.from_date);
  //   var dddate = startDate.getDate();
  //   var aadate = in30DaysDate.getDate();
  //   console.log("dddate>>>>>>>>>>>>>>>>>", this.months);
  //   if (this.months < 1) {
  //     this.months = 1;
  //     console.log("month>>>>>>>>>>>>>>>>>", this.months);
  //   } else if (dddate > aadate) {
  //     this.months = this.months + 1;
  //     console.log("month>>>>>>>>>>>>>>>>>", this.months);
  //   } else {
  //     this.months = this.months + 2;
  //     console.log("month>>>>>>>>>>>>>>>>>", this.months);
  //   }
  //   const thirtyDaysInMs = days * 24 * 60 * 60 * 1000;
  //   const timeDiffInMs = in30DaysDate.getTime() - startDate.getTime();

  //   console.log("Start:" + thirtyDaysInMs + " EndDate: " + timeDiffInMs);
  //   if (thirtyDaysInMs <= timeDiffInMs) {
  //     for (var d = startDate; startDate <= in30DaysDate; d.setDate(d.getDate() + 1)) {
  //       var ddate = new Date(d).getDate();
  //       var adate = this.to_date.getDate();
  //       if (ddate == adate) {
  //         this.checkdata(this.firstdate, d);
  //       }
  //     }
  //   } else {
  //     this.ExportActivity();
  //   }
  // }


  // months: any;
  // monthDiff(d1, d2) {
  //   var da1 = new Date(d1);
  //   var da2 = new Date(d2);
  //   this.months;
  //   this.months = (da2.getFullYear() - da1.getFullYear()) * 12;
  //   this.months -= da1.getMonth() + 1;
  //   this.months += da2.getMonth();
  //   return this.months <= 0 ? 0 : this.months;
  // }

  // month: any
  // year: any
  // loopDate() {
  //   this.monthDiff(this.from_date, this.to_date);
  //   this.month = new Date(this.from_date).getMonth() + 1;
  //   this.year = new Date(this.from_date).getFullYear()
  //   console.log("month=>", this.month, "year=>", this.year)
  //   if (this.month == 1 || this.month == 3 || this.month == 5 || this.month == 7 || this.month == 8 || this.month == 10 || this.month == 12) {
  //     console.log(">>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<")
  //     this.loopDateA(31);

  //   } else if (this.month == 4 || this.month == 6 || this.month == 9 || this.month == 11) {
  //     //max_day_value = 30
  //     console.log(">>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<")
  //     this.loopDateA(30);
  //   } else if (this.year % 4 == 0 && this.year % 100 != 0 || this.year % 400 == 0) {
  //     // max_day_value = 29
  //     console.log(">>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<")
  //     this.loopDateA(29);
  //   } else {
  //     //max_day_value = 28
  //     console.log(">>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<")
  //     this.loopDateA(28);
  //   }
  // }



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
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
          this.enddatesate.setFullYear(year, month - 1, 30);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        } else if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
          this.enddatesate.setFullYear(year, month - 1, 29);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate)
        } else {
          this.enddatesate.setFullYear(year, month - 1, 28);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        }

        this.str_date = this.enddatesate.setDate(this.enddatesate.getDate() + 1);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>start date", new Date(this.str_date));
        year = new Date(this.str_date).getFullYear();

      } else if (month == end_month && year != end_year) {

        console.log(">>>>>>>>>>>>>mont != end_month", new Date(this.str_date), ">>>>>>>>>>>>month", month);

        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
          this.enddatesate.setFullYear(year, month - 1, 31)
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
          this.enddatesate.setFullYear(year, month - 1, 30);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        } else if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
          this.enddatesate.setFullYear(year, month - 1, 29);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate)
        } else {
          this.enddatesate.setFullYear(year, month - 1, 28);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        }

        this.str_date = this.enddatesate.setDate(this.enddatesate.getDate() + 1);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>start date", new Date(this.str_date));
        year = new Date(this.str_date).getFullYear();

      } else if (month == end_month && year == end_year) {
        this.ExportActivityA(new Date(this.str_date), new Date(this.enddate));
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>mont == end_month")
      }
    }
  }


  oviewViewStatus: any;
  downloadStatus() {
    this.dataRoomService.ReportStatus(this.dataroomId, "activity_by_file").subscribe(res => {
      this.oviewViewStatus = res;
      //this.loopDate();
      this.Downloadfun();
      let url = '/#/download-status-documents'
      console.log('url', url)
      window.open(url, '_blank');
      console.log("oviewViewStatus=>", res)
    })
  }


  GetActivityByDate(pagenumber) {
    this.p = pagenumber;
    this.show_spinner = true;
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
      .GetActivityByFile(
        first,
        todays,
        this.deleted_files + "&page=" + pagenumber,
        this.dataroomId
      )
      .subscribe((res) => {
        this.show_spinner = false
        // this.data = res.data;
        const newdata = res.data;

        this.data = newdata.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00' }));
        this.dataSize = res.size;
        for (let e of this.data) {
          if (e.event == "drm download") {
            e.event = "Shortcut download"
          }
        }
        this.size = res.size;
      });
  }


  changeDateWise(from_date, to_date) {
    console.log('$$$$$$$$$', to_date)
    this.to_date = to_date;
    this.from_date = from_date;
    this.GetActivityByDate(this.p);
  }

  RemovedMembers(event) {
    this.deleted_files = event;
    this.GetActivityByDate(this.p);
  }

  finalData: any = {};
  ExportActivity() {

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
      .getActivityByFileExcel(
        this.dataroomId,
        first,
        todays,
        this.deleted_files,
        JSON.stringify(this.finalData)
      )
      .subscribe((res) => {
        this.response = res;
        this.spinner.hide();
      });

    setTimeout(() => {
      if (this.response == null) {
        let msg = 'export_activity_by_date';
        this.openDialogTimeout();
        this.dataRoomService
          .TimeOutApi(
            this.dataroomId,
            msg,
          )
          .subscribe((res) => {

            console.log(res, "timeout succeessfully");
          });
      }
      sub.unsubscribe()
      this.spinner.hide();
    }, 270000);
  }



  ExportActivityA(a, b) {

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

    let sub = this.dataRoomService
      .getActivityByFileExcel(
        this.dataroomId,
        first,
        todays,
        this.deleted_files,
        JSON.stringify(this.finalData)
      )
      .subscribe((res) => {
        this.response = res;
        this.spinner.hide();
      });

    setTimeout(() => {
      if (this.response == null) {
        let msg = 'export_activity_by_date';
        this.openDialogTimeout();
        this.dataRoomService
          .TimeOutApi(
            this.dataroomId,
            msg,
          )
          .subscribe((res) => {

            console.log(res, "timeout succeessfully");
          });
      }
      sub.unsubscribe()
      this.spinner.hide();
    }, 270000);
  }





  openDialogTimeout(): void {

    const dialogRef = this.dialog.open(TimeOutPopupA, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log(result);
      if (result && result != undefined) {

        if (result.result == true) {
          console.log(result.result, "result true");
        } else if (result.result == false) {
          this.ExportActivity()
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
  selector: "../report-overview/timeout-popup.html",
  templateUrl: "../report-overview/timeout-popup.html",
})

export class TimeOutPopupA {
  constructor(
    public dialogRefs: MatDialogRef<TimeOutPopupA>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRefs.close({ result: true });
  }

  onYesClick(): void {
    this.dialogRefs.close({ result: false });
  }

}