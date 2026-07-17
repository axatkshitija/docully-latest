import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataRoomService } from "../../services/index";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { Location } from "@angular/common";
import * as CryptoJS from 'crypto-js';

@Component({
  selector: "app-user-forgot-pass",
  templateUrl: "./user-forgot-pass.component.html",
  styleUrls: ["./user-forgot-pass.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class UserForgotPassComponent implements OnInit {
  passwordForm: FormGroup;
  msg: string;
  user: any;
  errors: any;
  is_error: boolean = false;
  _base_url: string = "";
  password: any;
  captchaCode: string;
  constructor(
    private toastr: ToastrService,
    private dataRoomService: DataRoomService,
    private baseUrlClass: BaseUrlClass,
    private location: Location

  ) {
    this._base_url = this.baseUrlClass.baseUrl;
  }

  ngOnInit() {
    this.createChangePassword();
    this.getUserInfo();
  }

  goBack() {
    this.location.back();
  }

  createChangePassword() {
    this.passwordForm = new FormGroup({
      current_password: new FormControl("", [
        Validators.minLength(8),
        Validators.maxLength(40),
        Validators.required,
      ]),
      new_password: new FormControl("", [
        Validators.minLength(8),
        Validators.maxLength(40),
        Validators.required,
        this.passwordValidator,
      ]),
      confirm_new_password: new FormControl("", [
        Validators.minLength(8),
        Validators.maxLength(40),
        Validators.required,
      ]),
    }); //,{validators: PasswordValidation.MatchPassword});
  }


  passwordValidator(control) {
    // Implement your password complexity logic here
    const value = control.value;

    // Add your complexity requirements
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[$@#&]/.test(value);

    const isValid = hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

    return isValid ? null : { passwordInvalid: true };
  }
  

  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  private key = CryptoJS.enc.Utf8.parse("1203199320052023");
  private iv = CryptoJS.enc.Utf8.parse("1203199320052023");

  encryptUsingAES256(text): any {
    // const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // const length = 6;
    // this.captchaCode = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    // console.log('captchcode>>', this.captchaCode)
    // var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text + this.captchaCode), this.key, {
    //   keySize: 128 / 8,
    //   iv: this.iv,
    //   mode: CryptoJS.mode.CBC,
    //   padding: CryptoJS.pad.Pkcs7
    // });
    return this.password = text
  }


  submitNewPassword() {
    const p ={
      current_password:this.encryptUsingAES256(this.passwordForm.value.current_password),
      new_password:this.encryptUsingAES256(this.passwordForm.value.new_password),
      confirm_new_password:this.encryptUsingAES256(this.passwordForm.value.confirm_new_password),
    }
    console.log("encrypt>>>>>>",p)
    this.dataRoomService.changeUserPassword(p).subscribe(
      (data) => {
        //console.log(res.data);
        this.msg = "Password successfully changed";
        this.showSuccess();
      },
      (error) => {
        this.errors = error.error.error;
        this.msg = this.errors;
        console.log(error);
        this.showError();
        this.is_error = true;

        setTimeout(() => {
          this.is_error = false;
        }, 5000);
      },

      () => {
        // No errors, route to new page
      }
    );
  }

  avatarUrl: any;
  getUserInfo() {
    //this.dataRoomService.getUserProfile().subscribe((res) => {
      this.user =  JSON.parse(localStorage.getItem("currentUser"));
      this.avatarUrl = this.user.avatar;
      console.log("this getuser infor ");
      this.avatarUrl = this.avatarUrl.replace("//media/", "/media/");
    //});
  }
}
