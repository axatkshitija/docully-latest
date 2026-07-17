import { Component, OnInit, ElementRef, ViewChild, Directive, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataRoomService } from '../../../services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { BaseUrlClass, ApiListClass } from '../../../common/index';
import { Location } from '@angular/common';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CookieService } from 'ngx-cookie-service';
declare var jQuery: any;



@Directive({ selector: 'MemberManageInput' })

export class MemberManageInput {
  // TODO(issue/24571): remove '!'.
  @Input() id !: string;
}



@Component({
  selector: 'app-manage-voters',
  templateUrl: './manage-voters.component.html',
  styleUrls: ['./manage-voters.component.css']
})
export class ManageVotersComponent implements OnInit {
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
  votestatus: any;
  usertimezone: any;
  constructor(private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private cookieService: CookieService,
    public baseUrlclass: BaseUrlClass, private _location: Location,) {

    this.route.params.subscribe(params => {
      this.voteId = params.voteId;
      this.votestatus = params.statusId;
      console.log("votestatus>>>>>>>>>", this.votestatus)
      this.getVoteResultList(this.voteId);

    });
    this.dataroomId = (localStorage.getItem("currentDataroomId")).toString();


  }

  ngOnInit() {

    this.filteredMembers = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFilteredMembers.slice()));
   // this.fruitCtrl.setValue('a');
    this.getUserInfo();
    this.getAllUsers();
    this.usertimezone = localStorage.getItem("currentUser")
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }



  geBack() {
    this._location.back();
  }


  @ViewChild('MemberManageInput') MemberManageInput: ElementRef;



  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    // if ((value || '').trim()) {
    //   this.members.push(value.trim());
    // }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }
  remove(fruit, indx): void {
    this.members.splice(indx, 1);
    this.selectedMembers.splice(indx, 1);
    console.log(this.selectedMembers, indx);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event);

    if (this.check_duplicate(event.option.value, this.members)) {
      this.selectedMembers.push(this.get_member(event.option.value));
      this.members.push(event.option.value);
    }
    this.MemberManageInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }
  private _filter(value: any): string[] {
    console.log(value);

    return this.allFilteredMembers.filter(fruit =>
      fruit.toLowerCase().indexOf(value.toLowerCase()) === 0);
  }


  check_duplicate(value, data) {

    for (var i = 0; i < data.length; i++) {
      if (data[i] === value) {
        return false
      }
    }
    return true;
  }


  private get_member(value: any) {
    for (var i = 0; i < this.allMembers.length; i++) {

      var temp = value.split('(')[1];

      if (temp.split(')')[0] == this.allMembers[i].email) {
        return this.allMembers[i];
      }
    }

  }

  focusFunction() {

    this.fruitCtrl.setValue(null);
  }

  voteResultList: any;
  getVoteResultList(voteId) {
    console.log(3434);
    this.dataRoomService.getVotingResult(voteId)
      .subscribe((res) => {
        console.log(res);
        const newdata = res;
        this.voteResultList = newdata.map((obj, i) => ({ ...obj, vote_date: obj.vote_date + '+04:00' }));
      })
  }

  removeVoter(voter_id) {
    console.log(voter_id);

    this.dataRoomService.removeVoter(this.dataroomId, voter_id)
      .subscribe((res) => {
        this.msg = res.message;
        this.showSuccess();

        this.getVoteResultList(this.voteId);
      })

  }

  addVoter() {
    if (this.selectedMembers.length > 0) {
      this.dataRoomService.addVoter(this.selectedMembers, this.dataroomId, this.voteId)
        .subscribe((res) => {
          // this.allMembers = res;

          this.msg = res.new + ' Voters Added Succesfully';
          this.showSuccess();
          jQuery("#createVoter").modal("hide");
          this.getVoteResultList(this.voteId);

          console.log(this.selectedMembers);
        })
    } else {
      console.log("Please Select Voter");
    }
  }

  user: any = {
    member: {
      is_dataroom_admin: false,
    }
  };
  user_id: number;
  getUserInfo() {
    this.dataRoomService.getUserProfileDatroom(this.dataroomId)
      .subscribe((res) => {
        this.user = res;
        this.user_id = res.id;
      })
  }

  dataroom_users_list: any;
  getAllUsers() {
    this.dataRoomService.getDataroomAllUsers(this.dataroomId)
      .subscribe((res) => {
        this.allMembers = res;
        for (var i = 0; i < this.allMembers.length; i++) {
          this.allFilteredMembers.push(this.allMembers[i].first_name + '(' + this.allMembers[i].email + ')');
        }

        // for (let e of this.members) {
        // let t = this.allFilteredMembers.indexOf(e);
        // console.log("value of e",e);
        // if (t>-1){
        //   this.allFilteredMembers.splice(t,1);
        // }
        // }

        console.log(this.allMembers);
      })
  }


  msg: any = '';
  //Toast Messages
  showSuccess() {
    console.log("dog:-", this.msg)
    this.toastr.success(this.msg);
  }


  showError() {
    this.toastr.error(this.msg);
  }

  showInfo() {
    this.toastr.info(this.msg);
  }

}
