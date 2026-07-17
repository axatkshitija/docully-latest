import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataRoomService } from '../../../services';
import { CookieService } from 'ngx-cookie-service';
declare var jQuery: any;

@Component({
  selector: 'app-all-members',
  templateUrl: './all-members.component.html',
  styleUrls: ['./all-members.component.css']
})
export class AllMembersComponent implements OnInit {
  all_members;
  all_membersList;
  channelId;
  msg: any;
  current_user: any;

  public channelMemberForm: FormGroup;

  @Input() my_channel_id;

  constructor(
    private dataRoomService: DataRoomService,
    public fb: FormBuilder,
    private toastrService: ToastrService,
    private cookieService:CookieService
  ) { }

  ngOnInit() {
    this.current_user = JSON.parse( localStorage.getItem('user'));
    this.channelId = this.my_channel_id;
    this.initializeChannelMemberForm()
    this.getMembersList()
  }

  ngOnChanges() {
    this.channelId = this.my_channel_id;
    this.getMembersList()
  }

  showSuccess() {
    this.toastrService.success(this.msg);
  }

  showError() {
    this.toastrService.error(this.msg);
  }
  onlyTextValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^[a-zA-Z\s]*$/.test(control.value);
    return valid ? null : { 'invalidText': { value: control.value } };
  }

  emailPattern =
  "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
  "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  
  initializeChannelMemberForm() {
    this.channelMemberForm = this.fb.group({
      first_name: ['', Validators.required,this.onlyTextValidator],
      last_name: ['', Validators.required,this.onlyTextValidator],
      email: ['', Validators.required,Validators.pattern(this.emailPattern)],
      accesstodataroomusers: [false],
      allowtoaddnewmember: [false],
      allowtoaddnewteam: [false],
      edit: [undefined],
    });
  }

  getMembersList() {
    console.log(this.channelId);
    this.dataRoomService.getAllMembersData(this.channelId).subscribe((res) => {
      this.all_members = res;
      this.all_membersList = res.team_member_data;
      console.log(this.all_members)
    });
  }

  deleteMember(memberId) {
    this.dataRoomService.delete_member_from_my_channel(this.channelId, memberId).subscribe((res) => {
      console.log(res);
      this.msg = res.msg;
      this.showSuccess();
      this.getMembersList()
    });
  }

  createNewChannelMember(channelMemberForm) {
    if (this.my_channel_id == undefined) {
      return;
    }
    this.channelMemberForm.get('edit').setValue(false)
    this.dataRoomService.add_new_member_to_my_chanel(channelMemberForm.value, this.my_channel_id)
      .subscribe((res) => {
        if (res.success === true) {
          this.msg = "user successfully added !";
          // this.all_members.push(channelMemberForm.value);
          this.channelMemberForm.reset();
          this.msg = res.message;
          this.showSuccess();
          this.getMembersList()
          jQuery("#add-channel-member").modal("hide");
        } else {
          this.msg = res.message;
          this.showError();
        }
      })
  }

  patchMember(member) {
    console.log(member)
    this.channelMemberForm.patchValue(member);
  }

  editChannelMember(channelMemberForm) {
    if (this.my_channel_id == undefined) {
      return;
    }
    this.channelMemberForm.get('edit').setValue(true)
    this.dataRoomService.add_new_member_to_my_chanel(channelMemberForm.value, this.my_channel_id)
      .subscribe((res) => {
        if (res.success === true) {
          this.msg = "user successfully updated!";
          this.msg = res.message;
          this.showSuccess();
          jQuery("#editChannelMember").modal("hide");
        } else {
          this.msg = res.message;
          this.showError();
        }
      })
  }

  searchList(event) {
    console.log(event.target.value)
    this.all_members.team_member_data = [];
    if (event.target.value.length == 0) {
      this.all_members.team_member_data = this.all_membersList;
      return;
    }
    for (let index = 0; index < this.all_membersList.length; index++) {
      console.log(this.all_membersList[index]['first_name'].toLowerCase(), event.target.value.toLowerCase())
      if (this.all_membersList[index]['first_name'].toLowerCase().startsWith(event.target.value.toLowerCase())) {
        this.all_members.team_member_data.push(this.all_membersList[index])
      }
    }
  }
}
