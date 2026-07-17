
import { Subject } from 'rxjs';
import { Component, OnInit, ViewEncapsulation, Input, HostListener } from "@angular/core";
import { AuthenticationService, DataRoomService } from "../../services/index";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { AuthService } from '../auth.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input("user")
  user: any;
  avatarUrl: any;
  _base_url: string;
  userActivity:any;
  userInactive: Subject<any> = new Subject();

  constructor(
    private dataRoomService: DataRoomService,
    private baseUrlClass: BaseUrlClass,
    private apiListClass: ApiListClass,
    private router: Router,
    private authenticationService: AuthenticationService,
    private authService: AuthService
  ) {
    this._base_url = this.baseUrlClass.baseUrl;
  }


  ngOnInit() {
    this.getUserInfo();
    this.IsActive();
    //this.authService.userActive();
  }

  goToDashboard() {
    this.router.navigate(["/dashboard/"]);
  }

  goToLink(url:any) {
    window.open(url)
  }

  onUserInteraction() {
    this.authService.userActive();
  }

  IsActive() {
    // this.authenticationService.getisactive();
  }
  upgrade_msg: any = "";
  getUserInfo() {
    
    //this.dataRoomService.getUserProfile().subscribe((res) => {
      console.log('>>>>>>>>user',this.user)
    const user:any  =  localStorage.getItem("currentUser");
     this.user = JSON.parse(user);
    if(this.user==null||this.user==undefined){
      this.router.navigate(["/"]);
      console.log(">>>>>>>>>this.user",this.user)
    }else{
      console.log(">>>>>>>>>this.1",this.user)
      //this.router.navigate(["/dashboard/"]);
    }
   
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", localStorage.getItem("currentUser"));
    if(this.user.avatar){
      this.avatarUrl = this.user.avatar;
      this.avatarUrl = this.avatarUrl.replace("//media/", "/media/")
    }else{
      this.avatarUrl = this.baseUrlClass.frontend_url +"assets/images/Profile.png";
    }
  
  }

  resetDisclaimerStatus(user_id:any) {
    this.dataRoomService.changeDisclaimerStatus({ 'userid': user_id });
    this.dataRoomService.logout_data();
    console.log(">>>>>>>>>>>>>>")

  
   // setTimeout(window.location.reload.bind(window.location), 1500);

  }

}
