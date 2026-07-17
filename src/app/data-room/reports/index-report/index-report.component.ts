import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../../services/dataroom_service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { SpinnerVisibilityService } from "ng-http-loader";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-index-report",
  templateUrl: "./index-report.component.html",
  styleUrls: ["./index-report.component.css"],
})
export class IndexReportComponent implements OnInit {
  dataroomId: any;
  msg: any;
  constructor(
    private dataRoomService: DataRoomService,
    private spinner: SpinnerVisibilityService,
    private toastr: ToastrService,
    private cookieService:CookieService
  ) {
    this.dataroomId =localStorage.getItem("currentDataroomId").toString();
  }

  member_id: any = 0;
  ngOnInit() {
    // this.GetIndexReports();
    // this.GetDataroomMembers();
  }

  receiveAutoMsgHandler(p) {
    this.dataroom_detail = p.singledataroom;
    console.log(p, "overview???????????????????????????????/");
    this.dataroom_name =  p.singledataroom.dataroom_name;
    let todays_date = new Date();
    this.current_date = moment(todays_date).format("YYYY-MM-DD hh-mm-ss a");
  }


  members: any;


  dataroom_detail: any;
  current_date: any;
  dataroom_name: any;

  showSuccess() {
    this.toastr.success(this.msg);
  }
  showError() {
    this.toastr.error(this.msg);
  }
  showInfo() {
    this.toastr.info(this.msg);
  }

  months = 1;
  data: any;
  finalData: any = {};
  GetIndexReports() {
    this.finalData['statusid'] = this.oviewViewStatus;
    this.finalData['mohthscount'] = this.months;
    this.spinner.show();
    if (this.member_id !== 0) {
      console.log(  this.dataroomId,
        this.member_id,
        this.dataroom_name,
        this.current_date);

      this.dataRoomService
        .getUserWiseIndexReport(
          this.dataroomId,
          this.member_id,
          JSON.stringify(this.finalData)
        )
        .subscribe((res) => {
          this.spinner.hide();
          this.msg = "SuccessFully Downloaded Index Report of Given User";
          this.showSuccess();
        });
    } else {
      this.spinner.hide();
      this.msg = "Please Select Users";
      this.showError();
    }
  }

  oviewViewStatus:any;
  downloadStatus(){
    this.dataRoomService.ReportStatus(this.dataroomId,"is_index_report_2").subscribe(res => {
      this.oviewViewStatus = res;
      this.GetIndexReports();
      let url = '/#/download-status-documents'
      window.open(url, '_blank');
    })
  }



  GoToTrash(index_id, i) {
    this.dataRoomService.DeleteIndexReports(index_id).subscribe((res) => {
      this.data.splice(i, 1);
      this.msg = "Index Report successfully deleted !";
      this.showInfo();
    });
  }

  getMembersOnSearch(event) {
    this.dataRoomService
    .getMembersOnSearch(this.dataroomId, event.target.value)
    .subscribe((res) => {
      console.log(res)
      this.members = res;
    });
  }

  memberName;
  getMemberName(value) {
    console.log(value)
    this.memberName = value.email
    this.member_id = value.id
  }
}
