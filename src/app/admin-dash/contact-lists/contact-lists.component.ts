import { Component, OnInit, ViewEncapsulation, Input } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { Validators, FormGroup, FormArray, FormBuilder, AbstractControl, FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ViewChild, ElementRef } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-contact-lists",
  templateUrl: "./contact-lists.component.html",
  styleUrls: ["./contact-lists.component.css"],
})
export class ContactListsComponent implements OnInit {
  searchText: any;
  @Input("user")
  user: any;
  hideNewContactForm: boolean = false;
  public contactForm: FormGroup; // our form model
  public contactGroupForm: FormGroup; // our form model
  public myTeamForm: FormGroup;
  all_contacts: any[];
  all_contacts_groups: any;

  @ViewChild("fileInput") fileInput: ElementRef;

  msg: string;
  avatarUrl: string;
  _base_url: string;
  constructor(
    private _fb: FormBuilder,
    private dataRoomService: DataRoomService,
    private toastrService: ToastrService,
    private baseUrlClass: BaseUrlClass,
    private router: Router,
    private cookieService : CookieService,
    private httpClient: HttpClient
  ) {
    this._base_url = this.baseUrlClass.baseUrl;
  }

  ngOnInit() {
    this.getUserInfo();
    this.initializeUserForm();
    this.initializeContactFrom();
    this.initializeMyTeamForm();
    this.intializeContactCSVform();
    this.getAllContacts();
    this.getAllContactGroups();
    this.getAllMyteam();
  }

  clearFile() {
    this.contactFormCSV.get("csv_upload").setValue(null);
    this.fileInput.nativeElement.value = "";
  }

  initializeMyTeamForm() {
    this.myTeamForm = this._fb.group({
      team_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
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
      first_name: ["", [Validators.required, this.onlyTextValidator.bind(this)]],
      last_name: ["", [Validators.required, this.onlyTextValidator.bind(this)]],
      email: ["", [Validators.required, Validators.pattern(this.emailPattern)]],
    });
  }

  // intializeContactCSVform(){}
  intializeContactCSVform() {
    this.contactFormCSV = this._fb.group({
      csv_upload: null,
    });
  }

  nameValidator(control: FormControl): { [key: string]: boolean } {
    const nameRegexp: RegExp = /[!#%^+\=\[\]{};':"\\|,.<>\?]/;
    if (control.value && nameRegexp.test(control.value)) {
       return { invalidName: true };
    }
}


  initializeContactFrom() {
    this.contactGroupForm = this._fb.group({
      group_name: ["", [ Validators.minLength(3),this.nameValidator]],
    });
  }
  getUserInfo() {
   // this.dataRoomService.getUserProfile().subscribe((res) => {
      this.user = JSON.parse(    localStorage.getItem("currentUser"));
      this.avatarUrl = this._base_url + this.user.avatar;
      this.avatarUrl = this.avatarUrl.replace("//media/", "/media/");
      console.log("Avatar url ", this.avatarUrl);
    //});
  }

  select: boolean = true;

  ProperSelection(value) {
    this.all_contacts;
    if (value == 0) {
      this.select = true;
      this.all_contacts_groups.forEach((res) => {
        res.select = false;
      });
      this.getAllContacts();
    } else {
      this.select = false;
      this.all_contacts_groups.forEach((res) => {
        if (res.id == value) {
          res.select = true;
        } else {
          res.select = false;
        }
      });
      this.getAllContactGroupMembers(value);
    }
  }

  getAllContacts() {
    this.dataRoomService.getAllContacts().subscribe((res) => {
      this.all_contacts = res;

      // this.all_contacts = res.filter((data)=>data.selected=false);
    });
  }

  saveContact(contactForm) {
    console.log("contactForm value", contactForm.value);
    this.dataRoomService
      .createNewContact(contactForm.value)
      .subscribe((res) => {
        this.all_contacts.push(res);
        this.msg = "Contact added sucessfully.";
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
  create_group: any = "";
  // save contact group form
  saveContactGroupForm(contactGroupForm) {
    this.dataRoomService
      .createNewContactGroup(contactGroupForm.value)
      .subscribe((res: any) => {
        this.all_contacts_groups.push(res);
        this.msg = "New contact group created";
        this.create_group = "";
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
      console.log("if true",this.toggle);
      this.selectedAll = this.all_contacts.filter(function (contact) {
        return (contact.selected = true);
      });
    } else {
      console.log("else",this.toggle);
      this.selectedAll = this.all_contacts.filter(function (contact) {
        return (contact.selected = false);
      });
      console.log("value of toggle",this.toggle);
    }
  }

  //delete contact id
  selectedAll: any = [];

  deleteContact(contact_id, i) {
    console.log("contact id", contact_id);
    this.dataRoomService
      .deleteContactFromGroup(contact_id, this.clicked_contact_group_id)
      .subscribe((res) => {
        console.log("Contact Deleted successfully");
        this.all_contacts.splice(i, 1);
        this.msg = res.msg;
        this.showError();
      });
  }

  checkIfAllSelected() {
    this.selectedAll = this.all_contacts.filter(function (contact) {
      return contact.selected == true;
    });
  }




  status: boolean = true;
  selected_contact_group_id: number = 0;
  clicked_contact_group_id: number = 0;
  // remaining need to create web service here
  getAllContactGroupMembers(group) {
    this.selected_contact_group_id = group;
    this.clicked_contact_group_id = group;
    this.dataRoomService
      .getAllContactsAssociatedWithGroup(group)
      .subscribe((res) => {
        //
        console.log("get all contacts related field successfully");
        console.log("Result is", res);
        this.all_contacts = res;
        this.status = !this.status;
      });
  }

  addMemberToSelectdGroup(group) {
    this.selected_contact_group_id = group;
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
            this.toggle = false;
            window.location.reload();
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
  saveMyTeamForm(myTeamForm) {
    this.dataRoomService.createMyTeam(myTeamForm.value).subscribe((res) => {
      this.all_my_teams.push(res);
      this.msg = "Team added";
      this.showSuccess();
      this.myTeamForm.reset();
    });
  }

  // get all my teams
  getAllMyteam() {
    this.dataRoomService.getAllMyteams().subscribe((res) => {
      this.all_my_teams = res;
    });
  }

  // navigate to the my team section
  navigateToTheMyTeamSection(team) {
    console.log("My Team id is", team);
    this.router.navigate(["/my-team", team.id]);
  }

  hideAddNewContactForm() {
    this.hideNewContactForm = !this.hideNewContactForm;
  }

  // upload csv functionality

  filedata: any;
  //  contactFormCSV : FormGroup;

  public contactFormCSV: FormGroup; // our form model

  fileEvent(e) {
    this.filedata = e.target.files[0];
    console.log(e);
  }
  onSubmitContactCSV() {
    console.log("file data is", this.contactFormCSV);
    this.dataRoomService.upload_contact_csv(this.filedata).subscribe((res) => {
      if (res.length > 0) {
        this.filedata = {};
        this.all_contacts = res;
        this.msg = "Member list uploaded successfully";
        this.showSuccess();
        this.clearFile();
      } else {
        this.msg = "Please Check CSV File Format";
        this.showError();
      }
    });
  }

  // download sample contact csv
  downloadSampleContactCsv() {
    console.log("download contact csv");
    this.dataRoomService.download_sample_contact_csv().subscribe((res) => {
      console.log("file downloaded successfully ");
    });
  }
}
