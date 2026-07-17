import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataRoomService } from '../../services';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.css']
})
export class ManageAddonsComponent implements OnInit {

  invoiceList;
  user;
  dataroomId;

  constructor(public dataRoomService: DataRoomService, public route: ActivatedRoute, public location: Location,   private cookieService : CookieService,) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.dataroomId = param.id
    })
    this.getUserInfo();
  }



  async getUserInfo() {
  //  this.dataRoomService.getUserProfile().subscribe((res) => {
      this.user = JSON.parse(    localStorage.getItem("currentUser"));
   // });
    let response = await this.dataRoomService.getInvoiceHistory(this.dataroomId);
    this.invoiceList = response['data']
    console.log(this.invoiceList);
  }


  downloadInvoice(planId) {
    this.dataRoomService.downloadInvoice(planId).subscribe(res => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement("a");
      a.setAttribute("style", "display:none;");
      document.body.appendChild(a);

      var filename = "Docully-invoice";
      var fileExt = "pdf";
      console.log(filename, "filenamee");
      console.log(fileExt, "fileExt");
      a.href = url;
      a.download = filename;
      a.click();
    });
  }

  downloadAddOnDvdInvoice(planId) {
    this.dataRoomService.downloadAddOnDvdInvoice(planId).subscribe(res => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement("a");
      a.setAttribute("style", "display:none;");
      document.body.appendChild(a);

      var filename = "Docully-invoice";
      var fileExt = "pdf";
      console.log(filename, "filenamee");
      console.log(fileExt, "fileExt");
      a.href = url;
      a.download = filename;
      a.click();
    });
  }
  
  downloadStorageAddOnInvoice(planId) {
    this.dataRoomService.downloadStorageAddOnInvoice(planId).subscribe(res => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement("a");
      a.setAttribute("style", "display:none;");
      document.body.appendChild(a);

      var filename = "Docully-invoice";
      var fileExt = "pdf";
      console.log(filename, "filenamee");
      console.log(fileExt, "fileExt");
      a.href = url;
      a.download = filename;
      a.click();
    });
  }

  goBack() {
    this.location.back();
  }

}
