import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  NgForm,
} from "@angular/forms";
import { DataRoomService } from "../../../services/index";
import { ToastrService } from "ngx-toastr";
import { RouterModule, Routes } from "@angular/router";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { TimezoneService } from "../../../services/timezone.service";
import { BaseUrlClass, ApiListClass } from "../../../common/index";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-my-team-overview",
  templateUrl: "./my-team-overview.component.html",
  styleUrls: ["./my-team-overview.component.css"],
})
export class MyTeamOverviewComponent implements OnInit {
  public createNewDataroomForm: FormGroup; // our form model
  msg: any;
  errors: any;
  timezone: any;
  areControlsEnabled: boolean = false;
  @Input() my_team_id: any;
  all_datarooms: any;
  all_members: any;
  my_team_data: any;
  constructor(
    private dataRoomService: DataRoomService,
    private toastrService: ToastrService,
    private cookieService:CookieService,
    private router: Router,
    private route: ActivatedRoute,
    private timeZone: TimezoneService
  ) {
    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    this.get_my_team_data();
    this.get_all_my_team_members();
  }

  get_my_team_data() {
    this.dataRoomService.getMyTeamData(this.my_team_id).subscribe((res) => {
      //res.my_team_logo  = this.base_url+res.my_team_logo;
      this.my_team_data = res;
    });
  }
  getToDetailedPage(dataroomId, choose_overview_default_page) {
    this.dataRoomService.getMembersPermission(dataroomId).subscribe((res) => {
      this.perm = res;
      console.log(this.perm, choose_overview_default_page, "this.perm");
      this.dataRoomService.checkfirstpage(dataroomId).subscribe((res) => {
        //  this.end_user_group_information = res;
        console.log(res, "end users info");
      });

      if (this.perm.is_overview && choose_overview_default_page == true) {
        this.router.navigate(["../overview", dataroomId]);
      } else if (
        this.perm.is_edit_index &&
        choose_overview_default_page == false
      ) {
        this.router.navigate(["../documents"]);
      } else if (this.perm.is_overview == false && this.perm.is_edit_index) {
        this.router.navigate(["../documents"]);
        // } else if (choose_overview_default_page == true) {
        //   console.log("FipTip");

        //   this.router.navigate(["../overview", dataroomId]);
        // } else if (choose_overview_default_page == false) {
        //   this.router.navigate(["../documents"]);
      } else if (
        this.perm.is_overview == false &&
        this.perm.is_edit_index == false &&
        this.perm.is_updates
      ) {
        this.router.navigate(["../update-doc"]);
      } else if (
        this.perm.is_overview == false &&
        this.perm.is_edit_index == false &&
        this.perm.is_updates == false &&
        this.perm.is_q_and_a
      ) {
        this.router.navigate(["../qa-user"]);
      } else if (
        this.perm.is_overview == false &&
        this.perm.is_edit_index == false &&
        this.perm.is_updates == false &&
        this.perm.is_q_and_a == false &&
        this.perm.is_voting
      ) {
        this.router.navigate(["../voting"]);
      } else if (
        this.perm.is_overview == false &&
        this.perm.is_edit_index == false &&
        this.perm.is_updates == false &&
        this.perm.is_q_and_a == false &&
        this.perm.is_voting == false &&
        this.perm.is_reports
      ) {
        this.router.navigate(["../report-overview"]);
      } else if (this.perm.is_edit_index) {
        this.router.navigate(["../documents"]);
      } else if (this.perm.is_users_and_permission) {
        this.router.navigate(["../user-and-permissions"]);
      } else if (this.perm.is_updates) {
        this.router.navigate(["../update-doc"]);
      } else if (this.perm.is_q_and_a) {
        this.router.navigate(["../qa-user"]);
      } else if (this.perm.is_reports) {
        this.router.navigate(["../report-overview"]);
      } else {
        this.router.navigate(["../overview", dataroomId]);
      }

      // this.getDataroomViewed(dataroomId);
    });
  }

  perm: any;
  gotoURl(dataroomId, dataroomName, choose_overview_default_page) {

   localStorage.setItem("currentDataroomId", dataroomId.toString())
    this.dataRoomService
      .get_dataroom_disclaimer(dataroomId)
      .subscribe((res) => {
        console.log(res.member.is_end_user, "TRipTest");

        if (res.overview.show_multiple_times_disclaimer == false) {
          if (res.member.disclaimer_status == false) {
            if (res.disclaimer.id == undefined) {
              if (res.member.is_end_user !== undefined) {
                if (res.member.is_end_user === true) {
                  this.getToDetailedPage(
                    dataroomId,
                    res.overview.choose_overview_default_page
                  );
                } else {
                  this.getToDetailedPage(dataroomId, true);
                }
              }
            } else {
              this.router.navigate(["../disclaimer-popup", res.disclaimer.id]);
            }
          } else {
            if (res.member.is_end_user !== undefined) {
              if (res.member.is_end_user === true) {
                this.getToDetailedPage(
                  dataroomId,
                  res.overview.choose_overview_default_page
                );
              } else {
                this.getToDetailedPage(dataroomId, true);
              }
            }
          }
        } else {
          if (res.member.disclaimer_status == false) {
            if (res.disclaimer.id == undefined) {
              this.getToDetailedPage(dataroomId, choose_overview_default_page);
            } else {
              localStorage.setItem("Multiple" + "&" + dataroomName + "&" + dataroomId,
              "true")
         
              this.router.navigate(["../disclaimer-popup", res.disclaimer.id]);
            }
          } else {
            console.log(res.overview.choose_overview_default_page, "Grtp");
            if (res.member.is_end_user !== undefined) {
              if (res.member.is_end_user === true) {
                this.getToDetailedPage(
                  dataroomId,
                  res.overview.choose_overview_default_page
                );
              } else {
                this.getToDetailedPage(dataroomId, true);
              }
            }
          }
        }
        // this.getToDetailedPage(dataroomId,choose_overview_default_page)
      });
    // this.getToDetailedPage(dataroomId,choose_overview_default_page)
  }

  createNewDataroom() {
    this.createNewDataroomForm = new FormGroup({
      dataroom_name: new FormControl("", [
        Validators.minLength(3),
        Validators.maxLength(40),
        Validators.required,
      ]),
      dataroom_modules: new FormGroup({
        is_watermarking: new FormControl(!this.areControlsEnabled, []),
        is_drm: new FormControl(!this.areControlsEnabled, []),
        is_question_and_answers: new FormControl(!this.areControlsEnabled, []),
        is_collabration: new FormControl(!this.areControlsEnabled, []),
        is_ocr: new FormControl(!this.areControlsEnabled, []),
        is_editor: new FormControl(!this.areControlsEnabled, []),
      }),

      is_account_level_branding: new FormControl(!this.areControlsEnabled, []),
    });
  }

  get_all_my_team_members() {
    this.dataRoomService
      .get_all_my_team_members(this.my_team_id)
      .subscribe((res) => {
        this.all_datarooms = res.datarooms;
        this.all_members = res.team_member_data;
      });
  }

  showSuccess() {
    this.toastrService.success(this.msg);
  }

  showError() {
    this.toastrService.error(this.msg);
  }
}
