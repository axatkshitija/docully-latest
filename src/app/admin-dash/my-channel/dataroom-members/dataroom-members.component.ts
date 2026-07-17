import { Component, Input, OnInit } from '@angular/core';
import { DataRoomService } from '../../../services';

@Component({
  selector: 'app-dataroom-members',
  templateUrl: './dataroom-members.component.html',
  styleUrls: ['./dataroom-members.component.css']
})
export class DataroomMembersComponent implements OnInit {
  @Input() my_team_id;
  dataroom_users;
  dataroom_users_list;
  teamId;

  constructor(
    private dataRoomService: DataRoomService,
  ) { }

  ngOnInit() {
    this.getTeamUsersList()
  }

  ngOnChanges() {
    this.teamId = this.my_team_id
    this.getTeamUsersList()
  }

  getTeamUsersList() {
    this.dataRoomService.getTeamUsersData(this.teamId).subscribe((res) => {
      this.dataroom_users = res.data;
      this.dataroom_users_list = res.data;
    });
  }

  searchList(event) {
    console.log(event.target.value)
    this.dataroom_users = [];
    if (event.target.value.length == 0) {
      this.dataroom_users = this.dataroom_users_list;
      return;
    }
    for (let index = 0; index < this.dataroom_users_list.length; index++) {
      console.log(this.dataroom_users_list[index]['userfullname'].toLowerCase(), event.target.value.toLowerCase())
      if (this.dataroom_users_list[index]['userfullname'].toLowerCase().startsWith(event.target.value.toLowerCase())) {
        this.dataroom_users.push(this.dataroom_users_list[index])
      }
    }
  }

}
