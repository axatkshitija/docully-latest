// import { IdleService } from './services/idle-service.service';
import { Component, HostListener } from '@angular/core';
import { Spinkit } from 'ng-http-loader';
import { HeaderComponent } from './common/header/header.component';
import { SharedService } from './services/shared-service';
import { BehaviorSubject, Observable, Subscription, fromEvent } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SessionService } from './common/session.service';
import { OfflineService } from './offline.service';
// import { GoogleTagManagerService } from 'angular-google-tag-manager';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public spinkit = Spinkit;
  title = 'app';
  showLoader: boolean = true;
  message: any;
  autologoutgetfun: any = HeaderComponent
  user: any;
  subscriptions: Subscription[] = [];
  isOnline: boolean = true;
  constructor(
    // private sharedService: SharedService,
    private router: Router,

    private sessionService: SessionService,
    private offlineService: OfflineService
    // private gtmService: GoogleTagManagerService,
  ) {

    window.addEventListener('beforeprint', (event) => {
      event.preventDefault();
      alert("Printing is disabled for this application.");
    });


    const user: any = localStorage.getItem("currentUser");
    this.user = JSON.parse(user);
    // if (this.user == null || this.user == undefined) {
    //   this.router.navigate(["/"]);
    //   console.log(">>>>>>>>>this.user", this.user)
    // } else {
    //   console.log(">>>>>>>>>this.1", this.user)
    //   //this.router.navigate(["/dashboard/"]);
    // }
    console.log("reset app");
  }



  ngOnInit() {
    this.isOnline = this.offlineService.isOnline();
    console.log('online>>>>>>>>>', this.isOnline)
    // Subscribe to online status changes
    this.offlineService.getOnlineStatus().subscribe((online: any) => {
      console.log('online>>>>>>>>>', online)
      this.isOnline = online;
    });

    let context = this;
    window.addEventListener("beforeunload", function (e) {
      this.window.alert("Closed");
    });
  }



  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keypress', ['$event'])
  onUserActivity() {
    // Reset the auto-logout timer on user activity
    this.sessionService.resetTimeout();
  }


  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: Event) {
    event.preventDefault();
    console.log('contextmenu is disabled in this application.');
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'PrintScreen' || (event.ctrlKey && event.key === 'p')) {
      event.preventDefault();
      // Optionally, you can display a message to inform the user.
      console.log('Printing is disabled in this application.');
    }
  }

  hadleCopy(event: KeyboardEvent) {
    window.addEventListener('copy', function (e) {
      e.preventDefault(); // Prevent the default copy behavior
      console.log('copy is disabled in this application.');
      // Optionally, you can modify the copied text or display a message to the user.
    });
  }


  ngOnDestroy(): void {
    localStorage.clear();
  }





}

