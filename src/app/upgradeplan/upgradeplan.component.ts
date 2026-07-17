import { Component, OnInit } from '@angular/core';
import { AuthenticationService, DataRoomService, SharedService } from "../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { BaseUrlClass } from '../common';

@Component({
  selector: 'app-upgradeplan',
  templateUrl: './upgradeplan.component.html',
  styleUrls: ['./upgradeplan.component.css']
})
export class UpgradeplanComponent implements OnInit {
  plans: any;
  currentplan:any;
  selectedItem = null;
  subscriptionId: string;
  gotolink: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private DataRoomService: DataRoomService,
    private HomepageService: AuthenticationService,
    private toastr: ToastrService,
    private cookieService:CookieService,
    private baseUrlClass:BaseUrlClass
  ) { }


  goBack() {
    this.router.navigate(["./manage-subscription/"+this.subscriptionId]);
  }

  singleplan: any;
  billingpage(singleplan) {
    if(singleplan != 8){
      this.HomepageService.maintainsubscriptionsession(singleplan).subscribe(
        (res) => {
          console.log("here", res);
          localStorage.setItem("selectplanid", singleplan)
      
          this.PayPlan()
          // this.router.navigate(["./billing-details"]);
        },
        (error) => {
          console.log("error in session");
        }
      );

    }
    else{
      let url = this.baseUrlClass.baseUrl + "/zoho_custom_plan/";
      window.location.href = url;
      console.log("here", ">>>>>>>>>>>>>>>>>>");
    }

  }
  singleplandata: any =[];
  showcost: boolean = false;
  // AddPlan(planitem) {
  //   this.selectedItem = planitem;
  //   this.DataRoomService.getSinglePlanDetails(planitem).subscribe(
  //     (res) => {
  //       console.log(res);
  //       this.singleplandata = res;
  //       this.showcost = true;
  //     },
  //     (error) => {
  //       console.log("error");
  //     }
  //   );
  // }


  AddPlan(planitem) {
    this.selectedItem = planitem;
    this.HomepageService.getSinglePlanDetails(planitem).subscribe(
      (res) => {
        console.log(res);
        if(res.length === 0){
          this.gotolink = true 
        }else{
          this.gotolink = false 
        }
        this.singleplandata = res;
        this.showcost = true;

      },
      (error) => {
        console.log("error");
      }
    );
  }


  upgradeplanlist(subscriptionId) {
    this.DataRoomService.getUpgradePlanDetails(subscriptionId).subscribe(
      (res) => {
        this.plans = res;
       // this.plans = this.plans.filter(e=>e.id != 4 && e.id != 5 && e.id != 3);

       this.plans = this.plans.filter(item =>item.id != 4 && item.id != 3 && item.id != 5 && item.id != 6 && item.id != 7 && item.id != 2 && item.id != 8);
       this.plans = [... this.plans,{
        name: "Enterprise Plan",
        cost: 100000,
        term: "quarterly",
        id:8
      }];

      console.log(">>>>>>>>>>", this.plans)

        this.plans = this.plans.sort(function (a, b): any {
          const costA = a['cost'];
          const costB = b['cost'];
          return costB > costA ? -1 : costB < costA ? 1 : 0;
        });
      },
      (error) => {
        console.log("error", error)
      }
    );
  }
  
  reactivateplanlist(subscriptionId) {
    this.DataRoomService.getRectivatePlanDetails(subscriptionId).subscribe(
      (res) => {
        this.plans = res;
       // this.plans = this.plans.filter(e=>e.id != 4 && e.id != 5 && e.id != 3)
        this.plans = this.plans.filter(item =>item.id != 4 && item.id != 3 && item.id != 5 && item.id != 6 && item.id != 7 && item.id != 2 && item.id != 8);
        this.plans = [... this.plans,{
          name: "Enterprise Plan",
          cost: 100000,
          term: "quarterly",
          id:8
        }];
        console.log(">>>>>>>>>>", this.plans)
       
        this.plans = this.plans.sort(function (a, b): any {
          const costA = a['cost'];
          const costB = b['cost'];
          return costB > costA ? -1 : costB < costA ? 1 : 0;
        });
      },
      (error) => {
        console.log("error", error)
      }
    );
  }

  getcurrentPlan(subscriptionId) {
    this.DataRoomService.getcurrentplandetail(subscriptionId).subscribe(
      (res) => {
        this.currentplan = res;
        this.item.dataroom_name = res.dataroom.dataroom_nameFront
      },
      (error) => {
        console.log("error", error)
      }
    );
  }



  item: any = {}
  PayPlan() {
    console.log(this.singleplandata)

    let paymentFormData = JSON.parse(localStorage.getItem('paymentForm'));
    console.log(paymentFormData)
    this.item["Billing_freq"] = this.singleplandata[0]["term"];
    this.item["Total_fee"] = this.singleplandata[0]["cost"];
    this.item["grand_total"] = this.singleplandata[0]["cost"];
    this.item["oldplanid"] = localStorage.getItem("oldplanid")
    this.item["step"] = "step3";
    this.item["dataroom_name"] = this.item.dataroom_name;
    this.item["pid"] = this.singleplandata[0]["id"];
    this.item["upgradeplanflag"] = localStorage.getItem("upgradeplan");
    console.log(this.item, "item for plan to pay")
    if (this.item.dataroom_name != null) {
      console.log("enter here in this function")
      localStorage.setItem('paymentForm', JSON.stringify(this.item))
      this.HomepageService.plansubscription(this.item).subscribe(
        (res) => {
          console.log("plan subscription", "success");
          localStorage.removeItem("oldplanid")
          localStorage.removeItem("upgradeplanflag")
          let url = res;
          window.location.href = url;
        },
        (error) => {
          console.log(error.status, "payment");
        }
      );
    }else{
      console.log("payment error");
      this.toastr.error("Please enter dataroom name.")
    }
  }


  ngOnInit() {
    var subscribeplanid = this.route.snapshot.paramMap.get("id");
    this.route.params.subscribe(param => {
      if(param.type == 'upgrade') {
        this.subscriptionId = subscribeplanid;
        if (subscribeplanid) {
          this.upgradeplanlist(subscribeplanid);
          this.getcurrentPlan(subscribeplanid);
          localStorage.setItem("oldplanid", subscribeplanid)
    
        }
        else {
          localStorage.setItem("oldplanid", "")
        }
      } else if(param.type == 'reactivate') {
        this.reactivateplanlist(subscribeplanid);
      }
    })

  }

}



