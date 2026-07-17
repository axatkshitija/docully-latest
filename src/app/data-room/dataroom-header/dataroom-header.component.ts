import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiListClass, BaseUrlClass,  } from '../../common';
import { AuthenticationService, DataRoomService } from '../../services';


@Component({
  selector: 'app-dataroom-header',
  templateUrl: './dataroom-header.component.html',
  styleUrls: ['./dataroom-header.component.css']
})
export class DataroomHeaderComponent implements OnInit {

  @Input("user")
  user: any;
  avatarUrl: string;
  _base_url: string;
  userActivity;
 
  userone: any;
  currentDataroomId: string;
  dataroom_detail: any;

  constructor(
    private dataRoomService: DataRoomService,
    private baseUrlClass: BaseUrlClass,
    private apiListClass: ApiListClass,
    private router: Router,
    private authenticationService: AuthenticationService,

  ) {
    this._base_url = this.baseUrlClass.baseUrl;
    this.currentDataroomId =localStorage.getItem("currentDataroomId");
    console.log("reset")
  }
  @Output() onInitEvent = new EventEmitter();

  ngOnInit() {
    this.getSingleDataroom(this.currentDataroomId);  
    this.getUserInfoOne();
    this.getUserInfo(); 
   
  }

  goToDashboard() {
    this.router.navigate(["/dashboard/"]);
  }

  goToLink(url) {
    window.open(url)
  }

  upgrade_msg: any = "";
  getUserInfo() {
      this.user = JSON.parse(localStorage.getItem("currentUser"));
      console.log( ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",localStorage.getItem("currentUser"));
      this.avatarUrl = this.user.avatar;
      this.avatarUrl = this.avatarUrl.replace("//media/", "/media/") || this.baseUrlClass.frontend_url + "assets/images/Profile.png";
    //});
  }


  getUserInfoOne() {
     this.dataRoomService
      .getUserProfileDatroom(this.currentDataroomId)
      .subscribe((res) => {
        this.userone = res;
      this.onInitEvent.emit({ singledataroom:this.dataroom_detail,userdetail:res});
      console.log(this.userone, this.currentDataroomId, "getUserInfo");
      });
  }


  getSingleDataroom(dataroomId) {
    this.dataRoomService.getSingleDataroom(dataroomId).subscribe((res) => {
      this.dataroom_detail = res; 
    })
  }





  

   resetDisclaimerStatus(user_id) {
     this.dataRoomService.changeDisclaimerStatus({'userid': user_id});
     this.dataRoomService.logout_data();
     console.log(">>>>>>>>>>>>>>")
     window.location.reload();
     this.router.navigate(['/login']);

  //  localStorage.clear();
  //   this.cookieService.delete('token');
  //   window.location.href = ''
    
  }

}
