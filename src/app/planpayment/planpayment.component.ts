import { Component, OnInit } from '@angular/core';
import { DataRoomService, SharedService } from "../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { countries } from '../share-data/countries';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: "app-planpayment",
  templateUrl: "./billing-details-cpid.component.html",
  styleUrls: ["./planpayment.component.css"],
})
export class BillingDetailsCPIDComponent implements OnInit {
  custom_details: any;
  // vat_detail: any;
  selectedvalue: any;
  grand_total: any;
  plan_id: string;
  msg: string;

  constructor(
    private DataRoomService: DataRoomService,
    private toastrService: ToastrService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

  }


}



@Component({
  selector: 'app-planpayment',
  templateUrl: './planpayment.component.html',
  styleUrls: ['./planpayment.component.css']
})
export class PlanpaymentComponent implements OnInit {

  constructor(
    private DataRoomService: DataRoomService,
    private toastrService: ToastrService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService:CookieService
  ) {

    
   }
  checked: boolean = false;
  item: any = {};
  selectplancost: any;
  selected_plan_id: any;
  selected_term: any;
  planitem: any;
  planselectarray: any;
  showresult: boolean = false;
  custom_details: any;
  // vat_detail: any;
  selectedvalue: any;
  grand_total: any;
  plan_id: string;
  msg: string;
  validationcriteria: any;
  model: any = {};


  billing_address_empty: boolean = false;
  billing_city_empty: boolean = false;
  billing_state_empty: boolean = false;
  billing_po_box_empty: boolean = false;
  billing_dataroom_name: boolean = false;
  billing_company_name: boolean = false;


  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  onSubmit() {

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
    this.item["others"] = this.item.others;


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


    // if (this.showpoxbox) {
    this.validationcriteria = this.item.dataroom_name && this.item.billing_address && this.item.billing_city && this.item.billing_state && this.item.billing_country
    // }
    // else {
    //   this.validationcriteria = this.item.dataroom_name && this.item.billing_address && this.item.billing_city && this.item.billing_state && this.item.billing_country && this.item.others
    // }

    if (this.validationcriteria) {
      localStorage.setItem('paymentForm', JSON.stringify(this.item))
      
      this.DataRoomService.plansubscription(this.item).subscribe(
        (res) => {
          this.msg = "process successful";
          var url = res;
          this.showSuccess();
          this.showresult = false;
          this.billing_address_empty = false;
          this.billing_city_empty = false;
          this.billing_state_empty = false;
          this.billing_po_box_empty = false;
          this.billing_dataroom_name = false;
          this.showpoxbox = false;
          // this.billing_company_name = false;
          // localStorage.removeItem('selectplanid');
          // localStorage.removeItem("oldplanid")
          // localStorage.removeItem("upgradeplanflag")

          if (localStorage.getItem("upgradeplan")) {
            // localStorage.removeItem('selectplanid');
            // localStorage.removeItem("oldplanid")
            localStorage.removeItem("upgradeplanflag")
            window.location.href = url;
            // this.router.navigate(["./planupgardesuccess"]);
          }
          else {
            localStorage.removeItem('selectplanid');
            // localStorage.removeItem("oldplanid")
            localStorage.removeItem("upgradeplanflag")
            this.router.navigate(["./paysuccess"]);
          }

        },
        (error) => {
          console.log(error.status, "payment");
          if (error.status === 400) {
            this.msg = "Already Used Trial";
            this.showError();
          }
        }
      );
    }
    else {
      this.msg = "Please enter all the fields";
      this.showError();
    }
  }

  getFormAutoFillData()
  {
    this.item["dataroom_name"] = "temprary dataroom name";
    this.item["billing_state"] = "temp state";
    this.item["company_name"] = "Comapany Name";
    this.item["billing_address"] = "Temp billing address";
    this.item["billing_city"] = "Billing City"
    this.item["billing_country"] = "India"
    console.warn(this.item)
  }

  countryData = [];
  getCountryOnSearch(event) {
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

  getCountryName(value) {
    this.item.billing_country = value;
  }

  clickAgree($event) {
    this.checked = $event.target.checked;
  }

  showpoxbox: boolean = false;
  selectChangeHandler(event: any) {
    if (this.showresult) {
      this.selectedvalue = event.target.value;
      this.selectplancost = this.planselectarray[0]["cost"];
      this.selected_plan_id = this.planselectarray[0]["id"];
      this.selected_term = this.planselectarray[0]["term"];
    }

    // if (this.selectedvalue == "UAE") {
    //   this.showpoxbox = true;
    //   this.vat_detail = ((5 / 100) * this.selectplancost).toFixed(2);
    //   this.item["var_detail"] = this.vat_detail;
    // } else {
    // this.showpoxbox = false;
    // this.vat_detail = 0;
    // this.item["vat_detail"] = this.vat_detail;
    // }
    // this.grand_total = +this.selectplancost + +this.vat_detail;
    // this.grand_total = this.selectplancost;
    this.item["grand_total"] = this.grand_total;
    this.item["pid"] = this.selected_plan_id;
    this.item["Total_fee"] = this.selectplancost;
    this.item["Billing_freq"] = this.selected_term;
  }

  getPlanfromstorage() {
    let planitem = localStorage.getItem("selectplanid");
    this.DataRoomService.getSinglePlanDetails(planitem).subscribe(
      (res) => {
        this.planselectarray = res;
        this.grand_total = this.planselectarray[0]['cost']
        // console.log(this.planselectarray)
        this.showresult = true;
      },
      (error) => {
        console.log("error");
      }
    );
  }

  paymentSuccessfull;
  isPaymentRetry = false;
  ngOnInit() {
    this.getFormAutoFillData();
    this.route.params.subscribe(param => {
      if (param) {
        if (param.state == "start") {
          this.paymentSuccessfull = "show";
        } else if (param.state == "end") {
          this.paymentSuccessfull = "hide"
          this.isPaymentRetry = true;
        }
      }
    })

    let checkplanselectedornot = localStorage.getItem("selectplanid");
    if (checkplanselectedornot) {
      this.getPlanfromstorage();
    }

    let paymentFormData = JSON.parse(localStorage.getItem('paymentForm'));
    console.log(paymentFormData)
    if (paymentFormData != null || paymentFormData != undefined) {
      this.item = paymentFormData;
      // setTimeout(() => {
      //   this.paymentSuccessfull = true;
      // }, 5000);
      localStorage.removeItem('paymentForm');
    }
  }
}
