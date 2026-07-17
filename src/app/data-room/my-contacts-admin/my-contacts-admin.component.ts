import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { DataRoomService } from '../../services/index';
import { Validators, FormGroup, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseUrlClass, ApiListClass } from '../../common/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-my-contacts-admin',
  templateUrl: './my-contacts-admin.component.html',
  styleUrls: ['./my-contacts-admin.component.css']
})
export class MyContactsAdminComponent implements OnInit {
  searchText:any;
  @Input('user')
  user : any; 
  hideNewContactForm : boolean = false;
  public contactForm: FormGroup; // our form model
  public contactGroupForm: FormGroup; // our form model
  public myTeamForm : FormGroup; 
  all_contacts : any[];
  all_contacts_groups : any;

  msg : string;
  avatarUrl : string ;
  _base_url : string ;
  currentDataroomId : any;
  group_name111 : string = "";
  group_name222 : string = "";
  group_name_all : boolean = false;
  constructor(private _fb: FormBuilder, 
        private dataRoomService: DataRoomService, 
        private toastrService : ToastrService, 
        private baseUrlClass : BaseUrlClass, 
        private router : Router, 
        private cookieService:CookieService,
        private httpClient : HttpClient
        ) { 
    this._base_url = this.baseUrlClass.baseUrl;
      	  	this.currentDataroomId =localStorage.getItem("currentDataroomId");

  }

  ngOnInit() {
  this.initializeUserForm();
  this.initializeContactFrom();
  this.initializeMyTeamForm();
  this.intializeContactCSVform();
  this.getAllContacts();
  this.getAllContactGroups();
  this.getAllMyteam();
  }

initializeMyTeamForm(){
     this.myTeamForm = this._fb.group({
            team_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            dataroom_allowed: ['', [Validators.required, Validators.maxLength(5)]], 
            dataroom_admin_allowed : ['', [Validators.required, Validators.maxLength(5)]], 
            dataroom_storage_allowed : ['',[Validators.required, Validators.maxLength(3), Validators.minLength(1)]]

        });
  }

  onlyTextValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^[a-zA-Z\s]*$/.test(control.value);
    return valid ? null : { 'invalidText': { value: control.value } };
  }
  emailPattern =
  "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
  "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  

initializeUserForm(){
     this.contactForm = this._fb.group({
            first_name: ['', Validators.required,this.onlyTextValidator],
            last_name: ['', Validators.required,this.onlyTextValidator], 
            email : ['', Validators.required,Validators.pattern(this.emailPattern)]

        });

  }


  // intializeContactCSVform(){}
intializeContactCSVform(){
this.contactFormCSV = this._fb.group({
 csv_upload: ['', Validators.required]
})

}

initializeContactFrom(){
  this.contactGroupForm = this._fb.group({
    group_name : ['', [Validators.required, Validators.minLength(3)]]
  })


}

getAllContacts(){
this.dataRoomService.getAllDataroomContacts(this.currentDataroomId)
.subscribe((res)=>{
  // this.all_contacts = res.filter((data)=>data.selected=false);
  this.group_name_all = true;
  this.group_name111 = "",
  this.all_contacts = res;
})
}

saveContact(contactForm){
  console.log("contactForm value", contactForm.value);
  this.dataRoomService.createNewDataroomContact(contactForm.value, this.currentDataroomId)
  .subscribe((res)=>{
    this.all_contacts.push(res);
    this.msg = "Contact successfully added !";
    this.showSuccess();
    this.initializeUserForm();
  })
}

// get all contact groups 
getAllContactGroups(){
this.dataRoomService.getAllDataroomContactsGroup(this.currentDataroomId)
  .subscribe((res)=>{
    
    this.all_contacts_groups = res;
    //this.initializeContactFrom();
    this.contactGroupForm.reset();
  })
}

// save contact group form
saveContactGroupForm(contactGroupForm){
  
  console.log("Save Contact Group Form",contactGroupForm.value);
  this.dataRoomService.createNewDataroomContactGroup(contactGroupForm.value, this.currentDataroomId)
  .subscribe((res: any)=>{
    this.all_contacts_groups.push(res);
    this.msg = res.msg;
    this.showSuccess();
  })
}

showSuccess(){
    this.toastrService.success( this.msg);
  }


showError(){
      this.toastrService.error( this.msg);
    }

toggle: boolean = false;
onSelectAllContacts() {
      
      this.toggle = !this.toggle;
      if (this.toggle===true){
        this.selectedAll = this.all_contacts.filter(function(contact) {
        return contact.selected = true;
          });
        }else{
          this.selectedAll = this.all_contacts.filter(function(contact) {
        return contact.selected = false;
          });
        console.log("toggle is false")
      }
  }


//delete contact id
 selectedAll: any = [];

deleteContact(contact_id, i){
  
  console.log("contact id", contact_id);
  this.dataRoomService.deleteContactFromGroup(contact_id, this.clicked_contact_group_id)
    .subscribe((res)=>{
      console.log("Delete contact successfully");
        this.all_contacts.splice(i, 1);
        this.msg = res.msg;
        this.showSuccess();
    })
}



  checkIfAllSelected(){
    this.selectedAll = this.all_contacts.filter(function(contact) {
      return contact.selected == true;
    });
  }

  selected_contact_group_id : number = 0;
  clicked_contact_group_id : number = 0;
// remaining need to create web service here 
  getAllContactGroupMembers(group){
    this.selected_contact_group_id = group.id;
    this.clicked_contact_group_id = group.id;
    this.group_name111 = group.group_name
    
    this.dataRoomService.getAllContactsAssociatedWithGroup(group.id)
     .subscribe((res)=>{
       console.log("get all contacts related field successfully")
       console.log("Result is", res);
       this.all_contacts = res;
       this.group_name_all = false;
     })
  }


  addMemberToSelectdGroup(group){
    //
   this.selected_contact_group_id = group;
  }


addToContactGroup(){

  //console.log("Add to contact group");
   //
   if(this.selected_contact_group_id !== 0){
      if(this.selectedAll.length > 0)
        {
           // push all code to the server 
          let data = {
            'selected_group_id': this.selected_contact_group_id, 
            'selected_members' : this.selectedAll
          }

          this.dataRoomService.add_new_member_to_contact_group(data)
          .subscribe((res)=>{
            
            this.msg = res.msg;
            this.showSuccess();   
          })
        }
        else{
          this.msg = "Please select the members";
          this.showError();
        }     
    } else{
      this.msg = "Please select the contact group";
      this.showError();
    }
}


all_my_teams : any[]= [];

// start of my team functionality 
saveMyTeamForm(myTeamForm){
  this.dataRoomService.createMyTeam(myTeamForm.value)
   .subscribe((res)=>{
      this.all_my_teams.push(res);
      this.msg = "Team added"
      this.showSuccess();
      this.myTeamForm.reset();
   })
  
}

// get all my teams 
getAllMyteam(){
  this.dataRoomService.getAllMyteams()
  .subscribe((res)=>{
    this.all_my_teams = res;
  })
}


// navigate to the my team section
navigateToTheMyTeamSection(team){
 console.log("My Team id is", team);
 this.router.navigate(['/my-team', team.id]);
}


hideAddNewContactForm(){
  this.hideNewContactForm = !this.hideNewContactForm;
}

// upload csv functionality 

  filedata:any;
//  contactFormCSV : FormGroup;

  public contactFormCSV: FormGroup; // our form model

  fileEvent(e){
    this.filedata=e.target.files[0];
    console.log(e);
  }
   onSubmitContactCSV() {
    console.log("file data is", this.filedata);
     this.dataRoomService.upload_contact_csv(this.filedata)
     .subscribe((res)=>{
       console.log("CSV file successfully uploaded !", res);
       this.all_contacts = res;
       this.msg = "CSV successfully uploaded !";
       this.showSuccess();
     })
    
   }

   // download sample contact csv
   downloadSampleContactCsv(){
     //console.log("download contact csv");
     this.dataRoomService.download_sample_contact_csv()
     .subscribe((res)=>{
       console.log("file downloaded successfully ");
     })
   }

deleteGroup(group_id){
  this.dataRoomService.deleteContactGroup(group_id)
  .subscribe((res)=>{
    this.msg = "Selected Group is deleted Successfully!"
    this.showError();
    this.getAllContactGroups();
  })
}

}
