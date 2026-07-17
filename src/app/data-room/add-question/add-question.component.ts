import { Component, OnInit } from '@angular/core';
import { DataRoomService } from '../../services/index';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {
dataroomId : any ;
  constructor(private toastr: ToastrService,
  			  private dataRoomService : DataRoomService,   private cookieService : CookieService, ) { 
  		this.dataroomId =localStorage.getItem("currentDataroomId");
  }

  ngOnInit() {
  	this.getAllRecentDocument();
    this.getUserInfo();
  }


user:any;
user_id: number;
getUserInfo(){
    //this.dataRoomService.getUserProfile() .subscribe((res)=>{
        
        this.user = JSON.parse(    localStorage.getItem("currentUser"));
        this.user_id = this.user.id;
    //})
}

msg:any;
showSuccess(){
	this.toastr.success( this.msg);
}


showError(){
	this.toastr.error( this.msg);
}




qna:any={
	'question':'',
	'answer':'',
	'folder':'',
};

folder_list:any;
getAllRecentDocument(){
    console.log("dataroom id is", this.dataroomId);
    var from_date = '';
    var to_date = '';
  this.dataRoomService.get_all_recent_document(this.dataroomId, from_date, to_date)
  .subscribe((res)=>{
      
      this.folder_list = res;
  })
}

SaveQNA(){
	this.dataRoomService.createQna(this.dataroomId,this.qna)
	.subscribe((res)=>{
		this.msg = "Question and Answer Successfully Created"
		this.showSuccess();
	},error=>{
		this.msg = error._body;
		this.showSuccess();
	})
}

}
