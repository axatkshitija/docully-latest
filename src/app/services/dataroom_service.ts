import { Injectable } from "@angular/core";
import { takeUntil } from 'rxjs/operators';
import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpClient,
  HttpHeaders,
} from "@angular/common/http";


//import { Http, Headers, RequestOptions, Response, ResponseContentType  } from '@angular/http';

import { Observable, of, throwError, empty, Subject } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";

//import { User, plan } from "../models/user";
// import { plan } from "../models/plan";
//import { plansession } from "../models/plansession";

import { BaseUrlClass, ApiListClass } from "../common/index";
import { saveAs } from 'file-saver';
// import {
//   Http,
//   Headers,
//   RequestOptions,
//   Response,
//   ResponseContentType,
// } from "@angular/http";


@Injectable()
export class DataRoomService {
  private baseUrl = ""; // URL to web api
  private token = "";
  constructor(
    private http: HttpClient,
    private baseUrlClass: BaseUrlClass,
    private router: Router,
    private apiListClass: ApiListClass
  ) {
    this.baseUrl = this.baseUrlClass.baseUrl;
    //"token " + localStorage.getItem("token") = "token " + localStorage.getItem("token");
  }
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  ngOnInit() {

  }

  getcurrentplandetail(subscriptionId: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.currentplandetail + subscriptionId + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      });
  }



  getAddondetail(subscriptionId: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.addons_detail + subscriptionId + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      });
  }



  /** GET heroes from the server */
  getUserProfile(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.user_profile, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }
  uploadStatus(dataroom_id: any, pagenumber: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.allbulkupload +
        dataroom_id +
        "/?page=" +
        pagenumber,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  getUserProfileDatroom(dataroom_id: any): Observable<any> {
    if (dataroom_id != null || dataroom_id != undefined) {
      return this.http
        .get(
          this.baseUrl +
          this.apiListClass.user_profile_dataroom +
          dataroom_id +
          "/",
          {
            headers: new HttpHeaders().set(
              "Authorization",
              "token " + localStorage.getItem("token")
            ),


          }
        )
        .pipe(
          tap(() => this.log(`fetched users`)),
          catchError(this.handleError("getUser", []))
        );
    }
    else {
      return of({})
    }

  }

  getCategoryUserProfile(dataroom_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.category_user_profile +
        dataroom_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get CategoryUser `)),
        catchError(this.handleError("getUser", []))
      );
  }

  getUserByEmail(email: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.user_by_email + "?email=" + email, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`get CategoryUser `)),
        catchError(this.handleError("getUser", []))
      );
  }
  addAddOn(data: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.addAddOn + data, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`get CategoryUser `)),
        catchError(this.handleError("getUser", []))
      );
  }

  getAllActivityDocuments(dataroom_id: any, pageno): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_all_activity_documents +
        dataroom_id +
        '/?page=' +
        pageno,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get CategoryUser `)),
        catchError(this.handleError("getUser", []))
      );
  }

  exportUserActivity(dataroom_id: any, userId: any) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.exportuseractivity +
        dataroom_id +
        '/' +
        userId + '/',
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
          responseType: "blob",
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get dataroom usage details `);
          saveAs(
            new Blob([res], { type: "text/csv" }),
            "UserActivity" + ".csv"
          );
        })
      );
  }


  getActivityUser(dataroom_id: any, user_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.user_activity +
        dataroom_id +
        "/" +
        user_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get ActivityUser `)),
        catchError(this.handleError("getUser", []))
      );
  }

  getActivityDataroom(dataroom_id: any, first: any, todays: any, pageno: any): Observable<any> {
    console.log("first date=====>", first);

    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.dataroom_activity +
        dataroom_id +
        "/?from_date=" +
        first +
        "&to_date=" +
        todays +
        '&page=' +
        pageno,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get ActivityDataroom`)),
        catchError(this.handleError("getUser", []))
      ).pipe(takeUntil(this.ngUnsubscribe));
  }


  getAllGroups(dataroom_id: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.all_groups + dataroom_id + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`get CategoryUser `)),
        catchError(this.handleError("getUser", []))
      );
  }



  /** GET access history from the server */
  getAccessHistory(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.access_history, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((users: any) => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  getActivityExcel(dataroomId: any, from_date: any, to_date: any, deleted: any) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.export_activity_by_date +
        dataroomId +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date +
        "&deleted=" +
        deleted,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
          responseType: "blob",
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get dataroom usage details `);
          saveAs(new Blob([res], { type: "text/csv" }), "activity.csv");
        })
      );
  }

  ExportOverviewReport(dataroomId: any, first: any, todays: any, statusId: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.export_overview_report +
        dataroomId +
        "/?from_date=" +
        first +
        "&to_date=" +
        todays,
        JSON.stringify(statusId),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }



  GetDataroomOtp(dataroom: any) {
    return this.http
      .post(
        this.baseUrl + "/generate_otp/" + dataroom + "/", JSON.stringify(dataroom),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }


  VerifyDataroomOtp(dataroom: any, otp: any) {
    return this.http
      .post(
        this.baseUrl + "/verify_otp/" + dataroom + "/", JSON.stringify(otp),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  OverviewReportZip(dataroomId: any, statusId: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        "/overview_zip_creation/" +
        dataroomId +
        "/",
        JSON.stringify(statusId),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }


  ReportStatus(dataroomId: any, type: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        "/reportsbulkdownloadstatus/" + dataroomId + "/?report_type=" +
        type,
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }


  ExportQNA(dataroomId: any, from_date: any, to_date: any, statusId: any) {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.export_qna +
        dataroomId +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date,
        JSON.stringify(statusId),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getFileDownloadedExcel(dataroomId: any, from_date: any, to_date: any, statusId: any) {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.export_files_downloaded +
        dataroomId +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date,
        JSON.stringify(statusId),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getActivityByFileExcel(
    dataroomId: any,
    from_date: any,
    to_date: any,
    deleted: any,
    statusId: any
  ) {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.export_activity_by_date +
        dataroomId +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date +
        "&deleted=" +
        deleted,
        JSON.stringify(statusId),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          // console.log(response, "what is this actually ");
          return response;
        })
      );
  }



  /** Get Count of Pages **/
  getFileActivity(dataroomId: any, folderId: any) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.files_activity +
        dataroomId +
        "/" +
        folderId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(error => {
          console.log('Caught in CatchError', error)
          return throwError(error);
        })
      );
  }


  getCountPages(dataroom_id: any, from_date: any, to_date: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.count_page + dataroom_id +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }
  /** Get details of single dataroom **/
  getAllDataRoomsFolders(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.dataroom_folder, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`get single dataroomId `)),
        catchError(this.handleError<any>("get single dataroomId"))
      );
  }

  archiveDataroom(dataroomId: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.archive_dataroom + dataroomId + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get single dataroomId `)),
        catchError(this.handleError<any>("get single dataroomId"))
      );
  }

  /**check admin user **/
  checkAdmin(data: any) {
    return this.http
      .post(this.baseUrl + this.apiListClass.check_admin, data, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  contactSupportTrial(dataroom: any) {
    return this.http
      .post(this.baseUrl + this.apiListClass.contact_support_trial, dataroom, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /**check admin user **/
  checkAdminUser(data: any) {
    return this.http
      .post(this.baseUrl + this.apiListClass.check_admin_user, data, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  TestPayment(data: any) {
    return this.http
      .post(this.baseUrl + "/teststripe/", data, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /**check admin user **/
  changeDisclaimerStatus(user_id: any) {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.change_disclaimer_status,
        user_id,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      ).toPromise().then(response => {
        this.log(`get all dataroom admins details `);
        return Promise.resolve(response);

      })


    // return this.http
    //   .post(
    //     this.baseUrl + this.apiListClass.change_disclaimer_status,
    //     user_id,
    //     {
    //       headers: new HttpHeaders().set(
    //         "Authorization",
    //         "token " + localStorage.getItem("token")
    //       ),
    //     }
    //   )
    //   .pipe(
    //     tap((res: any) => {
    //       this.log(`get all dataroom admins details `);
    //     })
    //   );
  }

  /**check admin user **/
  getAllUserMessage(admin_id: number) {
    return this.http
      .get(this.baseUrl + this.apiListClass.send_message + admin_id + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /**Get All Vote List **/
  getAllVoteList(dataroom_id: number, from_date: any, to_date: any) {
    return this.http
      .get(this.baseUrl + this.apiListClass.voting + dataroom_id +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`get all Vote details `);
        })
      );
  }

  /** To Create Vote **/

  createVote(
    data: any,
    dataroom_id: number,
    file: any,
    dataroomfile: any,
    file_size: any
  ) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (file != undefined) {
      formData.append("file", file, file.name);
      formData.append("file_size", file_size);
    }
    if (dataroomfile != undefined) {
      formData.append("dataroomfile", dataroomfile);
    }
    // console.log(formData, "formData");
    return this.http
      .put(
        this.baseUrl + this.apiListClass.voting + dataroom_id + "/",
        formData,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`dataroom pic is successfully uploaded`);
          // console.log("dataroom pic is successfully uploaded:", res);
        })
      );
  }

  /** To Make Vote **/

  Makevote(vote: any) {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.make_vote + vote.id + "/",
        JSON.stringify(vote),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  CreateQuestion(dataroom: any,qna:any) {
    //console.log(qna)
    const formData = new FormData();
    formData.append("category_id",qna.category_id);
    formData.append("que_title", qna.que_title);
   // const data = JSON.stringify(formData)
    console.log(formData)
    return this.http
      .post(
        this.baseUrl + this.apiListClass.Create_question+ dataroom + "/",
        formData,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /** To Create Vote **/

  createVoterGroup(data: any, dataroom_id: number) {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.voter_group + dataroom_id + "/",
        JSON.stringify(data),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /** To Create Vote **/

  getVoterGroup(dataroom_id: number) {
    return this.http
      .get(this.baseUrl + this.apiListClass.voter_group + dataroom_id + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  //To get Vote Count In Vote Status Report

  getVoteCount(vote_id: number) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.vote_count_analysis + vote_id + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  //To get Vote Count In Vote Status Report

  getVotingResult(vote_id: number) {
    return this.http
      .get(this.baseUrl + this.apiListClass.vote_result + vote_id + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /** To Create Vote **/

  addVoter(data: any, dataroom_id: number, vote_id: number) {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.add_voter +
        dataroom_id +
        "/" +
        vote_id +
        "/",
        JSON.stringify(data),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /** To Remove Voter **/

  removeVoter(dataroom_id: number, voter_id: number) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.add_voter +
        dataroom_id +
        "/" +
        voter_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /** To Get Voter Group Member **/

  getVoterGroupMemberList(group_id: number) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.voter_group_member + group_id + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /** To Add Member **/

  AddMemberVoterGroup(data: any, group_id: number) {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.voter_group_member + group_id + "/",
        JSON.stringify(data),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /** To Add Member **/

  DelMemberVoterGroup(group_member_id: number) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.del_group_member +
        group_member_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  //Export Voter Status Report

  ExportVoterStatusReport(vote_id: any, dataroom_name: any, date: any) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.export_voter_status + vote_id + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
          responseType: "blob",
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get dataroom usage details `);
          saveAs(
            new Blob([res], { type: "text/csv" }),
            "" + dataroom_name + "- Voting Status - " + date + ".csv"
          );
        })
      );
  }

  //Export Vote Report

  ExportVoteReport(dataroom_id: any,
    from_date: any,
    to_date: any,
    statusId: any) {
    return this.http
      .post(this.baseUrl + this.apiListClass.export_vote + dataroom_id +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date,
        JSON.stringify(statusId),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          // console.log(response, "what is this actually ");
          return response;
        })
      );
  }

  /**check admin user **/
  getChatPage(admin_id: number) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.chat_message_list + admin_id + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /**check admin user **/
  getAllDataroomMessage(dataroomId: number) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_dataroom_message +
        dataroomId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  get_time_zones_list() {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.time_zones_list +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          console.log(`get all dataroom admins details `);
        })
      );
  }




  /**check admin user **/
  checkLaUser(data: any) {
    return this.http
      .post(this.baseUrl + this.apiListClass.check_la_user, data, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /** POST : clone new dataroom **/
  cloneDataRoom(dataroom: any): Observable<any> {
    // console.log(dataroom, "value cloning");
    return this.http
      .post(this.baseUrl + this.apiListClass.clone_dataroom, dataroom, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }
  /** End of create new dataroom **/

  //delete_dataroom_admin(admin_id)
  delete_dataroom_admin_type(
    admin_id: number,
    group_id: number,
    delete_type: string
  ) {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.delete_dataroom_admin_type +
        admin_id +
        "/",
        { is_deleted: delete_type, group_id: group_id },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /** POST: update the user profile on the server */
  updateUserProfile(user: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.user_profile, user, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  /** Resend Invitation Link **/
  resendInvitationLink(member: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.resend_invitation_link, member, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }


  DeleteUser(dataroom,group,data: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.user_and_perm_bulk_delete + dataroom + '/' + group + '/', data, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  /** Folder Specific Permission **/
  createFolderSpecificPermission(file: any, dataroomId: any, groupId: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.create_dataroom_folder_permission +
        dataroomId +
        "/",
        { file: file, group_id: groupId },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("createFolderSpecificPermission:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      ).pipe(takeUntil(this.ngUnsubscribe));
  }

  create_dataroom_folder_permission_for_time(file: any, dataroomId: any, groupId: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.create_dataroom_folder_permission_for_time +
        dataroomId +
        "/",
        { file: file, group_id: groupId },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("createFolderSpecificPermission:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      ).pipe(takeUntil(this.ngUnsubscribe));
  }


  createFolderOnlyPermission(file: any, dataroomId: any, groupId: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.create_dataroom_folder_only_permission +
        dataroomId +
        "/",
        { file: file, group_id: groupId },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("createFolderSpecificPermission:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  /** POST: update the change user password on the server */
  changeUserPassword(user: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.change_password, user, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(tap((res: any) => this.log(`updated user id=${res}`)));
  }

  /** GET: get all datarooms usage **/
  getAllDataroomsUsage(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.get_dataroom_usage, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        }),
        catchError(this.handleError("getDatarooms", []))
      );
  }

  /** GET: get all datarooms **/
  getAllDatarooms(): Observable<any> {

    return this.http
      .get(this.baseUrl + this.apiListClass.dataroom, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => this.log(`fetched datarooms`)),
        catchError(this.handleError("getDatarooms", []))
      );
  }


  getLocalDatarooms(teamid: any, searchkey: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.globalsearchteamdataroom + teamid + `?key=${searchkey}`,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }


  /** POST : create new dataroom **/
  createDataRoom(dataroom: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.dataroom, dataroom, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }
  /** End of create new dataroom **/

  /** Get details of single dataroom **/
  getAllPrimaryUser(dataroom: any): Observable<any> {
    if (dataroom != null || dataroom != undefined) {
      return this.http
        .get(
          this.baseUrl + this.apiListClass.get_all_primary_users + dataroom + "/",
          {
            headers: new HttpHeaders().set(
              "Authorization",
              "token " + localStorage.getItem("token")
            ),
          }
        )
        .pipe(
          tap((res: any) => this.log(`get single dataroom `)),
          catchError(this.handleError<any>("get single dataroom"))
        );
    } else {
      return of({});
    }

  }


  getUserWiseIndexReport(
    dataroomId: number,
    user_id: any,
    statusId: any
  ) {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.index_report_user_wise +
        dataroomId +
        "/" +
        user_id
        +
        "/",
        JSON.stringify(statusId),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  /** **/

  /** Get Dataroom Members Report **/
  getDataroomMembers(dataroom: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.get_dataroom_members + dataroom + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get single dataroom `)),
        catchError(this.handleError<any>("get single dataroom"))
      );
  }
  /** **/

  /** Get details of single dataroom **/
  dataroom_mem_list(dataroom: any, user_id: number): Observable<any> {
    if (dataroom != null || dataroom != undefined) {
      return this.http
        .post(
          this.baseUrl + this.apiListClass.dataroom_mem_list + dataroom + "/",
          { user_id: user_id },
          {
            headers: new HttpHeaders().set(
              "Authorization",
              "token " + localStorage.getItem("token")
            ),
          }
        )
        .pipe(
          tap((res: any) => this.log(`get single dataroom `)),
          catchError(this.handleError<any>("get single dataroom"))
        );
    } else {
      return of({});
    }

  }
  /** **/

  bulkDownloadStatusIndex(dataroomId: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.bulkdownloadstatuscreateindex + dataroomId + '/',
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          // console.log(response, "what is this actually ");
          return response;
        })
      );
  }

  DownloadIndexReport(dataroom_id: any, from_date: any, to_date: any, status_id: any): Observable<any> {
    // console.log("This is Data : " + data,filecount, "bulk download");

    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.download_dataroom_index_report +
        dataroom_id +
        "/?from_date=" +
        from_date +
        "&to_Date=" +
        to_date,
        JSON.stringify(status_id),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          // console.log(response, "what is this actually ");
          return response;
        })
      ).pipe(takeUntil(this.ngUnsubscribe));
  }
  /** Get details of single dataroom **/
  getSingleDataroom(dataroom: any): Observable<any> {
    if (dataroom != null) {
      return this.http
        .get(this.baseUrl + this.apiListClass.dataroom_detail + dataroom + "/", {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        })

        .pipe(
          tap((res: any) => {
            this.log(`get single dataroom `);
            // console.log("get single dataroom", res.dataroomaccesscheck);
            if (res.dataroomaccesscheck !== undefined) {
              if (res.dataroomaccesscheck == "noaccess") {
                this.router.navigate(["../dashboard"]);
              }
            }
          }),

          catchError(this.handleError<any>("get single dataroom"))
        );
    }
    else {
      return of({});
    }
  }
  /** **/

  /** Get details of single dataroom **/
  getSingleDataroomNotificationList(dataroom: any, type: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_dataroom_notification +
        dataroom +
        "/?type=" +
        type,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get single dataroom `)),
        catchError(this.handleError<any>("get single dataroom"))
      );
  }
  /** **/

  /** Get details of single dataroom **/
  getSingleDataroomNotificationCount(dataroom: any): Observable<any> {
    if (dataroom != null || dataroom != undefined) {
      return this.http
        .get(
          this.baseUrl +
          this.apiListClass.get_dataroom_notification_count +
          dataroom +
          "/",
          {
            headers: new HttpHeaders().set(
              "Authorization",
              "token " + localStorage.getItem("token")
            ),
          }
        )
        .pipe(
          tap((res: any) => this.log(`get single dataroom `)),
          catchError(this.handleError<any>("get single dataroom"))
        );
    } else {
      return of({});
    }

  }
  /** **/
  bulkupload_files_check(dataroom: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.bulkupload_files_check +
        dataroom +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get single dataroom `)),
        catchError(this.handleError<any>("get single dataroom"))
      );
  }

  trashShowDeletedFiles(dataroom: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.ShowDeletedFiles + dataroom + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("show deleted files:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }
  Viewbulk_files(dataroom: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.Viewbulk_files + dataroom + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`get single dataroom `)),
        catchError(this.handleError<any>("get single dataroom"))
      );
  }

  /** Get details of single dataroom **/
  getAllNotificationList(type: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.get_all_notification + "?type=" + type,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get single dataroom `)),
        catchError(this.handleError<any>("get single dataroom"))
      );
  }
  /** **/
  receive_email(dataroom: any): Observable<any> {
    // console.log(dataroom, "receive_email");

    return this.http
      .put(this.baseUrl + this.apiListClass.receive_email, dataroom, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("receive_email:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  /** Update Single dataroom **/
  updateSingleDataroom(dataroom: any): Observable<any> {
    return this.http
      .put(
        this.baseUrl + this.apiListClass.dataroom_detail + dataroom.id + "/",
        dataroom,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  updateSingleDataroomInformation(dataroom: any): Observable<any> {
    // console.log(dataroom, "update sinle entry");
    return this.http
      .post(
        this.baseUrl + this.apiListClass.dataroom_detail + dataroom.id + "/",
        dataroom,
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  /** End of update single dataroom **/

  /** Edit Online Single dataroom **/
  editOnlineDataroom(data: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.editonlinedataroom, data,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }
  /** End of Online single dataroom **/

  /** Delete Single dataroom **/
  deleteSingleDataroom(dataroom: any): Observable<any> {
    return this.http
      .delete(
        this.baseUrl + this.apiListClass.dataroom_detail + dataroom + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }
  /** End of delete single dataroom **/

  /** Archived Single dataroom **/
  archivedRequestForDataroom(dataroom: any): Observable<any> {
    return this.http
      .delete(
        this.baseUrl + this.apiListClass.archive_request_api + dataroom + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  /** End of archive single dataroom **/

  /** Delete Single dataroom **/
  deletionRequestForDataroom(dataroom: any): Observable<any> {
    return this.http
      .delete(
        this.baseUrl + this.apiListClass.delete_request_api + dataroom + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }
  /** End of delete single dataroom **/

  /** change dataroom stage**/
  change_dataroom_stage(dataroom: any): Observable<any> {
    return this.http
      .put(
        this.baseUrl +
        this.apiListClass.change_dataroom_stage +
        dataroom.id +
        "/",
        dataroom,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  /** end of dataroom stage **/

  /** Change Dataroom Overview Setting **/
  update_dataroom_overview_setting(
    dataroom: any,
    dataroom_id: any
  ): Observable<any> {
    return this.http
      .put(
        this.baseUrl +
        this.apiListClass.update_dataroom_overview_setting +
        dataroom_id +
        "/",
        dataroom,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  /** End of dataroom overview setting**/
  get_dataroom_disclaimer(dataroomId: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_dataroom_disclaimer +
        dataroomId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }




  check_2fa_permission(dataroomId: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.check_2fa_permission +
        dataroomId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }




  update_dataroom_disclaimer(dataroom_id: any, dataroom: any): Observable<any> {
    return this.http
      .put(
        this.baseUrl +
        this.apiListClass.get_dataroom_disclaimer +
        dataroom_id +
        "/",
        dataroom,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  get_single_dataroom_overview(dataroom: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.dataroom_overview, dataroom, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  update_multiple_disclaime_overview(data: any): Observable<any> {
    return this.http
      .put(this.baseUrl + this.apiListClass.multiple_diclaimer_overview, data, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  /** Create User from super admin **/
  create_user_from_super_admin(dataroom: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.create_user_from_superadmin,
        dataroom,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        })
        //  catchError(this.handleError<any>('updateUser'))
      );
  }

  // End of super admin //

  get_all_admins(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.create_user_from_superadmin, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`get single dataroom `))
        //catchError(this.handleError<any>('get single dataroom'))
      );
  }

  //getAllContacts
  //createNewContact

  getAllContacts(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.create_contact, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`get single dataroom `))
        //catchError(this.handleError<any>('get single dataroom'))
      );
  }

  getButtonVisibilityCheck(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.buttonvisibilitycheck, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`get single dataroom `))
        //catchError(this.handleError<any>('get single dataroom'))
      );
  }

  // getAllDataroomContacts

  getAllDataroomContacts(dataroomId: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.create_datroom_contact +
        dataroomId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get single dataroom `))
        //catchError(this.handleError<any>('get single dataroom'))
      );
  }

  createNewContact(contact: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.create_contact, contact, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        })
      );
  }

  // create new dataroom contact
  sendDataroomUserMessage(
    userId: number,
    dataroomId: number,
    update: any
  ): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.send_message + userId + "/",
        { dataroomId: dataroomId, update: update },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        })
      );
  }

  sendMessageToUser(update: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.send_message_to_user, update, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create `);
        })
      );
  }
  // sendDataroomUserMessage(userId: number, dataroomId: number): Observable<any> {
  //     return this.http.post(this.baseUrl+this.apiListClass.send_message, userId, {'dataroomId': dataroomId}, {
  //     headers: new HttpHeaders().set('Authorization', "token " + localStorage.getItem("token")),
  //   }).pipe(
  //       tap((res) => {this.log(`create `);
  //         console.log("result is:", res);
  //       })
  //     );
  //   }

  // create new dataroom contact
  createNewDataroomContact(contact: any, dataroom: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.create_datroom_contact,
        { contact: contact, dataroom: dataroom },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        })
      );
  }

  /** Upload dataroom pic **/
  postDataroomPic(fileToUpload: File, dataroom_id: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("profile_pic", fileToUpload, fileToUpload.name);

    return this.http
      .put(
        this.baseUrl +
        this.apiListClass.upload_dataroom_pic +
        dataroom_id +
        "/",
        formData,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`dataroom pic is successfully uploaded`);
          // console.log("dataroom pic is successfully uploaded:", res);
        })
      );
  }
  /** End of dataroom pic **/

  // set default dataroom
  setDefaultDataroomLogo(dataroom_id: number, dataroom: any): Observable<any> {
    return this.http
      .put(
        this.baseUrl +
        this.apiListClass.set_default_dataroom_pic +
        dataroom_id +
        "/",
        dataroom,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        //
        //map(heroes => heroes[0]),
        tap((res: any) => this.log(`set default pic successfully`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }
  // end of set default datarooom

  // remove dataroom overview video
  removeDataroomOverviewvideo(dataroomId: number): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.remove_dataroom_overview_video +
        dataroomId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`remove dataroom overview video`))
        //catchError(this.handleError<any>('get sdingle dataroom'))
      );
  }
  // end of dataroom video
  createNewDisclaimers() {
    // console.log("create new disclaimers");
  }

  getAllDisclaimers(dataroomId: any): Observable<any> {
    if (dataroomId != null || dataroomId != undefined) {
      return this.http
        .get(
          this.baseUrl +
          this.apiListClass.add_new_dataroom_disclaimer +
          dataroomId +
          "/",
          {
            headers: new HttpHeaders().set(
              "Authorization",
              "token " + localStorage.getItem("token")
            ),
          }
        )
        .pipe(
          tap((res: any) => this.log(`remove dataroom overview video`))
          //catchError(this.handleError<any>('get single dataroom'))
        );
    } else {
      return of({});
    }

  }

  getSingleDisclaimers(disclaimerId: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.dataroom_disclaimer_api +
        disclaimerId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`remove dataroom overview video`))
        //catchError(this.handleError<any>('get single dataroom'))
      );
  }

  // get all contact groups

  getAllContactGroups(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.create_contact_group, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(tap((res: any) => this.log(`remove dataroom overview video`)));
  }

  getAllContactsGroup(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.create_contact_group, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`get all contact group `))
        //catchError(this.handleError<any>('get single dataroom'))
      );
  }

  // get all dataroom contacts group
  getAllDataroomContactsGroup(dataroomId: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.create_new_dataroom_contact_group +
        dataroomId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get all contact group `))
        //catchError(this.handleError<any>('get single dataroom'))
      );
  }

  deleteContactGroup(groupId: any): Observable<any> {
    return this.http
      .delete(
        this.baseUrl +
        this.apiListClass.create_new_dataroom_contact_group +
        groupId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get all contact group `))
        //catchError(this.handleError<any>('get single dataroom'))
      );
  }

  // create new contact group
  createNewContactGroup(contact: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.create_contact_group, contact, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        })
      );
  }

  // create new dataroom contact group
  createNewDataroomContactGroup(
    contact: any,
    dataroomId: any
  ): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.create_new_dataroom_contact_group +
        dataroomId +
        "/",
        contact,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        })
      );
  }

  // delete contact from group successfully
  deleteContactFromGroup(contact: any, group: number): Observable<any> {
    console.log("contact id is", contact);
    return this.http
      .put(
        this.baseUrl +
        this.apiListClass.get_all_contacts_associated_with_the_group +
        group +
        "/",
        { contact: contact },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get all contact group `))
        //catchError(this.handleError<any>('get single dataroom'))
      );
  }

  // add new member to contact group
  add_new_member_to_contact_group(data: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.add_new_member_to_contact_group,
        data,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        })
      );
  }

  // get all contacts associated with the group
  getAllContactsAssociatedWithGroup(group: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_all_contacts_associated_with_the_group +
        group +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get all contact group `))
        //catchError(this.handleError<any>('get single dataroom'))
      );
  }

  //get all my teams
  getAllMyteams(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.my_team, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(tap((res: any) => this.log("Get All My Temas")));
  }

  deleteChannel(channelId: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.Delete_channel + channelId + '/', {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(tap((res: any) => this.log("Get All My Temas")));
  }


  // Online User
  getOnlineTeamUsersData(): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.teamalluseronline,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }
  getOnlineFilteredUsersData(search: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.teamalluseronline2
        + '?userFullName=' + search.userFullName
        + '&emailId=' + search.emailId
        + '&team=' + search.team
        + '&dataroom=' + search.dataroom
        + '&role=' + search.role,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }
  getOnlineDashboardData(): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.myteamonlinedashboard,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }
  deleteOnlineTeam(teamid: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.teamdeletiononline + teamid,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }
  getOnlineDataroomStateDetails(dataroomID: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.dataroomapiadmin + dataroomID,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }
  getOnlineDeleteDetails(dataroomID: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.directdeletedataroom + dataroomID,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }
  // Online User


  //get all my channels & teams
  getChannelsAndTeams(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.chanelteamapi, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(tap((res: any) => this.log("Get All My Temas")));
  }

  //get all channels
  getAllChannels(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.my_chanel, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(tap((res: any) => this.log("Get All My Channels")));
  }


  getSilverOnline(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.silveronline, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(tap((res: any) => this.log("Get All My Channels")));
  }

  getGoldOnline(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.goldonline, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(tap((res: any) => this.log("Get All My Channels")));
  }

  getPlatinumOnline(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.platinumonline, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(tap((res: any) => this.log("Get All My Channels")));
  }

  getTrialOnline(): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.trialonline, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(tap((res: any) => this.log("Get All My Channels")));
  }

  GroupDeactivateactivate(id: any, notify): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.GroupDeactivateactivate + id + '/?notify=' + notify, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(tap((res: any) => this.log("Get All My Channels")));
  }


  // Get single invoice in pdf format
  download_dataroom_disclaimer(disclaimer_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.dataroom_disclaimer +
        disclaimer_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
          responseType: "blob",
        }
      )
      .pipe(
        tap((res: any) => this.log("Get All My Temas"))
        //this.extractContentAll(res)),
        //catchError(this.handleError<any>('get single dataroom'))
      );
  }

  // delete dataroom disclaimer
  delete_dataroom_disclaimer(disclaimer_id: any): Observable<any> {
    // console.log("delete disclaimers");
    return this.http
      .delete(
        this.baseUrl +
        this.apiListClass.dataroom_disclaimer +
        disclaimer_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(tap((res: any) => this.log(`remove dataroom overview video`)));
  }

  // make_default_dataroom_disclaimer
  make_default_dataroom_disclaimer(disclaimer_id: any): Observable<any> {

    return this.http
      .put(
        this.baseUrl +
        this.apiListClass.dataroom_disclaimer +
        disclaimer_id +
        "/",
        { disclamer: disclaimer_id },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(tap((res: any) => this.log(`remove dataroom overview video`)));
  }

  // upload disclaimer

  uploadDisclaimer(
    fileToUpload: File,
    dataroomId: number,
    file_size: any
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("fileKey", fileToUpload, fileToUpload.name);
    formData.append("file_size", file_size);
    // console.log(file_size, "Disclaimer Size dataroom");
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.add_new_dataroom_disclaimer +
        dataroomId +
        "/",
        formData,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(tap((res: any) => this.log(`remove dataroom overview video`)));
  }

  // cretae my team
  createMyTeam(myteam: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.my_team, myteam, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create my team`);
          // console.log("my team is:", res);
        })
      );
  }
  getUniversalDatroomTeams(searchtext: any, planname = ''): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.globalsearchteamdataroomid + `?key=${searchtext}&plan=${planname}`,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }
  // Create my Channel
  createMyChannel(myChannel: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.my_chanel, myChannel, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create my team`);
          // console.log("my team is:", res);
        })
      );
  }

  // cretae my team
  DataDvDAPI(subscriptionId: any, myteam: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.buyDataDVD + subscriptionId + '/', myteam, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create my team`);
          // console.log("my team is:", res);
        })
      );
  }

  //
  // cretae my team
  CancelOnAddPlan(subscriptionId: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.cancelonaddon + subscriptionId, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create my team`);
          // console.log("my team is:", res);
        })
      );
  }
  //

  CancelOnAddPlanExpired(subscriptionId: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.cancelonaddonexpired + subscriptionId, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create my team`);
          // console.log("my team is:", res);
        })
      );
  }

  ReactivatePlanAddOn(subscriptionId: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.reactivationplanlink + subscriptionId + '/', {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log(`create my team`);
          // console.log("my team is:", res);
        })
      );
  }

  getAllUsersData(): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.chanel_allmember,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }

  getTeamUsersData(teamId: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.team_allmember + teamId + '/',
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }

  getFilteredUsersData(search: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.chanel_allmember
        + '?userFullName=' + search.userFullName
        + '&emailId=' + search.emailId
        + '&team=' + search.team
        + '&dataroom=' + search.dataroom
        + '&channel=' + search.channel
        + '&role=' + search.role,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }

  getChannelDashboardCounts(): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.chanel_dashboard,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }

  getSingleChannelDashboardCounts(channelId: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.chanel_dashboard + '?id=' + channelId,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }

  // get single my_team data
  getMyTeamData(myteamID: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.my_team_detail_view + myteamID + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }

  deleteTeam(myteamID: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.Delete_team + myteamID + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }

  // update single my team data
  updateMyTeamData(myTeam: any): Observable<any> {
    return this.http
      .put(
        this.baseUrl + this.apiListClass.upload_my_team_logo + myTeam.id + "/",
        { myTeam: myTeam },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }

  updateMyTeam(myTeam: any): Observable<any> {
    return this.http
      .put(
        this.baseUrl + this.apiListClass.my_team_detail_view + myTeam.id + "/",
        { myTeam: myTeam },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }

  // delete single my team data
  deleteMyTeamData(myteamID: any): Observable<any> {
    return this.http
      .delete(
        this.baseUrl + this.apiListClass.my_team_detail_view + myteamID + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team data successfully fetched`);
        })
      );
  }

  maintainsubscriptionsession(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + "/MaintainPlanSession/",
      data,

      {
        headers: new HttpHeaders({
          Authorization: "token " + localStorage.getItem("token"),
        }),
      }
    );
  }
  getSinglePlanDetails(planitem: any): Observable<any> {
    return this.http.get(
      this.baseUrl + "/GetSinglePlan/" + planitem + "/"
    );
  }

  getPlanDetails(): Observable<any> {
    return this.http.get(
      this.baseUrl + "/plan_details/"
    );
  }
  plansubscription(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + "/plan_subscription/",
      data,

      {
        headers: new HttpHeaders({
          Authorization: "token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  uploadcancel(data: any): Observable<any> {

    return this.http.get(
      this.baseUrl + "/cancel_uploding/" + data,
      {
        headers: new HttpHeaders({
          Authorization: "token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  getUpgradePlanDetails(subscriptionId: any): Observable<any> {
    return this.http.get(
      this.baseUrl + "/getusercurrentplan/" + subscriptionId + "/",
      {
        headers: new HttpHeaders({
          Authorization: "token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  getRectivatePlanDetails(subscriptionId: any): Observable<any> {
    return this.http.get(
      this.baseUrl + "/getreactivateplans/" + subscriptionId + "/",
      {
        headers: new HttpHeaders({
          Authorization: "token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  // 
  // get my team branding detail view
  // my_team_branding_detail_view(myteamID:number): Observable<any>{
  // return this.http.get(this.baseUrl+this.apiListClass.my_team_branding_detail_view+myteamID+"/",
  //   {  headers: new HttpHeaders().set('Authorization', "token " + localStorage.getItem("token"))
  // }
  //   ).pipe(
  //     tap((res:any) => { this.log(`My team branding data successfully fetched`)}),
  //   );
  // }

  //my_team_branding_detail_view
  my_team_branding_update_view(my_team_branding: any): Observable<any> {
    return this.http
      .put(
        this.baseUrl +
        this.apiListClass.my_team_branding_detail_view +
        my_team_branding.id +
        "/",
        {
          my_team_branding: my_team_branding,
        },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team branding data successfully fetched`);
        })
      );
  }

  //revert_default_my_team_setting
  revert_default_my_team_setting(my_team_branding: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.revert_default_my_team_setting +
        my_team_branding.id +
        "/",
        {
          my_team_branding: my_team_branding,
        },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`MY team branding default setting successfully updated`);
        })
      );
  }

  // upload my team picture to the server
  upload_my_team_logo(fileToUpload: any, my_team_id: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("my_team_pic", fileToUpload, fileToUpload.name);
    formData.append("my_team", my_team_id);

    return this.http
      .post(
        this.baseUrl + this.apiListClass.upload_my_team_logo + my_team_id + "/",
        formData,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`My team picture successfully updated`);
        })
      );
  }

  // upload my team branding logo here
  upload_my_team_branding_logo(
    branding_logo: any,
    email_header: any,
    favicon_icon: any,
    my_team_id: any
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("branding_logo", branding_logo);
    formData.append("email_header", email_header);
    formData.append("favicon_icon", favicon_icon);
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.upload_my_team_branding_logo +
        my_team_id +
        "/",
        formData,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`My team branding picture successfully updated`);
        })
      );
  }

  plan_subscription(user_id: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.plan_subscribe, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`My team branding data successfully fetched`);
        })
      );
  }

  payNow(planId: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.paymentOverdue + planId + '/', {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`My team branding data successfully fetched`);
        })
      );
  }

  overdueAmount(planId: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.paymentOverdue + planId + '/' + '?overdueamount=8567', {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`My team branding data successfully fetched`);
        })
      );
  }

  perDvdAmount(): Observable<any> {
    return this.http
      .get(this.baseUrl + '/dvd_plans/', {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`My team branding data successfully fetched`);
        })
      );
  }

  // plan detail function 
  Plan_details(subscriptionId: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.userplandetails +
        subscriptionId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team branding data successfully fetched`);
        })
      );
  }

  // get all my team members

  //add_new_member_to_my_team
  get_all_my_team_members(my_team_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_all_my_team_members +
        my_team_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`My team branding data successfully fetched`);
        })
      );
  }
  // add new member to my team

  //add_new_member_to_my_team
  add_new_member_to_my_team(member: any, my_team_id: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.add_new_member_to_my_team +
        my_team_id +
        "/",
        {
          memeber: member,
        },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`members are successfully added`);
        })
      );
  }

  getTeamMembersData(my_team_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.add_new_member_to_my_team +
        my_team_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`members are successfully added`);
        })
      );
  }

  //add_new_member_to_my_chanel
  add_new_member_to_my_chanel(member: any, my_channel_id: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.add_new_member_to_my_chanel +
        my_channel_id +
        "/",
        {
          memeber: member,
        },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`members are successfully added`);
        })
      );
  }

  getAllMembersData(my_channel_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.add_new_member_to_my_chanel +
        my_channel_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`members are successfully added`);
        })
      );
  }

  // delete member from my team
  delete_member_from_my_team(my_team_id: any, member_id: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.delete_member_from_my_team +
        my_team_id +
        "/",
        {
          member_id: member_id,
        },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`delete member from my team data successfully fetched`);
        })
      );
  }

  // delete member from my channel
  delete_member_from_my_channel(my_channel_id: any, member_id: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.delete_member_from_chanel +
        my_channel_id +
        "/",
        {
          member_id: member_id,
        },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`delete member from my team data successfully fetched`);
        })
      );
  }

  // create dataroom from my team
  create_dataroom_from_my_team(my_team_id: any, dataroom: any, is_uae: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.create_dataroom_from_my_team,
        {
          my_team_id: my_team_id,
          dataroom: dataroom,
          is_uae: is_uae,
        },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`delete member from my team data successfully fetched`);
        })
      );
  }

  // create new folder
  create_new_folder(dataroom_id: number, new_folder: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.create_new_folder,
        { dataroom_id: dataroom_id, name: new_folder },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`create new root folder`);
        })
      );
  }

  // create new subfolder
  create_new_sub_folder(
    dataroom_id: number,
    new_folder: any,
    folder_id: number
  ): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.create_new_sub_folder,
        { dataroom_id: dataroom_id, name: new_folder, folder_id: folder_id },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`create new root folder`);
        })
      );
  }

  // get all root folders
  get_all_root_folders(
    dataroom_id: any,
    from_date: any,
    to_date: any
  ): Observable<any> {
    if (dataroom_id != null || dataroom_id != undefined) {
      return this.http
        .get(
          this.baseUrl +
          this.apiListClass.get_all_root_folders +
          dataroom_id +
          "/?from_date=" +
          from_date +
          "&to_date=" +
          to_date,
          {
            headers: new HttpHeaders().set(
              "Authorization",
              "token " + localStorage.getItem("token")
            ),
          }
        )
        .pipe(
          tap((res: any) => {
            this.log(`get all root folder`);
            if (res.dataroomaccesscheck !== undefined) {
              if (res.dataroomaccesscheck == "noaccess") {
                this.router.navigate(["../dashboard"]);
              }
            }
          })
        );
    } else {
      return of({});
    }

  }

  getFilesFolders(dataroom_id: any, group_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_file_folders +
        dataroom_id +
        "/?group_id=" +
        group_id,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all file folder`);
        })
      );
  }

  getAllFilesFolders(dataroom_id: any, group_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_all_folders +
        dataroom_id +
        "/?group_id=" +
        group_id,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all file folder`);
        })
      );
  }

  getSearchFolderFilesList(
    dataroom_id: any,
    name: any,
    type: any,
    uploaded_by: any,
    from_date: any,
    to_date: any,
    value: any
  ): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_search_folder_files +
        dataroom_id +
        "/?test=" +
        value +
        "&name=" +
        name +
        "&type=" +
        type +
        "&uploaded_by=" +
        uploaded_by +
        "&from_date=" +
        from_date +
        "&to_date=" +
        to_date,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all file folder`);
        })
      );
  }

  getGroupFilesFolders(dataroom_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_group_file_folders +
        dataroom_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all file folder`);
        })
      );
  }

  getUpdateGroupFilesFolders(file: any, dataroomId: any, groupId: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.get_update_group_file_folders +
        dataroomId +
        "/",
        { file: file, group_id: groupId },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  // (group_id: any): Observable<any>{
  // return this.http.get(this.baseUrl+this.apiListClass.get_update_group_file_folders+group_id+"/",
  //    {headers: new HttpHeaders().set('Authorization', "token " + localStorage.getItem("token"))}
  //       ).pipe(
  //         tap((res:any) => { this.log(`get all file folder`)}),
  //       );
  // }

  // get_folders
  getAllFolders(dataroom_id: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.get_folders + dataroom_id + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => {
          this.log("get all file folder");
        })
      );
  }

  // get all root folders
  get_all_permission_root_folders(dataroom_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_all_dataroom_root_folders +
        dataroom_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all root folder`);
        })
      );
  }

  // get single folder details
  getSingleFolderDetails(folder_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_single_folder_detail +
        folder_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all root folder`);
        })
      );
  }



  getSubSingleFolderDetails(folder_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.GetSingleFolderBreadCrumps +
        folder_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all root folder`);
        })
      );
  }

  // get all subfolder list
  getAllSubfolderList(
    folder_id: any,
    name: any,
    type: any,
    uploaded_by: any,
    from_date: any,
    to_date: any
  ): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_all_subfolder_list +
        folder_id +
        "/?name=" +
        name +
        "&type=" +
        type +
        "&uploaded_by=" +
        uploaded_by +
        "&from_date=" +
        from_date +
        "&to_date=" +
        to_date,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all root folder`);
        })
      );
  }

  // delete folder or file
  deleteFolderOrFile(folder_id: any): Observable<any> {
    return this.http
      .delete(
        this.baseUrl +
        this.apiListClass.delete_folder_or_file +
        folder_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all root folder`);
        })
      );
  }

  bulkDownloadRecentDoc(data: any, filecount: any): Observable<any> {
    console.log(filecount, "bulk download");
    return this.http
      .post(
        this.baseUrl +
        "/upload_status_bulk_download/" +
        filecount +
        "/",
        JSON.stringify(data),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          // console.log(response, "what is this actually ");
          return response;
        })
      );
  }


  // update folder or file name
  update_folder_or_file_name(folder: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.update_folder__or_file_name,
        { folder: folder },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`update_folder_or_file_name`);
        })
      );
  }

  // delete all folder / file list

  delete_all_folder_or_files(folder: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.delete_all_selected_files,
        { folder: folder },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`update_folder_or_file_name`);
        })
      );
  }

  favourite_all_selected_files(dataroom, folder: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.favourite_all_selected_files + dataroom + '/',
        { folder: folder },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`update_folder_or_file_name`);
        })
      );
  }





  delete_favourite_all_selected_files(dataroom, folder: any) {

    const httpOptions = {
      headers: new HttpHeaders()
        .set("Authorization", "token " + localStorage.getItem("token"))
        .set("Content-Type", "application/json"),
      body: { folder: folder }
    };


    return this.http
      .delete(
        this.baseUrl + this.apiListClass.favourite_all_selected_files + dataroom + '/', httpOptions

      )
      .pipe(
        tap((res: any) => {
          this.log(`update_folder_or_file_name`);
        })
      );
  }

  delete_redacte_pdf(dataroom, folder: any) {

    const httpOptions = {
      headers: new HttpHeaders()
        .set("Authorization", "token " + localStorage.getItem("token"))
        .set("Content-Type", "application/json"),
      body: { folder: folder }
    };


    return this.http
      .delete(
        this.baseUrl + this.apiListClass.redacte_pdf + dataroom + '/', httpOptions

      )
      .pipe(
        tap((res: any) => {
          this.log(`update_folder_or_file_name`);
        })
      );
  }




  // get all trashed files
  get_all_trashed_folder_and_files(
    dataroomId: number,
    deleted_by: any,
    page: number = 0,
    to_date: any,
    from_date: any
  ): Observable<any> {
    console.log(to_date, from_date, "dates in api");

    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_all_trashed_files +
        dataroomId +
        "/?deleted_by=" +
        deleted_by +
        "&page=" +
        +page +
        "&from_date=" +
        from_date +
        "&to_date=" +
        to_date,

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          // console.log(
          //   this.baseUrl +
          //   this.apiListClass.get_all_trashed_files +
          //   dataroomId +
          //   "/?deleted_by=" +
          //   deleted_by +
          //   "&page=" +
          //   +page +
          //   "&from_date=" +
          //   from_date +
          //   "&to_date=" +
          //   to_date,

          //   "trash"
          // );
          this.log(`update_folder_or_file_name`);
          if (res.dataroomaccesscheck !== undefined) {
            if (res.dataroomaccesscheck == "noaccess") {
              this.router.navigate(["../dashboard"]);
            }
          }
        })
      );
  }

  // new_update
  newUpdate(optionSelected: any, dataroomId: number): Observable<any> {
    // const formData : FormData = new FormData();
    // formData.append('file', file, file.name);
    // formData.append('options', JSON.stringify(optionSelected));
    return this.http
      .post(
        this.baseUrl + this.apiListClass.new_update + dataroomId + "/",
        optionSelected,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("Hello newupdates:-");
          // console.log("result is:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  // dataroom_user_list
  dataroom_user_list(dataroomId: number): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.dataroom_user_list + dataroomId + "/",

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`dataroom_user_list`);
        })
      );
  }

  // dataroom_group_list
  dataroom_group_list(dataroomId: number): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.dataroom_group_list + dataroomId + "/",

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`dataroom_user_list`);
        })
      );
  }

  get_category_item(categoryid: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.delete_category + categoryid + "/",

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get_categories_list`);
        })
      );
  }



  update_category_item(categorydata: any) {
    return this.http
      .put(
        this.baseUrl +
        this.apiListClass.update_category,
        { categorydata },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`update data`);
        })
      );
  }


  delete_category_item(categoryid: any): Observable<any> {
    return this.http
      .delete(
        this.baseUrl + this.apiListClass.delete_category + categoryid + "/",

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`delete_categories_list`);
        })
      );
  }

  // categories_list
  categories_list(dataroomId: number): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.categories_list + dataroomId + "/",

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`categories_list`);
        })
      );
  }

  // get_recent_updates
  get_recent_updates(dataroomId: number, cat_list: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.get_recent_updates + dataroomId + "/",
        { cat_list: cat_list },

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get_recent_updates`);
        })
      );
  }

  //recent_document
  recent_document(dataroomId: number): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.recent_document + dataroomId + "/",

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`recent_document`);
        })
      );
  }

  //get_all_recent_document
  get_all_recent_document(
    dataroomId: number,
    from_date: any,
    to_date: any
  ): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_all_recent_document +
        dataroomId +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date,

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get_all_recent_document`);
        })
      );
  }

  getFilesList(id: number): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.get_files_list + id + "/",

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`recent_document`);
        })
      );
  }

  getFilesOnSearch(id: number, key: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.get_files_list + id + "/?key=" + key,

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`recent_document`);
        })
      );
  }

  getMembersOnSearch(id: number, key: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.get_dataroom_members + id + "/?key=" + key,

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`recent_document`);
        })
      );
  }

  getUpdatesList(id: number): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.get_update_list + id + "/",

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`recent_document`);
        })
      );
  }

  get_recent_update_api(id: number): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.new_update + id + "/",

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`recent_document`);
        })
      );
  }

  get_single_member(id: number): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.get_single_member + id + "/",

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get_single_member`);
        })
      );
  }

  //get_datarroom_usage_details_for_graph
  get_dataroom_usage_details_for_graph(
    dataroomId: number,
    from_date: any,
    to_date: any
  ): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_dataroom_usage_details_for_graph +
        dataroomId +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          // console.log(from_date, "todays1111");
          // console.log(to_date, "first2222");
          this.log(`get dataroom usage details `);
        })
      );
  }


  TimeOutApi(dataroom: any, api: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.TimeOutApi + dataroom + "/",
        { msg: api },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`get single dataroom `)),
        catchError(this.handleError<any>("get single dataroom"))
      );
  }

  // download dataroom index report
  download_dataroom_index_report(
    dataroomId: number,
    from_date: any,
    to_date: any,
    dataroom_name: any
  ): Observable<Blob> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.download_indexing_report +
        dataroomId +
        "/?from_date=" +
        from_date +
        "&to_Date=" +
        to_date,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
          responseType: "blob",
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`folders_tree `);
          saveAs(
            new Blob([res], { type: "text/csv" }),
            "" + dataroom_name + "- Index Report - " + to_date + ".csv"
          );

          // console.log("folders_tree", res.dataroomaccesscheck);
          if (res.dataroomaccesscheck !== undefined) {
            if (res.dataroomaccesscheck == "noaccess") {
              this.router.navigate(["../dashboard"]);
            }
          }
        }),

        catchError(this.handleError<any>("get single dataroom"))
      );
  }

  // edit index of root folder
  edit_index_of_root_folder(dataroomId: number, folder: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.edit_index_of_root_folder,
        { dataroomId: dataroomId, folder: folder },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`edit index of root folder`);
        })
      );
  }

  // permanant deleet folder
  permanant_delete_folder(folder_id: any): Observable<any> {
    return this.http
      .delete(
        this.baseUrl +
        this.apiListClass.permanant_delete_folder +
        folder_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`permanat delete folder`);
        })
      );
  }

  permanant_delete_foldernew(folder_id: any): Observable<any> {
    return this.http
      .delete(
        this.baseUrl +
        this.apiListClass.permanant_delete_foldernew +
        folder_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`permanat delete folder`);
        })
      );
  }


  permanant_delete_folder_redact(folder_id: any): Observable<any> {
    return this.http
      .delete(
        this.baseUrl +
        this.apiListClass.permanant_delete_folder_redact +
        folder_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`permanat delete folder`);
        })
      );
  }


  // restore_folder_redact(folder_id: any): Observable<any> {
  //   return this.http
  //     .post(
  //       this.baseUrl +
  //       this.apiListClass.permanant_delete_folder_redact +
  //       folder_id +
  //       "/",
  //       {
  //         headers: new HttpHeaders().set(
  //           "Authorization",
  //           "token " + localStorage.getItem("token")
  //         ),
  //       }
  //     )
  //     .pipe(
  //       tap((res: any) => {
  //         this.log(`permanat delete folder`);
  //       })
  //     );
  // }


  // restore_folder_redact(folder_id: any): Observable<any> {
  //   return this.http
  //     .post(
  //       this.baseUrl + this.apiListClass.permanant_delete_folder_redact + folder_id +
  //       "/",
  //       {
  //         headers: new HttpHeaders().set(
  //           "Authorization",
  //           "token " + localStorage.getItem("token")
  //         ),
  //       }
  //     )
  //     .pipe(
  //       tap((res: any) => {
  //         this.log(`edit index of root folder`);
  //       })
  //     );
  // }

  restore_folder_redact(folder_id: any,): Observable<any> {
    const url = this.baseUrl + this.apiListClass.permanant_delete_folder_redact + folder_id + "/"; // Include the ID in the URL
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "token " + localStorage.getItem("token") // Include the token in the Authorization header
    });
    return this.http.post(url, null, { headers: headers });
  }

  // restore deleet folder
  restore_folders_files(folder_id: any, files: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.restore_folders_files +
        folder_id +
        "/",
        JSON.stringify(files),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`permanat delete folder`);
        })
      );
  }

  restore_folders_check(folder_id: any, files: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "token " + localStorage.getItem("token") }), observe: 'response' }
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.restore_folders_check +
        folder_id +
        "/",
        JSON.stringify(files),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
          observe: 'response'
        }
      )
      .pipe(
        tap((res: any) => {

          this.log(`permanat delete folder`);
        })
      );
  }




  bulk_permanant_delete_folder(folder_id: any, files: any) {

    const httpOptions = {

      // headers: new HttpHeaders().set(
      //   "Authorization",
      //   "token " + localStorage.getItem("token")
      // ),
      headers: new HttpHeaders()
        .set("Authorization", "token " + localStorage.getItem("token"))
        .set("Content-Type", "application/json"),
      body: JSON.stringify(files)
    };
    return this.http
      .delete(
        this.baseUrl +
        this.apiListClass.bulk_permanant_delete_folder +
        folder_id +
        "/", httpOptions
      )
      .pipe(
        tap((res: any) => {
          this.log(`permanat delete folder`);
        })
      );
  }

  trashShowDeletedFilesold(dataroom: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.ShowDeletedFilesold + dataroom + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res) => {
          this.log(`create `);
          // console.log("show deleted files:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }



  // upload contact csv from super admin panel
  upload_contact_csv(filedata: any): Observable<any> {
    let formdata = new FormData();
    // console.log(formdata);
    formdata.append("csv_file", filedata);
    return this.http
      .post(this.baseUrl + this.apiListClass.upload_new_csv, formdata, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`upload contact csv`);
        })
      );
  }

  // download sample contact csv
  download_sample_contact_csv(): Observable<Blob> {
    return this.http
      .get(this.baseUrl + this.apiListClass.download_sample_contact, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
        responseType: "blob",
      })
      .pipe(
        tap((res: any) => {
          this.log(`download sample contact csv`);
          saveAs(
            new Blob([res], { type: "text/csv" }),
            "download_sample_contact.csv"
          );
        })
      );
  }

  // create an admin
  create_an_dataroom_admin(
    dataroomId: number,
    admin: any,
    custom_message: string,
  ): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.create_dataroom_admin +
        dataroomId +
        "/",
        { admin: admin, custom_msg: custom_message },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`edit index of root folder`);
        })
      );
  }

  getFileInfo(dataroomId: number, file_id: number): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.get_file_info + dataroomId + "/",
        { file_id: file_id },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`edit index of root folder`);
        })
      );
  }

  // get accusoft viewer
  accusoftviewer() {
    var url =
      "http://api.accusoft.com/v2/viewers/iframe?key=29S7J6hUteow1HLeNli-t7BnwXRKZ3xD9YUP8Zk6Jo7Qyf0zElwaUzEmXGTwtTv_&document=http://www.pdf995.com/samples/pdf.pdf";
    return this.http
      .get(url, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
        responseType: "text",
      })
      .pipe(
        tap((res: any) => {
          this.log(`edit index of root folder`);
        })
      );
  }

  // getAllAdmins
  getAllAdmins(dataroomId: number): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.create_dataroom_admin +
        dataroomId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  getALLLAUsers(dataroomId: number, group: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.add_dataroom_la_user_group +
        dataroomId +
        "/" +
        "?group_id=" +
        group,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  getALLEndUsers(dataroomId: number, group: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.all_end_users +
        dataroomId +
        "/" +
        "?group_id=" +
        group,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }
  //get_members_permission
  getMembersPermission(dataroomId: number): Observable<any> {
    if (dataroomId != null) {
      return this.http
        .get(
          this.baseUrl +
          this.apiListClass.get_members_permission +
          dataroomId +
          "/",
          {
            headers: new HttpHeaders().set(
              "Authorization",
              "token " + localStorage.getItem("token")
            ),
          }
        )
        .pipe(
          tap((res: any) => {
            this.log(`get all dataroom admins details `);
          })
        );
    } else {
      return of({});
    }
  }

  getGroupDetail(group: any) {
    console.log(group)
    return this.http
      .get(
        this.baseUrl + this.apiListClass.get_group_details + group +'/' ,{
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      ).pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  get_dataroom_features(dataroomId: number): Observable<any> {
    if (dataroomId != null) {
      return this.http
        .get(
          this.baseUrl +
          this.apiListClass.dataroom_features +
          dataroomId +
          "/",
          {
            headers: new HttpHeaders().set(
              "Authorization",
              "token " + localStorage.getItem("token")
            ),
          }
        )
        .pipe(
          tap((res: any) => {
            this.log(`get all dataroom admins details `);
          })
        );
    } else {
      return of({});
    }
  }


  // getLaUserAdmin
  getDataroomAllUsers(dataroomId: number): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_detaroom_all_users +
        dataroomId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all users list.`);
        })
      );
  }

  // getLaUserAdmin
  create_la_user_group(
    dataroomId: number,
    first_form_group: any
  ): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.create_dataroom_la_group +
        dataroomId +
        "/",
        first_form_group,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`edit index of root folder`);
        })
      );
  }

  // createLaUserGroup
  add_dataroom_la_user_group(
    pk: any,
    dataroomGroupId: number,
    add_dataroom_la_user_group: any,
    dataroom_state: any,
    custom_message: any
  ): Observable<any> {

    return this.http
      .post(
        this.baseUrl + this.apiListClass.add_dataroom_la_user_group + pk + "/",
        {
          group_id: dataroomGroupId,
          member: add_dataroom_la_user_group,
          dataroomstate: dataroom_state,
          custom_msg: custom_message
        },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`edit index of root folder`);
          // console.log(dataroom_state, "dataroom_state");
        })
      );
  }

  addEndUsers(
    pk: any,
    dataroomGroupId: number,
    add_dataroom_la_user_group: any,
    dataroom_state: any,
    custom_message: any
  ): Observable<any> {
    // console.log(pk, dataroomGroupId, add_dataroom_la_user_group, "List box");
    return this.http
      .post(
        this.baseUrl + this.apiListClass.all_end_users + pk + "/",
        {
          group_id: dataroomGroupId,
          member: add_dataroom_la_user_group,
          dataroomstate: dataroom_state,
          custom_msg: custom_message
        },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`edit index of root folder`);
          // console.log("Dataroom State", res, dataroom_state);
        })
      );
  }

  // get_all_enduser_groups
  getAllDataroomLaUserGroups(dataroomId: number) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.create_dataroom_enduser_group +
        dataroomId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  // getEndUserAdmin
  create_end_user_group(
    dataroomId: number,
    first_form_group: any
  ): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.create_dataroom_enduser_group +
        dataroomId +
        "/",
        first_form_group,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`edit index of root folder`);
        })
      );
  }

  // get_all_enduser_groups
  getAllDataroomEndUserGroups(dataroomId: number) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.create_dataroom_enduser_group +
        dataroomId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  // delete dataroom admin id

  //delete_dataroom_admin(admin_id)
  delete_dataroom_admin(admin_id: number) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.delete_dataroom_admins +
        admin_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  // get end user group information
  get_end_user_group_information(group_id: number) {
    // console.log("group id is:", group_id);

    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_end_user_group_information +
        group_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all end user group information`);
        })
      );
  }
  checkfirstpage(datroomid: any) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.get_check_first_page + datroomid + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          // console.log("check end user");
          this.log(`get all end user group information`);
        })
      );
  }

  // get firstname and last name using email id
  getFirstnameAndLastnameUsingEmail(values: string) {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.get_firstname_and_lastname_using_email,
        { email: values },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all end user group information`);
        })
      );
  }

  // get users and permission data
  get_users_and_permission_data(dataroom_id: number) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_users_and_permission_data +
        dataroom_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get users and permission`);
        })
      );
  }

  // delete end user group

  //delete_end_user_group
  delete_end_user_group(group_id: number) {
    return this.http
      .delete(
        this.baseUrl +
        this.apiListClass.get_end_user_group_information +
        group_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`delete end user group`);
        })
      );
  }

  // edit end user group information

  //edit_enduser_group_information
  edit_enduser_group_information(group: any) {
    return this.http
      .put(
        this.baseUrl +
        this.apiListClass.get_end_user_group_information +
        group.id +
        "/",
        { group },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`delete end user group`);
        })
      );
  }

  // update endusers and permission data
  // getStripePlans() {
  //   // remove user from local storage to log user out
  //   this.http
  //     .get(this.baseUrl + "get_stripe_products" + '/', {
  //       headers: new HttpHeaders().set("Authorization", this.token),
  //     })
  //     .pipe(
  //       tap((res: any) => {
  //         this.log(`delete end user group`);
  //       })
  //     );
  // }

    // getLaUserAdmin
    getStripePlans(): Observable<any> {
      return this.http
        .get(
          this.baseUrl +
          '/get_stripe_products' +
          "/",
          {
            headers: new HttpHeaders().set(
              "Authorization",
              "token " + localStorage.getItem("token")
            ),
          }
        )
        .pipe(
          tap((res: any) => {
            this.log(`get all users list.`);
          })
        );
    }
  
  update_endusers_and_permission_data(data: any) {
    return this.http
      .put(
        this.baseUrl +
        this.apiListClass.get_users_and_permission_data +
        data +
        "/",
        { is_users_and_permission: "True" },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`upoda `);
        })
      );
  }

  update_endusers_and_permission_data1(data: any) {
    return this.http
      .put(
        this.baseUrl +
        this.apiListClass.get_users_and_permission_data +
        data.dataroom_groups.id +
        "/",
        { data },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`upoda `);
        })
      );
  }

  getAllNotViewFiles(dataroom_id: number, type: any) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_all_not_viewed_files +
        dataroom_id +
        "/?type=" +
        type,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get users and permission`);
        })
      );
  }



  getAllFavourites(dataroom_id: number, page: any) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.favourite_all_selected_files +
        dataroom_id +
        "/?page=" +
        page,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get users and permission`);
        })
      );
  }


  getAllRedactPdf(fileId: number) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_list_redacted_pdf +
        fileId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get users and permission`);
        })
      );
  }


  getAllNotPrintedFiles(dataroom_id: number, type: any) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_all_not_printed_files +
        dataroom_id +
        "/?type=" +
        type,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get users and permission`);
        })
      );
  }

  getAllNotDownloadFiles(dataroom_id: number, type: any) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_all_not_downloaded +
        dataroom_id +
        "/?type=" +
        type,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get users and permission`);
        })
      );
  }

  getFilesUpdated(dataroom_id: number, type: string) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_files_updated +
        dataroom_id +
        "/?type=" +
        type,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get users and permission`);
        })
      );
  }

  getFoldersHierarchy(dataroom_id: number) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.folders_hierarchy + dataroom_id + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get users and permission`);
        })
      );
  }

  getFoldersTree(dataroom_id: number, parent: number) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.folders_tree +
        dataroom_id +
        "/" +
        parent +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`folders_tree `);
          // console.log("folders_tree", res.dataroomaccesscheck);
          if (res.dataroomaccesscheck !== undefined) {
            if (res.dataroomaccesscheck == "noaccess") {
              this.router.navigate(["../dashboard"]);
            }
          }
        }),

        catchError(this.handleError<any>("get single dataroom"))
      );
  }

  getFoldersHierarchyPermission(dataroom_id: number, group_id: any, parent: number) {
    if (dataroom_id != null || dataroom_id != undefined) {

      return this.http
        .get(
          this.baseUrl +
          this.apiListClass.folders_hierarchy_permissionnew +
          dataroom_id +
          "/?group_id=" +
          group_id +
          "&folder_id=" +
          parent,
          {
            headers: new HttpHeaders().set(
              "Authorization",
              "token " + localStorage.getItem("token")
            ),
          }
        )
        .pipe(
          tap((res: any) => {
            this.log(`get users and permission`);
          })
        );

    } else {
      return of({});
    }

  }

  getFoldersHierarchyPath(dataroom_id: number, parent: number) {
    return this.http
      .get(
        this.baseUrl +
        "/folders_hierarchy_path/" +
        dataroom_id +
        "/?folder_id=" +
        parent,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get users and permission`);
        })
      );
  }

  getFolderSpecificPermission(dataroomid: any, folder_id: any, group_id: any) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.folders_hierarchy_permissionnew + dataroomid + `/?group_id=${group_id}&folder_id=${folder_id}`,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
    // .pipe(
    //   tap((res: any) => {
    //     this.log(`get all dataroom admins details `);
    //   })
    // );
  }

  getUploadStatusDocuments(dataroom_id: number, pagenumber: any) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_all_upload_status_documents +
        dataroom_id +
        "/?page=" +
        pagenumber,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get users and permission`);
        })
      );
  }
  getDownloadFilestest(file_id: any, type: any, flag: any): Observable<Blob> {
    // console.log(
    //   this.baseUrl +
    //   this.apiListClass.download_files +
    //   file_id +
    //   "/?laadminadminpdf=" +
    //   flag +
    //   "&type=" +
    //   type
    // );
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.download_files +
        file_id +
        "?laadminadminpdf=" +
        flag +
        "&type=" +
        type,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          // console.log(`get download Filess`);
        })
      );
  }


  
  bulkDownloadCount(statusId: any, data: any): Observable<any> {
    // console.log(data, "bulk download");
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.bulkDownloadfilecount +
        statusId +
        "/",
        JSON.stringify(data),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          // console.log(response, "what is this actually ");
          return response;
        })
      );
  }



  createCheckoutSession(data: any): Observable<any> {
    // console.log(data, "bulk download");
    return this.http
      .post(
        this.baseUrl +
        '/create-checkout-session/' ,
        JSON.stringify(data),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          // console.log(response, "what is this actually ");
          return response;
        })
      );
  }

  bulkDownloadget(dataroom_id: any): Observable<Blob> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.bulk_download +
        dataroom_id +
        "/?start=true/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
          responseType: "blob",
        }
      )
      .pipe(
        tap((res: any) => {
          // console.log(`get download Filess`);
        })
      );
  }

  bulkDownloadStatus(dataroomId: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.bulkdownloadstatuscreate + dataroomId + '/',
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          // console.log(response, "what is this actually ");
          return response;
        })
      );
  }

  bulkDownloadPost(data: any): Observable<any> {
    // console.log(data, "bulk download");
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.bulk_download +
        localStorage.getItem("currentDataroomId") +
        "/",
        JSON.stringify(data),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          // console.log(response, "what is this actually ");
          return response;
        })
      );
  }

  
  getDownloadFiles(file_id, type): Observable<Blob> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.download_files +
        file_id +
        "/?type=" +
        type,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          // console.log(`get download Filess`);
        })
      );
  }
  getShortcutFiles(file_id: any, type: any): Observable<any> {
    // console.log(type, "docu type");
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.short_cut_icon +
        file_id +
        "/?type=" +
        type,
        {},
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get download Filess`);
        })
      );
  }


  bulkDownload(data, filecount?): Observable<any> {
    console.log(filecount, "bulk download");
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.bulk_downloadtwo +
        filecount +
        "/",
        JSON.stringify(data),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: Response) => {
          // console.log(response, "what is this actually ");
          return response;
        })
      );
  }

  bulkDownloadRedact(data: any, filecount: any): Observable<any> {
    console.log(filecount, "bulk download");
    return this.http
      .post(
        this.baseUrl +
        "/redact_bulk_download/" +
        filecount +
        "/",
        JSON.stringify(data),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          // console.log(response, "what is this actually ");
          return response;
        })
      );
  }



  bulkDownloadDrm(data: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.bulk_downloaddrm +
        localStorage.getItem("currentDataroomId") +
        "/",
        JSON.stringify(data),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          // console.log(response, "what is this actually drm ");
          return response;
        })
      );
  }




  /* Get Reports */

  GetUserGroups(group_id: any, dataroom_id: any, removed: any, page: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_user_groups +
        dataroom_id +
        "/?group=" +
        group_id +
        "&removed=" +
        removed +
        "&page=" +
        page,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  /* Get Reports */

  GetUserDataroomLastView(dataroom_id: any, user_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_user_dataroom_last_view +
        dataroom_id +
        "/" +
        user_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }



  ExportUsersGroups(group_id: any, dataroom_id: any, removed: any, statusId: any) {
    return this.http
      .post(
        this.baseUrl +
        "/export_users_groups/" +
        dataroom_id +
        "/?group=" +
        group_id +
        "&removed=" +
        removed,
        JSON.stringify(statusId),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          // console.log(response, "what is this actually ");
          return response;
        })
      );
  }

  GetUsersStatus(dataroom_id: any, from_date: any, to_date: any, type: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_users_status +
        dataroom_id +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date +
        "&type=" +
        type,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  /** Return distinct message for sent, upload progress, & response events */
  // private getEventMessage(event: HttpEvent<any>, file: File) {
  //   switch (event.type) {
  //     case HttpEventType.Sent:
  //       return `Uploading file "${file.name}" of size ${file.size}.`;

  //     case HttpEventType.UploadProgress:
  //       // Compute and show the % done:
  //       const percentDone = Math.round((100 * event.loaded) / event.total);
  //       // console.log("File is " + percentDone + "% uploaded.");
  //       return `File "${file.name}" is ${percentDone}% uploaded.`;

  //     case HttpEventType.Response:
  //       // console.log("File was completely uploaded!.");
  //       return `File "${file.name}" was completely uploaded!`;

  //     default:
  //       return `File "${file.name}" surprising upload event: ${event.type}.`;
  //   }
  // }

  uploadFile(formData: any, folder_id: any, notify: any) {
    // console.log(formData, "form entry");
    console.warn("upload file is called ", formData)
    const req = new HttpRequest(
      "POST",
      this.baseUrl +
      this.apiListClass.upload_file_inside_folder +
      folder_id +
      "/?notify=" +
      notify,
      formData,
      {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
        responseType: "blob",
        reportProgress: true,
      }
    );
    return this.http.request(req).pipe(
      // map(event => this.getEventMessage(event, formData)),
      tap((res: any) => {
        this.log(`get dataroom usage details `);
      })
    );
  }

  uploadFiles(formData: any, folder_id: any, notify: any) {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.upload_file_inside_folder +
        folder_id +
        "/?notify=" +
        notify,
        formData,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
          responseType: "blob",
          reportProgress: true,
        }
      )
      .pipe(
        tap(() => {
          this.log(`get dataroom usage details `);
        }),
        catchError(this.handleError("getUser", []))
      );
  }
  ExportUsersStatus(dataroomId: any, from_date: any, to_date: any, statusId: any) {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.export_users_status +
        dataroomId +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date,
        JSON.stringify(statusId),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  GetActivityByFile(
    from_date: any,
    to_date: any,
    deleted_files: any,
    dataroom_id: any
  ): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.activity_by_date +
        dataroom_id +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date +
        "&deleted=" +
        deleted_files,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  GetActivityByDate(
    from_date: any,
    to_date: any,
    deleted_files: any,
    dataroom_id: any
  ): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.activity_by_date_report +
        dataroom_id +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date +
        "&deleted=" +
        deleted_files,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  GetActivityByDateExport(dataroomId: any, from_date: any, to_date: any, statusId: any) {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.export_activity_by_date_report +
        dataroomId +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date,
        JSON.stringify(statusId),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  GetIndexReports(dataroom_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.get_index_report + dataroom_id + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  DeleteIndexReports(index_id: any): Observable<any> {
    return this.http
      .delete(
        this.baseUrl + this.apiListClass.get_index_report + index_id + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  // copy_file
  copyFile(folder_id: any, file_id: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.copy_file,
        { folder_id: folder_id, file_id: file_id },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          console.log("result is:",);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  copySelectedFile(folder_id: any, selected_files: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.copy_selected_files + folder_id + "/",
        selected_files,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  // move_file
  moveFile(folder_id: any, file_id: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.move_file,
        { folder_id: folder_id, file_id: file_id },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  moveSelectedFile(folder_id: any, selected_files: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.move_selected_files + folder_id + "/",
        selected_files,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => {
          this.log(`create `);
          // console.log("result is:", res);
        }),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  GetAllFilesViewed(index_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.get_all_files_viewed + index_id + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((users: any) => {
          this.log(`get_all_files_viewed `);
          // console.log("get_all_files_viewed", users.dataroomaccesscheck);
          if (users.dataroomaccesscheck !== undefined) {
            if (users.dataroomaccesscheck == "noaccess") {
              this.router.navigate(["../dashboard"]);
            }
          }
        }),

        catchError(this.handleError<any>("get all files dataroom"))
      );
  }

  GetAllFilesPrinted(index_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.get_all_files_printed + index_id + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((users: any) => {
          this.log(`get_all_files_printed `);
          // console.log("get_all_files_printed", users.dataroomaccesscheck);
          if (users.dataroomaccesscheck !== undefined) {
            if (users.dataroomaccesscheck == "noaccess") {
              this.router.navigate(["../dashboard"]);
            }
          }
        }),

        catchError(this.handleError("getUser", []))
      );
  }

  //delete_dataroom_all_admin(admin_id)
  delete_dataroom_all_admin(values: any) {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.delete_dataroom_all_admins,
        { values: values },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  //  console donwload log
  bulkDownloadLog(statusId: any, filename: any): Observable<Blob> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.bulkdownload_reportlog +
        statusId +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
          responseType: "blob",
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get dataroom usage details `);
          saveAs(
            new Blob([res], { type: "text/csv" }),
            "" + filename + ".csv"
          );
          // console.log(res, "index report");
        })
      );
  }

  // Download Permission check method
  downloadPermissionCheck(statusid: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.bulkdownloadpermission + statusid + '/',
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: any) => {
          // console.log(response, "what is this actually ");
          return response;
        })
      );
  }

  GetAllFilesDownloaded(index_id: any, from_date: any, to_date: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_all_files_download +
        index_id +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((users: any) => {
          this.log(`get_all_files_download `);
          // console.log("get_all_files_download", users.dataroomaccesscheck);
          if (users.dataroomaccesscheck !== undefined) {
            if (users.dataroomaccesscheck == "noaccess") {
              this.router.navigate(["../dashboard"]);
            }
          }
        }),
        catchError(this.handleError("getUser", []))
      );
  }

  GetAllDataroomView(dataroom_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_dataroom_viewed +
        dataroom_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  GetBarchartDataroomView(dataroom_id: any, from_date: any, to_date: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_barchart_dataroom_viewed +
        dataroom_id +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  /* End */

  /** Services for Question and Answer calling Api **/
  GetQnaReport(dataroom_id: any, from_date: any, to_date: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.qna_report +
        dataroom_id +
        "/?from_date=" +
        from_date +
        "&to_date=" +
        to_date,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  //edit_enduser_group_information
  UpdatedMember(member: any) {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.dataroom_enduser_submitter,
        { member },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`delete end user group`);
        })
      );
  }

  GetQna(dataroom_id: any): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.qna_view + dataroom_id + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  logout_data() {
    if (localStorage.getItem("token")) {
      return this.http
        .get(this.baseUrl + this.apiListClass.logout + "?login_id=" + localStorage.getItem("login_id") + "&token=" + localStorage.getItem("token"), {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }).toPromise().then(response => {

          localStorage.clear();


          this.router.navigate(['/login']);
          setTimeout(window.location.reload.bind(window.location), 1000);

          return Promise.resolve(response);
        })
    } else {
      console.log('you are logged out!')
    }


  }

  GetFaq(dataroom_id: any): Observable<any> {
    return this.http
      .get(this.baseUrl + "/add_or_remove_faq/" + dataroom_id + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  postRequest(item: any, dataroom_id: any): Observable<any> {
    // console.log(item, "sending on post api");
    return this.http
      .post(
        this.baseUrl + "/add_or_remove_faq/" + dataroom_id + "/",
        JSON.stringify(item),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        tap((res: any) => this.log(`ok`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }


  GetQnaDetails(question_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.qna_view_detail + question_id + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  getUserQnaDetails(question_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.user_qna_details + question_id + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  createQna(dataroom_id: any, qna: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.qna_view + dataroom_id + "/",
        qna,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  commentDetail(questionId: number, qna: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.qa_view + questionId + "/", qna, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  getAllReplyList(question_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.get_reqply_list + question_id + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );
  }

  acceptFinalInfo(questionId: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.apiListClass.accept_question, questionId, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }
  /** End **/

  getEndUserGroup(dataroom_id: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.get_end_user_groups +
        dataroom_id +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap(() => this.log(`fetched end users groups`)),
        catchError(this.handleError("getUser", []))
      );
  }

  addDataroomPrimaryContact(
    dataroom_id: any,
    primary_list: any
  ): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        this.apiListClass.add_dataroom_primary_contact +
        dataroom_id +
        "/",
        primary_list,

        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  send_question1(question_id: number): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.send_question + question_id + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  reg_question1(question_id: number): Observable<any> {
    return this.http
      .get(this.baseUrl + this.apiListClass.reg_question + question_id + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => this.log(`updated user id=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  getDataroomContact(dataroom_id: number): Observable<any> {
    if (dataroom_id != null || dataroom_id != undefined) {
      return this.http
        .get(
          this.baseUrl +
          this.apiListClass.get_dataroon_contact +
          dataroom_id +
          "/",
          {
            headers: new HttpHeaders().set(
              "Authorization",
              "token " + localStorage.getItem("token")
            ),
          }
        )
        .pipe(
          tap(() => this.log(`fetched users`)),
          catchError(this.handleError("getUser", []))
        );
    } else {
      return of({});
    }

  }

  //delete_dataroom_admin(admin_id)
  manage_dataroom_category(dataroom_id: number, data: any) {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.manage_category + dataroom_id + "/",
        { update: data },
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  // Send Document Update
  sendDocumentUpdate(folder_id: number) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.send_document_update + folder_id + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  ////////////Question Answer Analytics//////////////////
  QNAAnalytics(dataroom_id: number) {
    return this.http
      .get(this.baseUrl + this.apiListClass.qna_analytics + dataroom_id + "/", {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  QNAFilterView(dataroom_id: number, category: any) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.qna_filter_view +
        dataroom_id +
        "/" +
        category +
        "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  postWatermarkingSettings(dataroomId: number, watermarkingForm: any) {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.watermark_settings + dataroomId + "/",
        watermarkingForm,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
          // console.log("1");
        })
      );
  }

  getWatermarkingSettings(dataroomId: number) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.watermark_settings + dataroomId + "/",
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
          // console.log("2");
        })
      );
  }

  getSearchAutoCompleteUser(key: any) {
    return this.http
      .get(
        this.baseUrl +
        this.apiListClass.search_auto_complete_user +
        "?key=" +
        key,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
        })
      );
  }

  handleNotificationStatus(data: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.notificationStatus,
        data,
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        tap((res: any) => this.log(`notification response=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }


  set_2fa_permission(dataroomId: any, data: any): Observable<any> {
    return this.http
      .post(
        this.baseUrl + this.apiListClass.set_2fa_permission + dataroomId + "/",
        data,
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        tap((res: any) => this.log(`notification response=${res}`)),
        catchError(this.handleError<any>("updateUser"))
      );
  }

  getInvoiceHistory(id: any) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.invoiceHistory + id + '/',
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      ).toPromise().then(response => {
        return response;
      })
  }

  getDvdInvoiceHistory(id: any) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.dvdInvoiceHistory + id + '/',
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      ).toPromise().then(response => {
        return response;
      })
  }

  downloadInvoice(id: any) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.exportInvoice + id + '/',
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
          responseType: 'blob'
        }
      )
      .pipe(
        tap((res: any) => {
          // console.log(`get download Filess`);
        })
      );
  }

  downloadAddOnDvdInvoice(id: any) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.exportAddOnDvdInvoice + id + '/',
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
          responseType: 'blob'
        }
      )
      .pipe(
        tap((res: any) => {
          // console.log(`get download Filess`);
        })
      );
  }

  downloadStorageAddOnInvoice(id: any) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.exportAddOnStorageInvoice + id + '/',
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
          responseType: 'blob'
        }
      )
      .pipe(
        tap((res: any) => {
          // console.log(`get download Filess`);
        })
      );
  }

  cancelUploading(bulkUploadId): Observable<any> {
    return this.http
      .post(
        this.baseUrl +
        "/cancel_uploding/",
        JSON.stringify({ bulkUploadId: bulkUploadId }),
        {
          headers: new HttpHeaders()
            .set("Authorization", "token " + localStorage.getItem("token"))
            .set("Content-Type", "application/json"),
        }
      )
      .pipe(
        map((response: Response) => {
          return response;
        })
      );
  }


  getUploadStatusId(dataroomId: any) {
    console.log(dataroomId)
    return this.http
      .get(
        this.baseUrl + this.apiListClass.bulUploadStatus + dataroomId + '/',
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      ).toPromise().then(response => {
        return response;
      })

  }

  CheckUploadRestriction(folderid:any,dataroomId: any) {
    return this.http
      .get(
        this.baseUrl + this.apiListClass.upload_end_user_timer_check + dataroomId +'/' +  folderid + '/',
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      ).pipe(
        tap((users: any) => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );

  }

  getFilelink(fileid: any): Observable<any> {
    return this.http
      .get(this.baseUrl + '/redacte_pdf/' + fileid + '/', {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((users: any) => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );

  }


  getRedactFilelink(fileid: any): Observable<any> {
    return this.http
      .get(this.baseUrl + '/get_single_redacted_pdf/' + fileid + '/', {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((users: any) => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );

  }

  setCurrentVersion(fileid: any): Observable<any> {
    return this.http
      .post(this.baseUrl + '/get_single_redacted_pdf/' + fileid + "/", null, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((users: any) => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );

  }

  removeCurrentVersion(fileid: any): Observable<any> {
    return this.http
      .post(this.baseUrl + '/remove_current_redacted_pdf/' + fileid + "/", null, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      })
      .pipe(
        tap((users: any) => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );

  }

  redact_single_downlaod(fileid: any): Observable<any> {
    return this.http
      .post(this.baseUrl + '/redact_single_downlaod/' + fileid + "/", null, {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
        responseType: "blob",
      })
      .pipe(
        tap((users: any) => this.log(`fetched users`)),
        catchError(this.handleError("getUser", []))
      );

  }

  updateWatermarkingSettings(watermarkingForm: any) {
    return this.http
      .put(
        this.baseUrl + this.apiListClass.update_watermark_settings,
        watermarkingForm,
        {
          headers: new HttpHeaders().set(
            "Authorization",
            "token " + localStorage.getItem("token")
          ),
        }
      )
      .pipe(
        tap((res: any) => {
          this.log(`get all dataroom admins details `);
          // console.log("3");
        })
      );
  } ////////////////////END//////////////////////////////
  // getDataroomContact(dataroom_id): Observable<any> {
  //     return this.http.get(this.baseUrl+this.apiListClass.get_dataroon_contact+dataroom_id+"/",  {
  //     headers: new HttpHeaders().set('Authorization', "token " + localStorage.getItem("token")),
  //   })
  //     .pipe(
  //       tap(users => this.log(`fetched end users groups`)),
  //       catchError(this.handleError('getUser', []))
  //     );
  // }

  /** get token **/
  getHeaders(): Headers {
    let headers = new Headers();
    let token = "token " + localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", "token " + localStorage.getItem("token"));
    }
    return headers;
  }
  /** End of token **/

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      if (error.status === 401) {
        this.router.navigate([""]);
        localStorage.clear();
      }
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    //this.messageService.add('HeroService: ' + message);
  }


}
