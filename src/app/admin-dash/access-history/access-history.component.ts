import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-access-history",
  templateUrl: "./access-history.component.html",
  styleUrls: ["./access-history.component.css"],
})
export class AccessHistoryComponent implements OnInit {
  config: any;
  constructor(private dataRoomService: DataRoomService, private cookieService : CookieService) {
    this.getUserInfo();

    this.getAccessHistory();
  }

  ngOnInit() {
    this.getUserInfo();
    this.getAccessHistory();
  }

  user: any;
  getUserInfo() {

      this.user = JSON.parse(    localStorage.getItem("currentUser"));
;
  }

  access_history: any;
  getAccessHistory() {
    this.dataRoomService.getAccessHistory().subscribe((res) => {
      this.access_history = res;
    });
  }
}
