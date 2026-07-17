import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataRoomService } from '../../../services';
declare var jQuery: any;

@Component({
  selector: 'app-online-dataroom',
  templateUrl: './online-dataroom.component.html',
  styleUrls: ['./online-dataroom.component.css']
})
export class OnlineDataroomComponent implements OnInit {
  @Input() data;
  //@Output('parentFun') parentFun: EventEmitter<any> = new EventEmitter();
  deleteForm: FormGroup;
  deleteFormNow: FormGroup;
  editOnlineDataroomForm: FormGroup;
  msg: any;
  usertimezone: string;

  constructor(
    private dataRoomService: DataRoomService,
    private toastrService: ToastrService,
    public datepipe: DatePipe,
  ) { }

  ngOnInit() {
    console.warn(this.data) 
    this.initializeDeleteForm();
    this.editOnlineDataroomFormMethod();
    this.usertimezone = localStorage.getItem("currentUser") 
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  showSuccess() {
    this.toastrService.success(this.msg);
  }

  showError() {
    this.toastrService.error(this.msg);
  }

  editOnlineDataroomFormMethod() {
    this.editOnlineDataroomForm = new FormGroup({
      dataroomid: new FormControl("", [
        Validators.required
      ]),
      dataroom_nameFront: new FormControl("", [
        Validators.required
      ]),
      dataroom_storage_allocated: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(4),
      ]),
      planinvoiceid: new FormControl("", [
        Validators.required
      ]),
      end_date: new FormControl("", [
        Validators.required
      ]),
      auto_renewal: new FormControl("", [
        Validators.required
      ]),
    });
  }
 
  initializeDeleteForm() {
    this.deleteForm = new FormGroup({
      delete: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
    this.deleteFormNow = new FormGroup({
      deleteNow: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
  }

  is_request_for_archive;
  archivedRequestForDataroom(dataroom) {
    console.log("Archived requets for dataroom ", dataroom.id);
    this.dataRoomService
      .archivedRequestForDataroom(dataroom)
      .subscribe((res) => {
        console.log("Archived requets ", res);
        this.is_request_for_archive = res.is_request_for_archive;
        if (this.is_request_for_archive) {
          this.msg = "Dataroom archive request successfully send !";
        } else {
          this.msg = " Dataroom Cancel archive request successfully send !";
        }
        this.showSuccess();
      });
      // this.getDataroomStateDetails()
  }

  is_request_for_deletion;
  is_archive;
  is_expired ;
is_deleted;
  deleteDataroom(dataroom_detail) {
    console.log(dataroom_detail)
    this.dataRoomService
      .deleteSingleDataroom(dataroom_detail)
      .subscribe((res) => {
        console.log(res, "deleteDataroom");
        this.is_request_for_deletion = res.is_request_for_deletion;
        this.is_archive = res.is_request_for_archive;
        this.is_expired = res.is_expired;
        this.is_deleted = res.is_deleted; 
        // if (dataroom_detail.is_request_for_deletion) {
        //   this.msg = " Dataroom Cancel delete request successfully send !";
        // } else {
        //   this.msg =
        //     "Your request to delete the data room has been processed and it will be deleted in 15 days.";
        // }
        if (this.is_request_for_deletion == false) {
          this.msg =
            "Your request to cancel the delete request of data room has been processed.";
          this.showSuccess();
          location.reload();
        } else {
          this.msg =
            "Your request to delete the data room has been processed and it will be deleted in 15 days.";
          this.showSuccess();
          location.reload();
        }
        // this.getDataroomStateDetails();
      });
      // location.reload();
  }

  patchDataroomData() {
    console.log(this.data)
    console.log(this.datepipe.transform(this.data.end_date, 'yyyy-MM-dd'))
    this.editOnlineDataroomForm.setValue({
      dataroomid: this.data.dataroom.id,
      dataroom_nameFront: this.data.dataroom.dataroom_nameFront,
      dataroom_storage_allocated: this.data.dataroom.dataroom_storage_allocated,
      planinvoiceid: this.data.id,
      end_date: this.datepipe.transform(this.data.end_date, 'yyyy-MM-dd'),
      auto_renewal: this.data.auto_renewal
    });
  }

  editDataroom(data) {
    console.log(data);
    this.dataRoomService.editOnlineDataroom(data).subscribe(res => {
      console.log(res);
      this.msg = res.data;
      this.showSuccess();
      jQuery("#editDataroom").modal("hide");
      // this.ngOnInit();
      location.reload();
    })
  }

  deleteDataroomNow(dataroomid)
  {
    console.log(dataroomid);
    this.dataRoomService.getOnlineDeleteDetails(dataroomid).subscribe((res)=>{
      console.warn(res);
      if(res=="Done")
      {
        this.msg="Dataroom Deleted Successfully"
        this.showSuccess();
        location.reload();
      }
      else
      {
        this.msg="Opps Something wen wrong..."
        this.showError();
      }
    })
  }

  dataroomstate=[];
  getDataroomStateDetails()
  {
    this.dataRoomService.getOnlineDataroomStateDetails(this.data.id).subscribe(res=>{
      this.dataroomstate = res;
      console.warn(this.dataroomstate,"this is dataroom state");
      console.warn(this.dataroomstate['is_expired'], this.dataroomstate['is_deleted']);
    });
  }
  getLocalDatarooms(event,teamid)
  {
   console.warn(event.target.value);
    this.dataRoomService.getLocalDatarooms(teamid,event.target.value).subscribe(res=>{
      console.log(res.dataroomdata)
    })
  }
}
