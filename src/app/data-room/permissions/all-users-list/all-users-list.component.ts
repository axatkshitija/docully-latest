import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators , FormBuilder} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataRoomService } from '../../../services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { Folder } from '../../../models/folder';

import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-all-users-list',
  templateUrl: './all-users-list.component.html',
  styleUrls: ['./all-users-list.component.css']
})
export class AllUsersListComponent implements OnInit {
  	currentDataroomId : any ;

  	constructor(private toastr: ToastrService, private dataRoomService : DataRoomService , 
    	private _formBuilder : FormBuilder, private dialog : MatDialog, 
		private cookieService:CookieService,
    	private router : Router, private location : Location){
    	this.currentDataroomId =localStorage.getItem("currentDataroomId");
    }

  	ngOnInit() {
  		this.getAllUsers();
      
  	}

	dataroom_users_list : any;
	getAllUsers(){
	  this.dataRoomService.getDataroomAllUsers(this.currentDataroomId)
	  .subscribe((res)=>{
	    this.dataroom_users_list = res;
	    console.log("Dataroom Id:---" , this.currentDataroomId, this.dataroom_users_list);
	    })

	}

  goBack(){
    this.location.back();
  }
  

}
