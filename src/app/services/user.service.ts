
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { BaseUrlClass, ApiListClass } from '../common/index';

@Injectable()
export class UserService {
    private baseUrl : string;
    private token : any;
    constructor(private http: Http, private baseUrlClass: BaseUrlClass, private apiList: ApiListClass ) {
        this.baseUrl = baseUrlClass.baseUrl;
        this.token =  localStorage.getItem('token');

    }

    
    checkEmailExistOrNot(email: any){
      console.log("user is:",email);
      return this.http.post(this.baseUrl+this.apiList.is_email_exist, JSON.stringify({ email: email  })).pipe(
        map((response: Response) => response.json()));

    }
}