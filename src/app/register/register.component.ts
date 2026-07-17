import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//import { ToastrService } from "ngx-toastr";
import { Location } from '@angular/common';
import { countries } from '../share-data/countries';
import { AuthenticationService } from '../services';
import { ToastrService } from 'ngx-toastr';
import { CaptchaService } from '../login/captcha.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public model: any;
  public isFreeTrail: any;
  public item: any;
  captchaImage: any;
  captchaError: boolean = false;
  captchaCode: any;



  constructor(private homeService: AuthenticationService, private route: Router, private captchaService: CaptchaService, private activateRoute: ActivatedRoute, private toastr: ToastrService, public location: Location) {
    this.model = {
      full_name: "",
      first_name: "",
      last_name: "",
      email: "",
      contact_no: "",
      country: "",
      company_name: ""
    }
    this.item = { ...this.model };
  }

  ngOnInit() {
    // If a user is already stored in localStorage, redirect to dashboard
    const currentUserRaw = localStorage.getItem('currentUser');
    if (currentUserRaw) {
      try {
        const currentUser = JSON.parse(currentUserRaw);
        if (currentUser) {
          this.route.navigate(['/dashboard']);
          return;
        }
      } catch (e) {
        // ignore parse errors and continue
      }
    }

  //  this.refreshCaptcha()
    this.model.email = this.homeService.getUserMail();
    this.activateRoute.queryParams.subscribe(params => {
      this.isFreeTrail = params['isFreeTrail'];
      console.log(this.isFreeTrail, "check for freetrial in reg")

    });
  }

  refreshCaptcha() {
    this.homeService
    .captcha()
    .subscribe(
      (res:any) => {
       
        let getdata = res;
        console.log(getdata.code)
        this.captchaCode = getdata.code;

      }
    )
  }

  onSubmit() {
    console.log("regi button clicked")

   // if (this.captchaCode == this.model.captcha) {
      // If full_name provided, split into first and last before submitting
      if (this.model.full_name) {
        const parts = this.model.full_name.trim().split(/\s+/);
        this.model.first_name = parts.shift() || '';
        this.model.last_name = parts.join(' ') || '';
      }

      this.homeService.mainSubscriber(this.model).subscribe((res:any) => {
        if (res) {
          localStorage.setItem('token', res['tokendata']['token'])
          localStorage.setItem("user", JSON.stringify(res['tokendata']['user']))
    
          localStorage.setItem("currentUser", JSON.stringify(res['tokendata']['user']))
          this.route.navigate(['/billing-term'], { queryParamsHandling: 'preserve' })
          this.toastr.info("Please refer to your inbox to verify your email and create your password. Once done, please log in to your account.");
        }
        else {
          this.toastr.error('Something went wrong');
        }
      }, (err:any) => {
        this.toastr.info(err.error.msg);
        this.route.navigate(['/existing-user']),
          console.log(err.error.msg, "error in registration")
      })
  //   } else {
  //     // CAPTCHA verification failed, display an error
  //     this.captchaError = true;
  //     console.error('Invalid captcha code');
  //   }
  }

  goBack() {
    this.location.back()
  }

  countryData:any = [];
  getCountryOnSearch(event:any) {
    this.countryData = [];
    for (let i = 0; i < countries.length; i++) {
      if (countries[i]['name'].toLowerCase().startsWith(event.target.value)) {
        this.countryData.push(countries[i]);
      }
    }
  }

  getCountryName(value:any) {
    this.model.country = value;
  }

  // Validation methods
  isValidFullName(): boolean {
    if (!this.model.full_name) return false;
    const nameRegex = /^[a-zA-Z ]{2,100}$/;
    return nameRegex.test(this.model.full_name.trim());
  }

  isValidContactNo(): boolean {
    if (!this.model.contact_no) return true;
    const contactRegex = /^[0-9+\-\s\(\)]{7,20}$/;
    return contactRegex.test(this.model.contact_no);
  }

  isValidCountry(): boolean {
    if (!this.model.country) return true;
    const countryRegex = /^[a-zA-Z\s\-\.]{2,50}$/;
    return countryRegex.test(this.model.country);
  }

  isValidCompanyName(): boolean {
    if (!this.model.company_name) return true;
    const companyRegex = /^[a-zA-Z0-9'@*$/_\-&()\s]{1,50}$/;
    return companyRegex.test(this.model.company_name);
  }

  isValidEmail(): boolean {
    if (!this.model.email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.model.email);
  }

}

