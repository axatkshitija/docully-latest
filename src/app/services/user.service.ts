
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BaseUrlClass, ApiListClass } from '../common/index';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string;
  private token: string | null;

  constructor(
    private http: HttpClient,
    private baseUrlClass: BaseUrlClass,
    private apiList: ApiListClass
  ) {
    this.baseUrl = this.baseUrlClass.baseUrl;
    this.token = localStorage.getItem('token');
  }

  checkEmailExistOrNot(email: string) {
    console.log('User email:', email);

    return this.http.post(
      this.baseUrl + this.apiList.is_email_exist,
      { email: email }
    );
  }
}
