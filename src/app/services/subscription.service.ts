import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
// import { Http, Headers, Response } from '@angular/http';
import { Observable, of } from 'rxjs';

import { BaseUrlClass, ApiListClass } from '../common/index';
// import { RequestOptions, ResponseContentType } from '@angular/http';
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})
export class SubscriptionService {

	private base_url: string;

	constructor(private http: HttpClient, private base: BaseUrlClass, private apiListClass: ApiListClass, private httpget: HttpClient) {

		this.base_url = this.base.subscriptionUrl;
	}


	getSubscriptionList(user_id:any): Observable<any> {
		console.log(this.base_url);
		return this.http.get(this.base_url + '/get/' + user_id + '/userplan')
			.pipe(
				tap(() => this.log(`fetched subscription`)),
				catchError(this.handleError('getSubscription', []))
			);
	}

	getSubscription_new(subscription_id:any): Observable<any> {

		return this.http.get(this.base_url + '/userplandetails_new/' + subscription_id, {
			headers: new HttpHeaders().set(
				"Authorization",
				"token " + localStorage.getItem("token")
			),
		}).pipe(

			tap(() => this.log(`Fetch Signle subscription`)),
			catchError(this.handleError('getSubscription', []))
		)
	}

	getSubscription(subscription_id:any): Observable<any> {

		return this.http.get(this.base_url + '/userplandetails/' + subscription_id , {
			headers: new HttpHeaders().set(
				"Authorization",
				"token " + localStorage.getItem("token")
			),
		}).pipe(

			tap(() => this.log(`Fetch Signle subscription`)),
			catchError(this.handleError('getSubscription', []))
		)
	}




	changeStatus(planId:any): Observable<any> {
		return this.http.get(this.base_url + this.apiListClass.subscribe_plan_status + planId).pipe(
			tap(() => this.log(`Set Status`)),
			catchError(this.handleError(`Change Plan Status`, []))
		)
	}

	getAddOn(): Observable<any> {
		return this.http.get(this.base_url + this.apiListClass.add_on).pipe(
			tap(() => this.log(`Get Addon`)),
			catchError(this.handleError(`Get Add On`, []))
		)
	}

	getToken(id:any): Observable<any> {
		return this.http.patch(this.base_url + '/plan/' + id + '/token', {}).pipe(
			tap(() => this.log(`Get Addon`)),
			catchError(this.handleError(`Get Add On`, []))
		)
	}

	cancelOnExpiry(team_id:any, plan_id:any): Observable<any> {
		return this.http.post(this.base_url + '/cancel/' + team_id + '/expiry', {
			plan_id: plan_id
		}).pipe(
			tap(() => this.log(`Get Addon`)),
			catchError(this.handleError(`Get Add On`, []))
		)
	}

	updateAddOn(data:any): Observable<any> {
		return this.http.post(this.base_url + this.apiListClass.subscribeAddOn, data).pipe(
			tap(() => this.log(`Set Addon`)),
			catchError(this.handleError(`Aet Add On`, []))
		)
	}

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

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
