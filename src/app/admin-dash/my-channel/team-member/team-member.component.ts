import { Component, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataRoomService } from '../../../services';
declare var jQuery: any;

@Component({
  selector: 'app-team-member',
  templateUrl: './team-member.component.html',
  styleUrls: ['./team-member.component.css']
})
export class TeamMemberComponent implements OnInit {
  adminForm: FormGroup;
  msg: string = "";
	my_team_data: any;
	all_members: any = [];
	all_members_list: any = [];
  usage_alert_email: any;
	support_alert_email: any;
  invitation_send_email: any;
	is_success_error_message: boolean = false;
	already_exist_user: any;
	teamId;

	@Input() my_team_id;

  constructor(private _dataroom_service: DataRoomService, private toastrService: ToastrService, public _fb: FormBuilder) { }

  ngOnInit() {
    this.initializeUserAdminForm();
    this.teamId = this.my_team_id;
    this.get_my_team_data();
    this.getTeamMembersList();
  }

  ngOnChanges() {
    this.teamId = this.my_team_id;
    this.get_my_team_data();
    this.getTeamMembersList();
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
  initializeUserAdminForm() {
    this.adminForm = this._fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      accesstodataroomusers: [false],
      allowtoaddnewmember: [false],
      allowtoaddnewdataroom: [false],
      edit: [undefined],
    });
  }

  createNewAdmin(new_admin_form) {
    console.log("New admin form", new_admin_form.value);
    console.log("My team id", this.my_team_id);
    if(this.my_team_id == undefined) {
      return;
    }
    this.adminForm.get('edit').setValue(false);
    this._dataroom_service.add_new_member_to_my_team(new_admin_form.value, this.my_team_id)
      .subscribe((res) => {

        console.log("dataroom successfully added");
        if (res.success === true) {
          this.msg = "user successfully added !";
          this.invitation_send_email = res.invitation_send_email;
          this.already_exist_user = res.already_exist_user;
          this.is_success_error_message = true;
          this.adminForm.reset();
          this.msg = res.message;
          this.showSuccess();
          this.getTeamMembersList();
          jQuery("#add-new-member").modal("hide");
        } else {
          this.msg = res.message;
          this.showError();
        }
      })
  }
 
  editAdmin(adminData) {
    console.log("My team id", this.my_team_id);
    if(this.my_team_id == undefined) {
      return;
    }
    adminData.get('edit').setValue(true)
    console.log("edit admin form", adminData);
    this._dataroom_service.add_new_member_to_my_team(adminData.value, this.my_team_id)
      .subscribe((res) => {

        console.log("dataroom successfully updated");
        if (res.success === true) {
          this.msg = "user successfully updated!";
          this.invitation_send_email = res.invitation_send_email;
          this.already_exist_user = res.already_exist_user;
          this.is_success_error_message = true;
          this.msg = res.message;
          this.showSuccess();
          jQuery("#editTeamMember").modal("hide");
        } else {
          this.msg = res.message;
          this.showError();
        }
      })
  }

  patchForm(member) {
    this.adminForm.patchValue(member);
  }

  get_my_team_data() {
    console.log(this.my_team_id);
    if(this.my_team_id == undefined) {
      return;
    }
		this._dataroom_service.getMyTeamData(this.my_team_id).subscribe((res) => {
			//res.my_team_logo  = this.base_url+res.my_team_logo;                  
			this.my_team_data = res;
			console.log("my team data is", this.my_team_data);
		})
	}

  getTeamMembersList() {
    this._dataroom_service.getTeamMembersData(this.teamId).subscribe((res) => {
      this.all_members = res;
      this.all_members_list = res.team_member_data;
      console.log(this.all_members)
    });
  }

  deleteMember(memberId) {
    this._dataroom_service.delete_member_from_my_team(this.teamId, memberId).subscribe((res) => {
      console.log(res);
      this.getTeamMembersList();
    });
  }

  searchList(event) {
    console.log(event.target.value)
    this.all_members.team_member_data = [];
    if (event.target.value.length == 0) {
      this.all_members.team_member_data = this.all_members_list;
      return;
    }
    for (let index = 0; index < this.all_members_list.length; index++) {
      console.log(this.all_members_list[index]['first_name'].toLowerCase(), event.target.value.toLowerCase())
      if (this.all_members_list[index]['first_name'].toLowerCase().startsWith(event.target.value.toLowerCase())) {
        this.all_members.team_member_data.push(this.all_members_list[index])
      }
    }
  }

}
