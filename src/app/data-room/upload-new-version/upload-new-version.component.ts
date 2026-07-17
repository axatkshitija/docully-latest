import { Component, OnInit, Input , Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-upload-new-version',
  templateUrl: './upload-new-version.component.html',
  styleUrls: ['./upload-new-version.component.css']
})
export class UploadNewVersionComponent implements OnInit {

  @Input() folder : any ;
  @Input() i : number;
  
  constructor() { }

  ngOnInit() {
  }

}
