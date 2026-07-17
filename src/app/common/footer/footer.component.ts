import { Component, OnInit, ViewEncapsulation, Input, Output } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {
   @Input('user')
  user : any;  

 pdfSrc = 'http://www.pdf995.com/samples/pdf.pdf';

   htmlContent : any;
  constructor() { }

  ngOnInit() {
    this.comments;
  }
  comments = [
    {value: '0fficial-0', viewValue: 'Official'},
    {value: 'legal-1', viewValue: 'Legal'},
    {value: 'financial-2', viewValue: 'Financial'},
    {value: 'corporate-3', viewValue: 'Corporate'},
    {value: 'confidential-4', viewValue: 'Confidential'},
  ];
  chkedBox=true

  getHtmlContent(htmlContent:any){
    console.log( htmlContent);
  }


}
