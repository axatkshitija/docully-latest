import { BaseUrlClass, ApiListClass } from "../common/index";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Location } from "@angular/common";
import { DataRoomService } from "../services/index";
import { ToastrService } from "ngx-toastr";
declare var jQuery: any;

@Component({
  selector: "app-watermarking-setting",
  templateUrl: "./watermarking-setting.component.html",
  styleUrls: ["./watermarking-setting.component.css"],
})
export class WatermarkingSettingComponent implements OnInit {
  dataroomId: any;
  constructor(
    private baseUrlClass: BaseUrlClass,
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private location: Location,
    private cdRef: ChangeDetectorRef
  ) {
    this.dataroomId = localStorage.getItem("currentDataroomId").toString();
  }

  preview: any =
    this.baseUrlClass.baseUrl + "/static/images/watermark_preview.png";
  ngOnInit() {
    this.getWatermarking();
    this.getFeatures(this.dataroomId);
  }

  features: any;
  getFeatures(dataroomId) {
    this.dataRoomService.get_dataroom_features(dataroomId).subscribe((res) => {
      if (res[0] === undefined) {

        this.features = {
          auto_expire:true,
          bulk_users_upload:true,
          country_perm:true,
          custom_external_link:true,
          custom_logo:true,
          custom_watermarking:true,
          desktop_unlimit_upload:true,
          doculink_perm:true,
          dropbox_upload:true,
          email_to_dataroom_upload:true,
          favourites:true,
          google_drive_upload:true,
          id:2,
          la_admin_access:true,
          module_perm:true,
          one_drive_upload:true,
          proj_management:true,
          proj_overview:true,
          proj_updates:true,
          proj_video_intro:true,
          qa_submit:true,
          qa_with_cat:true,
          redaction:true,
          sharepoint_upload:true,
          two_factor_auth:true,
          voting_perm:true,
          auto_logout: true,
          co_current_logins: true,
          voting_report_perm: true,
          index_report_others: true,
          self_upload_status: true,
          all_user_upload_status: true,
          activity_tracker_perm: true,
          file_view_limit: true,
          viewer_support: true,
          fence_viewer: true,
          print_screen_perm: true,
        }
      } else {
        this.features = res[0];
      }
      console.log("features>>", this.features)
    });
  }
  lengthWatermarking: any[] = [];
  getWatermarking() {
    this.dataRoomService
      .getWatermarkingSettings(this.dataroomId)
      .subscribe((res) => {
        console.log(res.length, "length of res");
        console.log(res, "finally got the issue");
        if (res.length == 0) {
          console.log("m in if condition len zero");
          this.preview = "assets/images/A_Sample_PDF.pdf";
          jQuery("#preview").attr("src", this.preview);
          console.log(" this.preview ", this.preview);
        } else if (res.length > 0) {
          console.log("m in if condition len not zero");
          console.log(res, "response of watermark222");
          this.watermarkingForm = res;

          this.lengthWatermarking = res;
          // this.preview = res[0].attachments;
          var filee = res[0].attachments.toString();
          //   var filename = filee.split(/[\\\/]/).pop();
          this.preview = filee;
          jQuery("#preview").attr("src", this.preview);
          console.log(" this.preview ", filee);
          //  console.log(filename, "filename222");
        }
      });
  }

  goBack() {
    this.location.replaceState("/overview/" + this.dataroomId);
    window.location.reload();
    console.log(
      (this.dataroomId = localStorage.getItem("currentDataroomId").toString()),
      "location"
    );
  }

  watermarkingForm: any = [
    {
      name: "Top Center",
      type: "top :: center",
      font_size: 24,
      opacity: 0,
      rotation: 0,
      user_ipaddress: false,
      user_name: false,
      user_email: false,
      current_time: false,
      dataroom_name: false,
      vtop: true,
      vcenter: false,
      vbottom: false,
      hleft: false,
      hmiddle: true,
      hright: false,
      custom_text: "CDMS",
    },
    {
      name: "Center Center",
      type: "center :: center",
      font_size: 24,
      opacity: 0,
      rotation: 0,
      user_ipaddress: false,
      user_name: false,
      user_email: false,
      current_time: false,
      dataroom_name: false,
      vtop: false,
      vcenter: true,
      vbottom: false,
      hleft: false,
      hmiddle: true,
      hright: false,
      custom_text: "CDMS",
    },
    {
      name: "Bottom Center",
      type: "bottom :: center",
      font_size: 24,
      opacity: 0,
      rotation: 0,
      user_ipaddress: false,
      user_name: false,
      user_email: false,
      current_time: false,
      dataroom_name: false,
      vtop: false,
      vcenter: false,
      vbottom: true,
      hleft: false,
      hmiddle: true,
      hright: false,
      custom_text: "CDMS",
    },
  ];

  msg: string = "";

  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  SaveWatermarkingSettings() {
    // this.preview = this.baseUrlClass.baseUrl+"/static/images/watermark_preview.png";
    if (this.lengthWatermarking.length == 0) {
      console.log("Watermarking Form" + this.watermarkingForm);
      this.dataRoomService
        .postWatermarkingSettings(this.dataroomId, this.watermarkingForm)
        .subscribe(
          (res) => {
            this.msg = res.msg;
            this.showSuccess();
            console.log("New");

            this.getWatermarking();
          },
          (error) => {
            this.msg = error._body;
            this.showSuccess();
          }
        );
    } else {
      this.dataRoomService
        .updateWatermarkingSettings(this.watermarkingForm)
        .subscribe(
          (res) => {
            console.log(res, "testing");
            this.msg = res.msg;

            var filee = res.attachments.toString();
            console.log(filee, "Files String");
            this.preview = filee;
            jQuery("#preview").attr("src", this.preview);
            this.showSuccess();
            console.log(this.msg);
            console.log(this.preview, "Update");
            // jQuery("#preview").attr(
            //   "src",
            //   this.preview + "?" + new Date().toString()
            // );
            // // location.reload(true)
            // this.getWatermarking();
          },
          (error) => {
            this.msg = error._body;
            this.showSuccess();
          }
        );
    }
  }

  clickVertical(event, type, i) {
    if (type == "vtop") {
      this.watermarkingForm[i].vtop = true;
      this.watermarkingForm[i].vcenter = false;
      this.watermarkingForm[i].vbottom = false;
    } else if (type == "vcenter") {
      this.watermarkingForm[i].vtop = false;
      this.watermarkingForm[i].vcenter = true;
      this.watermarkingForm[i].vbottom = false;
    } else if (type == "vbottom") {
      this.watermarkingForm[i].vtop = false;
      this.watermarkingForm[i].vcenter = false;
      this.watermarkingForm[i].vbottom = true;
    }

    if (
      this.watermarkingForm[i].vtop == true &&
      this.watermarkingForm[i].hleft == true
    ) {
      this.watermarkingForm[i].type = "top :: left";
      this.watermarkingForm[i].name = "Top Left";
    } else if (
      this.watermarkingForm[i].vtop == true &&
      this.watermarkingForm[i].hmiddle == true
    ) {
      this.watermarkingForm[i].type = "top :: center";
      this.watermarkingForm[i].name = "Top Center";
    } else if (
      this.watermarkingForm[i].vtop == true &&
      this.watermarkingForm[i].hright == true
    ) {
      this.watermarkingForm[i].type = "top :: right";
      this.watermarkingForm[i].name = "Top Right";
    } else if (
      this.watermarkingForm[i].vcenter == true &&
      this.watermarkingForm[i].hleft == true
    ) {
      this.watermarkingForm[i].type = "center :: left";
      this.watermarkingForm[i].name = "Center Left";
    } else if (
      this.watermarkingForm[i].vcenter == true &&
      this.watermarkingForm[i].hmiddle == true
    ) {
      this.watermarkingForm[i].type = "center :: center";
      this.watermarkingForm[i].name = "Center Center";
    } else if (
      this.watermarkingForm[i].vcenter == true &&
      this.watermarkingForm[i].hright == true
    ) {
      this.watermarkingForm[i].type = "center :: right";
      this.watermarkingForm[i].name = "Center Right";
    } else if (
      this.watermarkingForm[i].vbottom == true &&
      this.watermarkingForm[i].hleft == true
    ) {
      this.watermarkingForm[i].type = "bottom :: left";
      this.watermarkingForm[i].name = "Bottom Left";
    } else if (
      this.watermarkingForm[i].vbottom == true &&
      this.watermarkingForm[i].hmiddle == true
    ) {
      this.watermarkingForm[i].type = "bottom :: center";
      this.watermarkingForm[i].name = "Bottom Center";
    } else if (
      this.watermarkingForm[i].vbottom == true &&
      this.watermarkingForm[i].hright == true
    ) {
      this.watermarkingForm[i].type = "bottom :: right";
      this.watermarkingForm[i].name = "Bottom Right";
    }
  }

  clickHorizontal(event, type, i) {
    if (type == "hleft") {
      this.watermarkingForm[i].hleft = true;
      this.watermarkingForm[i].hmiddle = false;
      this.watermarkingForm[i].hright = false;
    } else if (type == "hmiddle") {
      this.watermarkingForm[i].hleft = false;
      this.watermarkingForm[i].hmiddle = true;
      this.watermarkingForm[i].hright = false;
    } else if (type == "hright") {
      this.watermarkingForm[i].hleft = false;
      this.watermarkingForm[i].hmiddle = false;
      this.watermarkingForm[i].hright = true;
    }

    if (
      this.watermarkingForm[i].vtop == true &&
      this.watermarkingForm[i].hleft == true
    ) {
      this.watermarkingForm[i].type = "top :: left";
      this.watermarkingForm[i].name = "Top Left";
    } else if (
      this.watermarkingForm[i].vtop == true &&
      this.watermarkingForm[i].hmiddle == true
    ) {
      this.watermarkingForm[i].type = "top :: center";
      this.watermarkingForm[i].name = "Top Center";
    } else if (
      this.watermarkingForm[i].vtop == true &&
      this.watermarkingForm[i].hright == true
    ) {
      this.watermarkingForm[i].type = "top :: right";
      this.watermarkingForm[i].name = "Top Right";
    } else if (
      this.watermarkingForm[i].vcenter == true &&
      this.watermarkingForm[i].hleft == true
    ) {
      this.watermarkingForm[i].type = "center :: left";
      this.watermarkingForm[i].name = "Center Left";
    } else if (
      this.watermarkingForm[i].vcenter == true &&
      this.watermarkingForm[i].hmiddle == true
    ) {
      this.watermarkingForm[i].type = "center :: center";
      this.watermarkingForm[i].name = "Center Center";
    } else if (
      this.watermarkingForm[i].vcenter == true &&
      this.watermarkingForm[i].hright == true
    ) {
      this.watermarkingForm[i].type = "center :: right";
      this.watermarkingForm[i].name = "Center Right";
    } else if (
      this.watermarkingForm[i].vbottom == true &&
      this.watermarkingForm[i].hleft == true
    ) {
      this.watermarkingForm[i].type = "bottom :: left";
      this.watermarkingForm[i].name = "Bottom Left";
    } else if (
      this.watermarkingForm[i].vbottom == true &&
      this.watermarkingForm[i].hmiddle == true
    ) {
      this.watermarkingForm[i].type = "bottom :: center";
      this.watermarkingForm[i].name = "Bottom Center";
    } else if (
      this.watermarkingForm[i].vbottom == true &&
      this.watermarkingForm[i].hright == true
    ) {
      this.watermarkingForm[i].type = "bottom :: right";
      this.watermarkingForm[i].name = "Bottom Right";
    }
  }

  increaseValue(i) {
    var value = parseInt(this.watermarkingForm[i].opacity.value, 10);
    value = isNaN(value) ? 0.05 : value;
    value++;
    this.watermarkingForm[i].opacity = value;
  }

  decreaseValue(i) {
    var value = parseInt(this.watermarkingForm[i].opacity.value, 10);
    value = isNaN(value) ? 0.05 : value;
    value < 0.05 ? (value = 0.05) : "";
    value--;
    this.watermarkingForm[i].opacity = value;
  }
}
