import { EventEmitter, Output } from '@angular/core';
// import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataRoomService } from '../../../services';
declare var jQuery: any;
declare var jQuery: any;

@Component({
  selector: 'app-online-team',
  templateUrl: './online-team.component.html',
  styleUrls: ['./online-team.component.css']
})
export class OnlineTeamComponent implements OnInit {
  @Input() data;
  @Output('parentFun') parentFun: EventEmitter<any> = new EventEmitter();
  @Output('getDataroomparent') getDataroomparent:EventEmitter<any> = new EventEmitter();
  constructor(private dataRoomService :DataRoomService,
    private toastrService : ToastrService
    ) { }

  ngOnInit() {
    console.warn(this.data, this.data.length) 
    this.initializeDeleteForm()
  }

  searchTeamForm = new FormGroup(

    { allteamssearch : new FormControl ("")}
   )

  gettoknowtheplan(item,i,planname)
  {
    console.log(planname);
    this.getDataroomparent.emit({item,i,planname});
  }
  deleteTeamForm:FormGroup;

  initializeDeleteForm() {
    this.deleteTeamForm = new FormGroup({
      deleteteam: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
  }

  showSuccess() {
    this.toastrService.success(this.msg);
  }

  showError() {
    this.toastrService.error(this.msg);
  }


msg
  deleteTeam(datateam)
  {
    console.warn(datateam);
    this.dataRoomService.deleteOnlineTeam(datateam).subscribe(res=>{
      if(res=='deleted')
      {
        this.msg = "Team Deleted Successfully..."
        this.showSuccess();
        this.parentFun.emit();
        this.ngOnInit();
      }else
      {
        this.msg = "Team contains datarooms please delete datarooms to prcessing further.";
        this.showError();
        this.parentFun.emit();
        this.ngOnInit();
      }
    });
  }

  reserveData
  newData=[];
  activateTeamSearch=false;
  activateTeamSearchBack=false;
  searchLocalTeam()
  {
    this.reserveData = this.data;
    console.warn(this.searchTeamForm.get('allteamssearch').value);
    this.dataRoomService.getUniversalDatroomTeams(this.searchTeamForm.get('allteamssearch').value).subscribe(res=>{
      console.log(res);
      this.newData = res.myteamdata;
      console.log(this.newData);
      this.activateTeamSearch=true;
      this.activateTeamSearchBack=true;
      console.warn(this.data);
    });
  }
  backSearchTeam()
  {
    this.activateTeamSearch=false;
      this.activateTeamSearchBack=false;
      this.newData=[];
  }
  
}
