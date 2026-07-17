import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { DataRoomService, SharedService } from '../../../services/index';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
declare var jQuery: any;

@Component({
	selector: 'app-members',
	templateUrl: './members.component.html',
	styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
	@Input() my_team_id;
	msg: string = "";
	adminForm: FormGroup;
	all_members: any = [];
	already_exist_user: any;
	errors: any;
	invitation_send_email: any;
	is_success_error_message: boolean = false;
	my_team_data: any;
	message: any;
	usage_alert_email: any;
	support_alert_email: any;
	subscription: Subscription;
	constructor(private _dataroom_service: DataRoomService,
		private toastrService: ToastrService,
		private _fb: FormBuilder,
		private sharedService: SharedService,
	) {
		this.subscription = this.sharedService.getMessage().subscribe(message => {
			//
			this.message = message;
			// if (this.message.text == "Refresh Dataroom!") {
			// 	this.my_team_id = this.message.id;
			// 	this.initializeUserAdminForm();
			// 	this.get_all_my_team_members();
			// 	this.get_my_team_data();
			// }
		})
	}

	ngOnInit() {
		this.initializeUserAdminForm();
		this.get_all_my_team_members();
		this.get_my_team_data();
	}

	showSuccess() {
		this.toastrService.success(this.msg);
	}

	showError() {
		this.toastrService.error(this.msg);
	}

	createNewAdmin(new_admin_form) {
		console.log("New admin form", new_admin_form.value);

		console.log("My team id", this.my_team_id);
		this._dataroom_service.add_new_member_to_my_team(new_admin_form.value, this.my_team_id)
			.subscribe((res) => {

				console.log("dataroom successfully added");
				if (res.success === true) {
					this.msg = "user successfully added !";
					this.invitation_send_email = res.invitation_send_email;
					this.already_exist_user = res.already_exist_user;
					this.is_success_error_message = true;
					this.all_members.push(new_admin_form.value);
					this.adminForm.reset();
					this.msg = res.message;
					this.showSuccess();
					jQuery("#add-new-member").modal("hide");
				} else {
					this.msg = res.message;
					this.showError();
				}
			})
	}


	onlyTextValidator(control: AbstractControl): { [key: string]: any } | null {
		const valid = /^[a-zA-Z\s]*$/.test(control.value);
		return valid ? null : { 'invalidText': { value: control.value } };
	  }
	
	  emailPattern =
	  "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
	  "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
	  
	initializeUserAdminForm() {
		this.adminForm = this._fb.group({
			first_name: ['', Validators.required,this.onlyTextValidator],
			last_name: ['', Validators.required,this.onlyTextValidator],
			email: ['', Validators.required,Validators.pattern(this.emailPattern)],
		});
	}

	removeSelectedMember(member, i) {

		console.log("Add new member ", i);
		this._dataroom_service.delete_member_from_my_team(this.my_team_id, member.id)
			.subscribe((res) => {
				this.all_members.splice(i, 1);
				this.msg = res.msg;
				this.showSuccess();
			})
	}

	// get all my team members 
	get_all_my_team_members() {
		this._dataroom_service.get_all_my_team_members(this.my_team_id)
			.subscribe((res) => {
				this.all_members = res.team_member_data;
				console.log("Result is", res);
				//console.log("get all my team members method successfully called");
			})
	}

	get_my_team_data() {
		this._dataroom_service.getMyTeamData(this.my_team_id).subscribe((res) => {
			//res.my_team_logo  = this.base_url+res.my_team_logo;                  
			this.my_team_data = res;
			console.log("my team data is", this.my_team_data);
		})
	}


}
