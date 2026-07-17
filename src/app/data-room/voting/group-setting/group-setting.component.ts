import { Component, OnInit } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ElementRef, ViewChild, Directive, Input } from "@angular/core";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { DataRoomService } from "../../../services/index";
import { BaseUrlClass, ApiListClass } from "../../../common/index";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  UploadOutput,
  UploadInput,
  UploadFile,
  humanizeBytes,
  UploaderOptions,
} from "ngx-uploader";
import { CookieService } from "ngx-cookie-service";
declare var jQuery: any;

@Directive({ selector: "memberGroupInput" })
export class MemberGroupInput {
  // TODO(issue/24571): remove '!'.
  @Input() id!: string;
}

@Component({
  selector: "app-group-setting",
  templateUrl: "./group-setting.component.html",
  styleUrls: ["./group-setting.component.css"],
})
export class GroupSettingComponent implements OnInit {
  dataroomId: any;
  group_data: any = {};

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  selectedMembers = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl(0);
  filteredMembers: Observable<string[]>;
  members: any = [];
  voteId: any;
  allMembers: any = [];
  allFilteredMembers: any = [];

  constructor(
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private cookieService:CookieService,
    public baseUrlclass: BaseUrlClass
  ) {
    this.dataroomId =localStorage.getItem("currentDataroomId").toString();

    this.group_data = {
      title: "",
      description: "",
      dataroom: this.dataroomId,
      status: true,
      member: [],
    };

    this.filteredMembers = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit:any) =>
        fruit ? this._filter(fruit) : this.allFilteredMembers.slice()
      )
    );

    this.fruitCtrl.setValue(null);
  }

  ngOnInit() {
    this.getAllUsers();
    this.getAllVoterGroup();
  }

  focusFunction() {
    this.fruitCtrl.setValue(null);
  }

  dataroom_users_list: any;
  getAllUsers() {
    this.dataRoomService
      .getDataroomAllUsers(this.dataroomId)
      .subscribe((res) => {
        this.allMembers = res;
        for (var i = 0; i < this.allMembers.length; i++) {
          this.allFilteredMembers.push(
            this.allMembers[i].first_name + "(" + this.allMembers[i].email + ")"
          );
        }
        console.log(this.allMembers);
      });
  }

  @ViewChild("memberGroupInput") memberGroupInput: ElementRef;

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    console.log(value);
    // Add our fruit
    if ((value || "").trim()) {
      this.members.push();
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.fruitCtrl.setValue(null);
  }
  remove(fruit, indx): void {
    this.members.splice(indx, 1);
    this.selectedMembers.splice(indx, 1);
    console.log(this.selectedMembers);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log("value of data",event.option.value);

    console.log(this.members,"above if",this.allFilteredMembers);

    // this.allFilteredMembers = $.grep(this.allFilteredMembers, function(value) {
    // return $.allFilteredMembers(value, value) < 0;
    // })

    if (this.check_duplicate(event.option.value, this.members)) {
      this.selectedMembers.push(this.get_member(event.option.value));
      this.members.push(event.option.value);
    }

    // this.allFilteredMembers = this.allFilteredMembers.filter( function( el ) {
    //   console.log("el",el);
    //   return this.members.indexOf( el ) < 0;
    // } );
    // console.log("now check all list",this.allFilteredMembers);
    console.log("selected members",this.members);

    // console.log("this.allFilteredMembers",this.allFilteredMembers);
    this.memberGroupInput.nativeElement.value = "";
    this.fruitCtrl.setValue(null);
    // console.log("this value getting",event.option.value);
    // this.allFilteredMembers.splice(event.option.value,1);

    for (let e of this.members) {
      let t = this.allFilteredMembers.indexOf(e);
      console.log(t,e)
      if (t>-1)
        this.allFilteredMembers.splice(t,1);
      console.log("inside loop",this.allFilteredMembers);
    }
    console.log("see selected -->",this.allFilteredMembers);

    // this.allFilteredMembers = this.allFilteredMembers.filter( function( el ) {
    //   return this.members.indexOf( el ) < 0;
    // } );

    // console.log("check new members",this.allMembers);

    

//     this.allFilteredMembers = this.allFilteredMembers.filter(function(value, index) {
//      return this.selectedMembers.indexOf(index) == -1;
// })


  }
  private _filter(value: any): string[] {
    console.log(value);

    return this.allFilteredMembers.filter(
      (fruit) => fruit.toLowerCase().indexOf(value.toLowerCase()) > -1
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
        console.log(value,"get method of it",temp);
        return this.allMembers[i];
      }
    }
  }

  createGroup() {
    this.group_data.member = this.selectedMembers;
    // const res = this.allMembers.filter(x => this.selectedMembers.some(y => y.email === x.email));
     console.log(">>>>>>>>>>>>>>>>",this.group_data.member );
    
     if(this.group_data.member.length === 0){
      console.log("<<<<<<<<<<<<<<<<<<<<",this.group_data.member );
      this.msg = "Please select members from dataroom.";
      this.showError();
     }else{
      this.dataRoomService
      .createVoterGroup(this.group_data, this.dataroomId)
      .subscribe((res) => {
        console.log(res);
        jQuery("#creategroup").modal("hide");
        this.msg = "New Group created successfully.";
        this.showSuccess();
        this.voter_group_list = res;
       /// window.location.reload();
        // delete this.group_data;
        // this.voteList = res;
      });
     }

  }

  voter_group_list: any = [];
  getAllVoterGroup() {
    this.dataRoomService.getVoterGroup(this.dataroomId).subscribe((res) => {
      console.log(res);
      this.voter_group_list = res;
      // this.voteList = res;
    });
  }

  deleteVoterGroup(vote_group_details) {
    vote_group_details.status = false;
    this.dataRoomService
      .createVoterGroup(vote_group_details, this.dataroomId)
      .subscribe((res) => {
        console.log(res);
        this.msg = "Group Deleted successfully.";
        this.showInfo();
        this.voter_group_list = res;
        // this.voteList = res;
      });
  }

  editGroup(vote_group_details) {
    this.dataRoomService
      .createVoterGroup(vote_group_details, this.dataroomId)
      .subscribe((res) => {
        console.log(res);
        this.msg = "Group Updated successfully.";
        this.showInfo();
        this.voter_group_list = res;
        // this.voteList = res;
      });
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
}
