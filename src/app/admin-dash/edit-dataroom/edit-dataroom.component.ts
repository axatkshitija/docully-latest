import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataRoomService } from "../../services/index";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-edit-dataroom",
  templateUrl: "./edit-dataroom.component.html",
  styleUrls: ["./edit-dataroom.component.css"],
})
export class EditDataroomComponent implements OnInit {
  @Input("dataroom") dataroom: any=[];
  @Input("i") i: any;
  msg: string = "";

  @Output()
  sendDataroom = new EventEmitter<any>();
  constructor(
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  is_dataroom_updated: boolean = false;
  updateDataroominformation(dataroom_detail:any) {
    this.dataroom.dataroom_name = dataroom_detail.dataroom_nameFront.replace(
      /_/,
      ""
    );

    console.log("Dtaroom Name is", dataroom_detail);
    this.dataRoomService
      .updateSingleDataroom(dataroom_detail)
      .subscribe((res) => {
        if (res.success == false) {
          this.msg = res.error;
          this.showError();
        } else {
          this.msg = "Dataroom information successfully updated !";
          this.showSuccess();
          this.dataroom = res;
          console.log("datroom after updation is", res);
          this.is_dataroom_updated = true;
          setTimeout(() => {
            this.is_dataroom_updated = false;
          }, 5000);
          this.sendDataroom.emit({
            dataroom: res,
          });
        }
      });
  }

  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }
  // showInfo(){
  // 	this.toastr.info( this.msg);
  // }
}
