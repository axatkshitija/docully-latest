import { Component, OnInit } from '@angular/core';
import { DataRoomService } from '../../services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseUrlClass, ApiListClass } from '../../common/index';
import { DomSanitizer } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-view-update-doc',
  templateUrl: './view-update-doc.component.html',
  styleUrls: ['./view-update-doc.component.css']
})
export class ViewUpdateDocComponent implements OnInit {
	currentDataroomId : any ;
	id :any;
  	constructor(private dataRoomService :DataRoomService,
  				private router : Router, 
  				private domSanitizer: DomSanitizer,
  				private baseUrlClass : BaseUrlClass, 
				  private cookieService:CookieService,
    			private route: ActivatedRoute) {
  		this.currentDataroomId = parseInt(localStorage.getItem("currentDataroomId"));
  		this.route.params.subscribe(params => {
  			
          	console.log("dataroom id is--- call from overview compomemt");
          	console.log(params.id);
          	this.id = params.id;
          	this.getRecentUpdate(this.id);
          	
        });
  	}

	ngOnInit() {

	}

updates:any;
url:any;
	getRecentUpdate(id){
		this.dataRoomService.get_recent_update_api(id)
		.subscribe((res)=>{
			this.updates = res;
			this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(this.baseUrlClass.baseUrl+this.updates.document)
			
		})
	}

  	dataroom_users_list : any;
	getAllUsers(){
	  this.dataRoomService.getDataroomAllUsers(this.currentDataroomId)
	  .subscribe((res)=>{
	    
	    this.dataroom_users_list = res;
	    console.log("View Update Doc Dataroom Id:---" , this.currentDataroomId, this.dataroom_users_list);
	    })
	}
}
