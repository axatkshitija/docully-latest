import { Component, Inject, OnInit } from "@angular/core";
import { BaseUrlClass, ApiListClass } from "../common/index";
import { DataRoomService } from "../services/index";
import { ToastrService } from "ngx-toastr";
import { SpinnerVisibilityService } from "ng-http-loader";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";

import { DialogData } from "../data-room/document/document.component";
import { CookieService } from "ngx-cookie-service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-indexes-report",
  templateUrl: "./indexes-report.component.html",
  styleUrls: ["./indexes-report.component.css"],
})
export class IndexesReportComponent implements OnInit {
  all_root_folder_list: any;
  dataroomId: number;
  minDate: any;
  to_date: any;
  response: any;
  statusId: any;
  usertimezone: string;
  constructor(
    private baseUrlClass: BaseUrlClass,
    private apiListClass: ApiListClass,
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private spinner: SpinnerVisibilityService,
    private cookieService:CookieService,
    private _fb: FormBuilder,
    private datePipe: DatePipe,
    public dialog: MatDialog,
  ) {
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
    this.getSingleDataroom(this.dataroomId);
  }

  ngOnInit() {
    this.getDateWise();
    this.usertimezone = localStorage.getItem("currentUser");
    console.log("><><><><><><><",JSON.parse(this.usertimezone))
    this.usertimezone = JSON.parse(this.usertimezone);
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  dataroom_name: any;
  getSingleDataroom(dataroomId) {
    this.dataRoomService.getSingleDataroom(dataroomId).subscribe((res) => {
      this.dataroom_name = res.dataroom_nameFront;
    });
  }


  getStatusId(){
    this.dataRoomService.bulkDownloadStatusIndex(this.dataroomId).subscribe( res => {
      console.log(res,"bulkdownload");
      this.statusId =  res;
     this.getAllIndexReport() 
  })
  }

  getAllIndexReport() {
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

      var finalData = {
        token: localStorage.getItem("token"),
        statusid: this.statusId,
      };
      
      let url = '/#/download-status-documents'
      console.log('url', url)
      window.open(url, '_blank')
      
    let sub = this.dataRoomService
      .DownloadIndexReport(//download_dataroom_index_report
        this.dataroomId,
        first,
        todays,
        JSON.stringify(finalData)
      )
      .subscribe((res) => {
        this.response = res
        console.log("Download dataroom index report succeessfully");
        this.spinner.hide();
      });

  }

  from_date: any;
  changeDateWise(from_date, to_date) {
    this.to_date = to_date;
    this.from_date = from_date;
    // this.getAllIndexReport();
  }

  convertToIST(utcDate) {
    return this.datePipe.transform(utcDate, 'yyyy-MM-dd hh:mm a',this.usertimezone['time_zone__offset']); // 'Asia/Kolkata' offset
  }

  fromdate: any;
  getDateWise() {
   
    const today = new Date();
    this.to_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    this.from_date = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    this.dataRoomService.getSingleDataroom(this.dataroomId).subscribe((res) => {
      this.fromdate = res.created_date;
      console.log(this.fromdate, "from date");
      this.from_date = new Date(this.fromdate);
      this.to_date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
    });

  }

  openDialogTimeout(): void {
  
    const dialogRef = this.dialog.open(TimeOutPopup, {
    width: "500px",
    //data: { ok: true, filecount: this.statusCount.filecount, size: this.statusCount.size, popup_dataroom_name: this.download_popup_dataroom_name },
  });

  dialogRef.afterClosed().subscribe((result) => {
    //console.log(result);
    
    if (result && result != undefined) {

      if (result.result == true) {
        console.log(result.result, "result true");


       // this.download_all_files();
      }else if( result.result== false){
       this.getAllIndexReport();
       console.log(result.result, "result false");
      }else{
        console.log(result, "result none");
      }
    }
    if (!result && result != undefined) {

      
      console.log(result, "result");
      // this.notify = "No";
      // this.startUpload();
    }
  });
}
}


@Component({
  selector: "./timeout-popup.html",
  templateUrl: "./timeout-popup.html",
})

export class TimeOutPopup {
  constructor(
    public dialogRefs: MatDialogRef<TimeOutPopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRefs.close({ result: true });
  }

  onYesClick(): void {
    this.dialogRefs.close({ result: false });
  }


}
