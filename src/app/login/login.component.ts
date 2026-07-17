import { Component, OnInit } from "@angular/core";
//import { HeaderComponent } from '../header/header.component';
import { Router, ActivatedRoute } from "@angular/router";

import { Location } from "@angular/common";
import { AuthenticationService, DataRoomService } from "../services";
import { BaseUrlClass } from "../common";
import * as CryptoJS from 'crypto-js';
import { CaptchaService } from "./captcha.service";


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: any;
  isLoginError: boolean = false;
  cookieValue: any;
  baseUrl: any;
  website_url: string = "";
  portal: string = "";
  drmaccess: boolean = false
  drmfolderid: any;
  userid: any;
  sessionClosed: any;
  encryptedData: any;
  captchaImage: any;
  captchaError: boolean = false;
  captchaCode: any;
  captchaText: string = '';
  userInput: string = '';
  characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private baser_url: BaseUrlClass,
    private baseUrlClass: BaseUrlClass,
  ) {
    this.baseUrl = this.baseUrlClass.baseUrl;
  }

  ngOnInit() {
    console.log('Encrypted Data:', this.encryptedData);
    this.drmfolderid = this.route.snapshot.paramMap.get("folderId")
    this.userid = this.route.snapshot.paramMap.get("userId")
    console.log(this.userid)

    // If a user is already stored in localStorage, redirect immediately
    const currentUserRaw = localStorage.getItem('currentUser');
    if (currentUserRaw) {
      let currentUser: any = null;
      try {
        currentUser = JSON.parse(currentUserRaw);
      } catch (e) {
        currentUser = null;
      }
      if (currentUser) {
        if (this.drmfolderid) {
          const userIdForLink = this.userid ? this.userid : currentUser.id;
          const link = this.baseUrl + "/file-view/" + this.drmfolderid + "/" + userIdForLink 
          window.location.href = link;
        } else {
          this.router.navigate(['/dashboard']);
        }
        return;
      }
    }


    let cookieToken = localStorage.getItem("token");
    if (cookieToken == "" || cookieToken == null) {
      localStorage.clear();
    }

    let currentUserToken = localStorage.getItem('token')
    console.log('currentUserToken: ', currentUserToken)
    console.log("check value", this.drmfolderid);
    if (currentUserToken != null) {
      //this.router.navigate(['dashboard'])
    }
    if (this.drmfolderid) {
      this.drmaccess = true;
    }
    else {
      console.log("false")
    }


    this.cookieValue = localStorage.getItem("url");
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.website_url = this.baser_url.website_url;
    this.portal = this.baser_url.frontend_url;

  }

  msg: string = "";

  goToLink(url: any) {
    window.open(url);
  }










  password: any
  private key: any = CryptoJS.enc.Utf8.parse("1203199320052023");
  private iv: any = CryptoJS.enc.Utf8.parse("1203199320052023");

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



  decryptUsingAES256(decString: any) {
    var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>decrypt password', decrypted.toString(CryptoJS.enc.Utf8))
    return decrypted.toString(CryptoJS.enc.Utf8);
  }


  activeSession() {
    this.authenticationService
      .activeSession(this.model.email)
      .subscribe(
        (res) => {
          console.log(res)
          this.login();
        }
      )

  }





  refreshCaptcha() {
    this.authenticationService
      .captcha()
      .subscribe(
        (res: any) => {
          let getdata = res;
          console.log(getdata.code)

          this.captchaCode = getdata.code;
        }
      )
  }




  login() {
    // this.activeSession()

    this.loading = true;
    this.authenticationService
      .login(this.model.email, this.model.password)
      .subscribe(
        (data) => {

          if (this.returnUrl != "/") {

          } else {
            // console.log('22222222222222222222')
            var user = localStorage.getItem("currentUser")
            if (this.drmaccess) {
              // let link = "http://20.193.245.169:8000/file-view/" + this.drmfolderid + "/" + this.userid + "/"
              let link = this.baseUrl + "/file-view/" + this.drmfolderid + "/" + this.userid + "/?token=" + localStorage.getItem("token");
              // let link = "https://services.docully.com/projectName/file-view/" + this.drmfolderid + "/" + JSON.parse(user).id + "/"
              window.location.href = link;
              this.drmaccess = false;
            }
            else {
              // console.log('3333333333333333333')
              this.router.navigate(["/dashboard"]);
              console.log(data.msg)
            }
          }
        },
        (error) => {
          this.isLoginError = true;
          setTimeout(() => {
            this.isLoginError = false;
          }, 5000);
          this.loading = false;
          // this.refreshCaptcha()
        }
      );
  }

  passwordToggleIcon = false;
  togglePassword() {
    var input: any = document.getElementsByName('password')
    //console.log(input)
    if (input[0]['type'] == "password") {
      input[0]['type'] = "text";
      this.passwordToggleIcon = true
    } else {
      input[0]['type'] = "password"
      this.passwordToggleIcon = false
    }
  }
}
