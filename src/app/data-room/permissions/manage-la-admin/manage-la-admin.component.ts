import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataRoomService } from "../../../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import { MatStepperModule } from "@angular/material/stepper";
import { Folder } from "../../../models/folder";

import { CookieService } from "ngx-cookie-service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-manage-la-admin",
  templateUrl: "./manage-la-admin.component.html",
  styleUrls: ["./manage-la-admin.component.css"],
})
export class ManageLaAdminComponent implements OnInit {
  currentDataroomId: any;
  newGroupForm: FormGroup;
  adminForm: FormGroup;
  // end user form
  FirstEndUserGroup: FormGroup;
  SecondOverviewFormPermission: FormGroup;
  ThirdMemberAdditionForm: FormGroup;
  FourthDocumentPermissions: FormGroup;
  FolderSpecificPermissions: FormGroup;
  deleteForm: FormGroup;
  deletes: any = "";
  msg: string;
  all_admin_list: any = []; // create new admin
  isLinear: boolean = false;
  all_root_folder: Folder[] = [];
  all_end_user_groups: any[] = [];
  is_hide_drm: boolean = false;
  is_hide_watermarking: boolean = false;
  // end user folder permission
  hideDocPermission: boolean = false;
  device: boolean = true;
  selected_group_id: number = 0;
  all_end_user_group_members: any[] = [];
  enduser_group_member_form: FormGroup;
  enduser_group_id: number = 0;
  selectedIndex: number = 0;
  checkbox_la: number = 0;
  errormsg: any[];
  item: string = "";
  user: any;
  isManageActionBar: boolean;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private cookieService : CookieService,
    private toastr: ToastrService,
    private dataRoomService: DataRoomService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    const id = parseInt(this.route.snapshot.paramMap.get("group_id"));
    //console.log("Type is:", typeOf(this.route.snapshot.paramMap.get('indx')));
    this.selectedIndex = parseInt(this.route.snapshot.paramMap.get("indx"));

    this.enduser_group_id = id;
    console.log("Manage Permission Group Id is:", id);
    this.currentDataroomId =localStorage.getItem("currentDataroomId");
    this.getFeatures(this.currentDataroomId); 
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required],
    });

    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ["", Validators.required],
    });

    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ["", Validators.required],
    });

    
    this.deleteForm = new FormGroup({
      delete: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
  }

  ngOnInit() {
    this.getUserInfo()
    this.initializeNewAdminForm();
    this.intializerNewGroupForm();
    this.initializeEndUserGroup();
    this.initializeOverviewFormPermission();
    this.intializeMemberAdditionForm();
    this.initializeDocumentAndPermission();
    this.getAllAdmins();
    this.getAllRootFolders();
    this.getAllEndUserGroups();
    this.initializeEndUserMemberGroup();
    this.getEndUserGroupInformation();
    this.initCreateNewMemberForm();
    this.initializeCreateNewAdminForm();
    this.getAllContactGroups();
    this.getAllContacts();
    this.addValue();
  }
  addValue() {
    this.item = "I'd like you to join my secure dataroom.";
  }

  
  is_disabled_delete_button: boolean = false;
  onKeyCheckDelete(event) {
    console.log("data is ", event);
    if (event.toLowerCase() == "delete") {
      this.is_disabled_delete_button = true;
    }
  }


  data: any = []
  deleteBulk() {
    const ids = this.selectedAll1.map(item => item.id);
    this.data = {
      id: ids,
      is_deleted: "is_deleted_la"
    }
    console.log(this.data)
    this.dataRoomService.DeleteUser(this.currentDataroomId,this.enduser_group_id, this.data).subscribe((res) => {
      console.log(res);
      this.deletes='';
      this.selectedAll1=[];
      this.msg = "Admin deleted successfully";
      this.showError();
      this.getAllAdmins();
    }, (error) => {
      console.log(error);
    });
  } 

  select: boolean = true;

  ProperSelection(value) {
    this.all_contacts;
    if (value == 0) {
      this.select = true;
      this.all_contacts_groups.forEach((res) => {
        res.select = false;
      });
      this.getAllContacts();
    } else {
      this.select = false;
      this.all_contacts_groups.forEach((res) => {
        if (res.id == value) {
          res.select = true;
        } else {
          res.select = false;
        }
      });
      this.getAllContactGroupMembers(value);
    }
  }

  getAllContactGroupMembers(group) {
    this.dataRoomService
      .getAllContactsAssociatedWithGroup(group)
      .subscribe((res) => {
        //
        console.log("get all contacts related field successfully");
        console.log("Result is", res);
        this.all_contacts = res;
        // this.status = !this.status;
      });
  }

  all_contacts: any;
  getAllContacts() {
    this.dataRoomService.getAllContacts().subscribe((res) => {
      this.all_contacts = res.filter((data) => (data.selected = true));
      console.log("get all contacts successfully",this.all_contacts);
    });
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


  all_contacts_groups: any;
  getAllContactGroups() {
    this.dataRoomService.getAllContactsGroup().subscribe((res) => {
      this.all_contacts_groups = res;
      //this.initializeContactFrom();
    });
  }

  // stepper for manage new admin
  firstCreateNewAdmin: FormGroup;
  secondInviteMessage: FormGroup;

  initializeCreateNewAdminForm() {
    this.firstCreateNewAdmin = this._formBuilder.group({
      firstCtrl: [""],
    });
    this.secondInviteMessage = this._formBuilder.group({
      secondCtrl: [
        "I'd like you to join my secure dataroom.",
        Validators.required,
      ],
    });
  }

  // initialization Overviewform permission
  initializeOverviewFormPermission() {
    console.log("initialize overview form permission");
    this.SecondOverviewFormPermission = new FormGroup({
      is_edit_dataroom_index: new FormControl(false, [Validators.required]),
      is_watermarking: new FormControl(false, [Validators.required]),
      is_drm: new FormControl(false, [Validators.required]),
    });
  }

  delete_type: string;
  removeSelectedElement(member, group_id, i) {
    this.delete_type = "is_deleted_la";
    console.log("delete admin", member, this.selected_group_id);
    console.log("delete admin", this.user.email);
    console.log("delete admin", member.member.email);

    if (member.member.email != this.user.email) {

      this.dataRoomService
        .delete_dataroom_admin_type(member.id, this.enduser_group_id, this.delete_type)
        .subscribe((res) => {
          this.managemerbers();
          this.msg = "Limited Access user deleted successfully.";
          this.showError();
        });

    } else if (member.member.email == this.user.email) {
      this.msg = "You can't delete youself.";
      this.showError();
      console.log("????????????????????????????? you can delete youself")

    }


  }

  onlyTextValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^[a-zA-Z\s]*$/.test(control.value);
    return valid ? null : { 'invalidText': { value: control.value } };
  }

  emailPattern =
  "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
  "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  

  initializeNewAdminForm() {
    this.adminForm = new FormGroup({
      first_name: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        this.onlyTextValidator
      ]),
      last_name: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        this.onlyTextValidator
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(this.emailPattern)
      ]),
    });
  }

  intializerNewGroupForm() {
    this.newGroupForm = new FormGroup({
      group_name: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
    });
  }

  // initilization member addition form
  all_end_users: any = [];
  intializeMemberAdditionForm() {
    console.log("member addition form");
    this.ThirdMemberAdditionForm = new FormGroup({
      first_name: new FormControl("", [
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      last_name: new FormControl("", [
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      email: new FormControl("", [
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
    });
  }

  initializeEndUserGroup() {
    this.FirstEndUserGroup = new FormGroup({
      group_name: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
    });
  }

  // initialize document and permission module
  initializeDocumentAndPermission() {
    this.FourthDocumentPermissions = new FormGroup({
      is_donwload_permission: new FormControl(""),
      // itemPermissionRow: this._formBuilder.array([this.initPermissionRows()])
    });
  }

  initPermissionRows() {
    return this._formBuilder.group({
      is_no_access: new FormControl("", []),
      is_view_only: new FormControl("", []),
      is_view_and_print: new FormControl("", []),
      is_view_and_print_download: new FormControl("", []),
      is_upload: new FormControl("", []),
      is_watermark: new FormControl("", []),
      is_drm: new FormControl("", []),
      is_editor: new FormControl("", []),
    });
  }

  // initializer enduser group form
  yourFn(event) {
    console.log(event.index, "event check");
    if (event.index == 3) {
      this.dataRoomService
        .getSingleDataroom(this.currentDataroomId)
        .subscribe((res) => {
          this.dataroom_live = res.is_dataroom_on_live;
          console.log(this.dataroom_live, "invitation_send_successfully");
          if (this.dataroom_live) {
            this.getAllAdmins();
          } else {
            this.getAllAdmins();
          }
        });
    }
    if (event.index == 2) {
      this.checkedArray = false;
    }
  }

  initializeEndUserMemberGroup() {
    this.enduser_group_member_form = this._formBuilder.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      email: ["", Validators.required],
      is_la_user: [true],
    });
  }

  // on submit admin form
  onSubmitAdminForm(adminForm: any) {
    console.log("admin form is", adminForm.value);
    let custom_message = "Hi";
    this.dataRoomService
      .create_an_dataroom_admin(
        this.currentDataroomId,
        adminForm.value,
        custom_message
      )
      .subscribe(
        (res: any) => {
          this.all_admin_list.push(res);
          this.msg = "Admin successfully added !";
          this.showInfo();
          this.adminForm.reset();
        },

        (error: any) => {
          console.log("error", error);
          this.msg = error.error.msg;
          this.showError();
        }
      );
  }
  // create end user group member
  createEnduserGroupMember() {
    console.log("create End user Group Member");
    console.log(this.enduser_group_member_form.value);
    this.all_end_user_group_members.push(this.enduser_group_member_form.value);
    this.enduser_group_member_form.reset();
  }

  // delete member from end user group

  deleteMemberFromGroup(i) {
    console.log("delete member from group", i);
    this.all_end_user_group_members.splice(i, 1);
    this.msg = "Member successfully deleted !";
    this.showError();
  }

  // common success messges
  all_groups: any = [];
  newGroupFormSubmit(groupForm: any) {
    this.all_groups.push(groupForm.value);
    this.msg = "Group successfully added !";
    this.showInfo();

    // reset the group form submit
    this.newGroupForm.reset();
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


  getUserInfo() {
    //this.dataRoomService.getUserProfile().subscribe((res) => {
    this.user = JSON.parse(localStorage.getItem("currentUser"));
    //});
  }

  // delete admin
  deleteAdmin(i, admin_id) {
    console.log("delete admin", admin_id);
    this.dataRoomService.delete_dataroom_admin(admin_id).subscribe((res) => {
      this.all_admin_list.splice(i, 1);
      this.msg = "Limited Access user deleted successfully.";
      this.showError();
    });
  }


  managemerbers() {
    console.log("Manage Members");
    this.dataRoomService
      .getSingleDataroom(this.currentDataroomId)
      .subscribe((res) => {
        this.dataroom_live = res.is_dataroom_on_live;
        console.log(this.dataroom_live, "invitation_send_successfully");
        if (this.dataroom_live) {
          this.dataRoomService
            .getALLLAUsers(this.currentDataroomId, this.enduser_group_id)
            .subscribe((res) => {
              this.all_admin_list = res.filter((res) => res.is_la_user == true);

              this.all_new_admin = this.all_admin_list.filter(
                (res) => res.selected == true
              );
              console.log("all admins are ", this.all_admin_list);
            });
        }
      });
  }

  // Start rajendra Work here
  add_user_list: any;
  all_new_admin: any[] = [];
  dataroom_live: boolean = false;
  checkedArray: boolean;

  addLaUserGroup() {

    console.log("send Invitation");
    this.selectedIndex = 2;
    console.log("delete admin", this.enduser_group_id, this.all_new_admin);
    this.dataRoomService
      .getSingleDataroom(this.currentDataroomId)
      .subscribe((res) => {
        this.dataroom_live = res.is_dataroom_on_live;
        console.log(this.dataroom_live, "invitation_send_successfully");
        if (this.dataroom_live) {
          this.dataRoomService
            .add_dataroom_la_user_group(
              this.currentDataroomId,
              this.enduser_group_id,
              this.all_new_admin,
              "Live",
              this.item
            )
            .subscribe(
              (res) => {
                this.addValue();
                // this.all_admin_list.splice(i, 1);
                this.msg = "Limited Access user added successfully.";
                this.getAllAdmins();
                this.selectedIndex = 3;
                this.add_user_list = this.all_admin_list.filter(
                  (ress) => ress.selected == true
                );
                this.showSuccess();
                this.checkedArray = true;
              },
              (error) => {

                this.msg = error.error.msg
                console.log(this.msg, "error", this.msg, "msg")
                this.showError();
              }
            );
        } else {
          this.msg =
            "Dataroom is on hold stage. Invitation will be sent once dataroom is on Live stage. Go to manage member section and refresh the page to see new members.";
          this.showInfo();
          this.getAllAdmins();
          this.selectedIndex = 3;
          this.checkedArray = true;

          this.dataRoomService
            .add_dataroom_la_user_group(
              this.currentDataroomId,
              this.enduser_group_id,
              this.all_new_admin,
              "Hold",
              this.item
            )
            .subscribe(
              (res) => {
                this.addValue();
                console.log(res, "Hold");
              },
              (error) => {
                this.msg = error._body;
                this.showError();
              }
            );
        }
      });
  }

  // End rajendra work

  resendInvitation(member) {
    console.log(member.dataroom.is_dataroom_on_live);
    if (member.dataroom.is_dataroom_on_live) {
      this.dataRoomService.resendInvitationLink(member).subscribe((res) => {
        this.msg = "Invitation resent successfully";
        this.showInfo();
      });
    } else {
      this.msg = "You Can't Send Invitation, Because Dataroom is not live";
      this.showInfo();
    }
  }

  resendInvitationBulk(member) {
    console.log(member.dataroom.is_dataroom_on_live);
    if (member.dataroom.is_dataroom_on_live) {
      this.dataRoomService.resendInvitationLink(member).subscribe((res) => {
        if(this.all_admin_list[this.selectedAll1.length - 1]['id'] == member.id){
          this.msg = "Invitation resent successfully";
          this.showInfo();
        }
      });
    }
  }

  addNewEndUserMember(ThirdMemberAdditionForm) {
    console.log("add new end user admin");
    console.log("admin form value is", ThirdMemberAdditionForm);
    this.all_end_users.push(ThirdMemberAdditionForm);
    this.ThirdMemberAdditionForm.reset();
    this.msg = "Team Member added successfully.";
    this.showInfo();
  }

  // FourthDocumentPermissions

  //isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  // delete member
  deleteMemberSuccessfully(i) {
    this.all_end_users.splice(i, 1);
    this.msg = "Member successfully deleted !";
    this.showError();
  }

  // get all admins from server
  q_flag: boolean = false;
  getAllAdmins() {
    this.dataRoomService
      .getALLLAUsers(this.currentDataroomId, this.enduser_group_id)
      .subscribe((res) => {
        console.log("all admins are ", res);
        this.all_admin_list = res.filter((res) => res.is_la_user == true);
        this.all_new_admin = this.all_admin_list.filter(
          (res) => res.selected == true
        );
      });
    this.dataRoomService
      .get_end_user_group_information(this.enduser_group_id)
      .subscribe((res) => {
        console.log(res)
        this.q_flag = res.is_q_and_a;
        console.log(this.q_flag, "is_q_and_a");
        if (!this.q_flag) {
          this.all_admin_list.is_q_a_user = false;
        }
      });
  }

  // get all end user groups
  submitEndUserGroup(end_user_group_information: any) {
    this.selectedIndex = 0;
    this.dataRoomService
      .edit_enduser_group_information(end_user_group_information)
      .subscribe((res) => {
        this.msg = "Limited Access group name updated successfully.";
        this.showInfo();
        this.selectedIndex = 1;
      });
  }

  end_user_group_information: any;
  getEndUserGroupInformation() {
    this.dataRoomService
      .get_end_user_group_information(this.enduser_group_id)
      .subscribe((res) => {
        this.end_user_group_information = res;
        console.log(this.end_user_group_information, "is_q_and_a");
      });
  }

  // get all rooot folders :
  getAllRootFolders() {
    this.dataRoomService
      .get_all_permission_root_folders(this.currentDataroomId)
      .subscribe((res) => {
        this.all_root_folder = res;
        console.log("all files are ", this.all_root_folder);
      });
  }

  // get all end user groups
  getAllEndUserGroups() {
    this.dataRoomService
      .getAllDataroomEndUserGroups(this.currentDataroomId)
      .subscribe((res) => {
        this.all_end_user_groups = res;
      });
  }

  getSelectedGroup(event) {
    console.log("event is", event);
    this.selected_group_id = event;
  }

  createLauserPermission(end_user_group_information) {
    // this.all_la_enduser_groups.push(this.laendusergroups.value);
    // this.laendusergroups.get("limited_access").setValue(true);
    const id = parseInt(this.route.snapshot.paramMap.get("group_id"));
    console.log("Apply Permission Group:-----", end_user_group_information, id);
    this.selectedIndex = 1;

    this.dataRoomService
      .update_endusers_and_permission_data1(end_user_group_information)
      .subscribe((res) => {
        this.msg = "Limited Access group permission applied successfully.";
        this.showSuccess();
        this.selectedIndex = 2;
        this.getEndUserGroupInformation();
        // this.is_create_new_enduser_group = false;
        // this.laendusergroups.reset();
      });
  }

  // on change permission
  onChangePermission(folder, per_type) {
    console.log("event data is", folder);
    if (per_type === "no_access") {
      folder.is_view_only = false;
      folder.is_view_and_print = false;
      folder.is_view_and_print_download = false;
      folder.is_upload = false;
      folder.is_watermark = false;
      folder.is_drm = false;
      folder.is_editor = false;
    } else if (per_type === "is_view_only") {
      folder.is_no_access = false;
      folder.is_view_and_print = false;
      folder.is_view_and_print_download = false;
    } else if (per_type === "is_view_and_print") {
      folder.is_view_only = false;
      folder.is_no_access = false;
      folder.is_view_and_print_download = false;
    } else if (per_type === "is_view_and_print_download") {
      folder.is_view_only = false;
      folder.is_no_access = false;
      folder.is_view_and_print = false;
    }
  }

  // revoke access now
  revokeAccessNow() {
    console.log("Revoke access now ");
    // this.all_root_folder.filter((res)=>{})
    this.all_root_folder.forEach(function (element) {
      element.is_view_only = false;
      element.is_no_access = true;
      element.is_view_and_print_download = false;
      element.is_view_and_print = false;
      element.is_editor = false;
      element.is_drm = false;
      element.is_watermark = false;
    });
  }

  // revoke drm
  revokeDrm() {
    console.log("revoke Shortcut");
    this.all_root_folder.forEach(function (element) {
      element.is_drm = false;
    });
  }

  // hide permission son document
  hidePermissionsOnDocument() {
    console.log(
      "second form value -- is drm ",
      this.SecondOverviewFormPermission.controls["is_drm"].value
    );
    console.log(
      "second form value -- is is_edit_dataroom_index ",
      this.SecondOverviewFormPermission.controls["is_edit_dataroom_index"].value
    );
    console.log(
      "second form value -- is is_watermarking ",
      this.SecondOverviewFormPermission.controls["is_watermarking"].value
    );
    this.is_hide_watermarking = this.SecondOverviewFormPermission.controls[
      "is_watermarking"
    ].value;
    this.is_hide_drm = this.SecondOverviewFormPermission.controls[
      "is_drm"
    ].value;
  }

  // getSelectedGroup
  getSelctedGroupInformation() {
    if (this.selected_group_id === 0) {
      alert("Please selcte group");
      // pass do nothing
    } else {
      this.hideDocPermission = true;
      console.log("hide doc permission");
    }
  }

  // get all end user groups

  getAllEndUserGroupMember() {
    // this.all_end_user_group_members = [];
    console.log("all end user groups");
  }



  private fieldArray: Array<any> = [];
  private newAttribute: any = {};

  addFieldValue() {
    this.fieldArray.push(this.newAttribute);
    this.newAttribute = {};
  }

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }
  goBack() {
    this.location.back();
  }

  // get first name and last name
  getFirstnameAndLastname(event: any) {
    let values = "dhananjay.s@axat-tech.com";
    if (typeof values != "undefined" || values != "") {
      console.log("values are ", values);
      this.dataRoomService
        .getFirstnameAndLastnameUsingEmail(values)
        .subscribe((res) => {
          console.log("result data is ", res);
        });
    }
    {
      console.log("Please eneter something");
    }
  }

  // create New Member form
  memberForm: FormGroup;

  initCreateNewMemberForm() {
    this.memberForm = this._formBuilder.group({
      email: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(this.emailPattern),
        ],
      ],
      first_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          this.onlyTextValidator
        ],
      ],
      last_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          this.onlyTextValidator
        ],
      ],
      is_la_user: [true],
      dataroom_group_id: [0],
    });
  }

  addNewAdminMember() {
    console.log("add new member method called", this.memberForm.value);
    // this.memberForm.
    this.memberForm.get("dataroom_group_id").setValue(this.enduser_group_id);
    this.dataRoomService.checkAdmin(this.memberForm.value).subscribe(
      (res) => {
        this.all_new_admin.push(this.memberForm.value);
        this.initCreateNewMemberForm();
        console.log("result data is ", res);
      },
      (error: any) => {
        console.log("error", error);
        this.msg = error.error.msg;
        this.showError();
      }
    );
  }

  checkNewAdminMember(member, event) {
    member.is_la_user = true;
    member.dataroom_group_id = this.enduser_group_id;

    if (event.checked == true) {
      this.dataRoomService.checkAdmin(member).subscribe(
        (res) => {
          this.all_new_admin.push(member);
          console.log("result data is ", res);
        },
        (error: any) => {
          console.log("error", error);
          this.msg = error.error.msg;
          this.showError();
        }
      );
    } else {
      var index = this.all_new_admin.findIndex(
        (res) => res.email === member.email
      );
      console.log(member.email, index);
      if (index >= 0) {
        this.all_new_admin.splice(index, 1);
      }
    }
  }

  deleteNeelyAddedAdmin(i) {
    this.all_new_admin.splice(i, 1);
    this.msg = "Member Deleted Successfully";
    this.showError();
  }

  is_review_added = false;

  addReview() {
    console.log("add review");
    this.is_review_added = !this.is_review_added;
  }

  invitation_send_successfully() {
    this.msg = "Inviatation successfully send";
    this.showSuccess();
  }

  checkboxLaAdmin(i, event) {
    this.all_new_admin[i].state = event.checked;
    // this.bulk_checkbox = this.bulk_checkbox + 1
    let checkbox = this.all_new_admin.filter((res) => res.state == true);
    this.checkbox_la = checkbox.length;
    console.log("bulk_checkbox:-------------" + this.checkbox_la);
  }

  selectedAll: any = [];
  toggle: boolean = false;
  checkboxAllLaAdmin() {
    this.toggle = !this.toggle;
    if (this.toggle === true) {
      this.selectedAll = this.all_new_admin.filter(function (contact) {
        return (contact.state = true);
      });
      let checkbox = this.all_new_admin;
      this.checkbox_la = checkbox.length;
    } else {
      this.selectedAll = this.all_new_admin.filter(function (contact) {
        return (contact.state = false);
      });
      this.checkbox_la = 0;
    }
  }

  bulkdeleteAllLaAdmin() {
    this.all_new_admin = [];
    this.checkbox_la = 0;
    this.getAllAdmins();
  }

  checkbox_la_manage: number = 0;
  checkIfSelectedManageLaAdmin(event,member) {

    member.selected = event.checked;
    let all_admins_count = this.all_admin_list.filter(
      (res) => res.state === true
    );
    this.selectedAll1 = all_admins_count;

    console.log("all admins count is", this.selectedAll1);
    if (all_admins_count.length > 0) {
      this.isManageActionBar = true;
    } else {
      this.isManageActionBar = false;
    }
  }



  SendInvitation() {
    this.selectedAll1.map((p) => {
      this.resendInvitationBulk(p)
    });
  }

  selectedAll1: any = [];
  toggle1: boolean = false;
  checkboxAllLaManage(key) {
    console.log(this.user, "key");
    const email = this.user.email;
    this.toggle1 = !this.toggle1;
    if (this.toggle1 === true) {

      if (key == 'first') {
        this.selectedAll1 = this.all_admin_list.filter(function (contact) {
          return (contact.state = true && contact.memberactivestatus == false);
        });
      } else if (key == 'second') {
        this.selectedAll1 = this.all_admin_list.filter(function (contact) {
          return (contact.state = true && contact.member.email != email );
        });
      }

      console.log(this.selectedAll1, "selected all");
      let checkbox = this.selectedAll1;
      this.checkbox_la_manage = checkbox.length;

      if (checkbox.length >= 1) {
        this.isManageActionBar = true;
      } else {
        this.checkbox_la_manage = 0;
        this.isManageActionBar = false;
      }

    } else {
      this.isManageActionBar = false;
      this.selectedAll1 = this.all_admin_list.filter(function (contact) {
        return (contact.state = false);
      });
      this.checkbox_la_manage = 0;
    }
  }



  ngAllChecked: boolean = false;
  deleteManageAdmin() {
    console.log(
      "selectedAll1:-",
      this.selectedAll1,
      "all_admin_list:-",
      this.all_admin_list
    );
    this.dataRoomService
      .delete_dataroom_all_admin(this.all_admin_list)
      .subscribe((res) => {
        this.all_admin_list = [];
        this.msg = "Delete all admin successfully !";
        this.showError();
        this.getAllAdmins();
        // this.ngAllChecked = false;
      });
  }

  activeButton: 'first' | 'second' | null = null;

  setActive(button: 'first' | 'second') {
    this.activeButton = button;
    console.log(this.all_admin_list, "ngAllChecked");
    if (this.ngAllChecked == true) {
      this.checkboxAllLaManage(this.activeButton);
      this.ngAllChecked = false;
    }
    this.all_admin_list.filter(function (contact) {
      return (contact.state = false);
    })
  }

  ChangesByEmail(email) {
    this.dataRoomService.getUserByEmail(email).subscribe((res) => {
      this.memberForm.get("first_name").setValue(res.first_name);
      this.memberForm.get("last_name").setValue(res.last_name);
    });
  }

  addPrimaryContact(event: any) {
    // let primary_list = this.all_admin_list.filter((res)=>res.primary_user==true&&res.primary_user==false);
    let primary_list = this.all_admin_list;
    console.log(this.currentDataroomId, primary_list, "list primary");

    this.dataRoomService
      .addDataroomPrimaryContact(this.currentDataroomId, primary_list)
      .subscribe((res) => {
        this.qa_apply = false;
        console.log("Add primary contact successful.", primary_list);
        this.msg = "Limited Access group changes applied successfully.";
        this.showSuccess();
        this.getAllAdmins();
      });
  }
  ClickPrimary(event, i) {
    this.all_admin_list[i].is_primary_user = event.checked;
    var is_primary_user = this.all_admin_list.filter(
      (res) => res.is_primary_user == true
    );
    if (is_primary_user.length > 0) {
      this.qa_apply = true;
    }
  }
  qa_apply: boolean = false;
  ClickQAUSER(event, i) {
    this.all_admin_list[i].is_q_a_user = event.checked;
    var qa_user = this.all_admin_list.filter((res) => res.is_q_a_user == true);
    if (qa_user.length > 0) {
      this.qa_apply = true;
    }
  }
}
