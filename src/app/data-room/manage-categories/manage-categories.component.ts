import { Component, OnInit } from "@angular/core";
import { DataRoomService } from "../../services/index";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  NgForm,
} from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-manage-categories",
  templateUrl: "./manage-categories.component.html",
  styleUrls: ["./manage-categories.component.css"],
})
export class ManageCategoriesComponent implements OnInit {
  dataroomId: any;
  public selectedValue;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dataRoomService: DataRoomService,
    private router: Router,
    private cookieService: CookieService,
    private _location: Location
  ) {
    this.dataroomId = localStorage.getItem("currentDataroomId");
  }
  emailForm: any;
  ngOnInit() {
    this.categoriesList();
    this.getDataroomUserList();
    this.QNAAnalytics();
    // this.getUserInfo();
  }
  showHideUploadDiv() { }

  // user: any;
  // user_id: number;
  // getUserInfo() {
  //   this.dataRoomService
  //     .getUserProfileDatroom(this.dataroomId)
  //     .subscribe((res) => {
  //       this.user = res;
  //       this.user_id = res.id;
  //     });
  // }

  goBack() {
    this._location.back();
  }

  analytics: any = {};

  QNAAnalytics() {
    this.dataRoomService.QNAAnalytics(this.dataroomId).subscribe((res) => {
      this.analytics = res;
    });
  }
  msg: any;
  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  data: any[] = [];
  categories_list: any;
  editcategory: boolean = false;
  getcategorydata: any;
  Editcategory(itemid) {
    this.editcategory = true;
    this.dataRoomService.get_category_item(itemid).subscribe(
      (res) => {
        this.getcategorydata = res;
        console.log("get one item", res);
      },
      (error) => {
        console.log("error", error);
      })
  }

  updatecategoryitem: any = {};


  UpdateCategory(categoryid) {
    this.updatecategoryitem["user_id"] = this.selectedValue
    this.updatecategoryitem["category_name"] = this.getcategorydata.categories_name
    this.updatecategoryitem['id'] = categoryid
    this.updatecategoryitem['dataroom_id'] = this.dataroomId
    this.dataRoomService.update_category_item(this.updatecategoryitem).subscribe(
      (res) => {
        this.msg = "Category Updated"
        this.showSuccess();
        this.editcategory = false;
        this.router.navigate(["qa-user"]);
      },
      (error) => {
        console.log("error", error);
      })



    // this.msg = "Category Updated"
    // this.showSuccess();
    // this.router.navigate(["qa-user"]);

  }







  categoriesList() {
    this.dataRoomService.categories_list(this.dataroomId).subscribe((res) => {
      console.log(this.dataroomId, "dataroom id"),
        this.categories_list = res.filter(
          (res) =>

            res.dataroom_id == parseInt(this.dataroomId)
        );
      this.categories_list.forEach((res) => {
        console.log(res.user, "response for category list", res);
        this.data.push({ categories: res.id, user: res.user, category: true });
        if (res.user.toString() == "") {
          this.data.pop();
        }
      });

      console.log(this.data, "this.data array and right side", this.categories_list);
    });
  }

  deletecategory(itemid) {
    this.dataRoomService.delete_category_item(itemid).subscribe(
      (res) => {
        this.msg = "Category Deleted"
        this.showSuccess();
        this.router.navigate(["qa-user"]);
      },
      (error) => {
        console.log("error", error);
      })
  }

  user_list: any;
  getDataroomUserList() {
    this.dataRoomService
      .dataroom_user_list(this.dataroomId)
      .subscribe((res) => {
        this.user_list = res; //JSON.parse(res.folder_data);
        this.user_list = this.user_list.filter(
          (res) => res.is_q_a_user === true
        );
      });
  }
  test(email) {
    console.log(email, "email");
  }
  error: boolean = false;
  submitAssignedCategories() {
    console.log(JSON.stringify(this.data), "submitAssignedCategories");
    // for (let i = 0; i < this.data.length; i++) {
    //   if (this.data[i]?.user?.length != 0 && this.data[i].user != null) {
    //     this.error = true;
    //   } else {
    //     this.error = false;
    //   }
    // }

    const allUsersValid = this.data.every(item => item.user && (!Array.isArray(item.user) || item.user.length > 0));
    if (!allUsersValid) {
      alert("Pls add email");
    }else{
      this.dataRoomService
      .manage_dataroom_category(this.dataroomId, this.data)
      .subscribe((res) => {
        while (this.data.length > 0) {
          this.data.pop();
        }
        console.log(this.data, "submitAssignedCategories");
        this.router.navigate(["manage-categories"]);
        this.msg = "Assigned new categories successfully !";
        this.showSuccess();
        this.router.navigate(["qa-user"]);
        // this.getDataroomUserList();
      },
        (error) => {
          this.msg = "pls provide category";
          this.showError();
        }
      );
    }


  }

  addNewCategories() {
    this.data.push({ categories: null, user: null, category: false });
    // if(this.data.length <= 0){
    //   this.data.push({ categories: null, user: null, category: false });
    // }
    // else{
    //   this.msg = "Please enter and submit the category and email";
    //   this.showError();
    // }
  }
}
