import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Injectable,
  Output,
  EventEmitter,
} from "@angular/core";
import { DataRoomService } from "../../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DomSanitizer } from "@angular/platform-browser";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { interval, Subscription } from "rxjs";
import { SpinnerVisibilityService } from "ng-http-loader";


@Component({
  selector: "app-data-room-left",
  templateUrl: "./data-room-left.component.html",
  styleUrls: ["./data-room-left.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class DataRoomLeftComponent implements OnInit {
  subscription: Subscription;
  intervalId: number;
  public now: Date = new Date();

  fileToUpload: File = null;
  url: any = "";
  msg: any;
  // @Input('dataroom_detail')
  dataroom_detail: any;
  currentDataroomId: any;
  _base_url: string = "";
  constructor(
    private dataRoomService: DataRoomService,
    private spinner: SpinnerVisibilityService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private baseUrlClass: BaseUrlClass,
    private router: Router,
  ) {
    this._base_url = this.baseUrlClass.baseUrl;
    this.currentDataroomId = localStorage.getItem("currentDataroomId");
    console.log(this.currentDataroomId);
    this.getSingleDataroom(this.currentDataroomId);
    this.getFeatures(this.currentDataroomId);
    this.getMembersPermission(this.currentDataroomId);
  }
  @Output() onInitEvent = new EventEmitter();

  ngOnInit() {
    this.getUserInfo();
    this.dataroomContact();
    this.getAllPrimaryContect();


  }

  user: any;
  getUserInfo() {
    this.dataRoomService
      .getUserProfileDatroom(this.currentDataroomId)
      .subscribe((res) => {
        this.user = res;
        this.onInitEvent.emit({ singledataroom: this.dataroom_detail, userdetail: res, memberpermission: this.perm });
        console.log(this.user, this.currentDataroomId, "getUserInfo");
        // const source = interval(30000);
        const text = "Your Text Here";
        this.opensnack(text, this.currentDataroomId);
      });
  }



  notification_count: number = 0;
  msg_count: number = 0;
  opensnack(text, currentDataroomId) {
    this.spinner.hide();
    this.now = new Date();
    console.log(currentDataroomId, text, this.now);
    this.dataRoomService
      .getSingleDataroomNotificationCount(this.currentDataroomId)
      .subscribe((res) => {
        console.log(res);
        this.msg_count = res.dataroom_message_count;
        if (
          this.user.member.is_la_user == true ||
          this.user.is_dataroom_admin == true
        ) {
          this.notification_count = res.dataroom_notification_count;
          console.log("this.notification_count", this.notification_count);
        } else {
          this.notification_count = res.user_datroom_count;
          console.log("User this.notification_count", res);
        }
      });
  }
  upgrade_msg: any = "";
  avatarUrl: string;
  dataroomname: any;
  auth: any;
  getSingleDataroom(dataroomId) {
    this.dataRoomService.getSingleDataroom(dataroomId).subscribe((res) => {
      res['dataroom_name'] = res.dataroom_name.replace(/_/g, " ")
      res['dataroom_nameFront'] = res.dataroom_nameFront.replace(/_/g, " ")
      this.dataroomname = res.dataroom_nameFront.replace(/_/g, " ");
      this.dataroom_detail = res;
      localStorage.setItem("get_dataroomname_popup", this.dataroom_detail.dataroom_nameFront)

      console.log("This is popup dataroom name " + localStorage.getItem("get_dataroomname_popup"))
      console.log(this.dataroom_detail, "datroom_name");
      // console.log(this.dataroomname, '############');
      this.dataroom_detail.dataroom_logo = res.dataroom_logo;
      // this.auth =
      //   "?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=4000-07-18T16:31:37Z&st=2020-07-18T08:31:37Z&spr=https&sig=aylrk2bVvDPXRyuw71YXS6fzG7chArJF%2F%2FYrX1lYrrE%3D";

      if (!this.dataroom_detail.is_paid) {
        let todays_date = new Date();
        // console.log("todays_date Date", todays_date);
        // console.log("Date", this.dataroom_detail.created_date);
        var date = new Date(this.dataroom_detail.created_date);
        // console.log("Date", date);
        var timeDiff = Math.abs(todays_date.getTime() - date.getTime());
        // console.log("timeDiff Date", timeDiff);
        var diff_date = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // console.log("Difference Date", diff_date);
        if (diff_date <= this.dataroom_detail.trial_days) {
          let rem_date = 16 - diff_date;
          this.upgrade_msg =
            "Your dataroom trial expires in " + rem_date + " days";
        } else {
          this.upgrade_msg = "Your dataroom is on extended trial";
        }
      }
    });
  }



  perm: any;
  getMembersPermission(dataroomId) {
    this.dataRoomService.getMembersPermission(dataroomId).subscribe((res) => {
      this.perm = res;
      // this.dataroom_detail.dataroom_logo = (this.baseUrlClass.baseUrl+res.dataroom_logo).replace("//media/","/media/")
    });
  }


  features: any;
  getFeatures(dataroomId) {
    this.dataRoomService.get_dataroom_features(dataroomId).subscribe((res) => {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>features",res)
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

  is_dataroom_updated: boolean = false;
  is_file_attached: boolean = false;
  dynamic_name: any;
  updateDataroominformation(dataroom_detail) {
    // console.log(dataroom_detail.dataroom_name, "these are the file names",dataroom_detail.dataroom_name);
    this.dynamic_name = this.ChangeDataroomName();
    // console.log("dynamic_name",this.dynamic_name);
    this.dataroom_detail.dataroom_nameFront = this.dynamic_name.replace(/_/g, " ");
    console.log("check name", this.dataroom_detail.dataroom_nameFront)
    if (dataroom_detail.dataroom_nameFront !== undefined) {
      this.dataroom_detail.dataroom_name = dataroom_detail.dataroom_nameFront.replace(/_/g, " ");
    }
    console.log(" check dataroom name", this.dataroom_detail.dataroom_name);
    // console.log("dynamic onchange -->",this.dynamic_name.replace(/_/,""));
    // console.log("this main name",this.dataroom_detail.dataroom_name);
    if (this.is_file_attached) {
      this.uploadFileToActivity();
    }

    this.dataRoomService
      .updateSingleDataroomInformation(dataroom_detail)
      .subscribe((res) => {
        console.log(res, "this update response");

        this.msg = "Dataroom information successfully updated !";
        this.showSuccess();
        this.getSingleDataroom(this.currentDataroomId);

        this.is_dataroom_updated = true;
        setTimeout(() => {
          this.is_dataroom_updated = false;
        }, 5000);
      });

  }

  updateDataroomStage() {
    this.dataroom_detail.is_dataroom_on_live = !this.dataroom_detail
      .is_dataroom_on_live;
    // console.log(this.dataroom_detail.is_dataroom_on_live);
    // console.log("Dataroom status", is_dataroom_on_live.value);
    // console.log("Dtaroom Name is", this.dataroom_detail);
    this.dataRoomService
      .updateSingleDataroomInformation(this.dataroom_detail)
      .subscribe((res) => {
        if (this.dataroom_detail.is_dataroom_on_live) {
          this.msg = "Data Room Stage updated successfully to Live.";
          this.dataRoomService
            .addEndUsers(this.currentDataroomId, undefined, "", "Holdtolive", "")
            .subscribe(
              (res) => {
                // console.log("end_user", res);
              },
              (error) => {
                this.msg = error._body;
                this.showError();
              }
            );
          this.dataRoomService
            .add_dataroom_la_user_group(
              this.currentDataroomId,
              undefined,
              "",
              "Holdtolive",
              ""
            )
            .subscribe(
              (res) => {
                // this.all_admin_list.splice(i, 1);
                console.log("end_user", res);
              },
              (error) => {
                this.msg = error._body;
                this.showError();
              }
            );
        } else {
          this.msg = "Data Room Stage updated successfully to Hold.";
        }

        this.showSuccess();
        this.getSingleDataroom(this.currentDataroomId);
      });
  }

  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  ChangeDataroomName() {
    // console.log("check change name function",this.dataroom_detail.dataroom_nameFront);
    return this.dataroom_detail.dataroom_nameFront
  }

  isUpdateCompanyLogo: boolean = false;

  handleFileInput(event) {
    this.isUpdateCompanyLogo = true;
    this.is_file_attached = true;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.fileToUpload = event.target.files[0];

      reader.onload = (event: any) => {
        this.url = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  uploadFileToActivity() {


    this.dataRoomService
      .postDataroomPic(this.fileToUpload, this.currentDataroomId)
      .subscribe(
        (res) => {
          console.log(res)
          // do something, if upload success
          res.data['dataroom_name'] = res.data.dataroom_name.replace(/_/g, " ")
          res.data['dataroom_nameFront'] = res.data.dataroom_nameFront.replace(/_/g, " ")
          this.dataroom_detail = res.data;

          this.dataroom_detail.dataroom_logo = res.data.dataroom_logo.replace(
            "//media/",
            "/media/"
          );
          this.msg = "Data room logo updated successfully";
          //  console.log(this.msg, "Dataroom pic");
          this.isUpdateCompanyLogo = false;
          this.is_file_attached = false;
          this.showSuccess();
        },
        (error) => {
          console.log(error.error.msg);
          this.msg = error.error.msg;
          console.log(error);
          this.showError();
        }
      );
  }




  setDefaultDataroomLogo() {
    console.log("set default dataroom logo");
    let dataroom: any = {
      id: 1,
    };
    this.dataRoomService
      .setDefaultDataroomLogo(this.currentDataroomId, dataroom)
      .subscribe((res) => {
        this.dataroom_detail = res.data;
        console.log(res.data, "Logg 12");
        // change by harish 24feb
        // this.dataroom_detail.dataroom_logo = (this.baseUrlClass.baseUrl+res.data.dataroom_logo).replace("//media/","/media/")
        this.dataroom_detail.dataroom_logo = res.data.dataroom_logo.replace(
          "//media/",
          "/media/"
        );

        this.msg = res.msg;
        this.showSuccess();
        this.isUpdateCompanyLogo = false;
      });
  }

  goToDataroomContactPage() {
    console.log("go to dataroom contact page");
    this.router.navigate(["manage-admin-group-permission/1/"]);
  }

  cancelStatus() {
    this.getSingleDataroom(this.currentDataroomId);
  }

  contact: any;
  dataroomContact() {
    // this.dataRoomService
    //   .getDataroomContact(this.currentDataroomId)
    //   .subscribe((res) => {
    //     this.contact = res;
    //   });
  }

  getUserBy(value) {
    console.log(value)
    this.update.user = value;
    this.update.email = value.email;
    this.sendMessage()
  }

  update: any = {
    message: "",
    subject: "",
    user: {},
    email: "",
  };

  user_dict: any;
  sendMessage() {
    console.log(this.update)
    this.dataRoomService.sendMessageToUser(this.update).subscribe((res) => {
      this.msg = res.data;
      this.showSuccess();
      this.update = {
        message: "",
        subject: "",
        user: {},
        email: "",
      };
    });


  }
  location() {
    window.open(" https://docullyvdr.zohodesk.com/", "_blank");

  }

  primary_users: any;
  primary_image: any;
  getAllPrimaryContect() {
    this.dataRoomService
      .getAllPrimaryUser(this.currentDataroomId)
      .subscribe((res) => {
        this.primary_users = res.data;
        console.log(this.primary_users, "primary user");
      });
  }

  CallUs() {
    window.open("tel:2240907266");
  }

  EmailUs() {
    window.open("mailto:support@docullyvdr.com");
  }

}
