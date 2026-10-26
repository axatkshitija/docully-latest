import { Component, OnInit } from '@angular/core';
import { DataRoomService } from '../../../services/dataroom_service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { TimezoneService } from '../../../services/timezone.service';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-users-status',
  templateUrl: './users-status.component.html',
  styleUrls: ['./users-status.component.css'],
})
export class UsersStatusComponent implements OnInit {
  dataroomId: any;
  timezone: any;
  fromdate: any;
  group: any = 0;
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
    private toastr: ToastrService,
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

  from_date: any;
  to_date: any;
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
    //this.fromdate = p.singledataroom.created_date;
    if (p.singledataroom == null || p.singledataroom == undefined) {
      this.dataRoomService
        .getSingleDataroom(this.dataroomId)
        .subscribe((res) => {
          this.dataroom_detail = res;
          console.log('dataroom>>>>>>>>>>>>>>>', res);
          this.minDate = new Date(res.created_date);
        });
    } else {
      this.minDate = new Date(this.dataroom_detail.created_date);
    }

    const date_today = new Date();
    const today_ist = this.convertToIST(date_today);
    const today = new Date(today_ist);

    console.log(this.from_date, 'from date changed');
    this.to_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    this.getDateWise();
    this.from_date = new Date(today);
    this.from_date.setDate(this.from_date.getDate() - 7);
    this.maxDate = new Date();
    console.log(this.from_date, 'from date changed');
    this.getAllGroups();
    this.changeDateWise(this.from_date, this.to_date);
  }

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
          this.ExportUsersStatusA(new Date(this.str_date), this.enddatesate);
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
          this.enddatesate.setFullYear(year, month - 1, 30);
          this.ExportUsersStatusA(new Date(this.str_date), this.enddatesate);
        } else if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
          this.enddatesate.setFullYear(year, month - 1, 29);
          this.ExportUsersStatusA(new Date(this.str_date), this.enddatesate);
        } else {
          this.enddatesate.setFullYear(year, month - 1, 28);
          this.ExportUsersStatusA(new Date(this.str_date), this.enddatesate);
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
          this.ExportUsersStatusA(new Date(this.str_date), this.enddatesate);
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
          this.enddatesate.setFullYear(year, month - 1, 30);
          this.ExportUsersStatusA(new Date(this.str_date), this.enddatesate);
        } else if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
          this.enddatesate.setFullYear(year, month - 1, 29);
          this.ExportUsersStatusA(new Date(this.str_date), this.enddatesate);
        } else {
          this.enddatesate.setFullYear(year, month - 1, 28);
          this.ExportUsersStatusA(new Date(this.str_date), this.enddatesate);
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
        this.ExportUsersStatusA(
          new Date(this.str_date),
          new Date(this.enddate),
        );
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>mont == end_month');
      }
    }
  }

  oviewViewStatus: any;
  downloadStatus() {
    this.dataRoomService
      .ReportStatus(this.dataroomId, 'users_status')
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

  groups: any;
  getAllGroups() {
    this.dataRoomService.getAllGroups(this.dataroomId).subscribe((res) => {
      this.groups = res;
    });
  }

  groupType(value) {
    this.group = value;
    this.GetUsersStatus(this.group);
  }

  data: any;
  datalist: any = [];
  GetUsersStatus(group) {
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
    group = this.group;
    this.dataRoomService
      .GetUsersStatus(this.dataroomId, first, todays, group)
      .subscribe((res) => {
        this.data = res;
        this.datalist = res;
        this.data = this.data.data.map((obj, i) => ({
          ...obj,
          date_joined: obj.date_joined + '+04:00',
          last_login: obj.last_login + '+04:00',
        }));
        console.log('this.data ', this.data);
      });
  }

  changeDateWise(from_date, to_date) {
    this.to_date = to_date;
    this.from_date = from_date;
    this.GetUsersStatus(this.group);
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

  msg: any;
  removeSelectedElement(member, i) {
    console.log('delete admin', member);
    this.dataRoomService.delete_dataroom_admin(member.id).subscribe((res) => {
      // this.data.splice(i, 1);
      this.msg = 'Removed Member Successfully!';
      this.showError();
      this.GetUsersStatus(this.group);
    });
  }

  finalData: any = {};
  ExportUsersStatus() {
    this.finalData['statusid'] = this.oviewViewStatus;
    this.finalData['mohthscount'] = this.months;
    this.spinner.show();
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
      .ExportUsersStatus(
        this.dataroomId,
        first,
        todays,
        JSON.stringify(this.finalData),
      )
      .subscribe((res) => {
        this.spinner.hide();
      });
  }

  ExportUsersStatusA(a, b) {
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
      .ExportUsersStatus(
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
