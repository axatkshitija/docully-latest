import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../services/index";
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { Location } from "@angular/common";
import { BaseUrlClass } from "../common/base_url";

@Component({
  selector: 'app-drm-check',
  templateUrl: './drm-check.component.html',
  styleUrls: ['./drm-check.component.css']
})
export class DrmCheckComponent implements OnInit {

    constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private _location: Location,
    private baser_url: BaseUrlClass
  ) { }

  ngOnInit() {

  	console.log(this.route.snapshot.paramMap.get("folderId"))
  }

}
