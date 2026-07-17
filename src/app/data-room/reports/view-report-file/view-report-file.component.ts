import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DataRoomService } from "../../../services/dataroom_service";
import { TimezoneService } from "../../../services/timezone.service";
import { DatePipe, Location } from "@angular/common";
import { SpinnerVisibilityService } from "ng-http-loader";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-view-report-file",
  templateUrl: "./view-report-file.component.html",
  styleUrls: ["./view-report-file.component.css"],
})
export class ViewReportFileComponent implements OnInit {
  id: any;
  dataroomId: any;
  timezone: any;
  usertimezone: string;
  constructor(
    private route: ActivatedRoute,
    private dataRoomService: DataRoomService,
    private timeZone: TimezoneService,
    private datePipe: DatePipe,
    private location: Location
  ) {
    this.usertimezone = localStorage.getItem("currentUser")
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0]
    console.log('thistime', this.usertimezone['time_zone__offset'])
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));

      this.timezone = this.timeZone.userTimeZone;
    });
  }

  ngOnInit() {
    this.getSingleFolderDetails(this.id);
    this.getFileActivity(this.id);
  }

  convertToIST(utcDate) {
    return this.datePipe.transform(utcDate, 'yyyy-MM-dd hh:mm a', this.usertimezone['time_zone__offset']); // 'Asia/Kolkata' offset
  }

  activities: any;
  getFileActivity(id) {
    this.dataRoomService
      .getFileActivity(this.dataroomId, id)
      .subscribe((res) => {
        this.activities = res;

        this.activities = this.activities.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00' }));

        // newdata.map(item => ({
        //   ...item,
        //   created_date: this.convertToIST(item.created_date) // Format the specified date field
        // }));

        console.log(this.activities, "activities");
      });
  }


  goBack() {
    this.location.back();
  }
  data: any;
  getSingleFolderDetails(id) {
    this.dataRoomService.getSingleFolderDetails(id).subscribe((res) => {
      // If res is an array, append '+04:00' to created_date in each object
      if (Array.isArray(res)) {
        this.data = res.map(item => ({
          ...item,
          created_date: item.created_date ? item.created_date + '+04:00' : '+04:00'
        }));
      } else {
        this.data = res;
        if (this.data && this.data.created_date) {
          this.data.created_date = this.data.created_date + '+04:00';
        }
        if(this.data && this.data.Delete_activity_count != 'None') {
          this.data.Delete_activity_count = this.data.Delete_activity_count + '+04:00';
        }
      }
      console.log(this.data, "count detail");
    });
  }
}
