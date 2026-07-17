import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataRoomService } from '../../../services';
import { CookieService } from 'ngx-cookie-service';
declare var jQuery: any;

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  public myTeamForm: FormGroup;
  msg: any;
  errors: any;
  numericNumberReg: any = "^[0-9]\\d*(\\.\\d{1,2})?$";
  @Input() chanel;
  @Input() singleDashboardCounts;
  @Output() channelAndTeamUpdate = new EventEmitter();
  channelId;
  channelDetail;
  currentUser;

  constructor(public _fb: FormBuilder, public _dataroom_service: DataRoomService, private toastrService: ToastrService,private cookieService:CookieService) { }

  ngOnInit() {
    this.currentUser = JSON.parse( localStorage.getItem('user'));
    console.log(this.currentUser)
    this.initializeMyTeamForm();
  }

  ngOnChanges() {
    this.channelId = this.chanel;
    this.channelDetail = this.singleDashboardCounts;
    console.log(this.channelId, this.channelDetail);
    this.getAllMyteam();
  }

  showSuccess() {
    this.toastrService.success(this.msg);
  }

  showError() {
    this.toastrService.error(this.msg);
  }

  initializeMyTeamForm() {
    this.myTeamForm = this._fb.group({
      chanel: [0],
      edit:[undefined],
      team_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      storage_exceed: [
        false,
        [
          Validators.required,
        ],
      ],
      usage_alertemail: [
        "",
        [
          // Validators.required,
          Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        ],
      ],
      usage_alertemailtwo: [
        "",
        [
          // Validators.required,
          Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        ],
      ],
      dataroom_allowed: [
        "",
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern(this.numericNumberReg),
        ],
      ],
      dataroom_admin_allowed: [
        "",
        [
          // Validators.required,
          Validators.maxLength(5),
          Validators.pattern(this.numericNumberReg), 
          Validators.pattern("^[0-9]*$")
        ],
      ],
      dataroom_storage_allowed: [
        "",
        [
          Validators.required,
          Validators.maxLength(3),
          // Validators.minLength(1),
          Validators.pattern(this.numericNumberReg),
        ],
      ],
    });
  }

  saveMyTeamForm(myTeamForm) {
    console.log(this.channelId)
    myTeamForm.get('chanel').setValue(this.channelId);
    myTeamForm.get('edit').setValue(false);
    console.log(myTeamForm);
    console.log(myTeamForm.controls.dataroom_admin_allowed.value);
    if(myTeamForm.controls.dataroom_admin_allowed.value==="")
    {
      myTeamForm.get('dataroom_admin_allowed').setValue(1000000);
      console.log(myTeamForm.controls.dataroom_admin_allowed.value);
    console.log(myTeamForm);
    this._dataroom_service.createMyTeam(myTeamForm.value).subscribe((res) => {
      this.all_my_teams.push(res);
      this.msg = "Team added";
      console.log("res>>>>>>>",res)
      this.showSuccess();
      // myTeamForm.reset();
      this.initializeMyTeamForm();
      this.getAllMyteam()
      jQuery("createnewteam").modal("hide");
      this.channelAndTeamUpdate.emit('updateChannelAndTeam')
    });
    }else{
    console.log(myTeamForm.controls.dataroom_admin_allowed.value);
    console.log(myTeamForm);
    this._dataroom_service.createMyTeam(myTeamForm.value).subscribe((res) => {
      this.all_my_teams.push(res);
      console.log("res>>>>>>>",res)
      this.msg = "Team added";
      this.showSuccess();
      // myTeamForm.reset();
      this.initializeMyTeamForm();
      this.getAllMyteam()
      jQuery("createnewteam").modal("hide");
      this.channelAndTeamUpdate.emit('updateChannelAndTeam')
    });
  }
  }

  editTeam(team, id) {
    this._dataroom_service.updateMyTeam(team).subscribe((res) => {
      this.msg = res.msg;
      this.showSuccess();
      // window.location.reload();
      jQuery("" + id + "").modal("hide");
      // this.get_my_team_data();
    });
  }

  deleteTeam(teamId) {
    this._dataroom_service.deleteTeam(teamId).subscribe(res => {
      this.msg = res;
      this.showSuccess();
      this.getAllMyteam()
    })
  }

  all_my_teams;
  all_my_teams_list;
  getAllMyteam() {
    console.log(this.channelId);
    this._dataroom_service.getAllMembersData(this.channelId).subscribe((res) => {
      this.all_my_teams = res.team_data;
      this.all_my_teams_list = res.team_data;
      console.log(this.all_my_teams)
    });
  }

  searchList(event) {
    console.log(event.target.value)
    this.all_my_teams = [];
    if (event.target.value.length == 0) {
      this.all_my_teams = this.all_my_teams_list;
      return;
    }
    for (let index = 0; index < this.all_my_teams_list.length; index++) {
      console.log(this.all_my_teams_list[index]['team_name'].toLowerCase(), event.target.value.toLowerCase())
      if (this.all_my_teams_list[index]['team_name'].toLowerCase().startsWith(event.target.value.toLowerCase())) {
        this.all_my_teams.push(this.all_my_teams_list[index])
      }
    }
  }

}
