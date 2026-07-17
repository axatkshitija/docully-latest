import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
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

import { Folder } from "../../../models/folder";

import { CookieService } from "ngx-cookie-service";
import { MatDialog } from "@angular/material/dialog";
import { error } from "highcharts";

@Component({
  selector: "app-manage-admin-groups",
  templateUrl: "./manage-admin-groups.component.html",
  styleUrls: ["./manage-admin-groups.component.css"],
})
export class ManageAdminGroupsComponent implements OnInit {
  ngAllChecked: boolean = false;
  is_action_bar = false;
  adminForm: FormGroup;
  newGroupForm: FormGroup;
  deleteForm: FormGroup;
  deletes: any = "";
  // end user form
  FirstEndUserGroup: FormGroup;
  SecondOverviewFormPermission: FormGroup;
  ThirdMemberAdditionForm: FormGroup;
  FourthDocumentPermissions: FormGroup;
  FolderSpecificPermissions: FormGroup;

  currentDataroomId: any;
  msg: string;
  all_admin_list: any = []; // create new admin
  isLinear: boolean = true;
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
  disabled_mat_toggle: boolean = false;
  checked: false;
  isDeleteAddMember: boolean = false;

  field = {
    email: "",
    first_name: "",
    last_name: "",
  };

  selectedIndex: number = 0;
  all_root_admin_selected: any = [];
  item: string;
  constructor(
    private toastr: ToastrService,
    private dataRoomService: DataRoomService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private location: Location,
    private cookieService: CookieService,
    private route: ActivatedRoute
  ) {
    this.currentDataroomId = localStorage.getItem("currentDataroomId");
    this.selectedIndex = parseInt(this.route.snapshot.paramMap.get("indx"));

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
    this.getFeatures(this.currentDataroomId)
  }

  ngOnInit() {
    this.initializeCreateNewAdminForm();
    this.customMessageForm();
    this.initializeNewAdminForm();
    this.getAllAdmins();
    this.initializeEndUserMemberGroup();
    this.initCreateNewMemberForm();
    this.getUserInfo();
    this.getAllContacts();
    this.getAllContactGroups();
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

  features: any;
  getFeatures(dataroomId) {
    this.dataRoomService.get_dataroom_features(dataroomId).subscribe((res) => {
      if (res[0] === undefined) {

        this.features = {
          auto_expire: true,
          bulk_users_upload: true,
          country_perm: true,
          custom_external_link: true,
          custom_logo: true,
          custom_watermarking: true,
          desktop_unlimit_upload: true,
          doculink_perm: true,
          dropbox_upload: true,
          email_to_dataroom_upload: true,
          favourites: true,
          google_drive_upload: true,
          id: 2,
          la_admin_access: true,
          module_perm: true,
          one_drive_upload: true,
          proj_management: true,
          proj_overview: true,
          proj_updates: true,
          proj_video_intro: true,
          qa_submit: true,
          qa_with_cat: true,
          redaction: true,
          sharepoint_upload: true,
          two_factor_auth: true,
          voting_perm: true,
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
    });
  }


  // showHideAddNewMemberSection
  // Purpose :
  // Show or hide permission menu - add new member section
  hideAddNewMember: boolean = true;
  showHideAddNewMemberSection() {
    this.hideAddNewMember = true;
    this.showAddNewMember = false;
  }
  showAddNewMember: boolean = false;
  HideHideAddNewMemberSection() {
    this.showAddNewMember = true;
    this.hideAddNewMember = false;
  }


  all_contacts_groups: any;
  getAllContactGroups() {
    this.dataRoomService.getAllContactsGroup().subscribe((res) => {
      //
      this.all_contacts_groups = res;
      //this.initializeContactFrom();
    });
  }

  user: any;
  getUserInfo() {
    this.dataRoomService.getUserProfileDatroom(this.currentDataroomId).subscribe((res) => {
      this.user = res;
      console.log(this.user, "user details in manage group permission");
      });
  }

  checkbox_la: any;
  bulkdeleteAllLaAdmin() {
    this.all_new_admin = this.all_new_admin.filter((res) => res.state !== true);
    this.checkbox_la = 0;
    // this.getAllAdmins();
  }

  checkboxLaAdmin(i, event) {
    this.all_new_admin[i].state = event.checked;
    // this.bulk_checkbox = this.bulk_checkbox + 1
    let checkbox = this.all_new_admin.filter((res) => res.state == true);
    this.checkbox_la = checkbox.length;
    console.log("bulk_checkbox:-------------" + this.checkbox_la);
  }


  activeButton: 'first' | 'second' | null = null;

  setActive(button: 'first' | 'second') {
    this.activeButton = button;
    console.log(this.all_admin_list, "ngAllChecked");
    if (this.toggle_manage_member == true) {
      this.onChangeSelectManageMember(this.activeButton);
      this.toggle_manage_member = false;
    }
    this.all_admin_list.filter(function (contact) {
      return (contact.state = false);
    })
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

  is_review_added = false;
  addReview() {
    console.log("add review");
    this.is_review_added = !this.is_review_added;
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
        Validators.pattern(this.emailPattern),
      ]),
    });
  }

  // initializer enduser group form

  initializeEndUserMemberGroup() {
    this.enduser_group_member_form = this._formBuilder.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      email: ["", Validators.required, Validators.pattern(this.emailPattern)],
    });
  }

  createEnduserGroupMember() {
    this.all_end_user_group_members.push(this.enduser_group_member_form.value);
    this.enduser_group_member_form.reset();
  }

  // delete member from end user group

  deleteMemberFromGroup(i) {
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

  // delete admin
  deleteAdmin(i, admin_id) {
    console.log("delete admin", admin_id);
    this.dataRoomService.delete_dataroom_admin(admin_id).subscribe((res) => {
      this.all_admin_list.splice(i, 1);
      this.msg = "Delete admin successfully !";
      this.showError();
    });
  }

  resendInvitation(member) {
    this.dataRoomService.resendInvitationLink(member).subscribe((res) => {
      this.msg = "Invitation resent successfully";
      this.showInfo();
    });
  }

  resendInvitationBulk(member) {
    this.dataRoomService.resendInvitationLink(member).subscribe((res) => {
      this.msg = "Invitation resent successfully";
      this.showInfo();
    //   console.log(this.all_admin_list[this.all_root_admin_selected.length - 1]['id'])
    //   if (this.all_admin_list[this.all_root_admin_selected.length - 1]['id'] == member.id) {
    //  ();
    //   }
    //   console.log(res);
    });
  }

  data: any = []
  deleteBulk() {
    const ids = this.all_root_admin_selected.map(item => item.id);
    this.data = {
      id: ids,
      is_deleted: "is_deleted_admin"
    }
    console.log(this.data)
    this.dataRoomService.DeleteUser(this.currentDataroomId, 0, this.data).subscribe((res) => {
      console.log(res);
      this.deletes='';
      this.all_root_admin_selected=[];
      this.msg = "Admin deleted successfully";
      this.showError();
      this.getAllAdmins();
    }, (error) => {
      console.log(error);
    });
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

  all_end_users = [];
  // delete member
  deleteMemberSuccessfully(i) {
    this.all_end_users.splice(i, 1);
    this.msg = "Member successfully deleted !";
    this.showError();
  }

  // get all admins from server
  add_user_list: any;
  getAllAdmins() {
    this.dataRoomService
      .getAllAdmins(this.currentDataroomId)
      .subscribe((res) => {
        console.log("all admins are ", res);
        this.all_admin_list = res;
        // this.all_admin_list.filter((res)=>res.selected=false);
        this.add_user_list = this.all_admin_list.filter(
          (res) => res.selected == true
        );
        this.all_new_admin = this.all_admin_list.filter(
          (res) => res.selected == true
        );
      });
  }

  // go back to navigation
  goBack() {
    this.location.back();
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
      selected: [true],
      dataroom_group_id: [0],
    });
  }
  messageForm: FormGroup;

  customMessageForm() {
    this.messageForm = this._formBuilder.group({
      custom_message: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ],
      ],
    });
  }

  all_new_admin: any[] = [];
  addNewAdminMember() {
    console.log("add new member method called", this.memberForm.value);
    // this.memberForm.
    this.memberForm.get("dataroom_group_id").setValue(this.currentDataroomId);
    this.dataRoomService.checkAdminUser(this.memberForm.value).subscribe(
      (res) => {
        console.log("add new member method called", this.memberForm.value);
        this.all_new_admin.push(this.memberForm.value);
        this.initCreateNewMemberForm();
        // this.msg = "Admin user is added successfully.";
        // this.showSuccess();
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
    member.dataroom_group_id = this.currentDataroomId;

    if (event.checked == true) {
      this.dataRoomService.checkAdminUser(member).subscribe(
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
      // this.all_new_admin.splice(index, 1);
      if (index >= 0) {
        this.all_new_admin.splice(index, 1);
      }
    }
  }

  ChangesByEmail(email) {
    this.dataRoomService.getUserByEmail(email).subscribe((res) => {
      this.memberForm.get("first_name").setValue(res.first_name);
      this.memberForm.get("last_name").setValue(res.last_name);
    });
  }

  deleteNeelyAddedAdmin(i) {
    this.all_new_admin.splice(i, 1);
    this.msg = "Member Deleted Successfully";
    this.showError();
  }

  is_edit_member(i) {
    console.log("is edit numbers");
    this.editedIndex = i;
  }

  editedIndex: any;

  is_cancel_editable(i) {
    console.log("is_cancel_editable");
    this.editedIndex = -1;
  }

  // submit edited member

  submitEditedMember(member) {
    console.log("member data is:", member);
    this.msg = "Member successfully edited";
    this.showSuccess();
    this.editedIndex = -1;
  }

  // delete existing admin

  deleteExistingAdmin(i) {
    this.all_admin_list.splice(i, 1);
    this.msg = "Admin deleted successfully";
    this.showSuccess();
  }
  // toggle: boolean = false;

  selectedAdminList: any = [];
  isActionBar: boolean = false;
  isManageActionBar: boolean = false;
  selected_admin_list_count: number = 0;

  onChangeSelect(event: any) {
    let toggle = event.checked;
    let counter = -1;

    if (toggle === true) {
      let all_root_admin = this.all_admin_list.filter(
        (res) => (res.selected = true)
      );
      this.selected_admin_list_count = all_root_admin.length;
      if (all_root_admin.length >= 1) {
        this.isActionBar = true;
      } else {
        this.selected_admin_list_count = 0;
        this.isActionBar = false;
      }
    } else {
      this.isActionBar = false;
      this.selected_admin_list_count = 0;
      let all_root_folder = this.all_admin_list.filter(
        (res) => (res.selected = false)
      );
    }
  }

  // check if selected element
  checkIfSelected(event: any, member: any) {
    console.log("check if selected", event.checked);
    member.selected = event.checked;
    let all_admins_count = this.all_admin_list.filter(
      (res) => res.selected === true
    );
    console.log("all admins count is", all_admins_count.length);
    if (all_admins_count.length > 0) {
      this.isActionBar = true;
    } else {
      this.isActionBar = false;
    }
  }

  deleteAllSelected() {
    let all_admins = this.all_admin_list.filter((res) => res.selected === true);
    for (let i = 0; i <= all_admins.length - 1; i++) {
      this.all_admin_list.splice(this.all_admin_list.indexOf(all_admins[i]), 1);
    }
    this.isActionBar = false;
    this.msg = "Admin deleted sussessfully";
    this.showError();
  }

  /**
        Below code is for manage members
     **/

  checkIfSelectedManageAdmin(event: any, member: any) {
    console.log("event any", event);
    console.log("member any", member);
    member.selected = event.checked;
    let all_admins_count = this.all_admin_list.filter(
      (res) => res.selected === true
    );
    this.all_root_admin_selected = all_admins_count;

    console.log("all admins count is", all_admins_count);
    if (all_admins_count.length > 0) {
      this.isManageActionBar = true;
    } else {
      this.isManageActionBar = false;
    }
  }

  SendInvitation() {
    this.all_root_admin_selected.map((p) => {
      this.resendInvitationBulk(p)
    });

  }

  toggle1: boolean = false;
  toggle_manage_member: boolean = false;
  onChangeSelectManageMember(key) {
    this.toggle1 = !this.toggle1;
    console.log(this.toggle1)


    if (this.toggle1 === true) {

      let all_root_admin = this.all_admin_list
      this.selected_admin_list_count = all_root_admin.length;



      if (key == 'first') {
        this.all_root_admin_selected = this.all_admin_list.filter(
          (res) => (res.selected = true && res.memberactivestatus == false)
        );
      } else if (key == 'second') {
        this.all_root_admin_selected = this.all_admin_list.filter(
          (res) => (res.selected = true && res.member.email != this.user.email)
        );
      }



      all_root_admin = this.all_root_admin_selected.filter(
        (res) => (res.selected = true)
      );
      console.log(this.all_root_admin_selected)
      if (all_root_admin.length >= 1) {
        this.isManageActionBar = true;
      } else {
        this.selected_admin_list_count = 0;
        this.isManageActionBar = false;
      }
    } else {
      this.isManageActionBar = false;
      this.selected_admin_list_count = 0;
      let all_root_folder = this.all_admin_list.filter(
        (res) => (res.selected = false)
      );
      this.all_root_admin_selected = all_root_folder;
      console.log(all_root_folder)
    }
  }

  deleteAllManageAdmin() {
    let all_admins = this.all_admin_list.filter((res) => res.selected === true);
    for (let i = 0; i <= all_admins.length - 1; i++) {
      this.all_admin_list.splice(this.all_admin_list.indexOf(all_admins[i]), 1);
    }
    this.isActionBar = false;
    this.msg = "Admin deleted successfully";
    this.showError();
  }

  removeSelectedElement(member, i) {
    console.log("delete admin", this.user.email);
    console.log("delete admin", member.member.email);

    if (member.member.email != this.user.email) {
      this.dataRoomService.delete_dataroom_admin(member.id).subscribe((res) => {
        this.msg = "Admin User is deleted successfully.";
        this.deletes = '';
        this.showError();
        this.getAllAdmins();
      });
    } else if (member.member.email == this.user.email) {
      this.msg = "You can't delete youself.";
      this.showError();
      console.log("????????????????????????????? you can delete youself")
    }


  }
  yourFn(event) {
    console.log(event.index, "event check");
    if (event.index == 3) {
      this.dataRoomService
        .getSingleDataroom(this.currentDataroomId)
        .subscribe((res) => {
          this.dataroom_live = res.is_dataroom_on_live;
          console.log(this.dataroom_live, "invitation_send_successfully");
          if (this.dataroom_live) {
            this.dataRoomService
              .getAllAdmins(this.currentDataroomId)
              .subscribe((res) => {
                console.log("all admins are ", res);
                this.all_admin_list = res;
                // this.all_admin_list.filter((res)=>res.selected=false);
                this.add_user_list = this.all_admin_list.filter(
                  (res) => res.selected == true
                );
                this.all_new_admin = this.all_admin_list.filter(
                  (res) => res.selected == true
                );
              });
          }
        });
    }
  }

  dataroom_live: any;
  managemerbers() {
    console.log("Manage Members");
    this.dataRoomService
      .getSingleDataroom(this.currentDataroomId)
      .subscribe((res) => {
        this.dataroom_live = res.is_dataroom_on_live;
        console.log(this.dataroom_live, "invitation_send_successfully");
        if (this.dataroom_live) {
          this.dataRoomService
            .getAllAdmins(this.currentDataroomId)
            .subscribe((res) => {
              console.log("all admins are ", res);
              this.all_admin_list = res;
              // this.all_admin_list.filter((res)=>res.selected=false);
              this.add_user_list = this.all_admin_list.filter(
                (res) => res.selected == true
              );
              this.all_new_admin = this.all_admin_list.filter(
                (res) => res.selected == true
              );
            });
        }
      });
  }

  sendNewMember() {
    //let custom_message = this.messageForm.get("custom_message").value;
    this.dataRoomService
      .create_an_dataroom_admin(
        this.currentDataroomId,
        this.all_new_admin,
        this.item
      )
      .subscribe((res) => {
        this.addValue();
        this.add_user_list = this.all_admin_list.filter(
          (res) => res.selected == true
        );
        this.all_new_admin = this.all_admin_list.filter(
          (res) => res.selected == true
        );
        this.all_contacts_groups.forEach((res) => {
          res.select = false;
        });

        this.msg = "Admin user is added successfully.";
        this.showSuccess();
        this.is_review_added = false;
        this.getAllAdmins();
        this.getAllContacts();

      }, (error) => {
        this.msg = error.error.msg;
        this.showError()

      }
      );
  }
  ClickPrimary(event, i) {
    console.log(event)
    this.all_admin_list[i].is_primary_user = event.checked;
    var is_primary_user = this.all_admin_list.filter(
      (res) => res.is_primary_user == true
    );
    if (is_primary_user.length > 0 || event) {
      this.qa_apply = true;
    }
  }
  qa_apply: boolean = false;

  addPrimaryContact(event: any) {
    // let primary_list = this.all_admin_list.filter((res)=>res.primary_user==true&&res.primary_user==false);
    this.all_admin_list.forEach(ele => {
      ele.is_q_a_user = true
    });
    let primary_list = this.all_admin_list;
    console.log(this.currentDataroomId, primary_list, "list primary");
    this.dataRoomService
      .addDataroomPrimaryContact(this.currentDataroomId, primary_list)
      .subscribe((res) => {
        console.log("Add primary contact successful.");
        this.msg = "Changes Applied successfully!";
        this.showSuccess();
        this.getAllAdmins();
      });
  }
}
