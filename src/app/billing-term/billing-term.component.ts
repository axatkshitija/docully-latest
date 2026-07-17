import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../services";
import { ToastrService } from "ngx-toastr";
import { BaseUrlClass } from "../common";

export interface DialogData { }

@Component({
  selector: "app-billing-term",
  templateUrl: "./billing-term.component.html",
  styleUrls: ["./billing-term.component.css"],
})
export class BillingTermComponent implements OnInit {
  plans: any;
  billing_details: any = {};
  total: any;
  clicked: boolean = false;
  baseUrl: any;
  plandetails: any = [];
  model: { user_id: any; step: string; edition: any; plan_id: any; fee: any };
  plan_id: string;
  selectedItem = null;
  user_details: any;
  isTrial: boolean;
  planitem: any;
  trialcheck: boolean = false;
  paymentSuccessfull: string;
  isPaymentRetry: boolean;
  gotolink: boolean = false;
  dataroomNameError: string = "";


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private HomepageService: AuthenticationService,
    private toastr: ToastrService,
    private location: Location,
    private baseUrlClass: BaseUrlClass,
  ) {
    this.baseUrl = this.baseUrlClass.baseUrl;
   }

  ngOnInit() {
    this.route.params.subscribe(param => {
      if (param) {
        if (param.state == 'start') {
          this.router.navigate(["./payment-successful/success"]);
          this.paymentSuccessfull = "show";

        } else if (param.state == 'end') {
          this.paymentSuccessfull = "hide";
          this.router.navigate(["./payment-successful/fail"]);
          this.isPaymentRetry = true;
        }
      }
    })
    let plan = localStorage.getItem("plan");
    this.plans = JSON.parse(plan);
    let user_details = localStorage.getItem("user");
    let plan_id = localStorage.getItem("plan_id");
    this.plan_id = plan_id;
    this.user_details = JSON.parse(user_details);
    this.isTrial = JSON.parse(localStorage.getItem('isTrial'))
    if (user_details) {
      if (this.user_details.is_trial) {
        this.trialcheck = true;
      }
    } else if (this.isTrial) {
      this.trialcheck = false;
    }

    this.plansgetapi();
  }


  goBack() {
    this.location.back();
  }

  onClickannually(plans) {
    this.billing_details.plan_id = plans.id;
    this.billing_details.Selected_plan = plans.category;
    this.billing_details.Edition = plans.plan;
    this.billing_details.Billing_freq = "Annually";
    this.billing_details.Effective_price = plans.twelve_month_price;
    this.billing_details.Total_fee = plans.twelve_month_price;
    this.billing_details.months = 12;
    console.log(this.billing_details);
    this.saveData();
  }

  onClickmonthly(plans) {
    this.billing_details.plan_id = plans.id;
    this.billing_details.Selected_plan = "Standard";
    this.billing_details.Edition = plans.edition;
    this.billing_details.Billing_freq = "Monthly";
    this.billing_details.Effective_price = plans.fee;
    this.billing_details.Total_fee = plans.fee;
    console.log(this.billing_details, plans);
    this.billing_details.months = 1;
    this.saveData();
  }

  onClickquarterly(plans) {
    this.billing_details.plan_id = plans.id;
    this.billing_details.Selected_plan = plans.category;
    this.billing_details.Edition = plans.plan;
    this.billing_details.Billing_freq = "Quarterly";
    this.billing_details.Effective_price = plans.three_month_price;
    this.billing_details.Total_fee = plans.three_month_price;
    this.billing_details.months = 3;
    console.log(this.billing_details);
    this.saveData();
  }

  saveData() {
    alert("save data");
    this.billing_details["user_details"] = this.user_details;
    this.billing_details["step"] = "step2";
    this.billing_details["planid"] = this.plan_id;
    localStorage.setItem(
      "billing_details",
      JSON.stringify(this.billing_details)
    );
  }

  onSubmit() {
    this.onClickmonthly(this.plans);
    this.HomepageService.plansubscription(this.billing_details).subscribe(
      (res) => {
        console.log("plan subscription", res, "success");
        localStorage.setItem("plan", JSON.stringify(this.plans));

        this.billing();
      },
      (error) => {
        console.log(error, "plan subscription in");
      }
    );
  }


  billing() {
    window.location.href = "./#/billing-details";
  }
  // himanshu -- 30 december
  singleplandata: any = [];
  showcost: boolean = false;
  AddPlan(planitem) {
    this.selectedItem = planitem;
    this.HomepageService.getSinglePlanDetails(planitem).subscribe(
      (res) => {
        console.log(res);
        if (res.length === 0) {
          this.gotolink = true
        } else {
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


  getplans: any;
  error: boolean = false;
  plansgetapi() {
    this.HomepageService.getPlanDetails().subscribe(
      (res) => {
        this.getplans = res;
        this.getplans = this.getplans.filter(item => item.id != 2 && item.id != 3 && item.id != 5 && item.id != 6 && item.id != 7 && item.id != 8);

        this.getplans = [... this.getplans, {
          name: "Enterprise Plan",
          cost: 100000,
          term: "quarterly",
          id: 9
        }];
        console.log(this.getplans, "plans detail")

        this.getplans = this.getplans.sort(function (a, b): any {
          const costA = a['cost'];
          const costB = b['cost'];
          return costB > costA ? -1 : costB < costA ? 1 : 0;
        });
        if (this.trialcheck) {
          this.getplans.forEach((element, index) => {
            if (element.cost == 0) this.getplans.splice(index, 1);
          });
        }
      },
      (error) => {
        this.error = true;
        console.log("all plans error");
      }
    );
  }

  selectplanalert() {
    alert("please select a plan");
  }

  singleplan: any;
  billingpage(singleplan) {
    if (singleplan != 9) {
      this.HomepageService.maintainsubscriptionsession(singleplan).subscribe(
        (res) => {
          console.log("here", res);
          localStorage.setItem("selectplanid", singleplan);
          this.PayPlan();
        },
        (error) => {
          console.log("error in session");
        }
      );

    }
    else {
      let url = this.baseUrl + "/zoho_custom_plan/";
      window.location.href = url;
      console.log("here", ">>>>>>>>>>>>>>>>>>");
    }

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
    } else {
      this.toastr.error("Please enter dataroom name.")
    }
  }

  validateDataroomName(event: any) {
    const value = event.target.value;
    const pattern = /^[a-zA-Z0-9_ ]*$/;

    if (value === "") {
      this.dataroomNameError = "";
    } else if (!pattern.test(value)) {
      this.dataroomNameError = "Only alphanumeric characters and underscores are allowed.";
      // Remove invalid characters
      this.item.dataroom_name = value.replace(/[^a-zA-Z0-9_ ]/g, "");
    } else {
      this.dataroomNameError = "";
    }
  }

}

@Component({
  selector: "app-billing-term",
  templateUrl: "./billing-term-cpid.component.html",
  styleUrls: ["./billing-term.component.css"],
})
export class BillingTermCPIDComponent implements OnInit {
  custom_plan: any;
  total: any;
  custom_details: any = {};
  plans: any;
  private HomepageService: AuthenticationService;
  plan_id: string;

  onClickannually(custom_plan) {
    this.custom_details.plan_id = custom_plan.id;
    this.custom_details.Selected_plan = custom_plan.plan;
    this.custom_details.Edition = custom_plan.storage;
    this.custom_details.Billing_freq = "Annually";
    this.custom_details.Effective_price = custom_plan.twelve_month_price;
    this.custom_details.Total_fee = custom_plan.twelve_month_price;
    console.log(this.custom_details);
    this.saveData();
  }

  onClickmonthly(custom_plan) {
    this.custom_details.plan_id = custom_plan.id;
    this.custom_details.Selected_plan = custom_plan.plan;
    this.custom_details.Edition = custom_plan.storage;
    this.custom_details.Billing_freq = "Monthly";
    this.custom_details.Effective_price = custom_plan.fee;
    this.custom_details.Total_fee = custom_plan.fee;
    this.custom_details["step"] = "step2";

    console.log(this.custom_details, "custom details");
    this.saveData();
  }

  onClickquarterly(custom_plan) {
    this.custom_details.plan_id = custom_plan.id;
    this.custom_details.Selected_plan = custom_plan.plan;
    this.custom_details.Edition = custom_plan.storage;
    this.custom_details.Billing_freq = "Quarterly";
    this.custom_details.Effective_price = custom_plan.three_month_price;
    this.custom_details.Total_fee = custom_plan.three_month_price;
    console.log(this.custom_details);
    this.saveData();
  }

  saveData() {
    // console.log(this.billing_details);
    this.custom_details["user_details"] = this.plans.user_id;
    this.custom_details["planid"] = this.plan_id;

    localStorage.setItem("cpid_details", JSON.stringify(this.custom_details));
    // console.log(JSON.parse(localStorage.getItem('billing_details')));
  }

  onSubmit() {
    this.onClickmonthly(this.plans);
    this.HomepageService.plansubscription(this.custom_details).subscribe(
      (res) => {
        console.log("plan subscription", "success");
        // this.billing();
      },
      (error) => {
        console.log(error, "plan subscription in");
      }
    );
  }
  billing() {
    window.location.href = "./#/billing-details-cpid";
  }

  user_details: any;
  ngOnInit() {
    let plan = localStorage.getItem("plan");
    this.plans = JSON.parse(plan);
    let plan_id = localStorage.getItem("plan_id");
    this.plan_id = plan_id;

    let custom_plan = localStorage.getItem("custom_plan_details");
    this.custom_plan = JSON.parse(custom_plan);
    let user_details = localStorage.getItem("user");
    this.user_details = JSON.parse(user_details);
  }
}
