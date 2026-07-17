import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators , FormBuilder} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataRoomService } from '../../../services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-end-user-group',
  templateUrl: './end-user-group.component.html',
  styleUrls: ['./end-user-group.component.css']
})
export class EndUserGroupComponent implements OnInit {

  adminForm : FormGroup;
  newGroupForm: FormGroup;
  endUserGroup : FormGroup;
  currentDataroomId : any ;
  msg : string;
  all_admin_list : any = [];
  isLinear : boolean = false;
  constructor(private toastr: ToastrService, private dataRoomService : DataRoomService , private _formBuilder : FormBuilder,private cookieService:CookieService,) {

 	this.currentDataroomId =localStorage.getItem("currentDataroomId");


		this.firstFormGroup = this._formBuilder.group({
			firstCtrl: ['', Validators.required]
		});
		this.secondFormGroup = this._formBuilder.group({
			secondCtrl: ['', Validators.required]
		});

		this.thirdFormGroup = this._formBuilder.group({
			thirdCtrl: ['', Validators.required]
		});

		this.fourthFormGroup = this._formBuilder.group({
			fourthCtrl: ['', Validators.required]
		});

   }

  ngOnInit() {
   	this.initializeNewAdminForm();
   	this.intializerNewGroupForm();
   	this.initializeEndUserGroup();
  }
emailPattern = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
    + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  initializeNewAdminForm(){
 		this.adminForm = new FormGroup({
      first_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      last_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50),Validators.pattern(this.emailPattern)]),
   
    });  

  }

  intializerNewGroupForm(){
	this.newGroupForm = new FormGroup({
      group_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
    }); 
  }

  nameValidator(control: FormControl): { [key: string]: boolean } {
    const nameRegexp: RegExp = /[!#%^+\=\[\]{};':"\\|,.<>\?]/;
    if (control.value && nameRegexp.test(control.value)) {
       return { invalidName: true };
    }
}

  initializeEndUserGroup(){
  	this.endUserGroup = new FormGroup({
  		group_name : new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50),this.nameValidator])
  	})
  }

  // on submit admin form
  onSubmitAdminForm(adminForm : any){
  	
  	console.log("admin form is", adminForm.value);
    let custom_message = "Hi"
  	// let custom_message = this.messageForm.get('custom_message').value;
  	this.dataRoomService.create_an_dataroom_admin(this.currentDataroomId, adminForm.value, custom_message)
  	.subscribe((res:any)=>{
		this.all_admin_list.push(adminForm.value);
	  	this.msg = "Admin successfully added !";
	  	this.showInfo();
	  	this.adminForm.reset();

  	}, 

    (error: any) =>{
      
      console.log("error", error);
      this.msg = error.error.msg;
      this.showError();
    })
  	
  }

// common success messges 
all_groups : any = [];
newGroupFormSubmit(groupForm: any){
	this.all_groups.push(groupForm.value);
	this.msg = "Group successfully added !";
	this.showInfo();

	// reset the group form submit
	this.newGroupForm.reset();


}
 showSuccess(){
    this.toastr.success( this.msg);
  }


  showError(){
    this.toastr.error( this.msg);
  }

  showInfo(){
    this.toastr.info( this.msg);
  }

  // delete admin
  deleteAdmin(i){

  	console.log("delete admin");
  	this.all_admin_list.splice(i, 1);
  	this.msg = "Delete admin successfully !";
  	this.showError();

  }


resendInvitation(){
	this.msg= "Resend invitation successfully";
	this.showInfo();
}


//isLinear = false;
firstFormGroup: FormGroup;
secondFormGroup: FormGroup;
thirdFormGroup: FormGroup;
fourthFormGroup: FormGroup;

}