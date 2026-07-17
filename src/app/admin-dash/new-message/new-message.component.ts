import { Component, OnInit, ViewEncapsulation, Input } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { Validators, FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { CookieService } from "ngx-cookie-service";
//import { ApiService } from "../../services/api-services";

@Component({
  selector: "app-new-message",
  templateUrl: "./new-message.component.html",
  styleUrls: ["./new-message.component.css"],
})
export class NewMessageComponent implements OnInit {
  @Input("user")
  user: any;
  _base_url: string;
  all_message: any;
  msg: string;
  usertimezone: string;
  //@Input() products$: Observable<any>;

  constructor(
    private _fb: FormBuilder,
    private cookieService : CookieService,
    private dataRoomService: DataRoomService,
    private toastrService: ToastrService,
    private baseUrlClass: BaseUrlClass,
    private router: Router,
    // private api: ApiService,

    private httpClient: HttpClient
  ) {
    this._base_url = this.baseUrlClass.baseUrl;
  }

  ngOnInit() {
    this.getUserInfo();
    this.opensnack();
    this.getCurrentDataroom();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }
  getCurrentDataroom() {
    console.log("get data room current in message",localStorage.getItem("currentDataroomId"));
  }
  togetmessgae(test) {
    this.getAllMessage();
  }
  user_details: any;
  getUserInfo() {
    //this.dataRoomService.getUserProfile().subscribe((res) => {
      this.user = JSON.parse(    localStorage.getItem("currentUser"));
      console.log(this.user, "user Message");

      this.getAllMessage();
    //});
  }
  notification_count: number = 0;
  msg_count: number = 0;
  opensnack() {
    var now = new Date();
    this.dataRoomService
      .getSingleDataroomNotificationCount(0)
      .subscribe((res) => {
        this.msg_count = res.dataroom_message_count;
        console.log(res, "Message Count");
        this.notification_count = res.user_notification_count;
      });
  }

  getAllMessage() {
    this.dataRoomService.getAllUserMessage(this.user.id).subscribe((res) => {
      this.all_message = res
      console.log(this.all_message, "All Messages");
    });
  }

  userId: number;
  char_message_list: any;
  chatPage(userId) {
    this.userId = userId;
    this.dataRoomService.getChatPage(userId).subscribe((res) => {
      const newdata = res;
      this.char_message_list = newdata.map((obj, i) => ({ ...obj, received_at: obj.received_at + '+04:00' }));
      console.log(this.char_message_list, "Chat Message");
    });
    this.getAllMessage();
  }
  userList: any[] = [];
  getUserIdsFirstWay($event) {
    this.dataRoomService
      .getSearchAutoCompleteUser($event.target.value)
      .subscribe((res) => {
        this.userList = res;
      });
  }

  update: any = {
    message: "",
    subject: "",
    user: {},
    email: "",
  };

  getUserBy(value) {
    this.update.user = value;
    this.update.email = value.email;
  }

  sendMessageToUser() {
    // console.log('called')
    var currentUser = JSON.parse(    localStorage.getItem("currentUser"));
    if (currentUser.email == this.update.email) {
      this.toastrService.error('Self messaging is restricted. Message cannot be sent to same logged in account');
      return;
    }
    if(Object.keys(this.update.user).length === 0 && this.update.user.constructor === Object) {
      // console.log('111111111111111111')
      this.toastrService.error('Select valid user from the dropdown');
      this.update = {
        message: "",
        subject: "",
        user: {},
        email: "",
      };
      return;
    }
    // console.log('asdkjbasfkbafbkb')
    this.dataRoomService.sendMessageToUser(this.update).subscribe((res) => {
      this.msg = res.data;
      this.showSuccess();
      this.getAllMessage();
      this.update = {
        message: "",
        subject: "",
        user: {},
        email: "",
      };
    });
  }

  dataroomId: number;
  user_id: number;
  sendMessage(char_message) {
    console.log(char_message, "Dataroom Msges");
    this.user_id = this.user.id;
    if (this.user.id == this.char_message_list[0].user_rec.id) {
      this.user_id = this.char_message_list[0].user_send.id;
    } else if (this.user.id == this.char_message_list[0].user_send.id) {
      this.user_id = this.char_message_list[0].user_rec.id;
    }
    this.dataroomId = this.char_message_list[0].dataroom;
    this.update.msg = char_message.id;

    this.update.subject = char_message.subject;
    this.dataRoomService
      .sendDataroomUserMessage(this.user_id, this.dataroomId, this.update)
      .subscribe((res) => {
        console.log(res)
        this.msg = "Message send successfully !";
        this.showSuccess();
        this.getAllMessage();
        this.chatPage(char_message.id);
        this.update = {
          message: "",
          subject: "",
          user: {},
          email: "",
        };
      });
  }

  showSuccess() {
    console.log("dog:-", this.msg);
    this.toastrService.success(this.msg);
  }

  showError() {
    this.toastrService.error(this.msg);
  }

  showInfo() {
    this.toastrService.info(this.msg);
  }
}
