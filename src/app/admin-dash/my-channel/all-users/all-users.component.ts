import { Component, OnInit } from '@angular/core';
import { DataRoomService } from '../../../services';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  all_users;
  search = {
    userFullName: '',
    emailId: '',
    team: '',
    dataroom: '',
    channel: '',
    role: '',
  }

  constructor(
    private dataRoomService: DataRoomService,
  ) { }

  ngOnInit() {
    this.getUsersList();
  }

  getUsersList() {
    this.dataRoomService.getAllUsersData().subscribe((res) => {
      this.all_users = res.data;
    });
  }

  resetList() {
    this.search = {
      userFullName: '',
      emailId: '',
      team: '',
      dataroom: '',
      channel: '',
      role: '',
    }
    this.dataRoomService.getAllUsersData().subscribe((res) => {
      this.all_users = res.data;
    });
  }

  getFilteredUsers() {
    this.dataRoomService.getFilteredUsersData(this.search).subscribe((res) => {
      this.all_users = res.data;
    });
  }
}
