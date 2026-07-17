import { J } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataRoomService } from '../../../services';
import { CookieService } from 'ngx-cookie-service';
declare var jQuery: any;

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  public channelForm: FormGroup;
  public channelMemberForm: FormGroup;
  public showChannelList = false;
  current_user: any;
  msg: any;
  errors: any;
  showTeamsList = false;
  my_team_id;
  my_team_data: any;

  constructor(
    private dataRoomService: DataRoomService,
    public fb: FormBuilder,
    private toastrService: ToastrService,
    private cookieService : CookieService
  ) { }

  ngOnInit() {
    this.current_user = JSON.parse( localStorage.getItem('user'));
    console.log(this.current_user);

    this.initializeChannelForm()
    this.initializeChannelMemberForm()

    this.getButtonVisibility();
    this.getUserInfo();
    this.getAllChannel();
    this.getAllChannelsAndTeams();
    this.getAllMyteam();
    this.getDashboardCount();

  }

  showSuccess() {
    this.toastrService.success(this.msg);
  }

  showError() {
    this.toastrService.error(this.msg);
  }

  numericNumberReg: any = "^[0-9]\\d*(\\.\\d{1,2})?$";
  initializeChannelForm() {
    this.channelForm = this.fb.group({
      edit: [undefined],
      chanel_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
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
      dataroom_storage_allowed: [
        "",
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.minLength(1),
          Validators.pattern(this.numericNumberReg),
        ],
      ],
      dataroom_admin_allowed: [
        "",
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern(this.numericNumberReg),
        ],
      ],
      usage_alertemail: [
        "",
        [
          Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        ],
      ],
      usage_alertemailtwo: [
        "",
        [
          Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        ],
      ],
    })
  }

  initializeChannelMemberForm() {
    this.channelMemberForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      accesstodataroomusers: [false],
      allowtoaddnewmember: [false],
      allowtoaddnewteam: [false],
    });
  }

  buttonVisibility;
  getButtonVisibility() {
    this.dataRoomService.getButtonVisibilityCheck().subscribe((res) => {
      this.buttonVisibility = res;
    });
  }

  user_obj: any;
  getUserInfo() {
    //this.dataRoomService.getUserProfile().subscribe((res) => {
      this.user_obj = JSON.parse(    localStorage.getItem("currentUser"));
      // if(this.user_obj.is_team){
      //   this.hideNewContactForm = false;
      // }
    //});
  }

  all_channels;
  getAllChannel() {
    this.dataRoomService.getAllChannels().subscribe((res) => {
      this.all_channels = res;
      if (this.all_channels.length > 0) {
        this.all_channels.forEach((res) => {
          res.select = false;
        });
        this.all_channels[0].select = true;
        this.my_channel_id = this.all_channels[0].id;
        this.getSingleMyTeamInfo(this.my_team_id);
        this.getSingleChannelDashboardCount()
        // this.get_all_my_team_members();
        // this.get_my_team_data();
      }
    });
  }

  createChannelForm(form) {
    form.get('edit').setValue(false);
    console.log(form)
    this.dataRoomService.createMyChannel(form.value).subscribe((res) => {
      this.all_channels.push(res);
      this.msg = "Channel added";
      this.showSuccess();
      jQuery("#create-new-channel").modal("hide");
      this.channelForm.reset();
    });
  }

  editChannel(form, i) {
    let data = {
      edit: true,
      id: form.id,
      user: form.user,
      chanel_name: form.chanel_name,
      dataroom_allowed: form.dataroom_allowed,
      dataroom_storage_allowed: form.dataroom_storage_allowed,
      dataroom_admin_allowed: form.dataroom_admin_allowed,
      usage_alertemail: form.usage_alertemail,
      usage_alertemailtwo: form.usage_alertemailtwo,
    }
    this.dataRoomService.createMyChannel(data).subscribe((res) => {
      this.msg = "Channel updated";
      this.showSuccess();
      jQuery("#editChannel" + i).modal("hide");
    });
  }

  all_my_teams;
  all_my_teams_list;
  getAllMyteam() {
    this.dataRoomService.getAllMyteams().subscribe((res) => {
      this.all_my_teams = res[0];
      console.log(this.all_my_teams)
      if (this.all_my_teams != undefined) {
        this.all_my_teams_list = JSON.parse(JSON.stringify(this.all_my_teams));
        if (this.all_my_teams.length > 0) {
          this.all_my_teams.forEach((res) => {
            res.select = false;
          });
          this.all_my_teams[0].select = true;
          this.my_team_id = this.all_my_teams[0].id;
          console.log(this.my_team_id)
          this.getSingleMyTeamInfo(this.my_team_id);
          // // this.getMyTeamBrandingData(this.my_team_id);
          // this.get_all_my_team_members();
          // this.get_my_team_data();
        }
      }
    });
  }

  allChannelsAndTeams;
  allChannelsAndTeamsList;
  getAllChannelsAndTeams() {
    this.dataRoomService.getChannelsAndTeams().subscribe((res) => {
      this.allChannelsAndTeams = res;
      console.log(this.allChannelsAndTeams)
      this.allChannelsAndTeamsList = JSON.parse(JSON.stringify(this.allChannelsAndTeams));
      for (let index1 = 0; index1 < this.allChannelsAndTeams.length; index1++) {
        this.allChannelsAndTeams[index1]['select'] = false;
        for (let index2 = 0; index2 < this.allChannelsAndTeams[index1]['teamdata'].length; index2++) {
          this.allChannelsAndTeams[index1]['teamdata'][index2]['select'] = false;
        }
      }
      if (this.allChannelsAndTeams[0].teamdata.length > 0) {
        this.my_team_id = this.allChannelsAndTeams[0].teamdata[0].id;
        console.log(this.my_team_id)
        this.allChannelsAndTeams[0]['select'] = true;
        this.allChannelsAndTeams[0]['teamdata'][0]['select'] = true;
      }
    });
  }

  getSingleChannelAndTeam(team, i, j) {
    console.log(team, i, j)
    console.log(this.allChannelsAndTeams)
    this.my_team_id = team;

    for (let index1 = 0; index1 < this.allChannelsAndTeams.length; index1++) {
      this.allChannelsAndTeams[index1]['select'] = false;
      for (let index2 = 0; index2 < this.allChannelsAndTeams[index1]['teamdata'].length; index2++) {
        this.allChannelsAndTeams[index1]['teamdata'][index2]['select'] = false;
      }
    }
    this.allChannelsAndTeams[j]['select'] = true;
    this.allChannelsAndTeams[j]['teamdata'][i]['select'] = true;
  }

  getSingleTeam(team, i) {
    this.my_team_id = team;
    this.all_my_teams.forEach((res) => {
      res.select = false;
    });
    this.all_my_teams[i].select = true;
    this.getSingleMyTeamInfo(team);
    // this.getMyTeamBrandingData(team);
    // this.get_all_my_team_members();
    // this.get_my_team_data();
    // this.sharedService.sendMessage("Refresh Dataroom!", team);
  }

  //get single my team info
  getSingleMyTeamInfo(id) {
    if (id == undefined) {
      return;
    }
    this.dataRoomService.getMyTeamData(id).subscribe((res) => {
      // res.my_team_logo = this.base_url + res.my_team_logo;
      this.my_team_data = res;
    });
  }

  deleteChannel(channelId) {
    this.dataRoomService.deleteChannel(channelId).subscribe((res) => {
      this.msg = res;
      this.showSuccess();
      this.getDashboardCount();
    });
  }

  //get Channel Dashboard Counts
  dashboardCounts;
  dashboardCountsList;
  activeTeamsCount = 0;
  activeDataroomsCount = 0;
  storageAllottedCount = 0;
  getDashboardCount() {
    this.dataRoomService.getChannelDashboardCounts().subscribe((res) => {
      this.dashboardCounts = res;
      this.dashboardCountsList = res.data;
      for (let index = 0; index < this.dashboardCounts.data.length; index++) {
        this.activeTeamsCount += this.dashboardCounts.data[index]['myteamscount']
        this.activeDataroomsCount += this.dashboardCounts.data[index]['dataroomcount']
        this.storageAllottedCount += parseFloat(this.dashboardCounts.data[index]['dataroom_storage_allowed'])
      }
    });
  }

  singleDashboardCounts;
  getSingleChannelDashboardCount() {
    this.dataRoomService.getSingleChannelDashboardCounts(this.my_channel_id).subscribe((res) => {
      this.singleDashboardCounts = res.data[0];
    });
  }

  singleDashboardChannel;
  getSingleChannelCount() {
    console.log(this.my_channel_id);
    this.dataRoomService.getAllMembersData(this.my_channel_id).subscribe((res) => {
      this.singleDashboardChannel = res;
      console.log(this.singleDashboardChannel)
    });
  }

  my_channel_id;
  getSingleChannel(channel, i) {
    this.my_channel_id = channel;
    this.all_channels.forEach((res) => {
      res.select = false;
    });
    this.all_channels[i].select = true;
    this.getSingleChannelDashboardCount();
    this.getSingleChannelCount();
    this.toggleChannelAndTeam();
    // this.getSingleMyTeamInfo(channel);
    // this.get_all_my_team_members();
    // this.get_my_team_data();
  }

  toggleChannelAndTeam() {
    for (let index = 0; index < this.allChannelsAndTeams.length; index++) {
      if (this.allChannelsAndTeams[index]['id'] == this.my_channel_id) {
        this.my_team_id = this.allChannelsAndTeams[index]['teamdata'][0]['id'];
        for (let index1 = 0; index1 < this.allChannelsAndTeams.length; index1++) {
          this.allChannelsAndTeams[index1]['select'] = false;
          for (let index2 = 0; index2 < this.allChannelsAndTeams[index1]['teamdata'].length; index2++) {
            this.allChannelsAndTeams[index1]['teamdata'][index2]['select'] = false;
          }
        }

        this.allChannelsAndTeams[index]['select'] = true;
        this.allChannelsAndTeams[index]['teamdata'][0]['select'] = true;
      }
    }
  }

  searchList(event) {
    console.log(event.target.value)
    this.dashboardCounts.data = [];
    if (event.target.value.length == 0) {
      this.dashboardCounts.data = this.dashboardCountsList;
      return;
    }
    for (let index = 0; index < this.dashboardCountsList.length; index++) {
      console.log(this.dashboardCountsList[index]['chanel_name'].toLowerCase(), event.target.value.toLowerCase())
      if (this.dashboardCountsList[index]['chanel_name'].toLowerCase().startsWith(event.target.value.toLowerCase())) {
        this.dashboardCounts.data.push(this.dashboardCountsList[index])
      }
    }
  }

  searchTeamsList(event) {
    console.log(event.target.value)
    this.all_my_teams = [];
    if (event.target.value.length == 0) {
      this.all_my_teams = JSON.parse(JSON.stringify(this.all_my_teams_list));
      this.all_my_teams_list.forEach((res) => {
        res.select = false;
      });
      return;
    }
    for (let index = 0; index < this.all_my_teams_list.length; index++) {
      console.log(this.all_my_teams_list[index]['team_name'].toLowerCase(), event.target.value.toLowerCase())
      if (this.all_my_teams_list[index]['team_name'].toLowerCase().startsWith(event.target.value.toLowerCase())) {
        this.all_my_teams.push(this.all_my_teams_list[index])
      }
    }
  }

  searchChannelAndTeamsList(event, j) {
    console.log(event.target.value, j)
    console.log('-----> ', this.allChannelsAndTeams[j].teamdata)
    console.log('-----> ', this.allChannelsAndTeamsList[j].teamdata)
    this.allChannelsAndTeams[j].teamdata = [];
    if (event.target.value.length == 0) {
      console.log('clear')
      this.allChannelsAndTeams[j].teamdata = JSON.parse(JSON.stringify(this.allChannelsAndTeamsList[j].teamdata));
      for (let index1 = 0; index1 < this.allChannelsAndTeamsList.length; index1++) {
        this.allChannelsAndTeamsList[index1]['select'] = false;
        for (let index2 = 0; index2 < this.allChannelsAndTeamsList[index1]['teamdata'].length; index2++) {
          this.allChannelsAndTeamsList[index1]['teamdata'][index2]['select'] = false;
        }
      }
      return;
    }
    for (let index = 0; index < this.allChannelsAndTeamsList[j].teamdata.length; index++) {
      console.log(this.allChannelsAndTeamsList[j].teamdata[index]['team_name'].toLowerCase(), event.target.value.toLowerCase())
      if (this.allChannelsAndTeamsList[j].teamdata[index]['team_name'].toLowerCase().startsWith(event.target.value.toLowerCase())) {
        this.allChannelsAndTeams[j].teamdata.push(this.allChannelsAndTeamsList[j].teamdata[index])
      }
    }
  }

}
