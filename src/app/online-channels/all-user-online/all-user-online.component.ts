import { DataRoomService } from './../../services/dataroom_service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-all-user-online',
  templateUrl: './all-user-online.component.html',
  styleUrls: ['./all-user-online.component.css']
})
export class AllUserOnlineComponent implements OnInit {
  @Input() data;
  search = {
    userFullName: '',
    emailId: '',
    team: '',
    dataroom: '',
    role: '',
  }
  constructor(private dataRoomService:DataRoomService) { }
p1;
  ngOnInit() {
  }

  resetList() {
    this.search = {
      userFullName: '',
      emailId: '',
      team: '',
      dataroom: '',
      role: '',
    }
    this.dataRoomService.getOnlineTeamUsersData().subscribe((res) => {
      this.data= res.data;
    });
  }
  getFilteredUsers() {
    this.dataRoomService.getOnlineFilteredUsersData(this.search).subscribe((res) => {
      this.data = res.data;
    });
  }

}
