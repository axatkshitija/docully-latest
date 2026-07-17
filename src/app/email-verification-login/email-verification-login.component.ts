import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
//import { HomepageService } from '../homepage/homepage.service';
//import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { AuthenticationService } from '../services';

@Component({
  selector: 'app-email-verification-login',
  templateUrl: './email-verification-login.component.html',
  styleUrls: ['./email-verification-login.component.scss']
})
export class EmailVerificationLoginComponent implements OnInit {
 //public backArrow = faChevronCircleLeft;
  public model: any = { email: '' };
  public isFreeTrail: any; 
  captchaImage: any;
  captchaCode: any;
  captchaError: boolean = false;
  constructor(private HomepageService: AuthenticationService, private route: Router,private activateRoute:ActivatedRoute, public location: Location ) {

  }

  ngOnInit() {
   // this.refreshCaptcha();

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

    this.activateRoute.queryParams.subscribe(params => {
      this.isFreeTrail = params['isFreeTrail'];
      console.log(this.isFreeTrail,"check for freetrial")
      
  });

  }



  refreshCaptcha() {
    this.HomepageService
      .captcha()
      .subscribe(
        (res:any) => {

          let getdata = res;
          console.log(getdata.code)
          this.captchaCode = getdata.code;

        }
      )
  }
/**after submitting email */
  onSubmit() {
    if (this.captchaCode == this.model.captcha) {
    console.log(this.model.email, 'checkuser')
    this.HomepageService.checkExisitingUser(this.model.email).subscribe(res => {
      console.log(res, "email")
      if (res) {
        this.route.navigate(['/signupform'])
      }
      else {
        this.route.navigate(['/existing-user'])
      }

    })
  }else {
    // CAPTCHA verification failed, display an error
    this.captchaError = true;
    console.error('Invalid captcha code');
  }
  }

  goBack() {
    this.location.back()
  }

}
