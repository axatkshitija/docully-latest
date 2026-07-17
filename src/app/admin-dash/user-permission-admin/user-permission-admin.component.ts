import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { DataRoomService } from '../../services/index';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-permission-admin',
  templateUrl: './user-permission-admin.component.html',
  styleUrls: ['./user-permission-admin.component.css']
})
export class UserPermissionAdminComponent implements OnInit {
  public userForm: FormGroup; // our form model
  msg: any;
  errors: any;
  invitation_send_email: any;
  already_exist_user: any[] = [];
  user: any;
  // controls:any;
  constructor(private _fb: FormBuilder,
    private _dataroom_service: DataRoomService,
    private toastrService: ToastrService) { }

  ngOnInit() {
    this.initializeUserForm();
    this.getAllAdmins();
  }

  initializeUserForm() {
    this.userForm = this._fb.group({
      user: this._fb.array([
        this.initUser(),
      ])
    });

  }

  onlyTextValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^[a-zA-Z\s]*$/.test(control.value);
    return valid ? null : { 'invalidText': { value: control.value } };
  }

  emailPattern =
    "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
    "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";


  initUser() {
    return this._fb.group({
      first_name: ['', Validators.required, this.onlyTextValidator],
      last_name: ['', Validators.required, this.onlyTextValidator],
      email: ['', Validators.required, Validators.pattern(this.emailPattern)],
    });
  }


  addUser() {
    const control = <FormArray>this.userForm.controls['user'];
    const addrCtrl = this.initUser();

    control.push(addrCtrl);

    /* subscribe to individual address value changes */
    // addrCtrl.valueChanges.subscribe(x => {
    //   console.log(x);
    // })
  }

  removeUser(i: number) {
    const control = <FormArray>this.userForm.controls['user'];
    control.removeAt(i);
  }
  is_success_error_message: boolean = false;
  save(model: any) {

    console.log("model is ", model.value);
    this._dataroom_service.create_user_from_super_admin(model.value)
      .subscribe((res) => {
        console.log("dataroom successfully added");
        this.msg = "user successfully added !";
        this.invitation_send_email = res.invitation_send_email;
        this.already_exist_user = res.already_exist_user;
        this.is_success_error_message = true;
        this.userForm.reset();

        this.getAllAdmins();

      })


  }


  showSuccess() {
    this.toastrService.success(this.msg);
  }


  showError() {
    this.toastrService.error(this.msg);
  }

  all_admins: any;
  getAllAdmins() {
    this._dataroom_service.get_all_admins()
      .subscribe((res) => {
        this.all_admins = res;
      })
  }

  refreshAdminForm() {
    this.initializeUserForm();
    this.is_success_error_message = false;
    //this.invitation_send_email = [];
    //this.already_exist_user = [];
  }

}
