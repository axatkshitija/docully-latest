import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { DataRoomService } from '../services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseUrlClass, ApiListClass } from '../common/index';


	@Component({
	  selector: 'app-messages',
	  templateUrl: './messages.component.html',
	  styleUrls: ['./messages.component.css']
	})
	export class MessagesComponent implements OnInit {
		@Input('user')
		user : any;
		all_message: any;
	  	msg: string;
		currentDataroomId : any ;
		_base_url : string = "";
		char_message_list: any;
		userId: number;

		constructor(private dataRoomService : DataRoomService, 
		private toastr: ToastrService, private sanitizer : DomSanitizer,
		private baseUrlClass : BaseUrlClass, private router : Router
		) { 
		this._base_url = this.baseUrlClass.baseUrl;
		this.currentDataroomId =localStorage.getItem("currentDataroomId");
		// this.getSingleDataroom(this.currentDataroomId);
		// this.getMembersPermission(this.currentDataroomId);
	}

	ngOnInit() {
		this.getDataroomMessage();
		this.getUserInfo();
	}

	getDataroomUserMessage: any;
	getDataroomMessage(){
		this.dataRoomService.getAllDataroomMessage(this.currentDataroomId)
		.subscribe((res)=>{
			
			this.getDataroomUserMessage = res;
		})
	}

  	getUserInfo1(){
    	//this.dataRoomService.getUserProfile().subscribe((res)=>{
    		this.user = JSON.parse(    localStorage.getItem("currentUser"));
        this.getAllMessage();
    	//})
    }

	getAllMessage1(){
		
		this.dataRoomService.getAllUserMessage(this.user.id,)
		.subscribe((res)=>{
			
			this.all_message = res;
		})
	}

	update:any={
		'message':'',
	}

	dataroomId: number;
	user_id: number;
	sendMessage1(){
		this.user_id = this.char_message_list[0].login_user;
		if (this.char_message_list[0].login_user == this.char_message_list[0].user_rec) {
		  this.user_id = this.char_message_list[0].user_send.id;
		}
		this.dataroomId = this.char_message_list[0].dataroom
		this.dataRoomService.sendDataroomUserMessage(this.user_id, this.dataroomId, this.update)
		.subscribe((res)=>{
		  
		  this.msg = "Message send successfully !";
		  this.showSuccess();
		  this.chatPage1(this.userId)
		})
		this.update={
		  'message':'',
		}
	}

	user_details: any;
	getUserInfo(){
		//this.dataRoomService.getUserProfile().subscribe((res)=>{
			this.user = JSON.parse(    localStorage.getItem("currentUser"));
		    this.getAllMessage();
		//})
	}

	getAllMessage(){
		
		this.dataRoomService.getAllUserMessage(this.user.id,)
		.subscribe((res)=>{
			
			this.all_message = res;
		})
	}

	chatPage1(userId){
		this.userId = userId;
		this.dataRoomService.getChatPage(userId)
		.subscribe((res)=>{
		  
		  this.char_message_list = res;
		})
	}

	update1:any={
	'message':'',
	}


	sendMessage(){
		this.user_id = this.char_message_list[0].login_user;
		if (this.char_message_list[0].login_user == this.char_message_list[0].user_rec) {
		  this.user_id = this.char_message_list[0].user_send.id;
		}
		this.dataroomId = this.char_message_list[0].dataroom
		this.dataRoomService.sendDataroomUserMessage(this.user_id, this.dataroomId, this.update)
		.subscribe((res)=>{
		  
		  this.msg = "Message send successfully !";
		  this.showSuccess();
		  this.chatPage1(this.userId)
		})
		this.update1={
		  'message':'',
		}
	}

	showSuccess(){
		console.log("dog:-", this.msg)
		this.toastr.success( this.msg);
	}


	showError(){
		this.toastr.error( this.msg);
	}

	showInfo(){
		this.toastr.info( this.msg);
	}
}
