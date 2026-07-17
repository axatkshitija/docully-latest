// import { Injectable } from "@angular/core";
// import { HttpClient } from "@angular/common/http";
// import { DataRoomService } from "../services/index";
// import { Component, OnInit, ViewEncapsulation, Input } from "@angular/core";
// import {
//   HttpEvent,
//   HttpEventType,
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest,
//   HttpResponse,
//   HttpHeaders,
// } from "@angular/common/http";

// //import { Http, Headers, RequestOptions, Response, ResponseContentType  } from '@angular/http';

// import { Observable, of } from "rxjs";
// import { catchError, map, tap } from "rxjs/operators";
// import { Router, ActivatedRoute } from "@angular/router";

// import { User } from "../models/user";
// import { BaseUrlClass, ApiListClass } from "../common/index";

// @Injectable()
// export class ApiService {
//   constructor(
//     private dataRoomService: DataRoomService,
//     private http: HttpClient,
//     private baseUrlClass: BaseUrlClass,
//     private router: Router,
//     private baseUrl = "",
//     private apiListClass: ApiListClass
//   ) {
//     this.baseUrl = this.baseUrlClass.baseUrl;
//     //"token " + localStorage.getItem("token") = "token " + localStorage.getItem("token");
//   }
//   ngOnInit() {
//     this.getUserInfo();
//   }

//   user_details: any;
//   user: any;
//   getUserInfo() {
//     this.dataRoomService.getUserProfile().subscribe((res) => {
//       this.user = res;
//       console.log(this.user, "user Message");

//       this.getAllMessage();
//     });
//   }

//   all_message: any;
//   getAllMessage() {
//     return this.http
//       .get(this.baseUrl + this.apiListClass.send_message + this.user.id + "/", {
//         headers: new HttpHeaders().set(
//           "Authorization",
//           "token " + localStorage.getItem("token")
//         ),
//       })
//       .pipe(
//         tap((res: any) => {
//           console.log("getAllMessage");
//           // this.log(`get all dataroom admins details `);
//         })
//       );
//   }
// }
