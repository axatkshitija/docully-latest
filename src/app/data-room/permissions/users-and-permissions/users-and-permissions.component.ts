import { DatePipe, Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataRoomService } from "../../../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import { MatStepperModule } from "@angular/material/stepper";
import { Folder } from "../../../models/folder";

import { CookieService } from "ngx-cookie-service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-users-and-permissions",
  templateUrl: "./users-and-permissions.component.html",
  styleUrls: ["./users-and-permissions.component.css"],
})
export class UsersAndPermissionsComponent implements OnInit {
  currentDataroomId: any;
  msg: string;
  all_admin_list: any = []; // create new admin
  all_end_user_groups: any[] = [];
  selected_group_id: number = 0;
  all_end_user_group_members: any[] = [];
  all_la_user_groups: any;

  constructor(
    private toastr: ToastrService,
    private dataRoomService: DataRoomService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private location: Location,
    private datePipe: DatePipe,
    private cookieService:CookieService,
  ) {
    this.currentDataroomId =localStorage.getItem("currentDataroomId");
    this.getFeatures(this.currentDataroomId)
  }
  ngOnInit() {
    this.initializeNewAdminForm();
    this.initEndusergroup();
    this.initLaEndusergroup();
    this.getAllEndUserGroups();
    this.getAllAdmins();
    this.getUserInfo();
    this.getAllDisclaimers();
    // this.getAllUsers();
  }

  dataroom_users_list: any;
  getAllUsers() {
    this.dataRoomService
      .getDataroomAllUsers(this.currentDataroomId)
      .subscribe((res) => {
        this.dataroom_users_list = res;
        console.log(
          "Dataroom Id:---",
          this.currentDataroomId,
          this.dataroom_users_list
        );
      });
  }

  all_disclaimers: boolean = false;
  getAllDisclaimers() {
    this.dataRoomService
      .getAllDisclaimers(this.currentDataroomId)
      .subscribe((res) => {
        var disclaimers = res.filter(
          (res) => res.is_dataroom_disclaimer_default === true
        );

        if (disclaimers.length > 0) {
          this.all_disclaimers = false;
        } else {
          this.all_disclaimers = true;
        }
      });
  }


  nameValidator(control: FormControl): { [key: string]: boolean } {
    const nameRegexp: RegExp = /[!#%^+\=\[\]{};':"\\|,.<>\?]/;
    if (control.value && nameRegexp.test(control.value)) {
       return { invalidName: true };
    }
}
  laendusergroups: FormGroup;
  initLaEndusergroup() {
    this.laendusergroups = this._formBuilder.group({
      group_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          this.nameValidator
        ],
      ],
      limited_access: [true],
    });
  }

  endusergroups: FormGroup;
  initEndusergroup() {
    this.endusergroups = this._formBuilder.group({
      group_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          this.nameValidator
        ],
      ],
      access_revoke: [""],
      end_user: [true],
    });
  }

  adminForm: FormGroup;
  emailPattern =
    "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
    "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  initializeNewAdminForm() {
    this.adminForm = new FormGroup({
      first_name: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      last_name: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(this.emailPattern),
      ]),
    });
  }

  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  showInfo() {
    this.toastr.info(this.msg);
  }

  // get all end user groups
  // getAllLaUserGroups(){
  //
  //   this.dataRoomService.getAllDataroomLaUserGroups(this.currentDataroomId)
  //   .subscribe((res)=>{
  //
  //      console.log("all la user groups are", res);
  //     this.all_la_user_groups = res;
  //   })
  // }
  groups: any;

  // get all end user groups
  getAllEndUserGroups() {
    this.dataRoomService
      .getAllDataroomEndUserGroups(this.currentDataroomId)
      .subscribe((res) => {
        console.log("all end user groups are", res);
        this.groups = res.reverse();
        this.all_la_enduser_groups = this.groups.filter(
          (res) => res.limited_access == true
        );
        this.all_end_user_groups = this.groups.filter(
          (res) => res.end_user == true
        );
      });
  }

  goToEnduserManagePermissions(group, indx) {
    console.log("group is", group);
    this.router.navigate(["/manage-permission/", group.id, indx]);
  }

  want_to_create_new_admin: boolean = false;

  addNewAdminFromGroup() {
    console.log("addNewAdminFromGroup");
    this.want_to_create_new_admin = !this.want_to_create_new_admin;
  }

  goToManageAdminPage(idx: number) {
    this.router.navigate(["manage-admin-group-permission", idx]);
  }

  goToUserListPage() {
    this.router.navigate(["all-users-list"]);
  }

  // go to manage limited admin access
  goToManageLimitedAccessAdmins() {
    console.log("goToManageLimitedAccessAdmins");
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

  // go to mannage la admin
  goToManageLAadmin(la_group, indx) {
    console.log("goToManageAdmin");
    this.router.navigate(["/manage-la-permission/", la_group.id, indx]);
  }

  // delete an end user group
  deleteEndUserGroup(i, group) {
    console.log("delete end user group");

    this.dataRoomService.delete_end_user_group(group.id).subscribe((res) => {
      this.all_end_user_groups.splice(i, 1);
      this.msg = "End user group deleted successfully.";
      this.showSuccess();
    });
  }

  goEnduserManagePermissions(group, indx) {
    console.log("group is", group);
    this.router.navigate(["/document-permission/", group.id, indx]);
  }

  deleteLAUserGroup(i, group) {
    console.log("delete end user group");
    this.dataRoomService.delete_end_user_group(group.id).subscribe((res) => {
      this.all_la_enduser_groups.splice(i, 1);
      this.msg = "Limited Access Admin Group deleted successfully.";
      this.showSuccess();
    });
  }

  // is create new la admin
  is_la_admin: boolean = false;
  IsCreateNewLAGroup() {
    console.log("cretae new la admin");
    this.is_la_admin = !this.is_la_admin;
    this.laendusergroups.reset();
  }

  //

  is_create_new_enduser_group = false;
  createNewEndUserGroup() {
    console.log("create new end user group");
    //this.is_create_new_enduser_group = !this.is_create_new_enduser_group;
    console.log("endusergroups", this.endusergroups.value);
    // this.all_end_user_groups.push(this.endusergroups.value);
    this.endusergroups.get("end_user").setValue(true);

    let selectedDate = this.endusergroups.get('access_revoke').value;
    this.endusergroups.get('access_revoke').setValue(this.datePipe.transform(selectedDate, 'yyyy-MM-ddThh:mm:ss'));
    console.log(this.endusergroups.get('access_revoke').value)
    this.dataRoomService
      .create_end_user_group(this.currentDataroomId, this.endusergroups.value)
      .subscribe((res) => {
        this.msg = "End User group created successfully.";
        this.showSuccess();
        this.endusergroups.reset();
        this.is_create_new_enduser_group = false;
        this.getAllEndUserGroups();
      });
  }

  IsCreateNewEnduserGroup() {
    console.log("is_crete new enduser group");
    this.is_create_new_enduser_group = !this.is_create_new_enduser_group;
    this.laendusergroups.reset();
  }

  usrs_and_permission_data: any;
  getAllAdmins() {
    this.dataRoomService
      .getAllAdmins(this.currentDataroomId)
      .subscribe((res) => {
        console.log("all admins are ", res);
        this.usrs_and_permission_data = res;
      });
  }

  // la admin groups

  all_la_enduser_groups: any[] = [];
  createLAGroup() {
    // this.all_la_enduser_groups.push(this.laendusergroups.value);
    this.laendusergroups.get("limited_access").setValue(true);
    console.log("delete LA End user group:-----", this.laendusergroups.value);

    this.dataRoomService
      .create_la_user_group(this.currentDataroomId, this.laendusergroups.value)
      .subscribe((res) => {
        this.msg = "Limited Access Admin Group created successfully.";
        this.showSuccess();
        // this.is_create_new_enduser_group = false;
        this.laendusergroups.reset();
        this.getAllEndUserGroups();
        this.is_la_admin = false;
      });
  }

  deleteLAEnduserGroup(i) {
    console.log("delete LA End user group");
    this.all_la_enduser_groups.splice(i, 1);
    this.msg = "LA group sucessfully deleted !";
    this.showSuccess();
  }

  user: any;
  user_id: number;
  getUserInfo() {
    // this.dataRoomService.getUserProfileDatroom(this.currentDataroomId).subscribe((res) => {
    //     this.user = res;
    //     this.user_id = res.id;
    //     this.getDataroomUser();
    //   });
  }

  receiveAutoMsgHandler(p) {
    this.getDataroomUser();
    this.user = p.userdetail;
    console.log(this.user, "overview");
    console.log(p, "overview???????????????????????????????/");
    this.user_id = p.userdetail.id;
  }


  primary_users_disclaimer_status: any;
  getDataroomUser() {
    this.dataRoomService
      .dataroom_mem_list(this.currentDataroomId, this.user_id)
      .subscribe((res) => {
        this.primary_users_disclaimer_status = res[0];
        console.log("primary_users_disclaimer_status",this.primary_users_disclaimer_status)
      });
  }
}
