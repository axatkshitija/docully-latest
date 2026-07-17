import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services';
import { CaptchaService } from '../login/captcha.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-existing-user',
  templateUrl: './existing-user.component.html',
  styleUrls: ['./existing-user.component.css']
})
export class ExistingUserComponent implements OnInit {
  isLoginError: any;
  loading: any;
  user: any;
  public model: any = {};
  public isFreeTrail: any;
  isFreeTrailcheck: boolean = false;
  emailidpresent: boolean = false;
  captchaImage: any;
  captchaError: boolean = false;
  captchaCode: any;
  password: any;
  constructor(
    private HomepageService: AuthenticationService,
    public dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,

    private route: ActivatedRoute,

    private captchaService: CaptchaService,
  ) {

    this.model = {
      email: "",
    }
  }
  ngOnInit() {
    ////this.refreshCaptcha();
    let usercheck = localStorage.getItem("currentUser");
    console.log("usercheck", usercheck);
    if (usercheck) {
      this.router.navigate(["./billing-term"]);
    }
    this.model.email = this.HomepageService.getUserMail();
    console.log(this.model.email)
    if (this.model.email) {
      this.emailidpresent = true;
    }
    // this.model.email = this.HomepageService.getUserMail();
    this.route.queryParams.subscribe(params => {
      this.isFreeTrail = params['isFreeTrail'];
      console.log("here is the value of free trial param -->", this.isFreeTrail);
    });
  }
  registertest() {
    localStorage.setItem("register", "true")
  }


  refreshCaptcha() {
    this.HomepageService
      .captcha()
      .subscribe(
        (res: any) => {

          let getdata = res;
          console.log(getdata.code)
          this.captchaCode = getdata.code;

        }
      )
  }

  private key = CryptoJS.enc.Utf8.parse("1203199320052023");
  private iv = CryptoJS.enc.Utf8.parse("1203199320052023");

  encryptUsingAES256(text: any): any {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 6;
    this.captchaCode = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    console.log('captchcode>>', this.captchaCode)
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text + this.captchaCode), this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>password', encrypted.toString())
    //this.decryptUsingAES256(encrypted.toString())
    return this.password = encrypted.toString();

  }

  login() {
    // this.loading = true;
    this.encryptUsingAES256(this.model.password)
    if (this.captchaCode == this.model.captcha) {
      this.HomepageService.login(this.model.email, this.model.password).subscribe(
        (data: any) => {
          let token = data;
          if (token.token) {
            document.cookie = "token=" + token.token;
            console.log("token is:", token.token);

            localStorage.setItem("token", token.token);
            localStorage.setItem("user", JSON.stringify(token.user));

            localStorage.setItem("currentUser", JSON.stringify(token.user))
            let logintoregister = localStorage.getItem("logintopricing");
            this.router.navigate(["./billing-term"]);

          }



          console.log(data, "login");
        },
        (error) => {
          this.isLoginError = true;
          setTimeout(() => {
            this.isLoginError = false;
          }, 5000);
          this.loading = false;
          // this.refreshCaptcha();
        }
      );
    } else {
      // CAPTCHA verification failed, display an error
      this.captchaError = true;
      console.error('Invalid captcha code');
    }

  }


  
  onSubmit() {
    this.model["email"] = this.model.email;
    this.model["password"] = this.model.password;
    console.log("model user", this.model);
    if (this.captchaService.verifyCaptcha(this.model.captcha)) {
      this.HomepageService.mainSubscriber(this.model).subscribe((res) => {
        console.log("submit mainSubscriber", res);
        if (res) {
          this.model["portal_id"] = res.id;
          this.model["team_id"] = res.team_id;
          console.log(this.model["portal_id"]);
        }
      });
    } else {
      // CAPTCHA verification failed, display an error
      this.captchaError = true;
      console.error('Invalid captcha code');
    }
  }
}
