import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataRoomService } from '../../../services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { BaseUrlClass, ApiListClass } from '../../../common/index';
import * as moment from 'moment';
import { SpinnerVisibilityService } from "ng-http-loader";
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-voting-report',
  templateUrl: './voting-report.component.html',
  styleUrls: ['./voting-report.component.css']
})
export class VotingReportComponent implements OnInit {


  dataroomId: any;
  timezone: any;
  fromdate: any;
  maxDate: any;
  minDate: any;
  from_date: Date;
  to_date: Date;
  str_date: any;
  enddate: Date;
  max_day_value: number;
  enddatesate: any;
  str_date2: Date;
  months: number;
  usertimezone: string;

  constructor(private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: SpinnerVisibilityService,
    private _fb: FormBuilder,
    private cookieService:CookieService,
    private datePipe: DatePipe,
    public baseUrlclass: BaseUrlClass) {
    this.dataroomId = (localStorage.getItem("currentDataroomId")).toString();
    //this.getSingleDataroom(this.dataroomId);
    this.getDateWise();
    this.timezone = new Date().toString().match(/([-\+][0-9]+)\s/)[1];
  }

  ngOnInit() {
    this.usertimezone = localStorage.getItem("currentUser");
    this.usertimezone = JSON.parse(this.usertimezone);
    console.log('>>>>>>>>.',this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  voteList: any = [];
  voteListSize: any = undefined;
  convertToIST(utcDate) {
    // UTC date string, e.g., '2024-10-30T09:00:00Z'
    //console.log(utcDate)
    return this.datePipe.transform(utcDate, 'yyyy-MM-dd hh:mm a',this.usertimezone['time_zone__offset']); // 'Asia/Kolkata' offset
  }


  receiveAutoMsgHandler(p) {
    this.dataroom_detail = p.singledataroom;
    console.log(p, "overview???????????????????????????????/");
    this.getDateWise();
    const date_today = new Date();
    const today_ist = this.convertToIST(date_today);
    const today = new Date(today_ist)
    this.from_date = new Date(today);
    this.from_date.setDate(today.getDate() - 7);
    console.log(this.from_date, "from date changed");
    this.to_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    this.changeDateWise(this.from_date, this.to_date)

    this.maxDate = new Date();
    this.minDate = new Date(this.dataroom_detail.created_date)
    console.log(this.minDate, this.maxDate)
    this.dataroom_name = p.singledataroom.dataroom_nameFront;
    let todays_date = new Date();
    this.current_date = moment(todays_date).format('YYYY-MM-DD hh-mm-ss a');

  }


  changeDateWise(from_date, to_date) {
    this.to_date = to_date;
    this.from_date = from_date;
    console.log(to_date, from_date)
    this.getVoteList();
  }

  dataroom_detail: any;
  current_date: any;
  dataroom_name: any;

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


  getVoteList() {
    console.log(3434);
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

    this.dataRoomService.getAllVoteList(this.dataroomId, first, todays)
      .subscribe((res) => {
        console.log(res);
        const newdata = res.data;
        this.voteList = newdata.map((obj, i) => ({ ...obj, end: obj.end + '+04:00' }));
        this.voteListSize = res.size;

      })
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
    this.months= (monthDiff + yearDiff * 12)+1;


    for (let i = 0; i < this.months; i++) {
      month = new Date(this.str_date).getMonth() + 1;
      if (month != end_month) {
        console.log(">>>>>>>>>>>>>>mont != end_month", new Date(this.str_date), ">>>>>>>>>>>>>month", month);

        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
          this.enddatesate.setFullYear(year, month - 1, 31)
          this.ExportVoteReportA(new Date(this.str_date), this.enddatesate);
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
          this.enddatesate.setFullYear(year, month - 1, 30);
          this.ExportVoteReportA(new Date(this.str_date), this.enddatesate);
        } else if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
          this.enddatesate.setFullYear(year, month - 1, 29);
          this.ExportVoteReportA(new Date(this.str_date), this.enddatesate)
        } else {
          this.enddatesate.setFullYear(year, month - 1, 28);
          this.ExportVoteReportA(new Date(this.str_date), this.enddatesate);
        }

        this.str_date = this.enddatesate.setDate(this.enddatesate.getDate() + 1);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>start date", new Date(this.str_date));
        year = new Date(this.str_date).getFullYear();

      } else if (month == end_month && year != end_year) {

        console.log(">>>>>>>>>>>>>mont != end_month", new Date(this.str_date), ">>>>>>>>>>>>month", month);

        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
          this.enddatesate.setFullYear(year, month - 1, 31)
          this.ExportVoteReportA(new Date(this.str_date), this.enddatesate);
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
          this.enddatesate.setFullYear(year, month - 1, 30);
          this.ExportVoteReportA(new Date(this.str_date), this.enddatesate);
        } else if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
          this.enddatesate.setFullYear(year, month - 1, 29);
          this.ExportVoteReportA(new Date(this.str_date), this.enddatesate)
        } else {
          this.enddatesate.setFullYear(year, month - 1, 28);
          this.ExportVoteReportA(new Date(this.str_date), this.enddatesate);
        }

        this.str_date = this.enddatesate.setDate(this.enddatesate.getDate() + 1);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>start date", new Date(this.str_date));
        year = new Date(this.str_date).getFullYear();

      } else if (month == end_month && year == end_year) {
        this.ExportVoteReportA(new Date(this.str_date), new Date(this.enddate));
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>mont == end_month")
      }
    }
  }


  oviewViewStatus: any;
  downloadStatus() {
    this.dataRoomService.ReportStatus(this.dataroomId, "voting").subscribe(res => {
      this.oviewViewStatus = res;
      //this.loopDate();
      this.Downloadfun();
      let url = '/#/download-status-documents'
      console.log('url', url)
      window.open(url, '_blank');
      console.log("oviewViewStatus=>", res)
    })
  }

  finalData: any = {};
  ExportVoteReport() {
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
    this.dataRoomService.ExportVoteReport(this.dataroomId,
      first,
      todays,
      JSON.stringify(this.finalData))
      .subscribe((res) => {
        this.spinner.hide();
        console.log("Export Overview Successfully")
      })
  }


  ExportVoteReportA(a,b) {
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
    this.dataRoomService.ExportVoteReport(this.dataroomId,
      first,
      todays,
      JSON.stringify(this.finalData))
      .subscribe((res) => {
        this.spinner.hide();
        console.log("Export Overview Successfully")
      })
  }
}


