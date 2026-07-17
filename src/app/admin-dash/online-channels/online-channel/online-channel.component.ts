import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataRoomService } from '../../../services';

@Component({
  selector: 'app-online-channel',
  templateUrl: './online-channel.component.html',
  styleUrls: ['./online-channel.component.css']
})
export class OnlineChannelComponent implements OnInit {
  public showChannelList = true;
  public showTeamsList = false;

  onlineChannels = {
    silverSelected: false,
    goldSelected: false,
    platinumSelected: false,
    trialSelected: false,
    allonlineplans:false
  }
  listData;

  constructor(
    private dataRoomService: DataRoomService,
    private router : Router
  ) {
    //this.getDashboardData();
   }


  ngOnInit() {
    this.getDashboardData();
    this.getSilverOnline();
    this.getGoldOnline();
    this.getPlatinumOnline();
    this.getTrialOnline();
    this.getOnlineTeamUsers();
    this.getAllOnlinePlans()
    this.onlineChannels.allonlineplans = true;
  }

  searchForm = new FormGroup(

   { allunisearchtext : new FormControl ("")}
  )



  parentFun(){console.log('parent component function.');
this.ngOnInit();
}
  parentFun1(){console.log('parent component function.');
this.searchTeamandDatarooms();
}
  silverOnline;
  getSilverOnline() {
    this.dataRoomService.getSilverOnline().subscribe((res) => {
      this.silverOnline = res;
      console.log(this.silverOnline);
      this.silverOnline.forEach(element => {
        element['select'] = false;
      });
    });

  }

  goldOnline;
  getGoldOnline() {
    this.dataRoomService.getGoldOnline().subscribe((res) => {
      this.goldOnline = res;
      console.log(this.goldOnline);
    });
  }

  platinumOnline;
  getPlatinumOnline() {
    this.dataRoomService.getPlatinumOnline().subscribe((res) => {
      this.platinumOnline = res;
      console.log(this.platinumOnline);
    });
  }

  trialOnline;
  getTrialOnline() {
    this.dataRoomService.getTrialOnline().subscribe((res) => {
      this.trialOnline = res;
      console.log(this.trialOnline);
      this.toggleListData();
    });
  }

  AllPlanonline;
  getAllOnlinePlans(){
    this.dataRoomService.getUniversalDatroomTeams("").subscribe(res=>{
      this.AllPlanonline=res.myteamdata;
      console.warn(this.AllPlanonline);
      this.toggleListData();
    })
  }



  toggleListData() {
    this.listData = []
    if (this.onlineChannels.silverSelected) {
      this.listData = this.silverOnline;
      this.listData.forEach(element => {
        element['select'] = false
      });
      this.listData[0]['select'] = true;
      this.getDataroom(this.listData[0], 0, 'silver')
    } else if (this.onlineChannels.goldSelected) {
      this.listData = this.goldOnline;
      this.listData.forEach(element => {
        element['select'] = false
      });
      this.listData[0]['select'] = true;
      this.getDataroom(this.listData[0], 0, 'gold')
    } else if (this.onlineChannels.platinumSelected) {
      this.listData = this.platinumOnline;
      this.listData.forEach(element => {
        element['select'] = false
      });
      this.listData[0]['select'] = true;
      this.getDataroom(this.listData[0], 0, 'platinum')
    } else if (this.onlineChannels.trialSelected) {
      this.listData = this.trialOnline;
      this.listData.forEach(element => {
        element['select'] = false
      });
      this.listData[0]['select'] = true;
      this.getDataroom(this.listData[0], 0, 'trial')
    }else if(this.onlineChannels.allonlineplans)
    {
      this.listData=this.AllPlanonline;
      this.listData.forEach(element => {
        element['select'] = false
      });
      this.listData[0]['select'] = true;
      this.getDataroom(this.listData[0], 0, 'allplans')
    }

    console.log('parent list data', this.listData);
  }

  toggleChannels(option) {
    if (option == 'silver') {
      this.onlineChannels = {
        silverSelected: true,
        goldSelected: false,
        platinumSelected: false,
        trialSelected: false,
        allonlineplans:false,
      }
    } else if (option == 'gold') {
      this.onlineChannels = {
        silverSelected: false,
        goldSelected: true,
        platinumSelected: false,
        trialSelected: false,
        allonlineplans:false,
      }
    } else if (option == 'platinum') {
      this.onlineChannels = {
        silverSelected: false,
        goldSelected: false,
        platinumSelected: true,
        trialSelected: false,
        allonlineplans:false,
      }
    } else if (option == 'trial') {
      this.onlineChannels = {
        silverSelected: false,
        goldSelected: false,
        platinumSelected: false,
        trialSelected: true,
        allonlineplans:false,
      }
    }else if(option=='allplans')
    {
      this.onlineChannels = {
        silverSelected: false,
        goldSelected: false,
        platinumSelected: false,
        trialSelected: false,
        allonlineplans:true,
      }
    }
    this.toggleListData();
  }

  dataroomData;
  getDataroom(item, i, option) {
    console.log(this.listData)
    console.log(item, i, option)
    this.dataroomData = item;
    const value = '+04:00'

    if ( item.dataroom.created_date.includes(value)) {
      console.log(`The word "${value}" is present in the string!`);
      // Add your condition here
    } else {
      //console.log(`The word "${targetWord}" is NOT present in the string.`);
      item.dataroom.created_date = item.dataroom.created_date + value;
    }

    if ( item.end_date.includes(value)) {
      console.log(`The word "${value}" is present in the string!`);
      // Add your condition here
    } else {
      //console.log(`The word "${targetWord}" is NOT present in the string.`);
      item.end_date = item.end_date + value;
    }


    
    if ( item.dataroom.updated_date.includes(value)) {
      console.log(`The word "${value}" is present in the string!`);
      // Add your condition here
    } else {
      //console.log(`The word "${targetWord}" is NOT present in the string.`);
      item.dataroom.updated_date = item.dataroom.updated_date + value;
    }

    
    this.dataroomData = item;

    this.listData.forEach(element => {
      element['select'] = false;
    });
    this.listData[i]['select'] = true

    if (option == 'silver') {
      this.onlineChannels = {
        silverSelected: true,
        goldSelected: false,
        platinumSelected: false,
        trialSelected: false,
        allonlineplans:false,
      }
    } else if (option == 'gold') {
      this.onlineChannels = {
        silverSelected: false,
        goldSelected: true,
        platinumSelected: false,
        trialSelected: false,
        allonlineplans:false,
      }
    } else if (option == 'platinum') {
      this.onlineChannels = {
        silverSelected: false,
        goldSelected: false,
        platinumSelected: true,
        trialSelected: false,
        allonlineplans:false,
      }
    } else if (option == 'trial') {
      this.onlineChannels = {
        silverSelected: false,
        goldSelected: false,
        platinumSelected: false,
        trialSelected: true,
        allonlineplans:false,
      }
    }else if(option=='allplans')
    {
      this.onlineChannels = {
        silverSelected: false,
        goldSelected: false,
        platinumSelected: false,
        trialSelected: false,
        allonlineplans:true,
      }
    }
  }

  allonlineusers=[];
  getOnlineTeamUsers()
  {
    this.dataRoomService.getOnlineTeamUsersData().subscribe(res=>{
      res.data.map(res=>{
       this.allonlineusers.push(res)
      })
    })
  }

  dashboardData=[];
  getDashboardData()
  {
    this.dataRoomService.getOnlineDashboardData().subscribe(res=>{
      console.warn(res)
      this.dashboardData =res.data;
    })
  }

  hiddendatarooms:boolean=true;
  takeBack=false;
  hiddenteams:boolean=false;
  getDataroomparent(item)
  {
    this.hiddenteams=true;
    this.takeBack=true;
    this.hiddendatarooms=false;
    // item, i, option
    console.warn(item.item,item.i,item.planname);
    this.getDataroom(item.item, item.i, item.planname);
    
  }
  getbacktoteams()
  {
    this.hiddenteams=false;
    this.hiddendatarooms=true;
  }

  // searchForm:FormGroup;
  activenofound=false;
  dataroomdata=[];
  teamsdata=[]  
  backbuttonsearch=false;
  searchActive=false;
  searchTeamandDatarooms()
  {
    this.activenofound =true;
    this.searchActive=true;
    this.backbuttonsearch=true;
    console.warn(this.searchForm.get('allunisearchtext').value);
    this.dataRoomService.getUniversalDatroomTeams(this.searchForm.get('allunisearchtext').value).subscribe(res=>{
      console.log(res);
      this.dataroomdata = res.dataroomdata;
      this.teamsdata = res.myteamdata;
    });
  }
  backsearchbutton()
  {
    this.searchActive=false;
    this.backbuttonsearch=false;
  }
}
