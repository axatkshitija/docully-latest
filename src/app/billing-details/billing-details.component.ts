import { Component, OnInit, Inject } from "@angular/core";
import { trigger, transition, useAnimation } from "@angular/animations";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { countries } from '../share-data/countries';
import { AuthenticationService } from "../services";


@Component({
  selector: "app-billing-details",
  templateUrl: "./billing-details.component.html",
  styleUrls: ["./billing-details.component.scss"],
})
export class BillingDetailsComponent implements OnInit {
  billing_address_details: any = {
    billing_address: "",
    billing_city: "",
    billing_state: "",
    po_box: "",
  };
  billing_details: any = {};
  checked: boolean = false;
  vat_detail: any;
  selectedvalue: any;
  grand_total: any;
  plan_id: any;
  item: any = {};
  selectplancost: any;
  selected_plan_id: any;
  selected_term: any;
  
  constructor(
    public dialog: MatDialog,
    private _location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private HomepageService: AuthenticationService,
    private toastr: ToastrService,
  ) { }

  user_details: any;
  oldplan_id: any;
  msg: any;

  planselectedbyuser: any;
  getselectedplan(planselectedbyuser:any) {
    this.HomepageService.getUserSelectedplan(planselectedbyuser).subscribe(
      (res) => {
        console.log("plans api result", res);
      },
      (error) => {
        console.log("all plans error");
      }
    );
  }

  async getFormDetails() {
    console.log('svdfdvfjh')
    let response:any = await this.HomepageService.formdetails();
    console.log(response);
    if (response != false) {
      
      this.item['billing_country'] = response['billing_country'];
      this.item['billing_state'] = response['billing_state'];
      this.item['billing_city'] = response['billing_city'];
      this.item['billing_address'] = response['billing_address'];
    }
    // this.HomepageService.formdetails().subscribe(
    //   (res) => {
    //     console.log("form result", res);
    //     this.item['billing_country'] = res.billing_country;
    //     this.item['billing_state'] = res.billing_state;
    //     this.item['billing_city'] = res.billing_city;
    //     this.item['billing_address'] = res.billing_address;
    //   },
    //   (error) => {
    //     console.log("all plans error", error);
    //   }
    // );
  }

  planitem: any;
  planselectarray: any;
  showresult: boolean = false;
  getPlanfromstorage() {
    let planitem = localStorage.getItem("selectplanid");
    this.HomepageService.getSinglePlanDetails(planitem).subscribe(
      (res) => {
        console.log("see plan response", res);
        this.planselectarray = res;
        this.grand_total = this.planselectarray[0]['cost']
        this.showresult = true;
      },
      (error) => {
        console.log("error");
      }
    );
  }

  paymentSuccessfull:any;
  isPaymentRetry = false;
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

    let billing_details:any = localStorage.getItem("billing_details");
    let billing_details_address:any = localStorage.getItem("user");
    let plan_id = localStorage.getItem("plan_id");
    this.plan_id = plan_id;

    this.billing_details = JSON.parse(billing_details);
    this.billing_address_details = JSON.parse(billing_details_address);
    console.log(this.billing_details, 37);
    let user_details:any = localStorage.getItem("user");
    this.user_details = JSON.parse(user_details);
    this.oldplan_id = localStorage.getItem("plan.plan_id");
    let usercheck =     localStorage.getItem("currentUser");
    // if(usercheck){
    //   this.item.company_name = usercheck.company_name;  
    // }

    // this.getselectedplan(this.user_details.id);
    let checkplanselectedornot = localStorage.getItem("selectplanid");
    if (checkplanselectedornot) {
      this.getPlanfromstorage();
    }

    const paymentForm:any = localStorage.getItem('paymentForm')
    let paymentFormData = JSON.parse(paymentForm);
    console.log(paymentFormData)
    if (paymentFormData != null) {
      this.item = paymentFormData;
      // this.paymentSuccessfull = true;
      localStorage.removeItem('paymentForm');
    } else {
      console.log('213213')
      this.getFormDetails();
    }
  }

  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  goBack() {
    this._location.back();
  }

  clickAgree($event:any) {
    this.checked = $event.target.checked;
  }

  countryData:any = [];
  getCountryOnSearch(event:any) {
    this.countryData = [];
    // console.log(event.target.value)
    for (let i = 0; i < countries.length; i++) {
      // console.log(countries[i]['name'])
      if (countries[i]['name'].toLowerCase().startsWith(event.target.value)) {
        this.countryData.push(countries[i]);
        // console.log(this.countryData)
      }
    }
  }

  getCountryName(value:any) {
    this.item.billing_country = value;
  }

  model: any = {};
  showpoxbox: boolean = false;
  selectChangeHandler(event: any) {
    if (this.showresult) {
      this.selectedvalue = event.target.value;
      this.selectplancost = this.planselectarray[0]["cost"];
      this.selected_plan_id = this.planselectarray[0]["id"];
      this.selected_term = this.planselectarray[0]["term"];
    }

    if (this.selectedvalue == "UAE") {
      this.showpoxbox = true;
      this.vat_detail = ((5 / 100) * this.selectplancost).toFixed(2);
      this.item["var_detail"] = this.vat_detail;
    } else {
      this.showpoxbox = false;
      this.vat_detail = 0;
      this.item["vat_detail"] = this.vat_detail;
    }
    this.grand_total = this.selectplancost;
    this.item["grand_total"] = this.grand_total;
    this.item["pid"] = this.selected_plan_id;
    this.item["Total_fee"] = this.selectplancost;
    this.item["Billing_freq"] = this.selected_term;
  }

  billing_address: string = "";
  billing_city: string = "";
  billing_state: string = "";
  billing_country: string = "";
  po_box: any;
  data: any = {};
  team: any = {};
  billing_address_empty: boolean = false;
  billing_city_empty: boolean = false;
  billing_state_empty: boolean = false;
  billing_po_box_empty: boolean = false;
  billing_dataroom_name: boolean = false;
  billing_company_name: boolean = false;

  freeTrialClicked = false

  onSubmit() {
    this.freeTrialClicked = true;

    if (this.item.dataroom_name) {
      this.item["dataroom_name"] = this.item.dataroom_name;
    }
    else {
      this.billing_dataroom_name = true;
    }
    this.item["company_name"] = this.item.company_name;

    if (this.item.company_name) {
      this.item["company_name"] = this.item.company_name;
    }
    // else{
    //   this.billing_company_name = true;
    // }

    if (this.item.billing_address) {
      this.item["billing_address"] = this.item.billing_address;
    }
    else {
      this.billing_address_empty = true;
    }

    if (this.item.billing_city) {
      this.item["billing_city"] = this.item.billing_city;
    }
    else {
      this.billing_city_empty = true;
    }

    if (this.item.billing_state) {
      this.item["billing_state"] = this.item.billing_state;
    }
    else {
      this.billing_state_empty = true;
    }

    this.item["po_box"] = this.item.po_box;


    // if(this.item.po_box){
    //   this.item["po_box"] = this.item.po_box;
    // }
    // else{
    //   this.billing_po_box_empty = true;
    // }
    // this.item[
    //   "billing_address"
    // ] = this.item.billing_address;
    this.item["step"] = "step3";
    if (localStorage.getItem("oldplanid")) {
      this.item["oldplanid"] = localStorage.getItem("oldplanid")
    }
    else {
      this.item["oldplanid"] = "";
    }

    if (localStorage.getItem("upgradeplan")) {
      this.item["upgradeplanflag"] = localStorage.getItem("upgradeplan")
    }
    else {
      this.item["upgradeplanflag"] = "";
    }

    if (this.showresult) {
      this.selectedvalue = this.item.billing_country;
      this.selectplancost = this.planselectarray[0]["cost"];
      this.selected_plan_id = this.planselectarray[0]["id"];
      this.selected_term = this.planselectarray[0]["term"];
    }
    // this.grand_total = this.selectplancost;
    this.item["grand_total"] = this.grand_total;
    this.item["pid"] = this.selected_plan_id;
    this.item["Total_fee"] = this.selectplancost;
    this.item["Billing_freq"] = this.selected_term;

    // this.item[
    //   "billing_city"
    // ] = this.item.billing_city;
    // this.item[
    //   "billing_state"
    // ] = this.item.billing_state;
    // this.item["po_box"] = this.item.po_box;


    localStorage.setItem("payment_billing_details",
    JSON.stringify(this.billing_details))

    if (this.item.dataroom_name != null && this.item.billing_address != null && this.item.billing_city != null && this.item.billing_state != null) {
      console.log("enter here in this function")
      

      localStorage.setItem('paymentForm', JSON.stringify(this.item))

      this.HomepageService.plansubscription(this.item).subscribe(
        (res) => {
          console.log("plan subscription", "success");
          if (this.grand_total != 0) {
            this.msg = "Please wait while we redirect you to the payment gateway";
            this.showSuccess();
          }
          this.showresult = false;
          this.billing_address_empty = false;
          this.billing_city_empty = false;
          this.billing_state_empty = false;
          this.billing_po_box_empty = false;
          this.billing_dataroom_name = false;
          this.showpoxbox = false;
          // this.billing_company_name = false;
          // localStorage.removeItem('selectplanid');
          localStorage.removeItem("oldplanid")
          localStorage.removeItem("upgradeplanflag")
          let url = res;
          window.location.href = url;
          // this.router.navigate(["./payment-successful"]);


        },
        (error) => {
          console.log(error.status, "payment");
          // if(error.status === 400)
          // {
          //   this.msg = "Already Used Trial";
          //   this.showError();
          // }
        }
      );
    }
    else {
      console.log("not all field selected");
      this.msg = "Please enter all the fields";
      this.showError();
    }
    // this.HomepageService.plansubscription(this.item).subscribe(
    //   (res) => {
    //     console.log("plan subscription", "success");
    //     this.msg = "process successful";
    //     this.showSuccess();
    //     this.showresult = false;
    //     this.billing_address_empty = false;
    //     this.billing_city_empty = false;
    //     this.billing_state_empty = false;
    //     this.billing_po_box_empty = false;
    //     localStorage.removeItem('selectplanid');
    //     this.router.navigate(["./payment-successful"]);

    //   },
    //   (error) => {
    //     console.log(error.status, "plan subscription in");
    //     if(error.status === 400)
    //     {
    //       this.msg = "Already Used Trial";
    //       this.showError();
    //     }
    //     else{
    //       this.msg = "Please enter all the fields";
    //       this.showError();
    //     }
    //   }
    // );

    // error code -----

    this.data["plan_id"] = this.selected_plan_id;
    // this.data["months"] = this.billing_details.months;
    this.data["price"] = this.selectplancost
    // this.data["tax"] = this.billing_details.vat_detail;
    this.data["total"] = this.grand_total;
    this.data["portal_id"] = this.user_details.portal_id;
    this.data["oldplan_id"] = this.oldplan_id;
    this.HomepageService.updateUser(this.billing_address_details).subscribe(
      (res) => {
        console.log(res);
      }
    );

    console.log(this.data, localStorage.getItem("buy_plan"));
    if (localStorage.getItem("buy_plan") === "true") {
      this.team["team_created_by"] = this.user_details.portal_id;
      this.team["user"] = this.user_details.portal_id;
      this.HomepageService.createTeam(this.team).subscribe((res) => {
        console.log(res);
        this.data["team_id"] = res.id;
        this.data["portal_id"] = this.user_details.portal_id;
        this.HomepageService.buyNewPlan(this.data).subscribe((res) => {
          console.log(res);
          this.goToPortal();
        });
      });
    } else if (this.oldplan_id) {
      this.data["team_id"] = this.user_details.team_id;
      this.HomepageService.modifyPlan(this.data).subscribe((res) => {
        console.log(res);
        this.goToPortal();
      });
    } else {
      this.data["team_id"] = this.user_details.team_id;
      this.HomepageService.buyPlan(
        this.data,
        this.user_details.team_id
      ).subscribe((res) => {
        console.log(res);
        this.goToPortal();
      });
    }

    // this.payment();
  }

  goToPortal() {
    window.location.href = window.location.origin;
  }

  payment() {
    window.location.href = './payment-option';
  }
}

@Component({
  selector: "app-billing-details",
  templateUrl: "./billing-details-cpid.component.html",
  styleUrls: ["./billing-details.component.scss"],
})
export class BillingDetailsCPIDIComponent implements OnInit {
  custom_details: any;
  vat_detail: any;
  selectedvalue: any;
  grand_total: any;
  plan_id: any;
  msg:any;

  constructor(
    public dialog: MatDialog,
    private HomepageService: AuthenticationService,
    private toastrService: ToastrService,
    private toastr: ToastrService,
  ) { }

  model: any = {};

  selectChangeHandler(event: any) {
    this.selectedvalue = event.target.value;
    console.log(this.selectedvalue);

    if (this.selectedvalue == "UAE") {
      this.vat_detail = ((5 / 100) * this.custom_details.Total_fee).toFixed(2);
      console.log(this.vat_detail);
      this.custom_details["vat_detail"] = this.vat_detail;
    } else {
      this.vat_detail = 0;
      console.log(this.vat_detail);
      this.custom_details["vat_detail"] = this.vat_detail;
    }
    this.grand_total = +this.custom_details.Total_fee + +this.vat_detail;
    console.log(this.grand_total);
    this.custom_details["grand_total"] = this.grand_total;
  }


  user_details: any;
  ngOnInit() {
    let custom_details:any = localStorage.getItem("cpid_details");
    this.custom_details = JSON.parse(custom_details);
    let user_details:any = localStorage.getItem("data");
    let plan_id:any = localStorage.getItem("plan_id");
    this.plan_id = plan_id;

    this.user_details = JSON.parse(user_details);


    // console.log(JSON.parse(localStorage.getItem('data')));
  }


  billing_address: string = "";
  billing_city: string = "";
  billing_state: string = "";
  po_box: any;
  data: any = {};
  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  onSubmit() {
    this.custom_details["billing_address"] = this.billing_address;
    this.custom_details["billing_city"] = this.billing_city;
    this.custom_details["billing_state"] = this.billing_state;
    this.custom_details["step"] = "step3";
    this.custom_details["planid"] = this.plan_id;

    this.custom_details["po_box"] = this.po_box;


    localStorage.setItem(  "payment_custom_details",
    JSON.stringify(this.custom_details))
    console.log(this.custom_details);

    this.data["plan_id"] = this.custom_details.plan_id;
    this.data["months"] = this.custom_details.Billing_freq;
    this.data["price"] = this.custom_details.Total_fee;
    this.data["tax"] = this.custom_details.vat_detail;
    this.data["total"] = this.custom_details.grand_total;
    this.HomepageService.plansubscription(this.custom_details).subscribe(
      (res) => {
        console.log("plan subscription", "success");
        this.msg = "process successful";
        this.showSuccess();
      },
      (error) => {
        console.log(error, "plan subscription in");
      }
    );

    console.log(this.data);

    // this.HomepageService.buyPlan(this.data).subscribe((res) => {
    //   console.log(res);
    // });
    // this.payment();
  }

  // payment() {
  //     window.location.href = './#/payment-option';
  //   }
}
