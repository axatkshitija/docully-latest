import { Component, OnInit, Input, signal } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { DataRoomService, SharedService } from "../../../services/index";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { TimezoneService } from "../../../services/timezone.service";
declare var jQuery: any;

@Component({
  selector: "app-dataroom",
  templateUrl: "./dataroom.component.html",
  styleUrls: ["./dataroom.component.css"],
})
export class DataroomComponent implements OnInit {
  datarooms: any;

  is_dataroom_exist: boolean = false;
  @Input() my_team_id: any;
  public createNewDataroomForm: FormGroup;
  public editDataroomForm: FormGroup;
  msg: any;
  errors: any;
  timezone: any;
  areControlsEnabled: boolean = false;
  message: any;
  selectedIndex: any;
  updateIndex: any;
  subscription: Subscription;
  all_datarooms: any;
  all_members: any;
  my_team_data: any;
  currentUser: any;
  all_dataroomsList = [];
  deleteForm: FormGroup;
  myteamuser: any;
  member_not_found: boolean = false;
  is_uae: boolean = false;
  isEnabledViewerSupport: boolean = true;
  isEnabledSelfStatus: boolean = true;
  isEnabledUserStatus: boolean = true;

  readonly panelOpenState = signal(false)
  dataroom_version: any;
  constructor(
    private dataRoomService: DataRoomService,
    private toastrService: ToastrService,
    private router: Router,
    private sharedService: SharedService,
    private timeZone: TimezoneService,

  ) {
    this.subscription = this.sharedService.getMessage().subscribe((message) => {
      this.message = message;
      this.my_team_id = this.message.id;
      if (this.message.text == "Refresh Dataroom!") {
        this.my_team_id = this.message.id;
        this.get_my_team_data();
        this.createNewDataroom();
        this.timezone = this.timeZone.userTimeZone;
      }
    });
  }

  ngOnInit() {
    this.createNewDataroom();
    this.initializeDeleteForm();
    this.get_my_team_data();
    this.getAllDataRoomsFolders();
    this.getDataroomsList();

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"))
  }

  ngOnChanges() {
    this.get_my_team_data();
    this.getAllDataRoomsFolders();
    this.getDataroomsList()
  }

  initializeDeleteForm() {
    this.deleteForm = new FormGroup({
      delete: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
  }



  



  numericNumberReg: any = "^[0-9]\\d*(\\.\\d{1,2})?$";
  getToDetailedPage(dataroomId, choose_overview_default_page) {
    console.log(dataroomId, "dataroomid");
    localStorage.setItem("currentDataroomId", dataroomId)
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
    });
  }

  onSelectChange(event: any): void {
    this.is_uae = event.target.value;
    console.log(this.is_uae)
  }
  onVersionChange(event: any): void {
    this.dataroom_version = event.target.value;
    console.log(this.dataroom_version)
  }

  onViewerSupportChange(event: any): void {
    this.isEnabledViewerSupport = event.checked;
    console.log(this.isEnabledViewerSupport)
  }

  onSelfStatusChange(event: any): void {
    this.isEnabledSelfStatus = event.checked;
    console.log(this.isEnabledSelfStatus)
  }

  onUserStatusChange(event: any): void {
    this.isEnabledUserStatus = event.checked;
    console.log(this.isEnabledUserStatus)
  }


  folders: any;
  getAllDataRoomsFolders() {
    this.dataRoomService.getAllDataRoomsFolders().subscribe((res) => {
      //
      this.folders = res;
      console.log(this.folders, "folders");
    });
  }
  dataroom_nameFront: any;
  getDataRoomName(res) {
    console.log(res, "dataroom");
    this.dataroom_nameFront = res.dataroom_name;
    this.update.dataroomname = this.dataroom_nameFront;
    this.update.dataroom = res.id;
    this.update.is_watermarking = res.dataroom_modules.is_watermarking;
    this.update.is_drm = res.dataroom_modules.is_drm;
    this.update.is_question_and_answers =
      res.dataroom_modules.is_question_and_answers;
    this.update.is_collabration = res.dataroom_modules.is_collabration;
    this.update.is_ocr = res.dataroom_modules.is_ocr;
    this.update.is_editor = res.dataroom_modules.is_editor;
    this.update.myteam = res.my_team;
    this.dataRoomService.getSingleDataroom(res.id).subscribe((res) => {
      this.datarooms_folders = this.folders.filter(
        (res) => res.dataroom == parseInt(this.update.dataroom)
      );
      console.log(this.update.myteam, "Folder");

      console.log(this.datarooms_folders, "Folder Dataroom");
    });
  }
  dataroom: any;
  datarooms_folders: any;
  update: any = {
    dataroom: "",
    myteam: "",
    clone_data: "",
    dataroomname: "",
    dataroom_name: "",
    user_group: false,
  };

  cloneExistingDataroom() {
    this.dataRoomService.cloneDataRoom(this.update).subscribe(
      (res) => {
        this.msg = "Dataroom successfully clone";
        this.showSuccess();
        console.log("serializer data is ", res);
      },
      (error) => {
        this.msg = "Internal error occurred !";

        this.showError();
      }
    );
    console.log("Delete Dataroom Id");
  }

  perm: any;
  gotoURl(dataroomId, dataroomName, choose_overview_default_page) {

    localStorage.setItem("currentDataroomId", dataroomId.toString())
    this.dataRoomService
      .get_dataroom_disclaimer(dataroomId)
      .subscribe((res) => {
        console.log(dataroomId, "TRipTest");

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
      });
  }

  onlyTextValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^[a-zA-Z\s]*$/.test(control.value);
    return valid ? null : { 'invalidText': { value: control.value } };
  }

  emailPattern =
    "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
    "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  nameValidator(control: FormControl): { [key: string]: boolean } {
    // Allow only alphanumeric characters and underscores
    const nameRegexp: RegExp = /^[a-zA-Z0-9_ ]*$/;
    if (control.value && !nameRegexp.test(control.value)) {
      return { invalidName: true };
    }
    return null;
  }

  createNewDataroom() {
    this.createNewDataroomForm = new FormGroup({
      id: new FormControl(""),
      edit: new FormControl(undefined),
      team: new FormControl("", [
        Validators.required,
        this.nameValidator
      ]),
      storage_exceed_block: new FormControl(false),
      dataroom_nameFront: new FormControl(""),
      dataroom_name: new FormControl("", [
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.required,
        this.nameValidator
      ]),
      dataroom_storage_allocated: new FormControl("", [
        Validators.minLength(1),
        Validators.maxLength(4),
        Validators.required,
        Validators.pattern(this.numericNumberReg),
      ]),
      dataroom_users_permitted: new FormControl("", [Validators.min(1)]),
      dataroom_admin: new FormGroup({
        first_name: new FormControl("", [
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.required,
          this.onlyTextValidator
        ]),
        last_name: new FormControl("", [
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.required,
          this.onlyTextValidator
        ]),
        email: new FormControl("", [
          Validators.minLength(3),
          Validators.maxLength(40),
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]),
      }),

      dataroom_features: new FormGroup({
        custom_watermarking: new FormControl(false),
        two_factor_auth: new FormControl(false),
        proj_overview: new FormControl(false),
        proj_video_intro: new FormControl(false),
        custom_logo: new FormControl(false),
        custom_external_link: new FormControl(false),
        auto_logout: new FormControl(false),
        co_current_logins: new FormControl(false),
        email_to_dataroom_upload: new FormControl(false),
        google_drive_upload: new FormControl(false),
        one_drive_upload: new FormControl(false),
        sharepoint_upload: new FormControl(false),
        dropbox_upload: new FormControl(false),
        favourites: new FormControl(false),
        redaction: new FormControl(false),
        la_admin_access: new FormControl(false),
        bulk_users_upload: new FormControl(false),
        doculink_perm: new FormControl(false),
        auto_expire: new FormControl(false),
        module_perm: new FormControl(false),
        qa_with_cat: new FormControl(false),
        qa_submit: new FormControl(false),
        desktop_unlimit_upload: new FormControl(false),
        proj_management: new FormControl(false),
        voting_perm: new FormControl(false),
        proj_updates: new FormControl(false),
        country_perm: new FormControl(false),
        voting_report_perm: new FormControl(false),
        index_report_others: new FormControl(false),
        self_upload_status: new FormControl(false),
        all_user_upload_status: new FormControl(false),
        activity_tracker_perm: new FormControl(false),
        is_upload_restrict: new FormControl(false),
        file_view_limit: new FormControl(false),
        viewer_support: new FormControl(false),
        fence_viewer: new FormControl(false),
        print_screen_perm: new FormControl(false),
      })
    });
  }

  ChangesByEmail(email) {
    this.dataRoomService.getUserByEmail(email).subscribe((res) => {
      this.createNewDataroomForm.get("dataroom_admin").get("first_name").setValue(res.first_name);
      this.createNewDataroomForm.get("dataroom_admin").get("last_name").setValue(res.last_name);
    });
  }

  // submit new dataroom
  submitNewDataroom(new_dataroom: any) {
    console.log("New dataroom form", new_dataroom, this.my_team_id);

    // First: Validate dataroom_name doesn't contain special characters (except underscore)
    const specialCharacterRegex = /^[a-zA-Z0-9_ ]*$/;
    if (new_dataroom.dataroom_name && !specialCharacterRegex.test(new_dataroom.dataroom_name)) {
      this.msg = "Dataroom name can only contain letters, numbers, and underscores!";
      this.toastrService.error(this.msg);
      return;
    }

    if (new_dataroom?.dataroom_features) {
      new_dataroom.dataroom_features = {
        auto_expire: new_dataroom?.dataroom_features?.auto_expire == undefined ? false : new_dataroom?.dataroom_features?.auto_expire,
        bulk_users_upload: new_dataroom?.dataroom_features?.bulk_users_upload == undefined ? false : new_dataroom?.dataroom_features?.bulk_users_upload,
        country_perm: new_dataroom?.dataroom_features?.country_perm == undefined ? false : new_dataroom?.dataroom_features?.country_perm,
        custom_external_link: new_dataroom?.dataroom_features?.custom_external_link == undefined ? false : new_dataroom?.dataroom_features?.custom_external_link,
        custom_logo: new_dataroom?.dataroom_features?.custom_logo == undefined ? false : new_dataroom?.dataroom_features?.custom_logo,
        custom_watermarking: new_dataroom?.dataroom_features?.custom_watermarking == undefined ? false : new_dataroom?.dataroom_features?.custom_watermarking,
        desktop_unlimit_upload: new_dataroom?.dataroom_features?.desktop_unlimit_upload == undefined ? false : new_dataroom?.dataroom_features?.desktop_unlimit_upload,
        doculink_perm: new_dataroom?.dataroom_features?.doculink_perm == undefined ? false : new_dataroom?.dataroom_features?.doculink_perm,
        dropbox_upload: new_dataroom?.dataroom_features?.dropbox_upload == undefined ? false : new_dataroom?.dataroom_features?.dropbox_upload,
        email_to_dataroom_upload: new_dataroom?.dataroom_features?.email_to_dataroom_upload == undefined ? false : new_dataroom?.dataroom_features?.email_to_dataroom_upload,
        favourites: new_dataroom?.dataroom_features?.favourites == undefined ? false : new_dataroom?.dataroom_features?.favourites,
        google_drive_upload: new_dataroom?.dataroom_features?.google_drive_upload == undefined ? false : new_dataroom?.dataroom_features?.google_drive_upload,
        la_admin_access: new_dataroom?.dataroom_features?.la_admin_access == undefined ? false : new_dataroom?.dataroom_features?.la_admin_access,
        module_perm: new_dataroom?.dataroom_features?.module_perm == undefined ? false : new_dataroom?.dataroom_features?.module_perm,
        one_drive_upload: new_dataroom?.dataroom_features?.one_drive_upload == undefined ? false : new_dataroom?.dataroom_features?.one_drive_upload,
        proj_management: new_dataroom?.dataroom_features?.proj_management == undefined ? false : new_dataroom?.dataroom_features?.proj_management,
        proj_overview: new_dataroom?.dataroom_features?.proj_overview == undefined ? false : new_dataroom?.dataroom_features?.proj_overview,
        proj_updates: new_dataroom?.dataroom_features?.proj_updates == undefined ? false : new_dataroom?.dataroom_features?.proj_updates,
        proj_video_intro: new_dataroom?.dataroom_features?.proj_video_intro == undefined ? false : new_dataroom?.dataroom_features?.proj_video_intro,
        qa_submit: new_dataroom?.dataroom_features?.qa_submit == undefined ? false : new_dataroom?.dataroom_features?.qa_submit,
        qa_with_cat: new_dataroom?.dataroom_features?.qa_with_cat == undefined ? false : new_dataroom?.dataroom_features?.qa_with_cat,
        redaction: new_dataroom?.dataroom_features?.redaction == undefined ? false : new_dataroom?.dataroom_features?.redaction,
        sharepoint_upload: new_dataroom?.dataroom_features?.sharepoint_upload == undefined ? false : new_dataroom?.dataroom_features?.sharepoint_upload,
        two_factor_auth: new_dataroom?.dataroom_features?.two_factor_auth == undefined ? false : new_dataroom?.dataroom_features?.two_factor_auth,
        voting_perm: new_dataroom?.dataroom_features?.voting_perm == undefined ? false : new_dataroom?.dataroom_features?.voting_perm,
        auto_logout: new_dataroom?.dataroom_features?.auto_logout == undefined ? false : new_dataroom?.dataroom_features?.auto_logout,
        co_current_logins: new_dataroom?.dataroom_features?.co_current_logins == undefined ? false : new_dataroom?.dataroom_features?.co_current_logins,
        voting_report_perm: new_dataroom?.dataroom_features?.voting_report_perm == undefined ? false : new_dataroom?.dataroom_features?.voting_report_perm,
        index_report_others: new_dataroom?.dataroom_features?.index_report_others == undefined ? false : new_dataroom?.dataroom_features?.index_report_others,
        self_upload_status: new_dataroom?.dataroom_features?.self_upload_status == undefined ? false : new_dataroom?.dataroom_features?.self_upload_status,
        all_user_upload_status: new_dataroom?.dataroom_features?.all_user_upload_status == undefined ? false : new_dataroom?.dataroom_features?.all_user_upload_status,
        activity_tracker_perm: new_dataroom?.dataroom_features?.activity_tracker_perm == undefined ? false : new_dataroom?.dataroom_features?.activity_tracker_perm,
        is_upload_restrict: new_dataroom?.dataroom_features?.is_upload_restrict == undefined ? false : new_dataroom?.dataroom_features?.is_upload_restrict,
        file_view_limit: new_dataroom?.dataroom_features?.file_view_limit == undefined ? false : new_dataroom?.dataroom_features?.file_view_limit,
        viewer_support: new_dataroom?.dataroom_features?.viewer_support == undefined ? false : new_dataroom?.dataroom_features?.viewer_support,
        fence_viewer: new_dataroom?.dataroom_features?.fence_viewer == undefined ? false : new_dataroom?.dataroom_features?.fence_viewer,
        print_screen_perm: new_dataroom?.dataroom_features?.print_screen_perm == undefined ? false : new_dataroom?.dataroom_features?.print_screen_perm,
      }
    }

    this.createNewDataroomForm.get('edit').setValue(false);
    new_dataroom['dataroom_version'] = this.dataroom_version
    //this.createNewDataroomForm.get('dataroom_nameFront').setValue(this.createNewDataroomForm.get('dataroom_name').value);
    this.dataRoomService
      .create_dataroom_from_my_team(this.my_team_id, new_dataroom, this.is_uae)
      .subscribe((res) => {
        console.log("Dataroom successfully cretaed");
        if (res.success === true) {
          console.log("Success is true");
          this.msg = res.message;
          this.showSuccess();
          this.all_datarooms.push(res.data);
          this.createNewDataroom();
          this.patchDataroomData();
          jQuery("#addDateRoom").modal("hide");
          this.getDataroomsList();
          // window.location.reload();
        } else {
          this.msg = res.message;
          this.showError();
          console.log("Error is false");
        }
      });
  }

  data_dataroom: any
  dataroom_features: any = []
  edit_dataroom_version: null;
  is_all_features: boolean;
  patchDataroomData() {
    console.log(this.my_team_data);

    if (this.updateIndex != undefined) {
      this.data_dataroom = this.all_datarooms[this.updateIndex];

      const features_value = this.data_dataroom.dataroom_features[0]
      console.log(features_value)

      if (
        features_value?.activity_tracker_perm == true &&
        features_value?.is_upload_restrict == true &&
        features_value?.all_user_upload_status == true &&
        features_value?.auto_expire == true &&
        features_value?.auto_logout == true &&
        features_value?.bulk_users_upload == true &&
        features_value?.co_current_logins == true &&
        features_value?.custom_external_link == true &&
        features_value?.custom_logo == true &&
        features_value?.custom_watermarking == true &&
        features_value?.desktop_unlimit_upload == true &&
        features_value?.doculink_perm == true &&
        features_value?.dropbox_upload == true &&
        features_value?.email_to_dataroom_upload == true &&
        features_value?.favourites == true &&
        features_value?.fence_viewer == true &&
        features_value?.file_view_limit == true &&
        features_value?.google_drive_upload == true &&
        features_value?.index_report_others == true &&
        features_value?.la_admin_access == true &&
        features_value?.module_perm == true &&
        features_value?.one_drive_upload == true &&
        features_value?.print_screen_perm == true &&
        features_value?.proj_overview == true &&
        features_value?.proj_updates == true &&
        features_value?.proj_video_intro == true &&
        features_value?.qa_submit == true &&
        features_value?.qa_with_cat == true &&
        features_value?.redaction == true &&
        features_value?.self_upload_status == true &&
        features_value?.sharepoint_upload == true &&
        features_value?.two_factor_auth == true &&
        features_value?.viewer_support == true &&
        features_value?.voting_perm == true &&
        features_value?.voting_report_perm == true
      ) {
        console.log(true);
        this.is_all_features = true;
      } else {
        console.log(false);
        this.is_all_features = false;
      }


      this.dataroom_version = this.data_dataroom.dataroom_version == "Lite" ? this.dataroom_version = 'Lite' : this.dataroom_version = null;
      this.edit_dataroom_version = this.data_dataroom.dataroom_version;
      this.is_uae = this.data_dataroom.is_usa_blob ? this.data_dataroom.is_usa_blob : false;
      this.dataroom_features = this.all_datarooms[this.updateIndex].dataroom_features[0];
      if (!this.dataroom_features) {
        this.dataroom_features = {
          auto_expire: false,
          bulk_users_upload: false,
          country_perm: false,
          custom_external_link: false,
          custom_logo: false,
          custom_watermarking: false,
          desktop_unlimit_upload: false,
          doculink_perm: false,
          dropbox_upload: false,
          email_to_dataroom_upload: false,
          favourites: false,
          google_drive_upload: false,
          id: 2,
          la_admin_access: false,
          module_perm: false,
          one_drive_upload: false,
          proj_management: false,
          proj_overview: false,
          proj_updates: false,
          proj_video_intro: false,
          qa_submit: false,
          qa_with_cat: false,
          redaction: false,
          sharepoint_upload: false,
          two_factor_auth: false,
          voting_perm: false,
          auto_logout: false,
          co_current_logins: false,
          voting_report_perm: false,
          index_report_others: false,
          self_upload_status: false,
          all_user_upload_status: false,
          activity_tracker_perm: false,
          is_upload_restrict: false,
          file_view_limit: false,
          viewer_support: false,
          fence_viewer: false,
          print_screen_perm: false,
        }
      }
      this.createNewDataroomForm.patchValue(this.data_dataroom)
      console.log(this.data_dataroom);
      this.edit_dataroom_version = this.data_dataroom.dataroom_version;




    }
    this.createNewDataroomForm.get('team').setValue(this.my_team_data.teamdata.team_name)
  }

  checkFeatures(event) {
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("custom_watermarking")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("two_factor_auth")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("proj_overview")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("proj_video_intro")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("custom_logo")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("custom_external_link")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("email_to_dataroom_upload")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("google_drive_upload")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("one_drive_upload")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("sharepoint_upload")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("dropbox_upload")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("favourites")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("redaction")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("la_admin_access")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("bulk_users_upload")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("doculink_perm")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("auto_expire")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("module_perm")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("qa_with_cat")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("qa_submit")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("desktop_unlimit_upload")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("proj_management")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("voting_perm")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("proj_updates")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("country_perm")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("auto_logout")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("co_current_logins")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("voting_report_perm")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("index_report_others")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("self_upload_status")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("all_user_upload_status")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("activity_tracker_perm")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("is_upload_restrict")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("file_view_limit")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("viewer_support")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("fence_viewer")?.setValue(event);
    (this.createNewDataroomForm.get('dataroom_features') as FormGroup).get("print_screen_perm")?.setValue(event);
  }

  editDataroom(data: any) {
    console.log(data, this.my_team_id);
    this.createNewDataroomForm.get('edit').setValue(true);
    //this.createNewDataroomForm.get('dataroom_nameFront').setValue(this.createNewDataroomForm.get('dataroom_name').value);
    this.createNewDataroomForm.removeControl('dataroom_name')

    let dataroomData = this.createNewDataroomForm.value;
    dataroomData['user'] = this.all_datarooms[this.updateIndex]['user']
    dataroomData['dataroom_version'] = this.dataroom_version
    console.log(dataroomData)

    this.dataRoomService
      .create_dataroom_from_my_team(this.my_team_id, dataroomData, this.is_uae)
      .subscribe((res) => {
        console.log("Dataroom successfully updated");
        if (res.success === true) {
          console.log("Success is true");
          this.msg = res.message;
          this.showSuccess();
          jQuery(`#editDataroom${this.updateIndex}`).modal("hide");
          this.getDataroomsList()
        } else {
          this.msg = res.message;
          this.showError();
          console.log("Error is false");
        }
      });
  }

  searchList(event) {
    console.log(event.target.value)
    this.all_datarooms = [];
    if (event.target.value.length == 0) {
      this.all_datarooms = this.all_dataroomsList;
      return;
    }
    for (let index = 0; index < this.all_dataroomsList.length; index++) {
      console.log(this.all_dataroomsList[index]['dataroom_nameFront'].toLowerCase(), event.target.value.toLowerCase())
      if (this.all_dataroomsList[index]['dataroom_nameFront'].toLowerCase().startsWith(event.target.value.toLowerCase())) {
        this.all_datarooms.push(this.all_dataroomsList[index])
      }
    }
  }

  showSuccess() {
    this.toastrService.success(this.msg);
  }

  showError() {
    this.toastrService.error(this.msg);
  }

  get_my_team_data() {
    if (this.my_team_id == undefined) {
      return;
    }
    this.dataRoomService.getMyTeamData(this.my_team_id).subscribe((res) => {
      //res.my_team_logo  = this.base_url+res.my_team_logo;
      this.my_team_data = res;


      console.log(this.my_team_data)
      if (this.my_team_data != "member data not found") {
        this.createNewDataroomForm.get('team').setValue(this.my_team_data.teamdata.team_name)
        console.log("my team data is", this.my_team_data);
      } else {
        this.member_not_found = true;
        console.log("my team data is", this.my_team_data);
      }
    });
  }

  is_request_for_archive;
  archivedRequestForDataroom(dataroom) {
    console.log("Archived requets for dataroom ", dataroom.id);
    this.dataRoomService
      .archivedRequestForDataroom(dataroom.id)
      .subscribe((res) => {
        console.log("Archived requets ", res);
        this.is_request_for_archive = res.is_request_for_archive;
        if (this.is_request_for_archive) {
          this.msg = "Dataroom archive request successfully send !";
          location.reload();
        } else {
          this.msg = " Dataroom Cancel archive request successfully send !";
          location.reload();
        }
        this.showSuccess();
      });
  }

  deletionRequestForDataroom(data) {
    this.dataRoomService
      .deletionRequestForDataroom(data.id)
      .subscribe((res) => {
        this.msg = "Dataroom deletion request successfully send !";
        // this.dataroom_detail.is_request_for_deletion = true;
        this.showSuccess();
        location.reload();
      });
  }

  getDataroomsList() {
    this.dataRoomService.getTeamMembersData(this.my_team_id).subscribe((res) => {
      this.all_datarooms = res.datarooms;
      this.all_dataroomsList = res.datarooms;
      console.log(this.all_datarooms)
    });
  }

  is_request_for_deletion;
  deleteDataroom(dataroom_detail) {
    console.log(dataroom_detail)
    this.dataRoomService
      .deleteSingleDataroom(dataroom_detail.id)
      .subscribe((res) => {
        console.log(res, "deleteDataroom");
        this.is_request_for_deletion = res.is_request_for_deletion;
        if (this.is_request_for_deletion == false) {
          this.msg =
            "Your request to cancel the delete request of data room has been processed.";
          this.showSuccess();
          location.reload();
        } else {
          this.msg =
            "Your request to delete the data room has been processed and it will be deleted in 15 days.";
          this.showSuccess();
          location.reload();
        }
      });
  }
}
