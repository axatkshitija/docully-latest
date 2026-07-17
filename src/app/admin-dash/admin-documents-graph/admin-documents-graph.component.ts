import { Component, OnInit } from "@angular/core";
import { Chart } from "angular-highcharts";
import { ToastrService } from "ngx-toastr";
import { DataRoomService } from "../../services/index";

@Component({
  selector: "app-admin-documents-graph",
  templateUrl: "./admin-documents-graph.component.html",
  styleUrls: ["./admin-documents-graph.component.css"],
})
export class AdminDocumentsGraphComponent implements OnInit {
  constructor(
    private dataRoomService: DataRoomService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.getAllDataroomsUsage();
  }

  chart: any;
  datarooms: any;
  getAllDataroomsUsage() {
    this.dataRoomService.getAllDataroomsUsage().subscribe((res) => {
      this.datarooms = res;


      console.log("Hello raveena", res);
      this.chart = new Chart({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false,
        },
        title: {
          text: "Dataroom <br> Usage",
          align: "center",
          verticalAlign: "middle",
          y: 40,
        },
        tooltip: {
          pointFormat:
            "{series.name}: <b>{point.y}MB ({point.percentage:.1f}%)</b>",
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false,
              distance: -50,
              style: {
                fontWeight: "bold",
                color: "white",
              },
            },
            startAngle: -90,
            endAngle: 90,
            center: ["50%", "75%"],
          },
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            type: "pie",
            name: "Browser share",
            innerSize: "50%",
            data: this.datarooms.document,
          },
        ],
      });
    });
  }
}
