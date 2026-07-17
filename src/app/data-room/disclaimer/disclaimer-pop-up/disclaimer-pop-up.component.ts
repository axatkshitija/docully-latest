import {
  Component,
  Pipe,
  OnInit,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { DataRoomService } from "../../../services/index";
import {
  UploadOutput,
  UploadInput,
  UploadFile,
  humanizeBytes,
  UploaderOptions,
} from "ngx-uploader";

import { BaseUrlClass, ApiListClass } from "../../../common/index";
import { ToastrService } from "ngx-toastr";
import { DomSanitizer } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { CookieService } from "ngx-cookie-service";

// @Pipe({
//   name: "safe",
// })
@Component({
  selector: "app-disclaimer-pop-up",
  templateUrl: "./disclaimer-pop-up.component.html",
  styleUrls: ["./disclaimer-pop-up.component.css"],
})
export class DisclaimerPopUpComponent implements OnInit {
  disclaimer: any;
  msg: string = "";
  basr_url: string = "";
  dataroomId: any;
  is_view_disclaimer: boolean = true;
  constructor(
    private dataRoomService: DataRoomService,
    private baseUrlClass: BaseUrlClass,
    private route: ActivatedRoute,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private location: Location,
    private cookieService:CookieService
  ) {
    // this.getAllDisclaimer();
    console.log("ng onit called");
    this.route.params.subscribe((params) => {
      this.disclaimer = params.id;
    });
    this.basr_url = this.baseUrlClass.baseUrl;
    this.dataroomId =localStorage.getItem("currentDataroomId");
    if (localStorage.getItem("is_view_disclaimer")) {
      this.is_view_disclaimer = false;
      localStorage.removeItem("is_view_disclaimer");
    }
  }

  ngOnInit() {
    this.getDownloadPreviewUrl();
    this.getUserInfo();
  }
  url: any;
  disclaimer_id: any;
  disclaimers: any;
  disclaimer_name: any;

  getDownloadPreviewUrl() {
    console.log(this.disclaimer);
    this.dataRoomService
      .getSingleDisclaimers(this.disclaimer)
      .subscribe((res) => {
        this.disclaimer_id = res.id;
        this.disclaimers = res;
        this.disclaimer_name = res.dataroom.dataroom_nameFront;
        // var auth =
        //   "?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=4000-07-18T16:31:37Z&st=2020-07-18T08:31:37Z&spr=https&sig=aylrk2bVvDPXRyuw71YXS6fzG7chArJF%2F%2FYrX1lYrrE%3D";

        this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(
          res.dataroom_disclaimer + "#toolbar=0"
        );
        console.log(this.disclaimers, "disclaimer id");
      });
  }
  download_dataroom_disclaimer() {
    this.dataRoomService
      .download_dataroom_disclaimer(this.disclaimer_id)
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
        a.download = this.disclaimers.dataroom_disclaimer_name;
        a.click();
        return url;
        // this.downloadFile(res);
        //
      });
  }

  back() {
    this.location.back();
  }

  disable: boolean = true;
  EnableButton(event) {
    if (event == true) {
      this.disable = false;
    } else {
      this.disable = true;
    }

  }

  AgreeDisclaimer() {
    var data = "";
    this.dataRoomService
      .update_dataroom_disclaimer(this.dataroomId, data)
      .subscribe((res) => {
        this.getToDetailedPage(
          this.dataroomId,
          res.choose_overview_default_page
        );
      });
  }

  goToBack() {
    var dataroomId = this.dataroomId;
    if (this.is_view_disclaimer) {
      this.router.navigate(["../dashboard"]);
    } else {
      this.dataRoomService.getMembersPermission(dataroomId).subscribe((res) => {
        this.perm = res;
        //
        if (this.perm.is_overview) {
          this.router.navigate(["../overview", dataroomId]);
        } else if (this.perm.is_edit_index) {
          this.router.navigate(["../documents"]);
        } else {
          this.router.navigate(["../overview"]);
        }

        this.getDataroomViewed(dataroomId);
      });
    }
  }
  perm: any;
  getToDetailedPage(dataroomId, choose_overview_default_page) {
    this.dataRoomService.getMembersPermission(dataroomId).subscribe((res) => {
      this.perm = res;
      //
      if (this.perm.is_overview && choose_overview_default_page == true) {
        this.router.navigate(["../overview", dataroomId]);
      } else if (
        this.perm.is_edit_index &&
        choose_overview_default_page == false
      ) {
        this.router.navigate(["../documents"]);
      } else if (choose_overview_default_page == true) {
        this.router.navigate(["../overview", dataroomId]);
      } else if (choose_overview_default_page == false) {
        this.router.navigate(["../documents"]);
      }

      //else if(this.perm.is_users_and_permission){
      //this.router.navigate(["../user-and-permissions"]);
      //}
      //else if(this.perm.is_updates){
      //this.router.navigate(["../update-doc"]);
      //}
      //else if(this.perm.is_q_and_a){
      //this.router.navigate(["../qa-user"]);
      //}
      //else if(this.perm.is_reports){
      //this.router.navigate(["../report-overview"]);
      //}
      //else{
      //  this.router.navigate(["../overview", dataroomId]);
      // }
      this.getDataroomViewed(dataroomId);
    });
  }
  user: any;
  user_id: number;
  getUserInfo() {
    this.dataRoomService
      .getUserProfileDatroom(this.dataroomId)
      .subscribe((res) => {
        this.user = res;
        this.user_id = res.id;
      });
    console.log(this.user, "user popup");
  }

  getDataroomViewed(dataroomId) {
    this.dataRoomService.GetAllDataroomView(dataroomId).subscribe((res) => {
      console.log("Dataroom Viewed" + dataroomId);
    });
  }
}
