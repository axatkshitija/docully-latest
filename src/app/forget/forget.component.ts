import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  AuthenticationService, UserService } from '../services/index';
import { CaptchaService } from '../login/captcha.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {
  model: any = {};
  loading = false;
  isForgotSuccess : boolean = false;
  isForgotError : boolean = false;
  showDive : boolean = true;
  captchaImage: any;
  captchaError: boolean = false;
  captchaCode: any;
  hideDive(){
    this.showDive = false;
  }
  constructor(private route: ActivatedRoute,
    private router: Router,
    private captchaService: CaptchaService,
    private authenticationService: AuthenticationService) { 

    }

  ngOnInit() {
    //this.refreshCaptcha()
  }

  refreshCaptcha() {
    this.authenticationService
    .captcha()
    .subscribe(
      (res:any) => {
        let getdata = res;
        console.log(getdata.code)
        this.captchaCode = getdata.code;
      }
    )
  }

  forgot(){
    this.loading = true;
    console.log("forgot method called");

    this.authenticationService.forgot(this.model.email)
        .subscribe(
            (data:any) => {
                  
                  this.isForgotSuccess = true;
                  this.loading = false;
                  setTimeout(()=>{
                      this.isForgotSuccess = false;
                    },5000);
                  console.log("debugger method called")
              //  this.router.navigate(['dashboard']);
            },
            (error:any) => {
              
                console.log("error in sending email");
                this.loading = false;
                this.isForgotError = true;
                this.refreshCaptcha();
                setTimeout(()=>{
                    this.isForgotError = false;
                  },5000);
            });

  
  }
}
