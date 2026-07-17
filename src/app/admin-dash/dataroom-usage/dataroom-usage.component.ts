import { Component, OnInit } from "@angular/core";
import { Chart } from "angular-highcharts";
import { ToastrService } from "ngx-toastr";
import { DataRoomService } from "../../services/index";

@Component({
  selector: "app-dataroom-usage",
  templateUrl: "./dataroom-usage.component.html",
  styleUrls: ["./dataroom-usage.component.css"],
})
export class DataroomUsageComponent implements OnInit {
  constructor(
    private dataRoomService: DataRoomService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getAllDataroomsUsage();
  }
  chart: any;
  datarooms: any;
  showchart: boolean = false;
  getAllDataroomsUsage() {
    this.dataRoomService.getAllDataroomsUsage().subscribe((res) => {
      this.datarooms = res;
      this.showchart = this.datarooms.access;
      console.log("chart data",this.datarooms.access);
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
          pointFormat:
            "{series.name}: <b>{point.y}GB ({point.percentage:.1f}%)</b>",
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
        // series: []
        series: this.datarooms.storage,
      });
    });
  }
}
