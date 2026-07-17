import { Router } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";

import {
  FormBuilder,
} from "@angular/forms";
import { TimezoneService } from "../../services/timezone.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { interval } from "rxjs";
import { bulkDownloadFail } from '../document/document.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: "app-download-status",
  templateUrl: "./download-status.component.html",
  styleUrls: ["./download-status.component.css"],
})
export class DownloadStatusComponent implements OnInit {
  all_root_folder_list: any = [];
  dataroomId;
  baseUrl: any;
  moment: any = moment;
  show_spinner: boolean = true;
  data: boolean = false;

  // set note on download status
  setNoteOnDownload: string;

  timezone: any;
  p: number = 1;
  p1: number = 1;
  isreport: boolean = false;
  usertimezone: string;
  namezone: string;
  constructor(
    private baseUrlClass: BaseUrlClass,
    private apiListClass: ApiListClass,
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private timeZone: TimezoneService,
    private http: HttpClient,
    public bulkfaildownload: MatDialog,
    private router: Router,
  ) {
    this.baseUrl = this.baseUrlClass.baseUrl;
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    this.bulkDownloadList();
    this.usertimezone = localStorage.getItem("currentUser");
    console.log("><><><><><><><", JSON.parse(this.usertimezone))
    this.usertimezone = JSON.parse(this.usertimezone);
    this.usertimezone = this.usertimezone['user_time_zone'][0];
    this.namezone = this.getFullStandardTimezoneByCountryCode(this.usertimezone['time_zone__abbreviation']);
    console.log(">>>>>>>>>namezone", this.namezone)

  }

  selectedIndex: number = 0;
  tab: boolean = false;
  tab1: boolean = false;
  startLoader = false;

  overview_tab: boolean = true;

  BackTab() {
    this.overview_tab = true;
    this.tab = false;
    this.tab1 = false;
  }

  private countryToFullStandardName: { [key: string]: string } = {
    "UTC": 'Coordinated Universal Time',
    "GMT": 'Greenwich Mean Time',
    "EST": 'Eastern Standard Time',
    "EDT": 'Eastern Daylight Time',
    "CST": 'Central Standard Time',
    "CDT": 'Central Daylight Time',
    "PST": 'Pacific Standard Time',
    "PDT": 'Pacific Daylight Time',
    "AKST": 'Alaska Standard Time',
    "AKDT": 'Alaska Daylight Time',
    "HST": 'Hawaii-Aleutian Standard Time',
    "HDT": 'Hawaii-Aleutian Daylight Time',
    "AEST": 'Australian Eastern Standard Time',
    "AEDT": 'Australian Eastern Daylight Time',
    "ACST": 'Australian Central Standard Time',
    "ACDT": 'Australian Central Daylight Time',
    "AWST": 'Australian Western Standard Time',
    "AWDT": 'Australian Western Daylight Time',
    "IST": 'India Standard Time',
    "IRDT": 'Iran Daylight Time',
    "KST": 'Korea Standard Time',
    "JST": 'Japan Standard Time',
    "BST": 'Bangladesh Standard Time',
    "BRT": 'Brasilia Time',
    "AMT": 'Armenian Time',
    "ART": 'Argentina Time',
    "WET": 'Western European Time',
    "CET": 'Central European Time',
    "CEST": 'Central European Summer Time',
    "EET": 'Eastern European Time',
    "EEST": 'Eastern European Summer Time',
    "MSK": 'Moscow Standard Time',
    "MSD": 'Moscow Daylight Time',
    "FJT": 'Fiji Time',
    "HKT": 'Hong Kong Time',
    "MST": 'Mountain Standard Time',
    "MT": 'Mountain Time',
    "NZST": 'New Zealand Standard Time',
    "NZDT": 'New Zealand Daylight Time',
    "SAST": 'South Africa Standard Time',
    "WAT": 'West Africa Time',
    "WIB": 'Western Indonesian Time',
    "WIT": 'Eastern Indonesian Time',
    "EAT": 'East Africa Time',
    "UTC+0": 'Coordinated Universal Time +0',
    "UTC+1": 'Coordinated Universal Time +1',
    "UTC+2": 'Coordinated Universal Time +2',
    "UTC+3": 'Coordinated Universal Time +3',
    "UTC+4": 'Coordinated Universal Time +4',
    "UTC+5": 'Coordinated Universal Time +5',
    "UTC+6": 'Coordinated Universal Time +6',
    "UTC+7": 'Coordinated Universal Time +7',
    "UTC+8": 'Coordinated Universal Time +8',
    "UTC+9": 'Coordinated Universal Time +9',
    "UTC+10": 'Coordinated Universal Time +10',
    "UTC+11": 'Coordinated Universal Time +11',
    "UTC+12": 'Coordinated Universal Time +12',
    "CCT": 'China Coast Time',
    "NPT": 'Nepal Time',
    "AFT": 'Afghanistan Time',
    "SGT": 'Singapore Time',
    "PHT": 'Philippine Time',
    "PKT": 'Pakistan Standard Time',
    "MNT": 'Mongolia Time',
    "NDT": 'Newfoundland Daylight Time',
    "NFT": 'Norfolk Time',
    "CAT": 'Central Africa Time',
    "FET": 'Further Eastern European Time',
    "UTC-1": 'Coordinated Universal Time -1',
    "UTC-2": 'Coordinated Universal Time -2',
    "UTC-3": 'Coordinated Universal Time -3',
    "UTC-4": 'Coordinated Universal Time -4',
    "UTC-5": 'Coordinated Universal Time -5',
    "UTC-6": 'Coordinated Universal Time -6',
    "UTC-7": 'Coordinated Universal Time -7',
    "UTC-8": 'Coordinated Universal Time -8',
    "UTC-9": 'Coordinated Universal Time -9',
    "UTC-10": 'Coordinated Universal Time -10',
    "UTC-11": 'Coordinated Universal Time -11',
    "UTC-12": 'Coordinated Universal Time -12',
  };






  getFullStandardTimezoneByCountryCode(countryCode: string): string | null {
    return this.countryToFullStandardName[countryCode.toUpperCase()] || null;
  }

  msg: string;
  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  showInfo() {
    this.toastr.info(this.msg);
  }

  failbulkDownload(): void {
    const dialogRef = this.bulkfaildownload.open(bulkDownloadFail, {
      width: "500px",
      //  data: { ok: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result != undefined) {
        if (result == true) {
          console.log(result, "result");
          //      this.download_all_files();
        }
      }
      if (!result && result != undefined) {
        console.log(result, "result");
      }
    });
  }

  downloadList;
  downloadStatusSubscription;
  unsubscribeDownload = false;
  overview: any;
  bulkDownloadList() {
    this.downloadStatusSubscription = interval(5000).subscribe((response) => {
      this.http.get(
        this.baseUrl +
        this.apiListClass.bulkdownloadrequesrtlist + this.dataroomId + '/',
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        },
      ).subscribe((res) => {
        console.log(res)
        //this.overview = res['data'][1]['failfilecount'];
        console.log(":overview", this.overview)
        for (let d = 0; d < res['data'].length; d++) {
          var finalData = {};

          if (res['data'][d]["failfilecount"] != 0 && res['data'][d]["failfilecount"] === res['data'][d]["successfilescount"] && (res['data'][d]["is_overview_report"] || res['data'][d]["is_q_and_a_report"] || res['data'][d]["is_activity_by_files_report"] || res['data'][d]["is_activity_by_date_report"] || res['data'][d]["is_user_and_grp_report"] || res['data'][d]["is_download_report"] || res['data'][d]["is_user_and_status_report"] || res['data'][d]["is_voting_report"]) && res['data'][d]["readytodownload"] == false) {
            console.log("is_overview_report failfilecount=>", res['data'][d]["failfilecount"], res['data'][d]["successfilescount"],)
            console.log("is_overview_report=>", res['data'][d].is_overview_report);
            finalData['statusid'] = res['data'][d].id;
            this.dataRoomService.OverviewReportZip(this.dataroomId, JSON.stringify(finalData)).subscribe(resp => { console.log("OverviewReportZip=>", resp) })

          }
        }
        const newdata = res['data'];
        this.downloadList = newdata.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00' }));
        //this.downloadList = res['data'];
        if (res['readytodownload'] == true) {
          this.downloadStatusSubscription.unsubscribe();
        }


      },
        (error) => {

          if (this.router.url.includes('folder_detail')) {
            this.msg = "Bulk download failed. Please select files/folders with download permission and try again.";
          }

          this.startLoader = false;
        }
      )
    })
  }

  downloadindex(item) {
    var zip_file_path = this.baseUrl + "/media/" + item.filename; //put inside "" your server path with file.zip
    var zip_file_name = item.filename; //put inside "" file name or something
    console.log(zip_file_path)
    console.log(zip_file_name)
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = zip_file_path;
    a.download = zip_file_name;
    a.click();
    document.body.removeChild(a);
    this.msg = "Your permission has been changed please contact Admin";
  }


  downloadOverview(resp) {
    var res = resp
    var zip_file_path = this.baseUrl + "/media/" + res; //put inside "" your server path with file.zip
    var zip_file_name = res; //put inside "" file name or something
    console.log(zip_file_path)
    console.log(zip_file_name)
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = zip_file_path;
    a.download = zip_file_name;
    a.click();
    document.body.removeChild(a);
    this.msg = "Your permission has been changed please contact Admin";
  }

  download(item) {
    console.log(item, "item for download")
    this.dataRoomService.downloadPermissionCheck(item.id).subscribe(resp => {
      console.log(resp);

      if (resp.download_permission) {
        var zip_file_path = this.baseUrl + "/media/" + resp.filedata;
        var zip_file_name = item.filename;
        console.log(zip_file_path)
        console.log(zip_file_name)
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.href = zip_file_path;
        a.download = zip_file_name;
        a.click();
        document.body.removeChild(a);
        this.msg = "Your permission has been changed please contact Admin";
      }
      else {
        this.msg = "Your permission has been changed please contact Admin";
        this.setNoteOnDownload = "All the Download will be deleted at 2.00am GST."
        this.showError();
      }
    }
    )
  }

  getDownloadLog(statusId, filename) {
    let newFileName = filename.replace('.zip', '');
    this.dataRoomService.bulkDownloadLog(statusId, newFileName).subscribe((res) => {
      console.log(res)
    });
  }
}
