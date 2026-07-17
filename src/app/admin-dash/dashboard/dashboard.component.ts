import {
  Component,
  OnInit,
  Inject,
} from "@angular/core";
import { FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataRoomService } from "../../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";




@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  config: any;
  msg: any;
  errors: any;
  timezone: any;
  createNewDataroomForm: any = FormGroup;
  areControlsEnabled: boolean = true;
  enduser_group_id: number = 0;
  dataroomId: any = "";
  currentUserId;

  filterQuery: any;
  foods = [
    { value: "steak-0", viewValue: "Steak" },
    { value: "pizza-1", viewValue: "Pizza" },
    { value: "tacos-2", viewValue: "Tacos" },
  ];
  sentOtp: any;
  session: any;
  usertimezone: string;

  constructor(
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.session = localStorage.getItem("sactive");
    console.log(this.session, 'session')


    this.route.params.subscribe((params) => {
      if (typeof params["dataroomId"] === "undefined") {
        this.dataroomId = JSON.stringify(localStorage.getItem("currentDataroomId"));
      } else {
        this.dataroomId = params["dataroomId"].toString();

        localStorage.setItem("currentDataroomId", this.dataroomId)
      }
    });

    this.route.params.subscribe((params) => {
      var group_id_get: any = this.route.snapshot.paramMap.get("group_id")
      const id: any = parseInt(group_id_get);
      this.enduser_group_id = id;
    });

    var get: any = localStorage.getItem('currentUser')
    var currentUser: any = JSON.parse(get);
    console.log(currentUser)
    if (currentUser != null) {
      this.currentUserId = currentUser['id'];
    }

    if (currentUser == null) {
      localStorage.clear()
      router.navigate([''])
    } else {
      this.currentUserId = currentUser['id'];
    }
    console.log(currentUser, this.currentUserId)

  }

  user: any;
  ngOnInit() {
    console.log(">>>>>>>>>++++++++++", this.session)
    this.getUserInfo();
    if (this.session == 'true') {
      console.log(">>>>>>>>>++++++++++>>>>>>>>>>>>>>>>", this.session)
      this.openDialogNote();
    }
    this.usertimezone = localStorage.getItem("currentUser")
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  getUserInfo() {
    const cuser: any = localStorage.getItem('currentUser')
    this.user = JSON.parse(cuser);
    console.log(this.user, "User info dashboard");
    if (this.user != null) {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.user)
      this.getAllDataRooms();
      this.createNewDataroom();
    }
  }

  datarooms: any;
  is_admin: boolean = false;
  getAllDataRooms() {
    this.dataRoomService.getAllDatarooms().subscribe((res) => {

      const newdata = res.data;
      this.datarooms = newdata.map((obj, i) => ({ ...obj, last_updated: obj.last_updated + '+04:00', trial_expiry_date: obj.trial_expiry_date + '+04:00' }));
      console.log(">>>>>>>>>>>>>>>>>>>>datarooms>>>>>>>>>>", this.datarooms)
      if (this.user.is_superadmin == true || this.user.is_admin == true) {
        this.is_admin = true;
        this.datarooms.forEach((res: any) => {
          res.selected = true;
        });
      } else {
        this.datarooms.forEach((res: any) => {

          if (res.member.is_la_user) {
            res.selected = true;
          } else {
            if (res.is_dataroom_on_live == true) {
              res.selected = true;
            } else {
              res.selected = false;
            }
          }
        });
      }

      this.datarooms.forEach((res: any) => {
        if (!res.is_paid) {
          let todays_date = new Date();
          var date = new Date(res.created_date);
          var timeDiff = Math.abs(todays_date.getTime() - date.getTime());
          var diff_date = Math.ceil(timeDiff / (1000 * 3600 * 24));
          if (diff_date <= res.trial_days) {
            let rem_date = 16 - diff_date;
            res.upgrade_msg = "trial expires in " + rem_date + " days";
          } else {
            res.upgrade_msg = "extended trial";
          }
        } else {
          res.upgrade_msg = "";
        }
      });
    });
  }

  folders: any;
  getAllDataRoomsFolders() {
    this.dataRoomService.getAllDataRoomsFolders().subscribe((res) => {
      this.folders = res;
    });
  }





  dataroom: any;
  datarooms_folders: any;
  perm: any;
  gotoURl(dataroomId: any, dataroomName: any, choose_overview_default_page: any) {
    localStorage.setItem("currentDataroomId", dataroomId)
    this.dataRoomService
      .check_2fa_permission(dataroomId)
      .subscribe((res) => {
        if (res == false) {
          this.dataRoomService
            .get_dataroom_disclaimer(dataroomId)
            .subscribe((res) => {
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
                      "true");
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
              }
            });
        } else {
          this.router.navigate(["../dataroom-lock", dataroomId]);
        }
      })



  }

  getToDetailedPage(dataroomId: any, choose_overview_default_page: any) {
    console.log(dataroomId, "dataroomid");
    console.log(choose_overview_default_page, "choose_overview_default_page");

    this.dataRoomService.getMembersPermission(dataroomId).subscribe((res) => {
      this.perm = res;
      this.dataRoomService.checkfirstpage(dataroomId).subscribe((res) => {
      });
      console.log(this.perm);

      if (this.perm !== null) {
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
      }
      this.getDataroomViewed(dataroomId);
    });
  }

  getDataroomViewed(dataroomId: any) {
    this.dataRoomService.GetAllDataroomView(dataroomId).subscribe((res) => {
    });
  }

  IsShowHideGride: boolean = false;
  showHideGrideView() {
    this.IsShowHideGride = true;
  }

  showHideListView() {
    this.IsShowHideGride = false;
  }



  onlyTextValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^[a-zA-Z\s]*$/.test(control.value);
    return valid ? null : { 'invalidText': { value: control.value } };
  }

  emailPattern =
    "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
    "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";



  createNewDataroom() {
    this.createNewDataroomForm = new FormGroup({
      dataroom_name: new FormControl("", [
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.required
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
      dataroom_admin: new FormGroup({
        first_name: new FormControl("", [
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.required,
          this.onlyTextValidator

        ]),
        last_name: new FormControl("", [
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.required,
          this.onlyTextValidator
        ]),
        email: new FormControl("", [
          Validators.minLength(3),
          Validators.maxLength(40),
          Validators.required,
          Validators.pattern(this.emailPattern)
        ]),
      }),
      dataroom_storage_allocated: new FormControl("", [
        Validators.minLength(1),
        Validators.required,
        Validators.maxLength(4),
      ]),
    });
  }

  is_dataroom_exist: boolean = false;
  submitNewDataroom(createNewDataroomForm: any) {
    this.dataRoomService.createDataRoom(createNewDataroomForm).subscribe(
      (res) => {
        this.is_dataroom_exist = false;
        setTimeout(() => {
          this.is_dataroom_exist = false;
        }, 3000);
        this.msg = "Dataroom successfully created";
        this.showSuccess();
        // console.log("serializer data is ", res);
        this.datarooms.push(res);
        this.createNewDataroom();
      },

      (error) => {
        this.msg = "Internal error occurred !";
        this.is_dataroom_exist = true;
        this.errors = error;
        this.showError();
      },


    );
  }

  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  archiveDataroom(dataroom: any) {
    this.dataRoomService
      .archivedRequestForDataroom(dataroom.id)
      .subscribe((res) => {
        this.msg = "Request has been send successfully for Archive";
        this.showSuccess();
      });
  }

  dataroom_detail: any;


  archivedRequestForDataroom(dataroom: any) {
    this.dataRoomService
      .archivedRequestForDataroom(dataroom.id)
      .subscribe((res) => {
        this.getAllDataRooms();
        if (res.is_request_for_archive) {
          this.msg = "Dataroom archive request successfully send !";
        } else {
          this.msg = " Dataroom Cancel archive request successfully send !";
        }
        this.showSuccess();
      });
  }

  deleteDataroom(dataroom_detail: any) {
    this.dataRoomService
      .deleteSingleDataroom(dataroom_detail.id)
      .subscribe((res) => {
        this.getAllDataRooms();
        if (dataroom_detail.is_request_for_deletion) {
          this.msg = " Dataroom Cancel delete request successfully send !";
        } else {
          this.msg =
            "Your request to delete the data room has been sent successfully to the support team. You will receive an email confirmation once it is processed successfully.";
        }

        this.showSuccess();
      });
  }

  update: any = {
    dataroom: "",
    clone_data: "",
    dataroom_name: "",
    user_group: false,
  };

  cloneExistingDataroom() {
    this.dataRoomService.cloneDataRoom(this.update).subscribe(
      (res) => {
        this.msg = "Dataroom successfully clone";
        this.showSuccess();
        this.getAllDataRooms();
      },
      (error) => {
        this.msg = "Internal error occurred !";
        this.showError();
      }
    );
  }

  contactSupportTrial(dataroom: any) {
    this.dataRoomService.contactSupportTrial(dataroom).subscribe((res) => {
      this.msg =
        "We have contacted the support regarding this matter through mail!!";
      this.showSuccess();
    });
  }

  Expire() {
    this.msg = "Please Reactivate Plan";
    this.showSuccess();
  }


  openDialogNote(): void {
    const dialogRef = this.dialog.open(SessionActivePopup, {
      width: "500px",
      data: { ok: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      localStorage.setItem("sactive", 'false');
    });
  }
  closeDialogNote(): void {
    this.dialog.closeAll();
  }
}

export interface DialogData {
  filecount: any;
  size: any;
  destination: string;
  source: string;
  copy: string;
  move: string;
  ok: string;
  popup_dataroom_name: string;
}

@Component({
  selector: "active-session",
  templateUrl: "session.html",
})
export class SessionActivePopup {
  isNotifyCheck: boolean = false;
  user: any;
  constructor(
    public dialogRefs: MatDialogRef<SessionActivePopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

    const user: any = localStorage.getItem("currentUser");
    this.user = JSON.parse(user);
  }


  onNoClick(): void {
    this.dialogRefs.close();
  }

}



