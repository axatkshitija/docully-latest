import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../../services/dataroom_service";
import { Chart } from "angular-highcharts";
import { CookieService } from "ngx-cookie-service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-usage-report",
  templateUrl: "./usage-report.component.html",
  styleUrls: ["./usage-report.component.css"],
})
export class UsageReportComponent implements OnInit {
  dataroomId: any;
  show_spinner: boolean = true;
  currentDataroomDetail;
  maxDate;
  minDate;
  from_date: any;
  to_date: any;
  curr: any;
  fromdate: any;
  dataroom_detail: any;
  usertimezone: any;

  constructor(private dataRoomService: DataRoomService,private cookieService:CookieService,private datePipe: DatePipe,) {

  }

  ngOnInit() {
    this.usertimezone = localStorage.getItem("currentUser");
    this.usertimezone = JSON.parse(this.usertimezone);
    console.log('>>>>>>>>.',this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
    this.dataroomId =localStorage.getItem("currentDataroomId").toString();
    console.log(this.dataroomId);
  }

  convertToIST(utcDate) {
    // UTC date string, e.g., '2024-10-30T09:00:00Z'
    //console.log(utcDate)
    return this.datePipe.transform(utcDate, 'yyyy-MM-dd hh:mm a',this.usertimezone['time_zone__offset']); // 'Asia/Kolkata' offset
  }

  receiveAutoMsgHandler(p) {
    this.dataroom_detail = p.singledataroom;
    console.log(p, "overview???????????????????????????????/");
 
    const date_today = new Date();
    const today_ist = this.convertToIST(date_today);
    const today = new Date(today_ist)


    console.log(this.from_date, "from date changed");
    this.to_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    this.getDateWise();
    this.maxDate = new Date();
    if(this.dataroom_detail==undefined||this.dataroom_detail==null){
      this.dataRoomService.getSingleDataroom(this.dataroomId).subscribe((pp) => {
        this.from_date = pp.created_date;
        this.dataroom_detail = pp;
        this.changeDateWise(this.from_date, this.to_date);
      })
    }else{
      this.from_date = p.singledataroom.created_date;
      this.changeDateWise(this.from_date, this.to_date);
    }

    this.minDate = this.from_date;
    
  
  }


  changeDateWise(from_date, to_date) {
    console.log("in change datewise");
    this.to_date = to_date;
    this.from_date = from_date;
    this.getCountPages();
    this.get_dataroom_usage_details();
  }

 

  count: any;
  getCountPages() {
    console.log('66666666666')
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
    this.dataRoomService.getCountPages(this.dataroomId, first, todays).subscribe((res) => {
      this.show_spinner = false;
      this.count = res;
      console.log(this.count, "count pages");
    });
  }

  data: any;
  chart: any;
  get_dataroom_usage_details() {
    console.log("get_dataroom_usage_details");
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

    this.dataRoomService
      .get_dataroom_usage_details_for_graph(this.dataroomId, first, todays)
      .subscribe((res) => {
        this.data = res;
        console.log("this.data ", first);
        console.log("this.data ", this.data);
        this.chart = new Chart({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: "pie",
          },
          title: {
            text: "",
          },
          tooltip: {
            pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: "pointer",
              dataLabels: {
                enabled: false,
              },
              showInLegend: true,
            },
          },
          credits: {
            enabled: false,
          },
          series: [
            {
              type:'pie',
              name: "Usage(MB)",
              data: [
                {
                  name: "Used",
                  y: res.dataroom_consumed,
                  color: "grey",
                },
                {
                  name: "Free",
                  y: res.dataroom_free,
                  color: "lightblue",
                },
              ],
            },
          ],
        });
      });
    // show chart data
  }


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
}
