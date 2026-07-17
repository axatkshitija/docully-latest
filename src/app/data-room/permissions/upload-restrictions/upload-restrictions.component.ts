

import { DataRoomService } from "../../../services/index";
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { DatePipe, Location } from "@angular/common";
import { BaseUrlClass, ApiListClass } from "../../../common/index";
declare var jQuery: any;
import { Router, ActivatedRoute } from "@angular/router";
import { MatStepperModule } from "@angular/material/stepper";
import { ITreeOptions, TreeNode } from "@bugsplat/angular-tree-component";
import { Injectable } from "@angular/core";
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { Folder } from "../../../models/folder";
import { SelectionModel } from '@angular/cdk/collections';
import { DialogData } from "../../document/document.component";
import { CookieService } from "ngx-cookie-service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";


interface FoodNode {
  name?: string;
  children?
}


@Component({
  selector: 'app-upload-restrictions',
  templateUrl: './upload-restrictions.component.html',
  styleUrls: ['./upload-restrictions.component.css']
})
export class UploadRestrictionsComponent {

  emailPattern: string | RegExp;

  selection = new SelectionModel<FoodNode>(true, []);


  // Globale Variable Declarations : 
  memberForm: FormGroup;
  msg: string;
  isShowDiv = true;
  isShowDivA = false;
  clickNoAccessid = 0;

  // Error and SUccess messages methods 



  treeControl = new NestedTreeControl<FoodNode>((noden) => noden.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  getnode: any;
  selectedData: any;
  IsAllselected: boolean = false;
  response: any;
  is_folder_only: boolean = true;
  usertimezone: string;

  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
    this.isShowDivA = !this.isShowDivA
  }

  toggleDisplayDivA() {
    this.isShowDivA = !this.isShowDivA;
    this.isShowDiv = !this.isShowDiv;
  }

  // showHideAddNewMemberSection
  // Purpose :
  // Show or hide permission menu - add new member section
  hideAddNewMember: boolean = true;
  showHideAddNewMemberSection() {
    this.hideAddNewMember = true;
    this.showAddNewMember = false;
  }
  showAddNewMember: boolean = false;
  HideHideAddNewMemberSection() {
    this.showAddNewMember = true;
    this.hideAddNewMember = false;
  }

  all_new_admin: any[] = [];
  arrSelectedindex: any[] = [];
  currentDataroomId: any;
  newGroupForm: FormGroup;
  adminForm: FormGroup;
  FirstEndUserGroup: FormGroup;
  SecondOverviewFormPermission: FormGroup;
  ThirdMemberAdditionForm: FormGroup;
  FourthDocumentPermissions: FormGroup;
  FolderSpecificPermissions: FormGroup;
  currentDate;
  all_admin_list: any = [];
  isLinear: boolean = false;
  all_root_folder: Folder[] = [];
  all_end_user_groups: any[] = [];
  is_hide_drm: boolean = false;
  is_hide_watermarking: boolean = false;
  hideDocPermission: boolean = false;
  device: boolean = true;
  editGroupName: boolean = false;
  editAccessRevoke: boolean = false;
  showCopyPermission: boolean = false;
  selected_group_id: number = 0;
  all_end_user_group_members: any[] = [];
  enduser_group_member_form: FormGroup;
  enduser_group_id: number = 0;
  selectedIndex: number = 0;
  bulk_checkbox: number = 0;
  checkbox_count: number = 0;
  cb_man_mem_count: number = 0;
  toggle1: boolean = false;
  selectedAll1: any = [];
  toggle: boolean = false;
  selectedAll: any = [];
  ngAllChecked: boolean = false;
  access_revoke;
  showDate: boolean = false;
  is_no_access: boolean = false;
  is_view_only: boolean = false;
  is_shortcut: boolean = false;
  is_view_and_print: boolean = false;
  is_view_and_print_and_download: boolean = false;
  is_upload: boolean = false;
  is_watermark: boolean = false;
  is_drm: boolean = false;
  is_editor: boolean = false;
  is_no_access_indeterminate: boolean = false;
  is_view_only_indeterminate: boolean = false;
  is_shortcut_indeterminate: boolean = false;
  is_view_and_print_indeterminate: boolean = false;
  is_view_and_print_and_download_indeterminate: boolean = false;
  is_upload_indeterminate: boolean = false;
  is_watermark_indeterminate: boolean = false;
  is_drm_indeterminate: boolean = false;
  is_editor_indeterminate: boolean = false;
  group_name: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private cookieService: CookieService,
    private location: Location,
    private toastr: ToastrService,
    private dataRoomService: DataRoomService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    public datepipe: DatePipe,
    private baseUrlClass: BaseUrlClass,
  ) {
    this.currentDataroomId = route.snapshot.paramMap.get("dataroom_id");
    const id = parseInt(this.route.snapshot.paramMap.get("group_id"));
    this.enduser_group_id = id;
    console.log("group id is", this.enduser_group_id);
    this.selectedIndex = parseInt(this.route.snapshot.paramMap.get("indx"));
    this.dataRoomService.getGroupDetail(this.enduser_group_id).subscribe((res) => {
      this.group_name = res[0].group_name;
      console.log("all end user groups>>>>>>>>>>>>>>>>>>", this.group_name, res);
    })

    console.log("Manage Permission Group Id is:", id);
    this.currentDataroomId = localStorage.getItem("currentDataroomId");
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required],
    });

    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ["", Validators.required],
    });

    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ["", Validators.required],
    });
  }

  ngOnInit() {
    let today = new Date();
    this.currentDate = this.datepipe.transform(today, 'yyyy-MM-dd')
    this.getSingleDataroom(this.currentDataroomId);
    this.initializeOverviewFormPermission();
    this.initializeDocumentAndPermission();
    this.getFolderHierarchyPermission();
    this.usertimezone = localStorage.getItem("currentUser");
    this.usertimezone = JSON.parse(this.usertimezone);
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  preview: any = this.baseUrlClass.baseUrl + "/static/images/watermark_preview.png";
  select: boolean = true;
  yourFn(event) {
    console.log(event.index, "event check");
    if (event.index == 3) {
      this.dataRoomService
        .getSingleDataroom(this.currentDataroomId)
        .subscribe((res) => {
          this.dataroom_live = res.is_dataroom_on_live;
          console.log(this.dataroom_live, "invitation_send_successfully");
          // if (this.dataroom_live) {
          //   this.getAllAdmins();
          // } else {
          //   this.getAllAdmins();
          // }
        });
    }
    if (event.index == 2) {
      this.checkedArray = false;
    }
  }

  topleft = true;
  topright = false;
  topcenter = false;
  middleleft = false;
  middlecenter = false;
  middleright = false;
  bottomleft = false;
  bottomcenter = false;
  bottomright = false;
  topleftposition() {
    this.middleleft = false;
    this.middlecenter = false;
    this.middleright = false;
    this.bottomleft = false;
    this.bottomcenter = false;
    this.bottomright = false;
    if (this.topleft == false) {
      this.topleft = true;
      this.topright = false;
      this.topcenter = false;

    } else {
      this.topleft = false;
    }
  }
  topcenterpostion() {
    this.middleleft = false;
    this.middlecenter = false;
    this.middleright = false;
    this.bottomleft = false;
    this.bottomcenter = false;
    this.bottomright = false;
    if (this.topcenter == false) {
      this.topleft = false;
      this.topright = false;
      this.topcenter = true;
    } else {
      this.topcenter = false;
    }
  }
  toprightposition() {
    this.middleleft = false;
    this.middlecenter = false;
    this.middleright = false;
    this.bottomleft = false;
    this.bottomcenter = false;
    this.bottomright = false;
    if (this.topright == false) {
      this.topleft = false;
      this.topright = true;
      this.topcenter = false;
    } else {
      this.topright = false;
    }
  }




  middleleftposition() {
    this.topleft = false;
    this.topright = false;
    this.topcenter = false;
    if (this.middleleft == false) {
      this.middleleft = true;
      this.middlecenter = false;
      this.middleright = false;
    } else {
      this.middleleft = false;
    }
  }
  middlecenterposition() {
    this.topleft = false;
    this.topright = false;
    this.topcenter = false;
    if (this.middlecenter == false) {
      this.middleleft = false;
      this.middlecenter = true;
      this.middleright = false;
    } else {
      this.middlecenter = false;
    }
  }
  middlerightposition() {
    this.topleft = false;
    this.topright = false;
    this.topcenter = false;
    if (this.middleright == false) {
      this.middleleft = false;
      this.middlecenter = false;
      this.middleright = true;
    } else {
      this.middleright = false;
    }
  }



  bottomleftposition() {
    this.topleft = false;
    this.topright = false;
    this.topcenter = false;
    this.middleleft = false;
    this.middlecenter = false;
    this.middleright = false;
    if (this.bottomleft == false) {
      this.bottomleft = true;
      this.bottomcenter = false;
      this.bottomright = false;
    } else {
      this.bottomleft = false;
    }
  }

  bottomcenterposition() {
    this.topleft = false;
    this.topright = false;
    this.topcenter = false;
    this.middleleft = false;
    this.middlecenter = false;
    this.middleright = false;
    if (this.bottomcenter == false) {
      this.bottomleft = false;
      this.bottomcenter = true;
      this.bottomright = false;
    } else {
      this.bottomcenter = false;
    }
  }
  bottomrightposition() {
    this.topleft = false;
    this.topright = false;
    this.topcenter = false;
    this.middleleft = false;
    this.middlecenter = false;
    this.middleright = false;
    if (this.bottomright == false) {
      this.bottomleft = false;
      this.bottomcenter = false;
      this.bottomright = true;
    } else {
      this.bottomright = false;
    }
  }




  convertToIST(utcDate) {
    if (utcDate != "null+04:00" && utcDate != "undefined+04:00" && utcDate != null && utcDate != undefined) {
      return this.datePipe.transform(utcDate, 'yyyy-MM-dd hh:mm a', this.usertimezone['time_zone__offset']); // 'Asia/Kolkata' offset
    }

  }

  show_spinner: boolean = true;
  nodes: any = [];
  getFolderHierarchyPermission() {
    this.dataRoomService
      .getFoldersHierarchyPermission(
        this.currentDataroomId,

        this.enduser_group_id,
        0,
      )
      .subscribe((res) => {
        console.log(res, "get APi");
        this.nodes = res;


        this.nodes = this.nodes.filter(
          (res) => res.name != 'Email Uploads'
        );

        const data = this.nodes.map(
          (res) => res.perm
        );

        console.log('data', data)
        const newdata = data.map((obj, i) => ({ ...obj, folder_timer_upload_ristrict_date: obj.folder_timer_upload_ristrict_date + '+04:00' }));
        console.log('newdata', newdata)
        newdata.map(item => ({
          ...item,
          folder_timer_upload_ristrict_date: this.convertToIST(item.folder_timer_upload_ristrict_date) // Format the specified date field
        }));

        this.nodes.forEach((obj, i) => {
          obj.perm = newdata[i]
        });
        console.log('data>>>>>>>>>>>>>>>>>>>>..', this.nodes, newdata)

        this.getnode = res;
        this.IndeterminateFuntion(this.nodes);
        this.show_spinner = false
      });
  }

  tempchildload(id) {
    console.log("Child will be load now")
  }
  options: ITreeOptions = {
    useCheckbox: false,
  };

  children: any = [];
  hidemsg: boolean = false;

  getSubFolderElement(id): any {
    this.router.navigate(["/folder-upload-restriction", this.enduser_group_id, this.selectedIndex, id]);
    console.warn("This is warning from the getFolderSpecific");
  }

  changeChildren(nodes, parent) {
    const permissionObj = Object.keys(parent.data.perm);
    var allTrue = false;
    var noAccess = 0;
    var is_view_only = 0;
    var is_view_and_print = 0;
    var is_view_and_print_and_download = 0;
    var is_upload = 0;
    var length = nodes.length;

    nodes.forEach((res) => {
      permissionObj.forEach((permission) => {
        if (!res.perm["is_exist"]) {
          console.log(232323);
          res.perm["" + permission + ""] =
            parent.data.perm["" + permission + ""];
          this.clickView(
            { checked: parent.data.perm["" + permission + ""] },
            res
          );
        } else {
          this.checkSameCheck(permission);
        }
      });

      this.IndeterminateFuntion(nodes);
    });
  }

  checkSameCheck(permission) {
    console.log(permission);
  }

  IndeterminateFuntion(nodes) {
    nodes.forEach((res) => {
      console.log(res.children, "IndeterminateFuntionrrrr");

      if (res.children != undefined) {
        if (res.children.length > 0) {
          var no_access_children = res.children.filter(
            (res) => res.perm.is_no_access === true
          );
          if (no_access_children.length == res.children.length) {
            res.noaccess_indeterminate = false;
            res.perm.is_no_access = true;
          } else if (no_access_children.length > 0) {
            res.noaccess_indeterminate = true;
          } else {
            res.noaccess_indeterminate = false;
          }
          var view_children = res.children.filter(
            (res) => res.perm.is_view_only === true
          );
          if (view_children.length == res.children.length) {
            res.view_indeterminate = false;
            res.perm.is_view_only = true;
          } else if (view_children.length > 0) {
            res.view_indeterminate = true;
          } else {
            res.view_indeterminate = false;
          }
          var vp_children = res.children.filter(
            (res) => res.perm.is_view_and_print === true
          );
          if (vp_children.length == res.children.length) {
            res.vp_indeterminate = false;
            res.perm.is_view_and_print = true;
          } else if (vp_children.length > 0) {
            res.vp_indeterminate = true;
          } else {
            res.vp_indeterminate = false;
          }
          var vpd_children = res.children.filter(
            (res) => res.perm.is_view_and_print_and_download === true
          );
          if (vpd_children.length == res.children.length) {
            res.vpd_indeterminate = false;
            res.perm.is_view_and_print_and_download = true;
          } else if (vpd_children.length > 0) {
            res.vpd_indeterminate = true;
            res.perm.is_view_and_print_and_download = true;
            console.log(res, res.vpd_indeterminate, "testome");
          } else {
            res.vpd_indeterminate = false;
            res.perm.is_view_and_print_and_download = false;
            console.log(res, res.vpd_indeterminate, "testome");
          }

          var childrens = res.children.filter((res) => res.is_folder === true);

          var upload_children = childrens.filter(
            (res) => res.perm.is_upload === true && res.is_folder == true
          );
          var upload_children_folder = childrens.filter(
            (res) => res.is_folder == true
          );
          console.log(
            upload_children_folder,
            upload_children,
            "Upload InterMinate"
          );

          if (upload_children.length == upload_children_folder.length) {
            res.is_upload = true;
            this.is_upload_indeterminate = false;


          } else if (upload_children.length > 0) {
            // res.upload_indeterminate = true;
            res.is_upload = false;
            this.is_upload_indeterminate = true;
          } else {
            this.is_upload_indeterminate = false;
          }

          var watermarking_children = res.children.filter(
            (res) => res.perm.is_watermarking === true
          );
          if (watermarking_children.length == res.children.length) {
            res.watermarking_indeterminate = false;
            res.perm.is_watermarking = true;
          } else if (watermarking_children.length > 0) {
            res.watermarking_indeterminate = true;
          } else {
            res.watermarking_indeterminate = false;
          }
          var drm_children = res.children.filter(
            (res) => res.perm.is_drm === true
          );
          if (drm_children.length == res.children.length) {
            res.drm_indeterminate = false;
            res.perm.is_drm = true;
          } else if (drm_children.length > 0) {
            res.drm_indeterminate = true;
          } else {
            res.drm_indeterminate = false;
          }
          var editor_children = res.children.filter(
            (res) => res.perm.is_editor === true
          );
          if (editor_children.length == res.children.length) {
            res.editor_indeterminate = false;
            res.perm.is_editor = true;
          } else if (editor_children.length > 0) {
            res.editor_indeterminate = true;
          } else {
            res.editor_indeterminate = false;
          }

          var shortcut_children = res.children.filter(
            (res) => res.perm.is_shortcut === true
          );
          if (shortcut_children.length == res.children.length) {
            res.shortcut_indeterminate = false;
            res.perm.is_shortcut = true;
          } else if (shortcut_children.length > 0) {
            res.shortcut_indeterminate = true;
            res.perm.is_shortcut = true;
          } else {
            res.shortcut_indeterminate = false;
            res.perm.is_shortcut = false;
          }

          res.children.forEach((res) => {
            this.InderminateSubFunction(res);
          });
        }
      }
    });
    this.AllFilesPermission();
  }

  AllFilesPermission() {
    console.log(this.children, "AllFilesPermission");
    var is_no_access_inder = this.nodes.filter(
      (res) => res.perm.is_no_access == true
    );
    var is_no_access_indert = this.nodes.filter(
      (res) => res.noaccess_indeterminate == true
    );
    if (
      (is_no_access_inder.length > 0 &&
        this.nodes.length > is_no_access_inder.length) ||
      is_no_access_indert.length > 0
    ) {
      this.is_no_access_indeterminate = true;
    } else if (this.nodes.length == is_no_access_inder.length) {
      this.is_no_access = true;
      this.is_no_access_indeterminate = false;
    } else {
      this.is_no_access_indeterminate = false;
      this.is_no_access = false;
    }

    var view_inder = this.nodes.filter((res) => res.perm.is_view_only == true);
    var view_indert = this.nodes.filter(
      (res) => res.view_indeterminate == true
    );
    console.log(view_inder, "View Inder");
    if (
      (view_inder.length > 0 && this.nodes.length > view_inder.length) ||
      view_indert.length > 0
    ) {
      this.is_view_only_indeterminate = true;
    } else if (this.nodes.length == view_inder.length) {
      this.is_view_only = true;
      this.is_view_only_indeterminate = false;
    } else {
      this.is_view_only_indeterminate = false;
      this.is_view_only = false;
    }

    var vp_inder = this.nodes.filter(
      (res) => res.perm.is_view_and_print == true
    );
    var vp_indert = this.nodes.filter((res) => res.vp_indeterminate == true);
    if (
      (vp_inder.length > 0 && this.nodes.length > vp_inder.length) ||
      vp_indert.length > 0
    ) {
      this.is_view_and_print_indeterminate = true;
    } else if (this.nodes.length == vp_inder.length) {
      this.is_view_and_print = true;
      this.is_view_and_print_indeterminate = false;
    } else {
      this.is_view_and_print_indeterminate = false;
      this.is_view_and_print = false;
    }
    var vpd_inder = this.nodes.filter(
      (res) => res.perm.is_view_and_print_and_download == true
    );
    var vpd_indert = this.nodes.filter((res) => res.vpd_indeterminate == true);
    if (
      (vpd_inder.length > 0 && this.nodes.length > vpd_inder.length) ||
      vpd_indert.length > 0
    ) {
      this.is_view_and_print_and_download_indeterminate = true;
    } else if (this.nodes.length == vpd_inder.length) {
      this.is_view_and_print_and_download = true;
      this.is_view_and_print_and_download_indeterminate = false;
    } else {
      this.is_view_and_print_and_download_indeterminate = false;
      this.is_view_and_print_and_download = false;
    }

    var upload_inder = this.nodes.filter((res) => res.perm.is_upload == true);
    var upload_indert = this.nodes.filter(
      (res) => res.upload_indeterminate == true
    );
    if (
      (upload_inder.length > 0 && this.nodes.length > upload_inder.length) ||
      upload_indert.length > 0
    ) {
      this.is_upload_indeterminate = true;
    } else if (this.nodes.length == upload_inder.length) {
      console.log(
        this.nodes.length,
        "Uploadddsa",
        upload_inder.length,
        upload_indert
      );

      this.is_upload = true;
      this.is_upload_indeterminate = false;
    } else {
      this.is_upload_indeterminate = false;
      this.is_upload = false;
    }

    var drm_inder = this.nodes.filter((res) => res.perm.is_shortcut == true);
    var shortcut_indert = this.nodes.filter(
      (res) => res.shortcut_indeterminate == true
    );
    console.log("DRMMMMMM", drm_inder, shortcut_indert);
    if (
      (drm_inder.length > 0 && this.nodes.length > drm_inder.length) ||
      shortcut_indert.length > 0
    ) {
      this.is_shortcut_indeterminate = true;
    } else if (this.nodes.length == drm_inder.length) {
      this.is_shortcut = true;
      this.is_shortcut_indeterminate = false;
    } else {
      this.is_shortcut_indeterminate = false;
      this.is_shortcut = false;
    }

  }

  InderminateSubFunction(res) {
    if (res.children != undefined) {
      if (res.children.length > 0) {
        var no_access_children = res.children.filter(
          (res) => res.perm.is_no_access === true
        );
        if (no_access_children.length == res.children.length) {
          res.noaccess_indeterminate = false;
          res.perm.is_no_access = true;
        } else if (no_access_children.length > 0) {
          res.noaccess_indeterminate = true;
        } else {
          res.noaccess_indeterminate = false;
        }
        var view_children = res.children.filter(
          (res) => res.perm.is_view_only === true
        );
        if (view_children.length == res.children.length) {
          res.view_indeterminate = false;
          res.perm.is_view_only = true;
        } else if (view_children.length > 0) {
          res.view_indeterminate = true;
        } else {
          res.view_indeterminate = false;
        }
        var vp_children = res.children.filter(
          (res) => res.perm.is_view_and_print === true
        );
        if (vp_children.length == res.children.length) {
          res.vp_indeterminate = false;
          res.perm.is_view_and_print = true;
        } else if (vp_children.length > 0) {
          res.vp_indeterminate = true;
        } else {
          res.vp_indeterminate = false;
        }
        var vpd_children = res.children.filter(
          (res) => res.perm.is_view_and_print_and_download === true
        );

        if (vpd_children.length == res.children.length) {
          res.vpd_indeterminate = false;
          res.perm.is_view_and_print_and_download = true;
        } else if (vpd_children.length > 0) {
          res.vpd_indeterminate = true;
          res.perm.is_view_and_print_and_download = true;
        } else {
          res.vpd_indeterminate = false;
          res.perm.is_view_and_print_and_download = false;
          console.log(res, res.vpd_indeterminate, "testome");
        }
        var upload_children = res.children.filter(
          (res) => res.perm.is_upload === true
        );
        if (upload_children.length == res.children.length) {
          res.upload_indeterminate = false;
          res.perm.is_upload = true;
        } else if (upload_children.length > 0) {
          res.upload_indeterminate = true;
        } else {
          res.upload_indeterminate = false;
        }
        var watermarking_children = res.children.filter(
          (res) => res.perm.is_watermarking === true
        );
        if (watermarking_children.length == res.children.length) {
          res.watermarking_indeterminate = false;
          res.perm.is_watermarking = true;
        } else if (watermarking_children.length > 0) {
          res.watermarking_indeterminate = true;
        } else {
          res.watermarking_indeterminate = false;
        }
        var drm_children = res.children.filter(
          (res) => res.perm.is_drm === true
        );
        var shortcut_children = res.children.filter(
          (res) => res.perm.is_shortcut === true
        );
        if (shortcut_children.length == res.children.length) {
          res.shortcut_indeterminate = false;
          res.perm.is_shortcut = true;
        } else if (shortcut_children.length > 0) {
          res.shortcut_indeterminate = true;
          res.perm.is_shortcut = true;
        } else {
          res.shortcut_indeterminate = false;
          res.perm.is_shortcut = false;
        }

        if (drm_children.length == res.children.length) {
          res.drm_indeterminate = false;
          res.perm.is_drm = true;
        } else if (drm_children.length > 0) {
          res.drm_indeterminate = true;
        } else {
          res.drm_indeterminate = false;
        }
        var editor_children = res.children.filter(
          (res) => res.perm.is_editor === true
        );
        if (editor_children.length == res.children.length) {
          res.editor_indeterminate = false;
          res.perm.is_editor = true;
        } else if (editor_children.length > 0) {
          res.editor_indeterminate = true;
        } else {
          res.editor_indeterminate = false;
        }
        console.log(res, "thhe inderminatefunction")

        res.children.forEach((res) => {
          this.InderminateSubFunction(res);
        });
      }
    }
  }





  all_files: any;
  all_folders: any;
  p_permission: boolean = false;
  group_id: number;
  group_all_files: any;
  group_all_folders: any;
  getGroupPermissions(group: any) {
    this.group_id = group;
    this.dataRoomService
      .getFoldersHierarchyPermission(this.currentDataroomId, group, 0)
      .subscribe((res) => {
        console.log(res, "getGroupPermissions");
        this.group_all_folders = res;
        if (this.group_id == 0) {
          this.p_permission = false;
          this.apply_update = false;
        } else {
          this.p_permission = true;
        }
        if (this.group_all_folders.length <= 0) {
          this.msg = "This group doesnt updated the folder permission yet!!";
          this.showError();
        }
        this.IndeterminateFuntion(this.group_all_folders);
      });
  }

  getUpdateGroupPermissions() {
    this.dataRoomService
      .createFolderSpecificPermission(
        this.group_all_folders,
        this.currentDataroomId,
        this.enduser_group_id
      )
      .subscribe((res) => {
        this.group_all_files = res;
        console.log(res, "Folder");
        this.msg = "Folder permissions copied successfully.";
        if (res === true) {
          this.showInfo();
          this.getFolderHierarchyPermission();
          console.log(res, "Folder1");
        }
        // this.getFilesFolders();
      });
  }

  all_dataroom_groups: any;
  apply_update: boolean = false;
  groupPermissions() {
    this.dataRoomService
      .getEndUserGroup(this.currentDataroomId)
      .subscribe((res) => {
        console.log(res, this.group_all_files.length, "Preview Permission");
        this.all_groups = res.data.filter(
          (res) => res.id != this.enduser_group_id
        );
        this.apply_update = true;
        if (this.group_all_files.length <= 0) {
          this.msg = "This group doesnt updated the folder permission yet!!";
          this.showError();
        }
      });
  }

  // initialization Overviewform permission
  initializeOverviewFormPermission() {
    console.log("initialize overview form permission");
    this.SecondOverviewFormPermission = new FormGroup({
      is_edit_dataroom_index: new FormControl(false, [Validators.required]),
      is_watermarking: new FormControl(false, [Validators.required]),
      is_drm: new FormControl(false, [Validators.required]),
    });
  }

  removeSelectedElement(member, i) {
    console.log("delete admin", member, i);
    var delete_type = "is_deleted_end";
    this.dataRoomService
      .delete_dataroom_admin_type(member.id, this.enduser_group_id, delete_type)
      .subscribe((res) => {
        this.all_admin_list.splice(i, 1);
        console.log(this.all_admin_list, "removeSelectedElement");
        this.msg = "Delete Member successfully !";
        this.showError();
      });
  }





  // initialize document and permission module
  initializeDocumentAndPermission() {
    this.FourthDocumentPermissions = new FormGroup({
      is_donwload_permission: new FormControl(""),
      // itemPermissionRow: this._formBuilder.array([this.initPermissionRows()])
    });
  }

  initPermissionRows() {
    return this._formBuilder.group({
      is_no_access: new FormControl("", []),
      is_view_only: new FormControl("", []),
      is_view_and_print: new FormControl("", []),
      is_view_and_print_download: new FormControl("", []),
      is_upload: new FormControl("", []),
      is_watermark: new FormControl("", []),
      is_drm: new FormControl("", []),
      is_editor: new FormControl("", []),
      is_shortcut: new FormControl("", []),
    });
  }

  // initializer enduser group form



  all_groups: any = [];
  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  showInfo() {
    this.toastr.info(this.msg);
  }

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  q_flag: boolean = false;
  end_user_group_information: any;
  checkfirstpage: any;
  groupStatus;
  is_review_added = false;
  dataroom_live: any;
  checkedArray: boolean;

  dataroom_detail: any;
  getSingleDataroom(dataroomId) {
    // this.dataRoomService.getSingleDataroom(dataroomId).subscribe((res) => {
    //   this.dataroom_detail = res;
    //   console.log(res, "live");
    // });
  }

  goBack() {
    this.router.navigate(["/manage-permission", this.enduser_group_id, 3]);
  }

  receiveAutoMsgHandler(p) {
    this.dataroom_detail = p.singledataroom;
    console.log(p, "overview???????????????????????????????/");
  }




  is_edit_member(i) {
    console.log("is edit numbers");
    this.editedIndex = i;
  }

  editedIndex: any;

  is_cancel_editable(i) {
    console.log("is_cancel_editable");
    this.editedIndex = -1;
  }

  // submit edited member

  NoAccessIfPermission(file, event) {
    if (event == true) {
      file.perm.is_no_access = true;
      file.perm.is_view_only = false;
      file.perm.is_access = false;
      file.perm.is_view_and_print = false;
      file.perm.is_view_and_print_and_download = false;
      file.perm.is_upload = false;
      file.perm.is_watermarking = false;
      file.perm.is_drm = false;
      file.perm.is_editor = false;
      file.perm.is_shortcut = false;
      if (file.children != undefined) {
        if (file.children.length > 0) {
          file.children.forEach((res) => {
            this.NoAccessIfPermission(res, event);
          });
        }
      }
    }
  }

  NoAccessElsePermission(file, event) {
    file.perm.is_no_access = false;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.NoAccessElsePermission(res, event);
        });
      }
    }
  }



  dateSelected(event, file) {
    console.log(event.target.value, file)
    // this.IndeterminateFuntion(this.nodes);
  }

  clickNoAccess(event, file) {
    this.arrSelectedindex.push(file.id);
    console.log(event, "this is event", file.id, "this is event file")


    if (event.checked == true) {
      this.is_no_access_indeterminate = true;
      this.NoAccessIfPermission(file, event.checked);
    } else {
      this.NoAccessElsePermission(file, event.checked);
    }

    this.IndeterminateFuntion(this.nodes);
  }

  ViewPermission(file) {
    file.perm.is_no_access = false;
    file.perm.is_view_only = true;
    file.perm.is_access = true;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.ViewPermission(res);
        });
      }
    }
  }
  ViewElsePermission(file) {
    file.perm.is_view_only = false;
    file.perm.is_view_and_print = false;
    file.perm.is_view_and_print_and_download = false;
    file.perm.is_upload = false;
    file.perm.is_shortcut = false;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.ViewElsePermission(res);
        });
      }
    }
  }

  clickView(event, file) {
    this.arrSelectedindex.push(file.id);
    console.log(file.id, "only file view click");
    if (event.checked == true) {
      this.is_view_only_indeterminate = true;
      this.ViewPermission(file);
    } else {
      this.ViewElsePermission(file);
    }
    this.IndeterminateFuntion(this.nodes);
    this.NoAccessAndAccess(file);
  }

  ViewPrintPermission(file) {
    console.log(file.id, "only file view click");
    file.perm.is_no_access = false;
    file.perm.is_view_only = true;
    file.perm.is_access = true;
    file.perm.is_view_and_print = true;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.ViewPrintPermission(res);
        });
      }
    }
  }

  ViewPrintElsePermission(file) {
    console.log(file.id, "only file view click");
    file.perm.is_view_and_print_and_download = false;
    file.perm.is_view_and_print = false;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.ViewPrintElsePermission(res);
        });
      }
    }
  }

  clickViewPrint(event, file, i, type) {
    this.arrSelectedindex.push(file.id);
    if (event.checked == true) {
      this.is_view_and_print_indeterminate = true;
      this.is_view_only_indeterminate = true;
      this.ViewPrintPermission(file);
    } else {
      this.ViewPrintElsePermission(file);
    }
    this.IndeterminateFuntion(this.nodes);
    this.NoAccessAndAccess(file);
  }

  ViewPrintDownload(file) {
    file.perm.is_no_access = false;
    file.perm.is_view_only = true;
    file.perm.is_access = true;
    file.perm.is_view_and_print = true;
    file.perm.is_view_and_print_and_download = true;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          console.log(res, "children Test");
          this.ViewPrintDownload(res);
        });
      }
    }
  }

  ViewPrintElseDownload(file) {
    file.perm.is_view_and_print_and_download = false;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.ViewPrintElseDownload(res);
        });
      }
    }
  }
  clickViewPrintDownload(event, file) {
    this.arrSelectedindex.push(file.id);
    if (event.checked == true) {
      this.is_view_and_print_indeterminate = false;
      this.is_view_only_indeterminate = false;

      this.is_view_and_print_and_download_indeterminate = true;
      this.ViewPrintDownload(file);
    } else {
      this.ViewPrintElseDownload(file);
    }

    this.IndeterminateFuntion(this.nodes);
    this.NoAccessAndAccess(file);
  }

  IfUpload(file) {
    if (file.is_folder) {
      file.perm.is_no_access = false;
      file.perm.is_upload = true;
      file.perm.is_access = true;
      file.perm.is_view_only = true;

      if (file.children != undefined) {
        if (file.children.length > 0) {
          file.children.forEach((res) => {
            this.IfUpload(res);
          });
        }
      }
    } else {
      file.perm.is_upload = false;
    }
  }
  ElseUpload(file) {
    file.perm.is_upload = false;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.ElseUpload(res);
        });
      }
    }
  }

  clickUploadPermission() {
    this.nodes.forEach((res) => {
      if (Array.isArray(res.children)) {
        var childrens = res.children.filter((res) => res.is_folder === true);
        if (childrens != undefined) {
          if (childrens.length > 0) {
            var upload_children = childrens.filter(
              (res) => res.perm.is_upload === true && res.is_folder == true
            );
            var upload_children_folder = childrens.filter(
              (res) => res.is_folder == true
            );
            if (upload_children.length == upload_children_folder.length) {
              res.is_upload = true;
              this.is_upload_indeterminate = false;
              res.is_no_access = false;
              res.is_access = false;
              res.is_view_only_indeterminate = true;
              res.is_view_only = true;
              //res.upload_indeterminate = false
            } else if (upload_children.length > 0) {
              // res.upload_indeterminate = true;
              res.view_indeterminate = true;
              res.is_view_only_indeterminate = true;

              // res.is_upload = false;
              this.is_upload_indeterminate = true;
            } else {
              this.is_upload_indeterminate = false;
            }
            childrens.forEach((ress) => {
              this.clickUploadSubPermission(ress);
            });
          }
        }
      }
    });
    this.AllFilesPermission();
  }
  clickUploadSubPermission(res) {
    console.log(res);
    var childrens = res.children.filter((res) => res.perm.is_upload === true);
    if (childrens != undefined) {
      if (childrens.length > 0) {
        var upload_children = childrens.filter(
          (res) => res.perm.is_upload === true
        );
        if (upload_children.length == childrens.length) {
          res.is_upload = true;
          res.is_no_access = false;
          res.is_view_only = false;

          res.is_access = false;
        } else if (upload_children.length > 0) {
          res.upload_indeterminate = true;
        } else {
          res.upload_indeterminate = false;
        }
        childrens.forEach((ress) => {
          this.clickUploadSubPermission(ress);
        });
      }
    }
  }

  clickUpload(event, file) {
    this.arrSelectedindex.push(file.id);
    console.log(event, "---", file);
    if (event.checked == true) {
      this.is_upload_indeterminate = true;
      this.is_view_only_indeterminate = true;

      this.IfUpload(file);
    } else {
      this.ElseUpload(file);
    }
    this.IndeterminateFuntion(this.nodes);
    this.NoAccessAndAccess(file);
  }
  IfWatermark(file) {
    file.perm.is_no_access = false;
    file.perm.is_watermarking = true;
    file.perm.is_access = true;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.IfWatermark(res);
        });
      }
    }
  }
  ElseWatermark(file) {
    file.perm.is_watermarking = false;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.ElseWatermark(res);
        });
      }
    }
  }

  clickWatermark(event, file, i, type) {
    if (event.checked == true) {
      this.is_watermark_indeterminate = true;
      this.IfWatermark(file);
    } else {
      this.ElseWatermark(file);
    }
    this.IndeterminateFuntion(this.nodes);
    this.NoAccessAndAccess(file);
  }

  IfDRM(file) {
    console.log("IfDRM4");
    file.perm.is_no_access = false;
    file.perm.is_drm = true;
    file.perm.is_access = true;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.IfDRM(res);
        });
      }
    }
  }

  ElseDRM(file) {
    console.log(":clickDRM3");
    file.perm.is_drm = false;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.ElseDRM(res);
        });
      }
    }
  }

  clickDRM(event, file) {
    console.log("IfDRM1");
    if (event.checked == true) {
      console.log(":clickDRM");
      this.is_drm_indeterminate = true;
      this.IfDRM(file);
    } else {
      console.log(":clickDRM2");
      this.ElseDRM(file);
    }
    this.IndeterminateFuntion(this.nodes);
    this.NoAccessAndAccess(file);
  }

  IfEditor(file) {
    file.perm.is_no_access = false;
    file.perm.is_editor = true;
    file.perm.is_access = true;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.IfEditor(res);
        });
      }
    }
  }

  ElseEditor(file) {
    file.perm.is_editor = false;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.ElseEditor(res);
        });
      }
    }
  }

  clickEditor(event, file) {
    if (event.checked == true) {
      this.is_editor_indeterminate = true;
      this.IfEditor(file);
    } else {
      this.ElseEditor(file);
    }
    this.IndeterminateFuntion(this.nodes);
    this.NoAccessAndAccess(file);
  }

  NoAccessAndClick(child) {
    if (
      child.perm.is_view_only == false &&
      child.perm.is_view_and_print == false &&
      child.perm.is_view_and_print_and_download == false &&
      child.perm.is_upload == false &&
      child.perm.is_shortcut == false &&
      child.perm.is_editor == false
    ) {
      console.log("Testify2");

      child.perm.is_no_access = true;
      child.perm.is_access = false;
    } else {
      console.log("Testify3");

      child.perm.is_no_access = false;
      child.perm.is_access = true;
    }

    child.children.forEach((test) => {
      this.NoAccessAndClick(test);

      console.log("Eestify3", test);

      if (test.children !== undefined) {
        if (test.children.length > 0) {
          console.log("Eestify3", test);

          this.NoAccessAndClick(test);
        }
      }
    });
  }
  NoAccessAndAccess(file) {

    this.nodes.forEach((res) => {
      if (
        res.perm.is_view_only == false &&
        res.perm.is_view_and_print == false &&
        res.perm.is_view_and_print_and_download == false &&
        res.perm.is_upload == false &&
        res.perm.is_shortcut == false &&
        res.perm.is_watermarking == false &&
        res.perm.is_editor == false
      ) {
        res.perm.is_no_access = true;
        res.perm.is_access = false;
        res.children.forEach((child) => {
          child.perm.is_no_access = true;
          if (
            child.perm.is_view_only == false &&
            child.perm.is_view_and_print == false &&
            child.perm.is_view_and_print_and_download == false &&
            child.perm.is_upload == false &&
            child.perm.is_shortcut == false &&
            child.perm.is_editor == false
          ) {
            child.perm.is_no_access = true;
            child.perm.is_access = false;
          } else {
            child.perm.is_no_access = false;
            child.perm.is_access = true;
          }
          child.children.forEach((child2) => {
            this.NoAccessAndClick(child2);

            if (child2.children !== undefined) {
              if (child2.children.length > 0) {
                this.NoAccessAndClick(child2);
              }
            }
          });
        });
      } else {
        res.perm.is_no_access = false;
        res.perm.is_access = true;

        res.children.forEach((child1) => {
          child1.perm.is_no_access = false;
          if (
            child1.perm.is_view_only == false &&
            child1.perm.is_view_and_print == false &&
            child1.perm.is_view_and_print_and_download == false &&
            child1.perm.is_upload == false &&
            child1.perm.is_shortcut == false &&
            child1.perm.is_editor == false
          ) {
            child1.perm.is_no_access = true;
            child1.perm.is_access = false;
          }
          child1.children.forEach((child2) => {
            this.NoAccessAndClick(child2);

            if (child2.children !== undefined) {
              if (child2.children.length > 0) {
                this.NoAccessAndClick(child2);
              }
            }
          });
        });
      }
    });
  }




  UpdateFoldersFilesPermission() {
    console.log(" this.is_folder_only >>>>>>", this.is_folder_only);

    if (this.IsAllselected == true) {
      this.selectedData = this.nodes;
    } else {
      this.selectedData = this.nodes.filter(obj => this.arrSelectedindex.indexOf(obj.id) != -1);
    }

    console.log(this.selectedData)
    if (this.is_folder_only == true) {
      let sub = this.dataRoomService
        .create_dataroom_folder_permission_for_time(
          this.selectedData,
          this.currentDataroomId,
          this.enduser_group_id
        )
        .subscribe(
          (res) => {
            this.response = res;
            console.log(res, "Update Permission");
            this.msg = "End User group upload restrictions updated successfully.";
            if (res === true) {
              this.getFolderHierarchyPermission();
              if (!this.hidemsg) {
                this.showSuccess();
              } else {
                this.hidemsg = false;
              }
            }
          },
          (error) => {
            this.msg = error._body;
            this.showError();
          });

      setTimeout(() => {
        if (this.response == null) {
          let msg = 'create_dataroom_folder_permission';
          //this.openDialogTimeout();
          this.dataRoomService
            .TimeOutApi(
              this.currentDataroomId,
              msg,
            )
            .subscribe((res) => {

              console.log(res, "timeout succeessfully");
            });
        }
        sub.unsubscribe()
      }, 270000);
    } else {
      let sub = this.dataRoomService
        .createFolderOnlyPermission(
          this.selectedData,
          this.currentDataroomId,
          this.enduser_group_id
        )
        .subscribe(
          (res) => {
            this.response = res;
            console.log(res, "Update Permission");
            this.msg = "End User group upload restrictions updated successfully.";
            if (res === true) {
              this.getFolderHierarchyPermission();
              console.log(res, "teststt123");
              if (!this.hidemsg) {
                this.showSuccess();
              } else {
                this.hidemsg = false;
              }
            }
          },
          (error) => {
            this.msg = error._body;
            this.showError();
          });

      setTimeout(() => {
        if (this.response == null) {
          let msg = 'create_dataroom_folder_permission';
          // this.openDialogTimeout();
          this.dataRoomService
            .TimeOutApi(
              this.currentDataroomId,
              msg,
            )
            .subscribe((res) => {

              console.log(res, "timeout succeessfully");
            });
        }
        sub.unsubscribe()
      }, 270000);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>is_folder_only<<<<<<<<<<<<<<<<<<<<<<<");
    }
  }



  ClickAllDateSelectedChildren(children, event) {
    console.log(this.nodes);

    if (event.target.value) {
      this.access_revoke = event.target.value
      children.forEach((res) => {
        res.access_revoke = event.target.value;
        if (Array.isArray(res.children)) {
          if (res.children.length > 0) {
            this.ClickAllDateSelectedChildren(res.children, event);
          }
        }
      });
    }
    this.IndeterminateFuntion(this.nodes);
  }

  ClickAllNoAccessChildren(children, event) {
    if (event == true) {
      this.is_view_only_indeterminate = false;
      this.is_view_and_print_indeterminate = false;
      this.is_view_and_print_and_download_indeterminate = false;
      this.is_upload_indeterminate = false;
      this.is_watermark_indeterminate = false;
      this.is_editor_indeterminate = false;
      this.is_drm_indeterminate = false;
      this.is_shortcut_indeterminate = false;
      children.forEach((res) => {
        res.perm.is_no_access = true;
        res.perm.is_view_only = false;
        res.perm.is_view_and_print = false;
        res.perm.is_view_and_print_and_download = false;
        res.perm.is_watermark = false;
        res.perm.is_drm = false;
        res.perm.is_editor = false;
        res.perm.is_upload = false;
        res.perm.is_shortcut = false;
        if (Array.isArray(res.children)) {
          if (res.children.length > 0) {
            this.ClickAllNoAccessChildren(res.children, event);
          }
        }
      });
    } else {
      children.forEach((res) => {
        res.perm.is_no_access = false;
        res.perm.is_view_only = false;
        res.perm.is_view_and_print = false;
        res.perm.is_view_and_print_and_download = false;
        res.perm.is_watermark = false;
        res.perm.is_drm = false;
        res.perm.is_editor = false;
        res.perm.is_upload = false;
        res.perm.is_shortcut = false;
        if (Array.isArray(res.children)) {
          if (res.children.length > 0) {
            this.ClickAllNoAccessChildren(res.children, event);
          }
        }
      });
    }
    this.IndeterminateFuntion(this.nodes);
  }

  clickAllDateSelected(event) {
    console.log(event.target.value);
    console.log(this.nodes);
    if (event.target.value) {
      this.access_revoke = event.target.value;
      this.nodes.forEach((res) => {
        console.log('res  --->  ', res)
        res.access_revoke = event.target.value;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllDateSelectedChildren(res.children, event);
          }
        }
      });
    }
  }


  clickAllNoAccess(event) {
    this.IsAllselected = true;
    if (event == true) {

      this.nodes.forEach((res) => {
        res.perm.is_no_access = true;
        res.perm.is_view_only = false;
        res.perm.is_view_and_print = false;
        res.perm.is_view_and_print_and_download = false;
        res.perm.is_watermark = false;
        res.perm.is_drm = false;
        res.perm.is_editor = false;
        res.perm.is_upload = false;
        res.perm.is_shortcut = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllNoAccessChildren(res.children, event);
          }
        }
      });
    } else {
      this.nodes.forEach((res) => {
        res.perm.is_no_access = false;
        res.perm.is_view_only = false;
        res.perm.is_view_and_print = false;
        res.perm.is_view_and_print_and_download = false;
        res.perm.is_watermark = false;
        res.perm.is_drm = false;
        res.perm.is_editor = false;
        res.perm.is_upload = false;
        res.perm.is_shortcut = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllNoAccessChildren(res.children, event);
          }
        }
      });
    }
    this.IndeterminateFuntion(this.nodes);
  }

  ClickAllViewChildren(children, event) {
    if (event == true) {
      children.forEach((res) => {
        res.perm.is_view_only = true;
        res.perm.is_no_access = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllViewChildren(res.children, event);
          }
        }
      });
    } else {
      console.log("unclick allview child");
      this.is_view_only = false;
      this.is_view_and_print_and_download = false;
      this.is_view_and_print = false;
      this.is_upload = false;
      this.is_shortcut = false;
      children.forEach((res) => {
        res.perm.is_view_only = false;
        res.perm.is_shortcut = false;
        res.perm.is_upload = false;
        res.perm.is_view_and_print = false;
        res.perm.is_view_and_print_and_download = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllViewChildren(res.children, event);
          }
        }
      });
    }
    this.IndeterminateFuntion(this.nodes);
  }
  clickAllView(event) {
    this.IsAllselected = true;
    if (event == true) {
      console.log("clickAllView");
      this.is_no_access = false;
      this.is_view_only = true;
      this.nodes.forEach((res) => {
        res.perm.is_view_only = true;
        res.perm.is_no_access = false;
        console.log(res.children);
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllViewChildren(res.children, event);
          }
        }
      });
    } else {
      this.nodes.forEach((res) => {
        console.log("unclickAllView");
        res.perm.is_view_only = false;
        res.perm.is_upload = false;
        res.perm.is_shortcut = false;
        res.perm.is_view_and_print = false;
        res.perm.is_view_and_print_and_download = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllViewChildren(res.children, event);
          }
        }
      });
    }
    this.IndeterminateFuntion(this.nodes);
  }
  ClickAllViewPrintChildren(children, event) {
    console.log(children);
    if (event == true) {
      console.log("ClickAllViewPrint");
      children.forEach((res) => {
        res.perm.is_view_only = true;
        res.perm.is_view_and_print = true;

        res.perm.is_no_access = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllViewPrintChildren(res.children, event);
          }
        }
      });
    } else {
      children.forEach((res) => {
        // res.perm.is_view_only = false;
        res.perm.is_view_and_print_and_download = false;
        res.perm.is_view_and_print = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllViewPrintChildren(res.children, event);
          }
        }
      });
    }
  }
  clickAllViewPrint(event) {
    this.IsAllselected = true;
    if (event == true) {
      console.log("clickAllViewPrint");
      this.is_no_access = false;
      this.is_view_only = true;
      this.nodes.forEach((res) => {
        res.perm.is_view_only = true;
        res.perm.is_view_and_print = true;
        res.perm.is_no_access = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllViewPrintChildren(res.children, event);
          }
        }
      });
    } else {
      console.log("else clickAllViewPrint");
      this.is_view_only = true;
      this.is_view_and_print_and_download = false;
      this.nodes.forEach((res) => {
        res.perm.is_view_only = false;
        res.perm.is_view_and_print = false;
        res.perm.is_view_and_print_and_download = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllViewPrintChildren(res.children, event);
          }
        }
      });
    }
    this.IndeterminateFuntion(this.nodes);
  }
  ClickAllViewPrintDownloadChildren(children, event) {
    if (event == true) {
      console.log("ClickAllViewPrintDownloadChildren");
      children.forEach((res) => {
        res.perm.is_no_access = false;
        res.perm.is_view_only = true;
        res.perm.is_view_and_print = true;
        res.perm.is_view_and_print_and_download = true;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllViewPrintDownloadChildren(res.children, event);
          }
        }
      });
    } else {
      children.forEach((res) => {
        res.perm.is_view_only = true;
        res.perm.is_view_and_print = true;
        // res.perm.is_upload = false;
        // res.perm.is_shortcut = false;
        res.perm.is_view_and_print_and_download = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllViewPrintDownloadChildren(res.children, event);
          }
        }
      });
    }
  }
  clickAllViewPrintDownload(event) {
    this.IsAllselected = true;
    if (event == true) {
      console.log("ClickAllViewPrintDownload");
      this.is_no_access = false;
      this.is_view_only = true;
      this.is_view_and_print = true;
      this.nodes.forEach((res) => {
        res.perm.is_no_access = false;
        res.perm.is_view_only = true;
        res.perm.is_view_and_print = true;
        res.perm.is_view_and_print_and_download = true;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            console.log("timo children", res.children);
            this.ClickAllViewPrintDownloadChildren(res.children, event);
          }
        }
      });
    } else {
      console.log("ClickAllViewPrintDownload");
      // this.is_view_only = false;
      // this.is_view_and_print = false;
      this.nodes.forEach((res) => {
        res.perm.is_view_only = true;
        res.perm.is_view_and_print = true;
        // res.perm.is_shortcut = false;
        // res.perm.is_upload = false;
        res.perm.is_view_and_print_and_download = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllViewPrintDownloadChildren(res.children, event);
          }
        }
      });
    }
  }
  ClickAllWatermarkChildren(children, event) {
    if (event == true) {
      children.forEach((res) => {
        res.perm.is_no_access = false;
        res.perm.is_watermarking = true;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllWatermarkChildren(res.children, event);
          }
        }
      });
    } else {
      children.forEach((res) => {
        res.perm.is_watermarking = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllWatermarkChildren(res.children, event);
          }
        }
      });
    }
    this.IndeterminateFuntion(this.nodes);
  }
  clickAllWatermark(event) {
    if (event == true) {
      this.is_no_access = false;
      this.nodes.forEach((res) => {
        res.perm.is_no_access = false;
        res.perm.is_watermarking = true;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllWatermarkChildren(res.children, event);
          }
        }
      });
    } else {
      this.nodes.forEach((res) => {
        res.perm.is_watermarking = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.ClickAllWatermarkChildren(res.children, event);
          }
        }
      });
    }
    this.IndeterminateFuntion(this.nodes);
  }

  clickAllUploadChildren(children, event) {
    if (event == true) {
      console.log(children);
      this.is_no_access = false;
      children.forEach((res) => {
        res.perm.is_no_access = false;

        if (res.is_folder == true) {
          res.perm.is_upload = true;
          res.perm.is_view_only = true;
        } else {
          res.perm.is_upload = false;
          res.perm.is_view_only = true;
        }

        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllUploadChildren(res.children, event);
          }
        }
      });
    } else {
      children.forEach((res) => {
        res.perm.is_upload = false;
        res.perm.is_view_only = true;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllUploadChildren(res.children, event);
          }
        }
      });
    }
    this.IndeterminateFuntion(this.nodes);
  }
  clickAllUpload(event) {
    this.IsAllselected = true;
    console.log("Test Console");
    if (event == true) {
      this.is_no_access = false;
      this.is_view_only = true;
      this.nodes.forEach((res) => {
        res.perm.is_no_access = false;
        res.perm.is_view_only = true;
        res.perm.is_upload = true;

        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllUploadChildren(res.children, event);
          }
        }
      });
    } else {
      this.nodes.forEach((res) => {
        res.perm.is_upload = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllUploadChildren(res.children, event);
          }
        }
      });
    }
    this.IndeterminateFuntion(this.nodes);
  }

  clickAllDRMChildren(children, event) {
    if (event == true) {
      this.is_no_access = false;
      children.forEach((res) => {
        res.perm.is_no_access = false;
        res.perm.is_drm = true;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllDRMChildren(res.children, event);
          }
        }
      });
    } else {
      children.forEach((res) => {
        res.perm.is_drm = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllDRMChildren(res.children, event);
          }
        }
      });
    }
    this.IndeterminateFuntion(this.nodes);
  }

  clickAllDRM(event) {
    if (event == true) {
      this.is_no_access = false;
      this.nodes.forEach((res) => {
        res.perm.is_no_access = false;
        res.perm.is_drm = true;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllDRMChildren(res.children, event);
          }
        }
      });
    } else {
      this.nodes.forEach((res) => {
        res.perm.is_drm = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllDRMChildren(res.children, event);
          }
        }
      });
    }
  }

  clickAllEditorChildren(children, event) {
    if (event == true) {
      this.is_no_access = false;
      children.forEach((res) => {
        res.perm.is_no_access = false;
        res.perm.is_editor = true;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllEditorChildren(res.children, event);
          }
        }
      });
    } else {
      children.forEach((res) => {
        res.perm.is_editor = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllEditorChildren(res.children, event);
          }
        }
      });
    }
    this.IndeterminateFuntion(this.nodes);
  }

  onChangeDate(dateValue, file) {
    // called when the user picks a date/time for upload restriction
    console.log("Triggered", dateValue);
    // ensure the model is updated (ngModel already handles this)
    file.perm.folder_timer_upload_ristrict_date = dateValue;

    // if a date/time has been provided we should automatically
    // tick the associated checkbox (and propagate to children via
    // existing logic).  If the date is cleared, uncheck it.
    if (dateValue) {
      if (!file.perm.folder_timer_upload_ristrict) {
        file.perm.folder_timer_upload_ristrict = true;
        // create a synthetic event object with a checked property
        this.clickUploadRestriction({ checked: true } as any, file);
      }
    } else {
      if (file.perm.folder_timer_upload_ristrict) {
        file.perm.folder_timer_upload_ristrict = false;
        this.clickUploadRestriction({ checked: false } as any, file);
      }
    }
  }


  clickUploadRestriction(event, file) {
    this.arrSelectedindex.push(file.id);
    console.log(file.id, "clickShortcut1");

    if (event.checked == true) {
      this.is_shortcut_indeterminate = true;
      this.is_view_only_indeterminate = true;
      this.ViewShortcutPermission(file);
    } else {
      console.log("clickShortcut2");
      this.ViewShortcutElsePermission(file);
      // when the checkbox is manually unticked we should also clear any
      // previously selected date/time so the UI resets
      file.perm.folder_timer_upload_ristrict_date = null;
      // propagate to children as well (the ViewShortcutElsePermission already
      // handles permission clearing; clearing date for descendants too)
      if (file.children) {
        const clearDates = (nodes) => {
          nodes.forEach(n => {
            n.perm.folder_timer_upload_ristrict_date = null;
            if (n.children) {
              clearDates(n.children);
            }
          });
        };
        clearDates(file.children);
      }
    }
    console.log("clickShortcut3");

    this.IndeterminateFuntion(this.nodes);
    this.NoAccessAndAccess(file);
  }

  ViewShortcutPermission(file) {
    file.perm.is_no_access = false;
    file.perm.is_view_only = true;
    file.perm.is_access = true;
    file.perm.is_shortcut = true;

    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.ViewShortcutPermission(res);
        });
      }
    }
  }

  ViewShortcutElsePermission(file) {
    file.perm.is_no_access = false;
    file.perm.is_view_only = true;
    file.perm.is_access = false;
    file.perm.is_shortcut = false;

    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.ViewShortcutElsePermission(res);
        });
      }
    }
  }

  clickAllShortcutChildren(children, event) {
    if (event == true) {
      console.log("clickAllShortcutChildren");
      this.is_no_access = false;
      children.forEach((res) => {
        res.perm.is_no_access = false;
        res.perm.is_view_only = true;
        res.perm.is_access = true;
        res.perm.is_shortcut = true;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllShortcutChildren(res.children, event);
          }
        }
      });
    } else {
      children.forEach((res) => {
        console.log(res.children);
        res.perm.is_shortcut = false;

        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllShortcutChildren(res.children, event);
          }
        }
      });
    }
    this.IndeterminateFuntion(this.nodes);
  }
  clickAllShortcut(event) {
    this.IsAllselected = true;
    if (event == true) {
      console.log(22323);
      this.is_no_access = false;
      this.is_view_only = true;
      this.nodes.forEach((res) => {
        res.perm.is_no_access = false;
        res.perm.is_view_only = true;
        res.perm.is_shortcut = true;
        res.perm.is_access = true;

        if (res.children != undefined) {
          console.log(res);

          if (res.children.length > 0) {
            this.clickAllShortcutChildren(res.children, event);
          }
        }
      });
    } else {
      this.nodes.forEach((res) => {
        res.perm.is_shortcut = false;
        console.log(res.children);
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllShortcutChildren(res.children, event);
          }
        }
      });
    }
  }

  clickAllEditor(event) {
    if (event == true) {
      this.is_no_access = false;
      this.nodes.forEach((res) => {
        res.perm.is_no_access = false;
        res.perm.is_editor = true;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllEditorChildren(res.children, event);
          }
        }
      });
    } else {
      this.nodes.forEach((res) => {
        res.perm.is_editor = false;
        if (res.children != undefined) {
          if (res.children.length > 0) {
            this.clickAllEditorChildren(res.children, event);
          }
        }
      });
    }
  }



  toggles(expanded) {
    expanded = !expanded;
  }

  // openDialogTimeout(): void {
  //   const dialogRef = this.dialog.open(TimeOutPopupD, {
  //     width: "500px",
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     //console.log(result);
  //     if (result && result != undefined) {

  //       if (result.result == true) {
  //         console.log(result.result, "result true");
  //       } else if (result.result == false) {
  //         this.UpdateFoldersFilesPermission()
  //         console.log(result.result, "result false");
  //       } else {
  //         console.log(result, "result none");
  //       }
  //     }
  //     if (!result && result != undefined) {
  //       console.log(result, "result");
  //     }
  //   });
  // }
}
