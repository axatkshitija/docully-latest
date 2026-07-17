import { Component, OnInit } from '@angular/core';
import { DataRoomService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-dataroom-lock',
  templateUrl: './dataroom-lock.component.html',
  styleUrls: ['./dataroom-lock.component.css']
})
export class DataroomLockComponent implements OnInit {
  sentOtp: any;
  dataroomId: any;
  public model: any = { otp: '' };
  error: boolean = false;
  msg: any;
  verify: boolean = false;
  perm: any;
  customRegexPattern : any = /^[a-zA-Z0-9]+$/;

  constructor(private dataRoomService: DataRoomService, private route: ActivatedRoute, private router: Router, public location: Location,private toastr: ToastrService) {
    this.route.params.subscribe((params) => {
      console.log("dataroom id is--- call from overview compomemt");
      console.log(params.dataroomId);
      if(localStorage.getItem('token')){
        if (typeof params.dataroomId === "undefined") {
          const current:any =localStorage.getItem("currentDataroomId")
          this.dataroomId = current.toString();
        } else {
          this.dataroomId = params.dataroomId.toString();
          localStorage.setItem("currentDataroomId", this.dataroomId)
        }
      }else{
        this.router.navigate(['/login'])
      }

    });


  }

  ngOnInit() {
  this.getDataroomOtp();

  }


  showSuccess() {
    this.toastr.success(this.msg);
  }


  getDataroomOtp() {
    this.dataRoomService.GetDataroomOtp(this.dataroomId).subscribe((res: any) => {
     localStorage.setItem("sentotp", res)
      this.sentOtp = res;
      console.log("getDataroomOtp>>>>>>>>>>>>>", res);
    });
  }


  onSubmit() {
    console.log(this.model.otp, 'checkuser')
    let finaldata = {
      otp: this.model.otp
    }

    this.dataRoomService.VerifyDataroomOtp(this.dataroomId, finaldata).subscribe((res: any) => {
   
      localStorage.setItem("sentotp", res)
      this.verify = true;
      this.msg = res;
      this.showSuccess();
     this.gotoURl(this.dataroomId) 
      console.log("VerifyDataroomOtp>>>>>>>>>>>>>", res);
    }, (error) => {
      this.verify = true;
      this.msg = error.error;
      this.error = true
      console.log(error)
    },

    );
  }


  gotoURl(dataroomId:any) {
    console.log("Verifyres>",dataroomId );
    localStorage.setItem("currentDataroomId", this.dataroomId)
          this.dataRoomService
            .get_dataroom_disclaimer(dataroomId)
            .subscribe((res) => {
              if (res.overview.show_multiple_times_disclaimer == false) {
                if (res.member.disclaimer_status == false) {
                  if (res.disclaimer.id == undefined) {
                    if (res.member.is_end_user !== undefined) {
                      if (res.member.is_end_user === true) {
                        this.getToDetailedPage(
                          dataroomId,
                          res.overview.choose_overview_default_page
                        );
                      } else {
                        this.getToDetailedPage(dataroomId, true);
                      }
                    }
                  } else {
                    this.router.navigate(["../disclaimer-popup", res.disclaimer.id]);
                  }
                } else {
                  if (res.member.is_end_user !== undefined) {
                    if (res.member.is_end_user === true) {
                      this.getToDetailedPage(
                        dataroomId,
                        res.overview.choose_overview_default_page
                      );
                    } else {
                      this.getToDetailedPage(dataroomId, true);
                    }
                  }
                }
              } else {
                if (res.member.disclaimer_status == false) {
                  if (res.disclaimer.id == undefined) {
                    this.getToDetailedPage(dataroomId,  res.overview.choose_overview_default_page);
                  } else {
                
                    this.router.navigate(["../disclaimer-popup", res.disclaimer.id]);
                  }
                } else {
                  // console.log(res.overview.choose_overview_default_page, "Grtp");
                  if (res.member.is_end_user !== undefined) {
                    if (res.member.is_end_user === true) {
                      this.getToDetailedPage(
                        dataroomId,
                        res.overview.choose_overview_default_page
                      );
                    } else {
                      this.getToDetailedPage(dataroomId, true);
                    }
                  }
                }
              }
              // this.getToDetailedPage(dataroomId,choose_overview_default_page)
            });
          //this.getToDetailedPage(dataroomId,choose_overview_default_page)



  }



  getToDetailedPage(dataroomId:any, choose_overview_default_page:any) {
    console.log(dataroomId, "dataroomid");
    console.log(choose_overview_default_page, "choose_overview_default_page");

    this.dataRoomService.getMembersPermission(dataroomId).subscribe((res) => {
      this.perm = res;
      // console.log(this.perm, choose_overview_default_page, "this.perm");
      this.dataRoomService.checkfirstpage(dataroomId).subscribe((res) => {
        //  this.end_user_group_information = res;
        // console.log(res, "end users info");
      });
      console.log(this.perm);

      if (this.perm !== null) {
        if (this.perm.is_overview && choose_overview_default_page == true) {
          this.router.navigate(["../overview", dataroomId]);
        } else if (
          this.perm.is_edit_index &&
          choose_overview_default_page == false
        ) {
          this.router.navigate(["../documents"]);
        } else if (this.perm.is_overview == false && this.perm.is_edit_index) {
          this.router.navigate(["../documents"]);
          // } else if (choose_overview_default_page == true) {
          //   console.log("FipTip");

          //   this.router.navigate(["../overview", dataroomId]);
          // } else if (choose_overview_default_page == false) {
          //   this.router.navigate(["../documents"]);
        } else if (
          this.perm.is_overview == false &&
          this.perm.is_edit_index == false &&
          this.perm.is_updates
        ) {
          this.router.navigate(["../update-doc"]);
        } else if (
          this.perm.is_overview == false &&
          this.perm.is_edit_index == false &&
          this.perm.is_updates == false &&
          this.perm.is_q_and_a
        ) {
          this.router.navigate(["../qa-user"]);
        } else if (
          this.perm.is_overview == false &&
          this.perm.is_edit_index == false &&
          this.perm.is_updates == false &&
          this.perm.is_q_and_a == false &&
          this.perm.is_voting
        ) {
          this.router.navigate(["../voting"]);
        } else if (
          this.perm.is_overview == false &&
          this.perm.is_edit_index == false &&
          this.perm.is_updates == false &&
          this.perm.is_q_and_a == false &&
          this.perm.is_voting == false &&
          this.perm.is_reports
        ) {
          this.router.navigate(["../report-overview"]);
        } else if (this.perm.is_edit_index) {
          this.router.navigate(["../documents"]);
        } else if (this.perm.is_users_and_permission) {
          this.router.navigate(["../user-and-permissions"]);
        } else if (this.perm.is_updates) {
          this.router.navigate(["../update-doc"]);
        } else if (this.perm.is_q_and_a) {
          this.router.navigate(["../qa-user"]);
        } else if (this.perm.is_reports) {
          this.router.navigate(["../report-overview"]);
        } else {
          this.router.navigate(["../overview", dataroomId]);
        }
      }
    //  this.getDataroomViewed(dataroomId);
    });
  }

  goBack() {
    this.router.navigate(["../dashboard"]);
  }

}
