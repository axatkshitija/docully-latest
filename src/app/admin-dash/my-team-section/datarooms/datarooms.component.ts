import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  NgForm,
  AbstractControl,
} from "@angular/forms";
import { DataRoomService, SharedService } from "../../../services/index";
import { ToastrService } from "ngx-toastr";
import { RouterModule, Routes } from "@angular/router";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { BaseUrlClass, ApiListClass } from "../../../common/index";
import { TimezoneService } from "../../../services/timezone.service";
import { filter } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";
declare var jQuery: any;

@Component({
  selector: "app-datarooms",
  templateUrl: "./datarooms.component.html",
  styleUrls: ["./datarooms.component.css"],
})
export class DataroomsComponent implements OnInit {
  datarooms: any;

  is_dataroom_exist: boolean = false;
  @Input() my_team_id: any;
  public createNewDataroomForm: FormGroup; // our form model
  public editDataroomForm: FormGroup; // our form model
  msg: any;
  errors: any;
  timezone: any;
  areControlsEnabled: boolean = false;
  message: any;
  selectedIndex: any;
  subscription: Subscription;
  is_uae: boolean = false;
  //my_team_id : number ;
  constructor(
    private dataRoomService: DataRoomService,
    private toastrService: ToastrService,
    private router: Router,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private timeZone: TimezoneService,
    private cookieService:CookieService
  ) {
    this.subscription = this.sharedService.getMessage().subscribe((message) => {
      this.message = message;
      this.my_team_id = this.message.id;
      if (this.message.text == "Refresh Dataroom!") {
        this.my_team_id = this.message.id;
        this.get_all_my_team_members();
        this.get_my_team_data();
        this.createNewDataroom();
        this.timezone = this.timeZone.userTimeZone;
      }
    });
  }

  ngOnInit() {
    this.get_all_my_team_members();
    this.get_my_team_data();
    this.createNewDataroom();
    this.getAllDataRoomsFolders();
  }
  numericNumberReg: any = "^[0-9]\\d*(\\.\\d{1,2})?$";
  getToDetailedPage(dataroomId, choose_overview_default_page) {
    console.log(dataroomId, "dataroomid");
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

    // console.log(this.datarooms_folders, "Folder");
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
        // this.datarooms.push(res);
        // this.getAllDataRooms();
      },
      (error) => {
        this.msg = "Internal error occurred !";
        // this.is_dataroom_exist = true;
        // this.errors = error;
        // console.log(error)
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
              localStorage.setItem( "Multiple" + "&" + dataroomName + "&" + dataroomId,
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

  onlyTextValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^[a-zA-Z\s]*$/.test(control.value);
    return valid ? null : { 'invalidText': { value: control.value } };
  }

  emailPattern =
  "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
  "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  
  nameValidator(control: FormControl): { [key: string]: boolean } {
    const nameRegexp: RegExp = /[!#%^+\=\[\]{};':"\\|,.<>\?]/;
    if (control.value && nameRegexp.test(control.value)) {
       return { invalidName: true };
    }
}
  createNewDataroom() {
    this.createNewDataroomForm = new FormGroup({
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
      dataroom_users_permitted: new FormControl(""),
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
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]),
      }),
    });
  }

  editDataroomData() {
    console.log(this.all_datarooms[this.selectedIndex]);
    
    this.createNewDataroomForm.patchValue(this.all_datarooms[this.selectedIndex])
  }

  checkUae(event){
    console.log(event)
    this.is_uae = event;
      }
    
  // submit new dataroom

  submitNewDataroom(new_dataroom: any) {
    console.log("New dataroom form", new_dataroom, this.my_team_id);
    this.dataRoomService
      .create_dataroom_from_my_team(this.my_team_id, new_dataroom,this.is_uae)
      .subscribe((res) => {
        console.log("Dataroom successfully cretaed");
        if (res.success === true) {
          console.log("Success is true");
          this.msg = res.message;
          this.showSuccess();
          this.all_datarooms.push(res.data);
          this.createNewDataroom();
          jQuery("#addDateRoom").modal("hide");
          // window.location.reload();
        } else {
          this.msg = res.message;
          this.showError();
          console.log("Error is false");
        }
      });
  }

  // get all datarooms

  all_datarooms: any;
  all_members: any;
  my_team_data: any;
  all_dataroomsList = [];
  get_all_my_team_members() {
    this.dataRoomService
      .get_all_my_team_members(this.my_team_id)
      .subscribe((res) => {
        this.all_datarooms = res.datarooms;
        this.all_dataroomsList = this.all_datarooms;
        this.all_members = res.all_members;
      });
  }
  getDataFromDataroomNameOrId(event) {
    this.all_dataroomsList = [];
    console.log(event.target.value, this.all_datarooms)
    if (event.target.value == null) {
      this.all_dataroomsList = this.all_datarooms
    }
    for (let i = 0; i < this.all_datarooms.length; i++) {
      if (this.all_datarooms[i]['dataroom_name'].includes(event.target.value) || this.all_datarooms[i]['id'].includes(event.target.value)) {
        this.all_dataroomsList.push(this.all_datarooms[i]);
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
    this.dataRoomService.getMyTeamData(this.my_team_id).subscribe((res) => {
      //res.my_team_logo  = this.base_url+res.my_team_logo;
      this.my_team_data = res;
      console.log("my team data is", this.my_team_data);
    });
  }

  archivedRequestForDataroom(dataroom) {
    console.log("Archived requets for dataroom ", dataroom.id);
    this.dataRoomService
      .archivedRequestForDataroom(dataroom.id)
      .subscribe((res) => {
        console.log("Archived requets ", res);
        // this.dataroom_detail.is_request_for_archive =
        //   res.is_request_for_archive;
        if (res.is_request_for_archive) {
          this.msg = "Dataroom archive request successfully send !";
        } else {
          this.msg = " Dataroom Cancel archive request successfully send !";
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
      });
  }

}
