import { ToastrService } from 'ngx-toastr';
import { DataRoomService } from '../../../../services/index';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  UploadOutput,
  UploadInput,
  UploadFile,
  humanizeBytes,
  UploaderOptions,
} from 'ngx-uploader';
import { BaseUrlClass, ApiListClass } from '../../../../common/index';
import { Component, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import * as moment from 'moment';
import { TimezoneService } from '../../../../services/timezone.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-voting-status',
  templateUrl: './voting-status.component.html',
  styleUrls: ['./voting-status.component.css'],
})
export class VotingStatusComponent implements OnInit {
  voteId: any;
  dataroomId: any;
  timezone: any;
  usertimezone: any;
  constructor(
    private dataRoomService: DataRoomService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    public baseUrlclass: BaseUrlClass,
    private _location: Location,
    private timeZone: TimezoneService,
  ) {
    this.route.params.subscribe((params) => {
      this.voteId = params.voteId;
      this.getVoteResultList(this.voteId);
      this.getVoteResultStatus(this.voteId);
    });
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
    this.dataroom_name = p.singledataroom.dataroom_nameFront;
    let todays_date = new Date();
    this.current_date = moment(todays_date).format('YYYY-MM-DD hh-mm-ss a');
  }

  ExportVoterStatus() {
    this.dataRoomService
      .ExportVoterStatusReport(
        this.voteId,
        this.dataroom_name,
        this.current_date,
      )
      .subscribe((res) => {
        console.log('Export Overview Successfully');
      });
  }

  dataroom_detail: any;
  current_date: any;
  dataroom_name: any;
  voteResultList: any;
  getVoteResultList(voteId) {
    console.log(3434);
    this.dataRoomService.getVotingResult(voteId).subscribe((res) => {
      console.log(res);
      //this.voteResultList = res;
      const newdata = res;
      this.voteResultList = newdata.map((obj, i) => ({
        ...obj,
        vote_date: obj.vote_date + '+04:00',
      }));
    });
  }

  geBack() {
    this._location.back();
  }

  voteResultStatus: any;
  getVoteResultStatus(voteId) {
    console.log(3434);
    this.dataRoomService.getVoteCount(voteId).subscribe((res) => {
      console.log(res);
      this.voteResultStatus = res;
    });
  }
}
