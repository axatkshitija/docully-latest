import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DataRoomService } from "../../services/index";
import { ToastrService } from "ngx-toastr";
import { Http, Headers, Response } from "@angular/http";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { map } from "rxjs/operators";
import { Location } from "@angular/common";

import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { TimezoneService } from "../../services/timezone.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-qa-questions",
  templateUrl: "./qa-questions.component.html",
  styleUrls: ["./qa-questions.component.css"],
})
export class QaQuestionsComponent implements OnInit {
  questionId: number;
  msg: string;
  private base_url: string;
  faqForm: any;
  timezone: any;
  currentDataroomId: any;
  token: any = '';

  constructor(
    private route: ActivatedRoute,
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private router: Router,
    private location: Location,
    private base: BaseUrlClass,
    private timeZone: TimezoneService
  ) {
    this.route.params.subscribe((params) => {
      this.questionId = params.id;
    });

    this.token = localStorage.getItem("token");
    this.currentDataroomId =localStorage.getItem("currentDataroomId");
    this.base_url = base.baseUrl;
    this.timezone = this.timeZone.userTimeZone;
  }

  ngOnInit() {
    this.getQuestions();
    this.getAllReply();
    this.getUserQnaDetails();
    this.calcTime();
    this.faqForm = new FormGroup({
      question: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      answer: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      file: new FormControl("", [Validators.required, Validators.minLength(1)]),
    });
  }
  question_data: any = { question: "", answer: "", file: false, folder_id: 0 };

  dataroomId: any;
  data: any;
  item: any;

  getQuestions() {
    // public qna_view_detail: string = "/qna_view_detail/";
    this.dataRoomService.GetQnaDetails(this.questionId).subscribe((res) => {
      this.data = JSON.parse(res);
      console.log(this.data);
      this.item = this.data[0];
      this.question_data = this.item.question_details;
      this.test1(this.item.question_details);
      console.log(this.question_data, "Question data");
      //this.dataroomId = this.data[0].category_details[0].dataroom.id;
      this.getUserInfo();
      // this.user
      // this.category_user
    });
  }
  toggle: boolean = false;
  test1(detail) {
    this.toggle = !this.toggle;
    this.dataRoomService.GetQnaDetails(this.questionId).subscribe((res) => {
      this.data = JSON.parse(res);
      console.log(this.data);
      this.item = this.data[0];
      console.log(this.item.id, "id test");
      this.question_data = {
        id: detail.id,
        user: detail.user,
        dataroom: detail.dataroom,
        question: this.question_data.question,
        answer: this.question_data.answer,
        file_flag: this.toggle,
        qna: detail.qna,
        folder: detail.folder,
        created_date: detail.created_date,
        updated_date: detail.updated_date,
        category: detail.category,
        acc: detail.acc,
        final: detail.final,
        replies: detail.replies,
        pending: detail.pending,
        is_faq: detail.is_faq,
      };
    });

    console.log(this.question_data.file_flag, "file id");
  }

  test(detail) {
    this.toggle = !this.toggle;
    this.dataRoomService.GetQnaDetails(this.questionId).subscribe((res) => {
      this.data = JSON.parse(res);
      console.log(this.data);
      this.item = this.data[0];
      console.log(this.item.id, "id test");
      this.question_data = {
        id: detail.id,
        user: detail.user,
        dataroom: detail.dataroom,
        question: this.question_data.question,
        answer: this.question_data.answer,
        file_flag: this.toggle,
        folder_id: detail.folder.id,
        qna: detail.qna,
        folder: detail.folder,
        created_date: detail.created_date,
        updated_date: detail.updated_date,
        category: detail.category,
        acc: detail.acc,
        final: detail.final,
        replies: detail.replies,
        pending: detail.pending,
        is_faq: detail.is_faq,
      };
    });

    console.log(this.question_data.file_flag, "file id");
  }
  goBack() {
    this.location.back();
  }

  reply: boolean = false;
  getUserQnaDetails() {
    this.dataRoomService.getUserQnaDetails(this.questionId).subscribe((res) => {
      this.reply = res.reply;
    });
  }

  user: any;
  getUserInfo() {
    this.dataRoomService
      .getUserProfileDatroom(this.currentDataroomId)
      .subscribe((res) => {
        this.user = res;
        console.log(this.user);
      });
  }
  gmtHours: any;
  calcTime() {
    var d = new Date();
    this.gmtHours = -d.getTimezoneOffset() / 60;
    this.gmtHours = "+" + this.gmtHours;

    var d = new Date();
    var n = d.getTimezoneOffset();
    this.gmtHours = n;
    console.log(this.gmtHours);
  }

  goToViewerPage(folder) {
    console.log("folder id is", folder);
    let token = localStorage.getItem("token");
    document.cookie = "token=" + token;

  }

  showDiv = false;
  showHideUploadDiv() {

    if (this.showDiv == true) {
      // code...
      if(this.update.reply){
        this.comment();
      }
      this.showDiv = false;
    } else {

      this.showDiv = true;

    }
  }

  update: any = {
    reply: "",
  };
  comment() {
    // this.update.push()
    // this.update.update({'questionId': })
    this.update;
    this.dataRoomService
      .commentDetail(this.questionId, this.update)
      .subscribe((res) => {
        this.getAllReply();
        this.update.reply = "";
        // this.showHideUploadDiv();
        this.showDiv = false;
        // this.msg = "Question successfully rejected !";
        //    		this.showSuccess();
      });
  }

  reply_list: any;
  getAllReply() {
    this.dataRoomService.getAllReplyList(this.questionId).subscribe((res) => {
      this.reply_list = JSON.parse(res);
    });
  }

  acceptFinal(question_id) {
    this.dataRoomService.acceptFinalInfo(question_id).subscribe((res) => {
      // this.reply_list = JSON.parse(res)
      this.msg = "Final question added successfully !";
      this.showSuccess();
    });
  }

  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  showInfo() {
    this.toastr.info(this.msg);
  }

  AddToFaq(item) {
    console.log(this.question_data, "question_dataa");
    item.id = "";
    this.dataRoomService
      .postRequest(this.question_data, this.currentDataroomId)
      .subscribe((res) => {
        console.log(res);
        this.router.navigate(["/faq"]);
        // this.getQuestions();
        // this.reply_list = JSON.parse(res)
        // this.msg = "Final question added successfully !";
        //    		this.showSuccess();
      });
  }
}
