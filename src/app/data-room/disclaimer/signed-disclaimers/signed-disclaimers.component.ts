import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../../services/index";
import { Location } from "@angular/common";
import { TimezoneService } from "../../../services/timezone.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-signed-disclaimers",
  templateUrl: "./signed-disclaimers.component.html",
  styleUrls: ["./signed-disclaimers.component.css"],
})
export class SignedDisclaimersComponent implements OnInit {
  currentDataroomId: any;
  disclaimer: any;
  timezone: any;
  usertimezone: string;

  constructor(
    private dataRoomService: DataRoomService,
    private _location: Location,
    private cookieService:CookieService,
    private timeZone: TimezoneService
  ) {
    this.currentDataroomId =localStorage.getItem("currentDataroomId");
    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    this.getAllUsers();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  dataroom_users_list: any;
  getAllUsers() {
    this.dataRoomService
      .getDataroomAllUsers(this.currentDataroomId)
      .subscribe((res) => {
        const newdata = res;
        this.dataroom_users_list = newdata.map((obj, i) => ({ ...obj, disclaimer_signed_date: obj.disclaimer_signed_date + '+04:00' }));
        console.log(res, "discliamer");
        this.getUrl(this.dataroom_users_list);
      });
  }

  object: any = {};

  getUrl(user_list) {
    for (var i = 0; i < user_list.length; i++) {
      this.object = user_list[i];
      this.object["url"] = "";
      this.object["dataroom_disclaimer_name"] = "";
      this.object["disclaimer_id"] = "";

      if (
        user_list[i].disclaimer_signed_id != "" &&
        user_list[i].disclaimer_signed_id != undefined
      ) {
        this.dataRoomService
          .getSingleDisclaimers(user_list[i].disclaimer_signed_id)
          .subscribe((res) => {
            console.log(res);
            this.object.url = res["dataroom_disclaimer"];
            this.object.dataroom_disclaimer_name =
              res["dataroom_disclaimer_name"];
            this.object.disclaimer_id = res["id"];
          });
      }
    }
  }

  geBack() {
    this._location.back();
  }
  download_dataroom_disclaimer(disclaimer, dataroom_disclaimer_name) {
    console.log(disclaimer, "download disclaimer");
    this.dataRoomService
      .download_dataroom_disclaimer(disclaimer)
      .subscribe((res) => {
        console.log("download dataroom disclaimer 1");
        var blob = new Blob([res], { type: "blob" });
        var url = window.URL.createObjectURL(blob); // <-- work with blob directly
        // create hidden dom element (so it works in all browsers)
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);

        // create file, attach to hidden element and open hidden element
        a.href = url;
        a.download = dataroom_disclaimer_name;
        a.click();
        return url;
        // this.downloadFile(res);
        //
      });
  }
}
