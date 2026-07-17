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
  selector: "app-my-team",
  templateUrl: "./my-team.component.html",
  styleUrls: ["./my-team.component.css"],
})
export class MyTeamComponent implements OnInit {
  user: any;
  public teamForm: FormGroup; // our form model
  msg: any;
  errors: any;
  invitation_send_email: any;
  already_exist_user: any[] = [];
  my_team_data: any;
  my_team_id: number;
  base_url: string = "";
  is_my_team_logo_default: boolean = false;
  // my team overview data
  public createNewDataroomForm: FormGroup; // our form model
  public myTeamForm: FormGroup;
  areControlsEnabled: boolean = false;
  timezone: any;
  all_datarooms: any;
  all_members: any;

  constructor(
    private _fb: FormBuilder,
    private _dataroom_service: DataRoomService,
    private dataRoomService: DataRoomService,
    private cookieService: CookieService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private baseUrl: BaseUrlClass,
    private timeZone: TimezoneService
  ) {
    this.base_url = this.baseUrl.baseUrl;
    this.timezone = this.timeZone.userTimeZone;

  }

  ngOnInit() {
    let id = parseInt(this.route.snapshot.paramMap.get("myteamId"));
    this.my_team_id = id;
    this.initializeUserForm();
    this.getAllAdmins();
    this.getSingleMyTeamInfo(id);
    // this.getMyTeamBrandingData(id);
    this.get_my_team_data();
    this.get_all_my_team_members();
    this.initializeMyTeamForm();
  }

  nameValidator(control: FormControl): { [key: string]: boolean } {
    const nameRegexp: RegExp = /[!#%^+\=\[\]{};':"\\|,.<>\?]/;
    if (control.value && nameRegexp.test(control.value)) {
       return { invalidName: true };
    }
}

  initializeMyTeamForm() {
    this.myTeamForm = this._fb.group({
      team_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          this.nameValidator
        ],
      ],
      dataroom_allowed: ["", [Validators.required, Validators.maxLength(5)]],
      dataroom_admin_allowed: [
        "",
        [Validators.required, Validators.maxLength(5)],
      ],
      dataroom_storage_allowed: [
        "",
        [Validators.required, Validators.maxLength(3), Validators.minLength(1)],
      ],
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
              localStorage.setItem(  "Multiple" + "&" + dataroomName + "&" + dataroomId,
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

  all_my_teams: any[] = [];

  // start of my team functionality
  saveMyTeamForm(myTeamForm) {
    this._dataroom_service.createMyTeam(myTeamForm.value).subscribe((res) => {
      this.all_my_teams.push(res);
      this.msg = "Team added";
      this.showSuccess();
      this.myTeamForm.reset();
    });
  }

  //get single my team info
  getSingleMyTeamInfo(id) {
    this._dataroom_service.getMyTeamData(id).subscribe((res) => {
      res.my_team_logo = this.base_url + res.my_team_logo;
      this.my_team_data = res;
    });
  }

  // get my team branding detail
  my_team_branding_detail: any;
  // getMyTeamBrandingData(id){
  //   this._dataroom_service.my_team_branding_detail_view(id)
  //   .subscribe((res)=>{
  //     console.log("get my team branding data", res);
  //      res.branding_logo = this.base_url+res.branding_logo;
  //      res.email_header = this.base_url+res.email_header;
  //      res.favicon_icon = this.base_url+res.favicon_icon;
  //      this.my_team_branding_detail = res;
  //   })
  // }

  initializeUserForm() {
    this.teamForm = this._fb.group({
      user: this._fb.array([this.initUser()]),
    });
  }

  initUser() {
    return this._fb.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      email: ["", Validators.required],
    });
  }

  addUser() {
    const control = <FormArray>this.teamForm.controls["user"];
    const addrCtrl = this.initUser();
    control.push(addrCtrl);

    /* subscribe to individual address value changes */
    // addrCtrl.valueChanges.subscribe(x => {
    //   console.log(x);
    // })
  }

  removeUser(i: number) {
    const control = <FormArray>this.teamForm.controls["user"];
    control.removeAt(i);
  }

  is_success_error_message: boolean = false;

  showSuccess() {
    this.toastrService.success(this.msg);
  }

  showError() {
    this.toastrService.error(this.msg);
  }

  all_admins: any;
  getAllAdmins() {
    this._dataroom_service.get_all_admins().subscribe((res) => {
      this.all_admins = res;
    });
  }

  refreshAdminForm() {
    this.initializeUserForm();
    this.is_success_error_message = false;
    //this.invitation_send_email = [];
    //this.already_exist_user = [];
  }

  OverviewFormSubmit() { }
  color: any = "#ffffff";

  // update my team information
  saveMyTeamChanges(myTeam) {
    //
    console.log("My Team Information", myTeam);
    console.log("myTeam model is", this.my_team_data);
    this._dataroom_service
      .updateMyTeamData(this.my_team_data)
      .subscribe((res) => {
        console.log("my team changes sucessfully changed", res);
        res.my_team_logo = this.base_url + res.my_team_logo;
        this.my_team_data = res;
        this.msg = "My Team Information successfully updated !";
        this.showSuccess();
      });
  }

  // update branding changes
  saveMyTeamBrandingChanges() {
    // console.log("saveMyTeamBrandingChanges",myteam_branding_changes);
    this._dataroom_service
      .my_team_branding_update_view(this.my_team_branding_detail)
      .subscribe((res) => {
        console.log("Result is", res);
        //this.my_team_branding_detail = res;
        // upload team branding logo changes
        this.msg = "Team Branding Changes successfully updated !";
        this.showSuccess();
        this.upload_my_team_branding_logo();
      });
  }

  // my team branding default values
  revertToDefaultCdrBranding() {
    console.log("revert to default cdr branding");
    this._dataroom_service
      .revert_default_my_team_setting(this.my_team_branding_detail)
      .subscribe((res) => {
        this.my_team_branding_detail = res;
        this.msg = "My team branding information successfully set default";
        this.showSuccess();
      });
  }

  team_logo_url: string = "";
  uploadMyTeamLogo(files?: HTMLInputEvent) {
    let _newfiles: any = files.target.files[0];

    if (_newfiles) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.is_my_team_logo_default = true;
        this.team_logo_url = event.target.result;
        // upload myteam logo picture to the server
        this._dataroom_service
          .upload_my_team_logo(_newfiles, this.my_team_id)
          .subscribe((res) => {
            //
            res.data.my_team_logo = this.base_url + res.data.my_team_logo;
            console.log("team logo url is", res.data.my_team_logo);
            this.my_team_data = res.data;
            this.msg = res.msg;
            this.showSuccess();
          });
      };
      reader.readAsDataURL(_newfiles);
    }
  }

  // handle file input
  is_branding_logo_default: boolean = false;
  is_email_header_default: boolean = false;
  is_favicon_icon_default: boolean = false;
  branding_logo: any; //= new File([""], "filename");
  email_header: any; //= new File([""], "filename");
  favicon_icon: any; //= new File([""], "filename");
  is_branding_logo_url: string;
  is_email_header_url: string;
  is_favicon_icon_url: string;

  handleFileInput(event, type) {
    console.log("Type is", type);
    if (type == "branding_logo") {
      this.is_branding_logo_default = true;
      console.log("type is branding logo");
      this.branding_logo = event.target.files[0];
      if (this.branding_logo) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.is_branding_logo_url = event.target.result;
        };
      }
      reader.readAsDataURL(this.branding_logo);
    } else if (type == "email_header") {
      this.is_email_header_default = true;
      console.log("type is email header");
      this.email_header = event.target.files[0];
      if (this.email_header) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.is_email_header_url = event.target.result;
        };
      }
      reader.readAsDataURL(this.email_header);
    } else if (type == "favicon_icon") {
      this.is_favicon_icon_default = true;
      this.favicon_icon = event.target.files[0];
      if (this.favicon_icon) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.is_favicon_icon_url = event.target.result;
        };
      }
      reader.readAsDataURL(this.favicon_icon);
    } else {
      console.log("Show alert message , if nothing is seleted");
    }
  }

  // file reader common function

  // upload team branding logo here
  upload_my_team_branding_logo() {
    this._dataroom_service
      .upload_my_team_branding_logo(
        this.branding_logo,
        this.email_header,
        this.favicon_icon,
        this.my_team_id
      )
      .subscribe((res) => {
        //
        res.data.branding_logo = this.base_url + res.data.branding_logo;
        res.data.email_header = this.base_url + res.data.email_header;
        res.data.favicon_icon = this.base_url + res.data.favicon_icon;
        this.my_team_branding_detail = res.data;
        //reinitialze the value of all varilabel of upload branding inside  files
        this.email_header = [];
        this.branding_logo = [];
        this.favicon_icon = [];
      });
    // }
  }

  // get overview data

  getOverviewData() {
    //
    console.log("get overview data method called");
    this.get_all_my_team_members();
  }

  // get all my team data e.g datarooms and members

  get_all_my_team_members() {
    this._dataroom_service
      .get_all_my_team_members(this.my_team_id)
      .subscribe((res) => {
        //
        this.all_datarooms = res.datarooms;
        this.all_members = res.team_member_data;
      });
  }

  // cretae new dataroom

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

  // get my team overview data

  get_my_team_data() {
    this._dataroom_service.getMyTeamData(this.my_team_id).subscribe((res) => {
      //res.my_team_logo  = this.base_url+res.my_team_logo;
      this.my_team_data = res;
    });
  }
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
