import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Directive,
  Input,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { DataRoomService } from "../../../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";

import { BaseUrlClass, ApiListClass } from "../../../common/index";
import { Location } from "@angular/common";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { TimezoneService } from "../../../services/timezone.service";
import { CookieService } from "ngx-cookie-service";
declare var jQuery: any;

@Directive({ selector: "MemberManageGroupInput" })
export class MemberManageGroupInput {
  // TODO(issue/24571): remove '!'.
  @Input() id!: string;
}

@Component({
  selector: "app-manage-group-members",
  templateUrl: "./manage-group-members.component.html",
  styleUrls: ["./manage-group-members.component.css"],
})
export class ManageGroupMembersComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  selectedMembers = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredMembers: Observable<string[]>;
  members: any = [];
  dataroomId: any;
  voteId: any;
  allMembers: any = [];
  allFilteredMembers: any = [];
  groupId: any;
  timezone: any;
  usertimezone: any;
  constructor(
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    public baseUrlclass: BaseUrlClass,
    private _location: Location,
    private cookieService:CookieService,
    private timeZone: TimezoneService
  ) {
    this.route.params.subscribe((params) => {
      this.groupId = params.groupId;
      // this.getVoterGroupMemberList(this.groupId);
      this.timezone = this.timeZone.userTimeZone;
    });
    this.dataroomId =localStorage.getItem("currentDataroomId").toString();
  }

  ngOnInit() {
    this.filteredMembers = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allFilteredMembers.slice()
      )
    );
    //this.fruitCtrl.setValue("a");

    this.getVoterGroupMemberList(this.groupId);
    this.getAllUsers();
    this.getUserInfo();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];

  }

  geBack() {
    this._location.back();
  }

  @ViewChild("MemberManageGroupInput") MemberManageGroupInput: ElementRef;

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    // if ((value || '').trim()) {
    //   this.members.push(value.trim());
    // }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.fruitCtrl.setValue(null);
  }

  focusFunction() {
    this.fruitCtrl.setValue(null);
  }

  remove(fruit, indx): void {
    this.members.splice(indx, 1);
    this.selectedMembers.splice(indx, 1);
    console.log(this.selectedMembers);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.check_duplicate(event.option.value, this.members)) {
      this.selectedMembers.push(this.get_member(event.option.value));
      this.members.push(event.option.value);
    }
    this.MemberManageGroupInput.nativeElement.value = "";
    this.fruitCtrl.setValue(null);
  }
  private _filter(value: any): string[] {
    console.log(value);

    return this.allFilteredMembers.filter(
      (fruit) => fruit.toLowerCase().indexOf(value.toLowerCase()) === 0
    );
  }

  check_duplicate(value, data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i] === value) {
        return false;
      }
    }
    return true;
  }

  private get_member(value: any) {
    for (var i = 0; i < this.allMembers.length; i++) {
      var temp = value.split("(")[1];

      if (temp.split(")")[0] == this.allMembers[i].email) {
        return this.allMembers[i];
      }
    }
  }

  voter_group_members: any;
  getVoterGroupMemberList(group_id) {
    this.dataRoomService.getVoterGroupMemberList(group_id).subscribe((res) => {
      //this.voter_group_members = res;
      const newdata = res;
      this.voter_group_members = newdata.map((obj, i) => ({ ...obj, created_date: obj.created_date + '+04:00' }));
      console.log(res);
      console.log("in voter api",this.allMembers);

    });
  }

  dataroom_users_list: any;
  getAllUsers() {
    this.dataRoomService
      .getDataroomAllUsers(this.dataroomId)
      .subscribe((res) => {
        this.allMembers = res;
        // console.log("check",this.voter_group_members);
        // for (var i = 0; i < this.allMembers.length; i++) {
        //   this.allFilteredMembers.push(
        //     this.allMembers[i].first_name + "(" + this.allMembers[i].email + ")"
        //   );
        // }

        // console.log("all data",this.allFilteredMembers);
        // console.log(this.allMembers);
      });
  }

  filtermember(){
    console.log("filter voter data",this.voter_group_members);
    // console.log("all filtered data",this.allFilteredMembers);
    console.log("all members",this.allMembers);
    while(this.allFilteredMembers.length > 0) {
    this.allFilteredMembers.pop();
    }
    for (let e of this.voter_group_members) {
      console.log("loop",e.email)
      // let t = this.allMembers.indexOf(e.email);
      // if (t>-1){
      //   this.allMembers.splice(t,1);
      // }
      for (var i = 0; i < this.allMembers.length; i++) {
        let t = this.allMembers[i].email.indexOf(e.email);
        if (t>-1){
          console.log("duplicate now pop")          
        }
        else{
          this.allFilteredMembers.push(
          this.allMembers[i].first_name + "(" + this.allMembers[i].email + ")"
        );
        }

    }
    }
    // for (var i = 0; i < this.allMembers.length; i++) {
    //   this.allFilteredMembers.push(
    //     this.allMembers[i].first_name + "(" + this.allMembers[i].email + ")"
    //   );
    // }
    console.log("now after filter all filtered data",this.allFilteredMembers);
    
  }



  msg: any = "";
  //Toast Messages
  showSuccess() {
    console.log("dog:-", this.msg);
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  showInfo() {
    this.toastr.info(this.msg);
  }

  addVoterGroupMember() {
    // AddMemberVoterGroup
    console.log(this.selectedMembers);
    this.dataRoomService
      .AddMemberVoterGroup(this.selectedMembers, this.groupId)
      .subscribe((res) => {
        // this.voter_group_members = res;
        // console.log(res);
        jQuery("#addMember").modal("hide");
        this.getVoterGroupMemberList(this.groupId);
        window.location.reload();
      });
  }

  deleteMember(group_member_id) {
    this.dataRoomService
      .DelMemberVoterGroup(group_member_id)
      .subscribe((res) => {
        this.getVoterGroupMemberList(this.groupId);
        // this.voter_group_members = res;
        console.log(res);
      });
  }

  user: any;
  user_id: number;
  getUserInfo() {
    this.dataRoomService
      .getUserProfileDatroom(this.dataroomId)
      .subscribe((res) => {
        this.user = res;
        this.user_id = res.id;
      });
  }
}
