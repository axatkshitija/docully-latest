import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
// import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { BaseUrlClass, ApiListClass } from "../common/index";
// import { RequestOptions, ResponseContentType } from "@angular/http";
import {

  HttpClient,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";

//import { plan } from "../models/user";

@Injectable()
export class AuthenticationService {
  private base_url: string;
  private token: string;
  userMail: any;
  constructor(
    private http: HttpClient,
    private base: BaseUrlClass,
    private apiListClass: ApiListClass,
    private router: Router,
    private httpget: HttpClient,
  ) {
    this.base_url = base.baseUrl;
    this.token = "token " + localStorage.getItem("token");
  }

  activeSession(username: string) {
    return this.http
      .post(
        this.base_url + '/user_active/',
        JSON.stringify({ email: username })
      )
      .pipe(
        map((response: any) => {
          // console.log(response)
          let res = response;
          // console.log(res)
          localStorage.setItem("sactive", res.msg);
          return response;
        })
      );
  }


  captcha() {
    return this.http
      .get(
        this.base_url + '/captcha/'
      )

  }
  login(username: string, password: string) {
    return this.http
      .post(
        this.base_url + this.apiListClass.login,
        JSON.stringify({ username: username, password: password})
      )
      .pipe(
        map((response: any) => {
          console.log(response)
          // login successful if there's a jwt token in the response
          let token = response;
          if (token.token) {
            localStorage.setItem("token", token.token);
            localStorage.setItem("user", JSON.stringify(token.user));

            localStorage.setItem("currentUser", JSON.stringify(token.user))
            localStorage.setItem("login_id", JSON.stringify(token.login_id))

          }
          return token;
        })
      );
  }




  // checkExisitingUser(email: string, captcha: string) {
  //   return this.http
  //     .post(
  //       this.base_url + "/registeremailcheck/",
  //       JSON.stringify({ email: email })
  //     )
  //     .pipe(
  //       map((response: any) => {
  //         return response
  //       })
  //     );
  // }

  checkExisitingUser(data): Observable<any> {
    console.log(data);
    this.userMail = data;
    return this.httpget.get(
      this.base_url + "/registeremailcheck/" +
      "?email=" +
      data
    );
    // return
  }

  mainSubscriber(data: any): Observable<any> {
    return this.httpget.post(
      this.base_url + "/register/",
      data
    );
  }

  setUserMail(data: any) {
    this.userMail = data;
  }


  getUserMail() {
    console.log(this.userMail)
    return this.userMail;
  }


  getUserSelectedplan(userplanselectedid: any): Observable<any> {
    return this.httpget.get(
      this.base_url + "/GetPlanForBilling/" + userplanselectedid + "/", {
      headers: new HttpHeaders({
        Authorization: "token " + localStorage.getItem("token"),
      }),
    }
    );
  }

  formdetails() {
    return this.httpget.get(this.base_url + '/userbiilingdetails/',
      {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      }).toPromise().then(res => {
        console.log(res)
        return res;
      })
  }


  getSinglePlanDetails(planitem: any): Observable<any> {
    return this.httpget.get(
      this.base_url + "/GetSinglePlan/" + planitem + "/"

    );
  }




  getisactive() {
    return this.httpget.get(this.base_url + '/is_active/',
      {
        headers: new HttpHeaders().set(
          "Authorization",
          "token " + localStorage.getItem("token")
        ),
      }).toPromise().then(res => {
        console.log(res)
        return res;
      })
  }


  getPlanDetails(): Observable<any> {
    return this.httpget.get(
      this.base_url + "/plan_details/"
      //"http://20.193.245.169:8080/projectName/plan_details/"
    );
  }

  forgot(user: string) {
    console.log("user is:",user);
    return this.http.post(this.base_url+this.apiListClass.forgot, JSON.stringify({ user: user})).pipe(
      map((response: any) => response));
}


  maintainsubscriptionsession(data: any): Observable<any> {
    return this.httpget.post(
      this.base_url + "/MaintainPlanSession/",
      data,

      {
        headers: new HttpHeaders({
          Authorization: "token " + localStorage.getItem("token"),
        }),
      }
    );
  }


  updateUser(data: any): Observable<any> {
    //alert(data.id);
    return this.httpget.patch(
      this.base_url + "user/" + data.id + "/update",
      data
    );
  }

  buyNewPlan(data: any): Observable<any> {
    return this.httpget.post(
      this.base_url + "buy/newplan",
      data
    );
  }

  modifyPlan(data: any): Observable<any> {
    return this.httpget.post(
      this.base_url + "plan/modify",
      data
    );
  }

  buyPlan(data: any, team_id: any): Observable<any> {
    return this.httpget.patch(
      this.base_url + "buy/" + team_id + "/plan",
      data
    );
  }


  createTeam(data: any): Observable<any> {
    return this.httpget.post(
      this.base_url + "create_team/",
      data
    );
  }

  plansubscription(data: any): Observable<any> {
    console.log(data, "plan subscription");
    return this.httpget.post(
      this.base_url + "/plan_subscription/",
      //"http://20.193.245.169:8080/projectName/plan_subscription/",
      data,

      {
        headers: new HttpHeaders({
          Authorization: "token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  zohosubscription(): Observable<any> {


    const params = new HttpParams({
      fromObject: {
        refresh_token: '1000.6ff64f5c33f604d0969683ed84701772.28ac1ba0255435b0f3c3faadf928362a',
        client_id: "1000.ST9XGX4LSA0JI9WDZN9BMA3QY4WS1M",
        client_secret: "313a88810dd3ab38bbd42088ee24d43a7c86313d3e",
        redirect_uri: 'https%3A%2F%2Fservices.docullyvdr.com',
        grant_type: 'refresh_token'
      }
    });

    const httpOptions = {
      headers: new HttpHeaders({
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-XSS-Protection": "1",
        "Accept": "*/*"

      })
    };

    return this.httpget.post(
      "https://accounts.zoho.com/oauth/v2/token", params, httpOptions,
    );
  }

  

  logout() {
    // remove user from local storage to log user out
    this.httpget
      .get(this.base_url + "logout", {
        headers: new HttpHeaders().set("Authorization", this.token),
      })
      .pipe();
  }
}
