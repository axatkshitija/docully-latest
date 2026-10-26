import { Component, OnInit } from '@angular/core';
import { DataRoomService } from '../../../services/dataroom_service';
import * as moment from 'moment';
import { TimezoneService } from '../../../services/timezone.service';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-download-reports',
  templateUrl: './download-reports.component.html',
  styleUrls: ['./download-reports.component.css'],
})
export class DownloadReportsComponent implements OnInit {
  from_date: any;
  to_date: any;
  dataroomId: any;
  timezone: any;
  filterQuery: any;
  p: number = 1;
  show_spinner: boolean = true;
  fromdate: any;
  dataroom_detail: any;
  current_date: any;
  dataroom_name: any;
  maxDate;
  minDate;
  str_date: any;
  enddate: Date;
  max_day_value: number;
  enddatesate: any;
  str_date2: Date;
  months: number;
  usertimezone: string;

  constructor(
    private dataRoomService: DataRoomService,
    private spinner: SpinnerVisibilityService,
    private datePipe: DatePipe,
    private timeZone: TimezoneService,
  ) {
    this.dataroomId = localStorage.getItem('currentDataroomId').toString();

    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    this.usertimezone = localStorage.getItem('currentUser');
    this.usertimezone = JSON.parse(this.usertimezone);
    console.log('>>>>>>>>.', this.usertimezone);
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  convertToIST(utcDate) {
    return this.datePipe.transform(
      utcDate,
      'yyyy-MM-dd hh:mm a',
      this.usertimezone['time_zone__offset'],
    ); // 'Asia/Kolkata' offset
  }

  receiveAutoMsgHandler(p) {
    this.dataroom_detail = p.singledataroom;
    console.log(p, 'overview???????????????????????????????/');
    const date_today = new Date();
    const today_ist = this.convertToIST(date_today);
    const today = new Date(today_ist);
    if (p.singledataroom == null || p.singledataroom == undefined) {
      this.dataRoomService
        .getSingleDataroom(this.dataroomId)
        .subscribe((res) => {
          this.dataroom_detail = res;
          this.minDate = new Date(res.created_date);
          console.log('dataroom>>>>>>>>>>>>>>>', res);
        });
    } else {
      this.minDate = new Date(this.dataroom_detail.created_date);
    }
    this.getDateWise();
    this.to_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    this.from_date = new Date(today);
    this.from_date.setDate(this.from_date.getDate() - 7);
    this.changeDateWise(this.from_date, this.to_date);
    this.maxDate = new Date();
  }

  deleted_files: boolean = false;
  getDateWise() {
    var today = new Date();
    this.to_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    this.from_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
  }

  Downloadfun() {
    debugger;
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
    this.months = monthDiff + yearDiff * 12 + 1;

    for (let i = 0; i < this.months; i++) {
      month = new Date(this.str_date).getMonth() + 1;
      if (month != end_month) {
        console.log(
          '>>>>>>>>>>>>>>mont != end_month',
          new Date(this.str_date),
          '>>>>>>>>>>>>>month',
          month,
        );

        if (
          month == 1 ||
          month == 3 ||
          month == 5 ||
          month == 7 ||
          month == 8 ||
          month == 10 ||
          month == 12
        ) {
          this.enddatesate.setFullYear(year, month - 1, 31);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
          this.enddatesate.setFullYear(year, month - 1, 30);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        } else if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
          this.enddatesate.setFullYear(year, month - 1, 29);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        } else {
          this.enddatesate.setFullYear(year, month - 1, 28);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        }

        this.str_date = this.enddatesate.setDate(
          this.enddatesate.getDate() + 1,
        );
        console.log(
          '>>>>>>>>>>>>>>>>>>>>>>>>>start date',
          new Date(this.str_date),
        );
        year = new Date(this.str_date).getFullYear();
      } else if (month == end_month && year != end_year) {
        console.log(
          '>>>>>>>>>>>>>mont != end_month',
          new Date(this.str_date),
          '>>>>>>>>>>>>month',
          month,
        );

        if (
          month == 1 ||
          month == 3 ||
          month == 5 ||
          month == 7 ||
          month == 8 ||
          month == 10 ||
          month == 12
        ) {
          this.enddatesate.setFullYear(year, month - 1, 31);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
          this.enddatesate.setFullYear(year, month - 1, 30);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        } else if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
          this.enddatesate.setFullYear(year, month - 1, 29);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        } else {
          this.enddatesate.setFullYear(year, month - 1, 28);
          this.ExportActivityA(new Date(this.str_date), this.enddatesate);
        }

        this.str_date = this.enddatesate.setDate(
          this.enddatesate.getDate() + 1,
        );
        console.log(
          '>>>>>>>>>>>>>>>>>>>>>>>>>start date',
          new Date(this.str_date),
        );
        year = new Date(this.str_date).getFullYear();
      } else if (month == end_month && year == end_year) {
        this.ExportActivityA(new Date(this.str_date), new Date(this.enddate));
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>mont == end_month');
      }
    }
  }

  oviewViewStatus: any;
  downloadStatus() {
    this.dataRoomService
      .ReportStatus(this.dataroomId, 'download')
      .subscribe((res) => {
        this.oviewViewStatus = res;
        //this.loopDate();
        this.Downloadfun();
        let url = '/#/download-status-documents';
        console.log('url', url);
        window.open(url, '_blank');
        console.log('oviewViewStatus=>', res);
      });
  }

  data: any;
  dataSize: any;
  GetAllFilesDownloaded() {
    var todays =
      new Date(this.to_date).getFullYear() +
      '-' +
      (new Date(this.to_date).getMonth() + 1) +
      '-' +
      new Date(this.to_date).getDate();
    var first =
      new Date(this.from_date).getFullYear() +
      '-' +
      (new Date(this.from_date).getMonth() + 1) +
      '-' +
      new Date(this.from_date).getDate();
    this.dataRoomService
      .GetAllFilesDownloaded(this.dataroomId, first, todays)
      .subscribe((res) => {
        this.show_spinner = false;
        // this.data = res.data;
        const newdata = res.data;
        this.data = newdata.map((obj, i) => ({
          ...obj,
          created_date: obj.created_date + '+04:00',
        }));
        this.dataSize = res.size;

        console.log('this.data ', this.data);
      });
  }

  changeDateWise(from_date, to_date) {
    this.to_date = to_date;
    this.from_date = from_date;
    console.log(to_date, from_date);
    this.GetAllFilesDownloaded();
  }

  RemovedMembers(event) {
    this.deleted_files = event;
    this.GetAllFilesDownloaded();
  }

  finalData: any = {};
  ExportActivity() {
    this.spinner.show();
    this.finalData['statusid'] = this.oviewViewStatus;
    this.finalData['mohthscount'] = this.months;
    let todays_date = new Date();
    this.current_date = moment(todays_date).format('YYYY-MM-DD hh-mm-ss a');
    var todays =
      new Date(this.to_date).getFullYear() +
      '-' +
      (new Date(this.to_date).getMonth() + 1) +
      '-' +
      new Date(this.to_date).getDate();
    var first =
      new Date(this.from_date).getFullYear() +
      '-' +
      (new Date(this.from_date).getMonth() + 1) +
      '-' +
      new Date(this.from_date).getDate();

    this.dataRoomService
      .getFileDownloadedExcel(
        this.dataroomId,
        first,
        todays,
        JSON.stringify(this.finalData),
      )
      .subscribe((res) => {
        this.spinner.hide();
      });
  }

  ExportActivityA(a, b) {
    this.finalData['statusid'] = this.oviewViewStatus;
    this.finalData['mohthscount'] = this.months;
    this.spinner.show();
    let todays_date = new Date();
    this.current_date = moment(todays_date).format('YYYY-MM-DD hh-mm-ss a');
    var todays =
      new Date(b).getFullYear() +
      '-' +
      (new Date(b).getMonth() + 1) +
      '-' +
      new Date(b).getDate();
    var first =
      new Date(a).getFullYear() +
      '-' +
      (new Date(a).getMonth() + 1) +
      '-' +
      new Date(a).getDate();

    this.dataRoomService
      .getFileDownloadedExcel(
        this.dataroomId,
        first,
        todays,
        JSON.stringify(this.finalData),
      )
      .subscribe((res) => {
        this.spinner.hide();
      });
  }
}
