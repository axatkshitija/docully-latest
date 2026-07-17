export class BaseUrlClass {

	public baseUrl: string;
	public frontend_url: string;
	public subscriptionUrl: string;
	public website_url: string;
	maintanace_web: boolean = true;
	constructor() {

		this.baseUrl = 'https://services.docullyvdr.com/projectName';
		//this.baseUrl = 'http://20.204.117.208:8080/projectName';
		this.subscriptionUrl = 'https://services.docullyvdr.com/projectName';
		this.frontend_url = 'https://services.docullyvdr.com';
		this.website_url = 'https://services.docullyvdr.com';
	}
}
