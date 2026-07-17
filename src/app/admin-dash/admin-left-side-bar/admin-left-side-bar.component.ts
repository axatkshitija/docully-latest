import { Component, OnInit, ViewEncapsulation, Input } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { Validators, FormGroup, FormArray, FormBuilder, AbstractControl, FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { HttpClient } from "@angular/common/http";
// import { MessagingService } from "../../messaging.service";
@Component({
  selector: "app-admin-left-side-bar",
  templateUrl: "./admin-left-side-bar.component.html",
  styleUrls: ["./admin-left-side-bar.component.css"],
})
export class AdminLeftSideBarComponent implements OnInit {
  @Input("user")
  user: any;
  hideNewContactForm: boolean = false;
  public contactForm: any=FormGroup; // our form model
  public contactGroupForm: any=FormGroup; // our form model
  public myTeamForm: any=FormGroup;
  public url:any;
  all_contacts: any =[];
  all_contacts_groups: any;
  searchText:any;
  msg: any;
  avatarUrl: any;
  _base_url: string;
  constructor(
    private _fb: FormBuilder,
    private dataRoomService: DataRoomService,
    private toastrService: ToastrService,
    private baseUrlClass: BaseUrlClass,
    public router: Router,
    private httpClient: HttpClient // private messagingService: MessagingService
  ) {
    this._base_url = this.baseUrlClass.baseUrl;
  }

  ngOnInit() {
    this.getUserInfo();
    this.getButtonVisibility();
    this.initializeUserForm();
    this.initializeContactFrom();
    this.initializeMyTeamForm();
    this.intializeContactCSVform();
    this.getAllContacts();
    this.getAllContactGroups();
    this.opensnack();
    this.getAllNotification();
  }
  user_id: any;
  getUserInfo() {
   // this.dataRoomService.getUserProfile().subscribe((res) => {
    const user :any = localStorage.getItem("currentUser")
      this.user = JSON.parse( user);
      // console.log(this.user, "Personal Info");
      if(this.user.avatar){
        this.avatarUrl = this.user.avatar;
        this.avatarUrl = this.avatarUrl.replace("//media/", "/media/")
      }else{
        this.avatarUrl = this.baseUrlClass.frontend_url + "assets/images/Profile.png";
      }
   // });
  }

  location() {
    window.open("https://docullyvdr.zohodesk.com/", "_blank");

    //  window.location.href = "https://docully.freshdesk.com/support/home";
  }
  notification_count: number = 0;
  msg_count: number = 0;
  opensnack() {
    var now = new Date();
    this.dataRoomService
      .getSingleDataroomNotificationCount(0)
      .subscribe((res) => {
        // this.notification_count = res.user_notification_count;
        this.msg_count = res.dataroom_message_count;
        // console.log(res, "Message Count");
        this.notification_count = res.user_notification_count;

      });
  }



  // const userId = 'user001';
  // this.messagingService.requestPermission(userId)
  // this.messagingService.receiveMessage()
  // this.message = this.messagingService.currentMessage

  initializeMyTeamForm() {
    this.myTeamForm = this._fb.group({
      team_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      dataroom_allowed: ["", [Validators.required, Validators.maxLength(5)]],
      dataroom_admin_allowed: [
        "",
        [Validators.required, Validators.maxLength(5)],
      ],
      dataroom_storage_allowed: [
        "",
        [Validators.required, Validators.maxLength(3), Validators.minLength(1)],
      ],
    });
  }

  emailPattern =
  "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
  "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  onlyTextValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^[a-zA-Z\s]*$/.test(control.value);
    return valid ? null : { 'invalidText': { value: control.value } };
  }




  initializeUserForm() {
    this.contactForm = this._fb.group({
      first_name: ["", Validators.required,this.onlyTextValidator],
      last_name: ["", Validators.required,this.onlyTextValidator],
      email: ["", [Validators.required, Validators.pattern(this.emailPattern)]],
    });
  }



  // intializeContactCSVform(){}
  intializeContactCSVform() {
    this.contactFormCSV = this._fb.group({
      csv_upload: ["", Validators.required],
    });
  }



  initializeContactFrom() {
    this.contactGroupForm = this._fb.group({
      group_name: ["", [Validators.required, Validators.minLength(3)]],
    });
  }

  setDefaultPic() {
    this.avatarUrl = this.avatarUrl;
  }



  buttonVisibility:any;
  getButtonVisibility() {
    this.dataRoomService.getButtonVisibilityCheck().subscribe((res) => {
      this.buttonVisibility = res;
    });
  }
 
  getAllContacts() {
    this.dataRoomService.getAllContacts().subscribe((res) => {
      this.all_contacts = res.filter((data:any) => (data.selected = true));
    });
  }

  saveContact(contactForm:any) {
    // console.log("contactForm value", contactForm.value);
    this.dataRoomService
      .createNewContact(contactForm.value)
      .subscribe((res) => {
        this.all_contacts.push(res);
        this.msg = "Contact successfully added !";
        this.showSuccess();
        this.initializeUserForm();
      });
  }

  // get all contact groups
  getAllContactGroups() {
    this.dataRoomService.getAllContactsGroup().subscribe((res) => {
      this.all_contacts_groups = res;
      //this.initializeContactFrom();
      this.contactGroupForm.reset();
    });
  }

  // save contact group form
  saveContactGroupForm(contactGroupForm:any) {
    // console.log("Save Contact Group Form", contactGroupForm.value);
    this.dataRoomService
      .createNewContactGroup(contactGroupForm.value)
      .subscribe((res: any) => {
        this.all_contacts_groups.push(res);
        this.msg = res.msg;
        this.showSuccess();
      });
  }

  showSuccess() {
    this.toastrService.success(this.msg);
  }

  showError() {
    this.toastrService.error(this.msg);
  }

  toggle: boolean = false;
  onSelectAllContacts() {
    this.toggle = !this.toggle;
    if (this.toggle === true) {
      this.selectedAll = this.all_contacts.filter(function (contact:any) {
        return (contact.selected = true);
      });
    } else {
      // console.log("toggle is false");
    }
  }

  //delete contact id
  selectedAll: any = [];

  deleteContact(contact_id:any, i:any) {
    // console.log("contact id", contact_id);
    this.dataRoomService
      .deleteContactFromGroup(contact_id, this.clicked_contact_group_id)
      .subscribe((res) => {
        // console.log("Delete contact successfully");
        this.all_contacts.splice(i, 1);
        this.msg = res.msg;
        this.showSuccess();
      });
  }

  checkIfAllSelected() {
    this.selectedAll = this.all_contacts.filter(function (contact:any) {
      return contact.selected == true;
    });
  }

  selected_contact_group_id: number = 0;
  clicked_contact_group_id: number = 0;
  // remaining need to create web service here
  getAllContactGroupMembers(group:any) {
    this.selected_contact_group_id = group.id;
    this.clicked_contact_group_id = group.id;
    this.dataRoomService
      .getAllContactsAssociatedWithGroup(group.id)
      .subscribe((res) => {
        //
        // console.log("get all contacts related field successfully");
        // console.log("Result is", res);
        this.all_contacts = res;
      });
  }

  addMemberToSelectdGroup(group:any | null) {
    //
    this.selected_contact_group_id = group.value;
  }

  addToContactGroup() {
    //console.log("Add to contact group");
    //
    if (this.selected_contact_group_id !== 0) {
      if (this.selectedAll.length > 0) {
        // push all code to the server
        let data = {
          selected_group_id: this.selected_contact_group_id,
          selected_members: this.selectedAll,
        };

        this.dataRoomService
          .add_new_member_to_contact_group(data)
          .subscribe((res) => {
            this.msg = res.msg;
            this.showSuccess();
          });
      } else {
        this.msg = "Please select the members";
        this.showError();
      }
    } else {
      this.msg = "Please select the contact group";
      this.showError();
    }
  }

  all_my_teams: any[] = [];

  // start of my team functionality
  saveMyTeamForm(myTeamForm:any) {
    this.dataRoomService.createMyTeam(myTeamForm.value).subscribe((res) => {
      this.all_my_teams.push(res);
      this.msg = "Team added";
      this.showSuccess();
      this.myTeamForm.reset();
    });
  }

  // navigate to the my team section
  navigateToTheMyTeamSection() {
    this.router.navigate(["/my-team"]);
  }

  hideAddNewContactForm() {
    this.hideNewContactForm = !this.hideNewContactForm;
  }

  // upload csv functionality

  filedata: any;
  //  contactFormCSV : FormGroup;

  public contactFormCSV:any= FormGroup; // our form model

  fileEvent(e:any) {
    this.filedata = e.target.files[0];
    // console.log(e);
  }
  onSubmitContactCSV() {
    // console.log("file data is", this.filedata);
    this.dataRoomService.upload_contact_csv(this.filedata).subscribe((res:any) => {
      // console.log("CSV file successfully uploaded !", res);
      this.all_contacts = res;
      this.msg = "CSV successfully uploaded !";
      this.showSuccess();
    });
  }

  // download sample contact csv
  downloadSampleContactCsv() {
    // console.log("download contact csv");
    this.dataRoomService.download_sample_contact_csv().subscribe((res:any) => {
      // console.log("file downloaded successfully ");
    });
  }

  CallUs() {
    window.open("tel:2240907266");
  }

  EmailUs() {
    window.open("mailto:support@docullyvdr.com");
  }

  unreadCount: any;
  getAllNotification() {
    this.dataRoomService.getAllNotificationList("fixed").subscribe((res) => {
      console.log(res);
      if (res != undefined) {
        this.unreadCount = res.unread_count;
      } 
    });
  }
}
