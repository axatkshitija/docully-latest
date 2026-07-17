import { DatePipe, Location } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataRoomService } from "../../../services/index";
import { ActivatedRoute, Router } from "@angular/router";
import { Folder } from "../../../models/folder";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ITreeOptions } from "@bugsplat/angular-tree-component";
import { Injectable } from "@angular/core";
import { group } from "@angular/animations";

export interface DialogData {
  yes: string;
  no: string;
  ok: string;
}

@Component({
  selector: "app-manage-group-permission",
  templateUrl: "./manage-group-permission.component.html",
  styleUrls: ["./manage-group-permission.component.css"],
})
@Injectable()
export class ManageGroupPermissionComponent implements OnInit {
  currentDataroomId: any;
  newGroupForm: FormGroup;
  adminForm: FormGroup;
  // end user form
  FirstEndUserGroup: FormGroup;
  SecondOverviewFormPermission: FormGroup;
  ThirdMemberAdditionForm: FormGroup;
  FourthDocumentPermissions: FormGroup;
  FolderSpecificPermissions: FormGroup;

  currentDate;
  msg: string;
  all_admin_list: any = []; // create new admin
  isLinear: boolean = false;
  all_root_folder: Folder[] = [];
  all_end_user_groups: any[] = [];
  is_hide_drm: boolean = false;
  irm_protected_files_days: number = 1;
  irm_protected_files: boolean = false;
  is_hide_watermarking: boolean = false;
  // end user folder permission
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
  item: string = "";
  isManageActionBar: boolean;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
    private router: Router,
    private dataRoomService: DataRoomService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    public datepipe: DatePipe,
  ) {

    const id = parseInt(this.route.snapshot.paramMap.get("group_id"));
    this.enduser_group_id = id;
    console.log("group id is", this.enduser_group_id);
    this.selectedIndex = parseInt(this.route.snapshot.paramMap.get("indx"));

    console.log("Manage Permission Group Id is:", id);
    this.currentDataroomId = localStorage.getItem("currentDataroomId");
    this.getFeatures(this.currentDataroomId)
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

    this.deleteForm = new FormGroup({
      delete: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
  }

  user: any;
  ngOnInit() {
    let today = new Date();
    this.currentDate = this.datepipe.transform(today, 'yyyy-MM-dd')
    //this.getSingleDataroom(this.currentDataroomId);
    this.initializeNewAdminForm();
    this.intializerNewGroupForm();
    this.initializeEndUserGroup();
    this.initializeOverviewFormPermission();
    this.intializeMemberAdditionForm();
    this.initializeDocumentAndPermission();
    this.getAllAdmins();

    // this.getFilesFolders();
    this.initializeEndUserMemberGroup();
    this.getEndUserGroupInformation();
    this.initCreateNewMemberForm();
    this.get_end_user_groups();
    this.getFolderHierarchyPermission();
    this.getAllContacts();
    this.getAllContactGroups();
    this.addValue();
    //this.irm_group_protection_get();
    this.dataRoomService.getUserProfileDatroom(this.currentDataroomId).subscribe((res) => {
      this.user = res.member;
      console.log(this.user, "user details in manage group permission");
    });
    console.log(this.user, "user details in manage group permission");
  }

  addValue() {
    this.item = "I'd like you to join my secure dataroom.";
  }

  select: boolean = true;
  yourFn(event) {
    console.log(event.index, "event check");
    if (event.index == 3) {
      this.dataRoomService
        .getSingleDataroom(this.currentDataroomId)
        .subscribe((res) => {
          this.dataroom_live = res.is_dataroom_on_live;
          console.log(this.dataroom_live, "invitation_send_successfully");
          if (this.dataroom_live) {
            this.getAllAdmins();
          } else {
            this.getAllAdmins();
          }
        });
    }
    if (event.index == 2) {
      this.checkedArray = false;
    }
  }


  documentUploadRestriction() {
    this.router.navigate(["/document-upload-restriction/", this.enduser_group_id, 4]);
  }


  activeButton: 'first' | 'second' | null = null;

  setActive(button: 'first' | 'second') {
    this.activeButton = button;
    console.log(this.all_admin_list, "ngAllChecked");
    if (this.ngAllChecked == true) {
      this.checkboxAllAddedManageMember(this.activeButton);
      this.ngAllChecked = false;
    }
    this.all_admin_list.filter(function (contact) {
      return (contact.state = false);
    })
  }



  features: any;
  getFeatures(dataroomId) {
    this.dataRoomService.get_dataroom_features(dataroomId).subscribe((res) => {
      if (res[0] === undefined) {

        this.features = {
          auto_expire: true,
          bulk_users_upload: true,
          country_perm: true,
          custom_external_link: true,
          custom_logo: true,
          is_upload_restrict: true,
          custom_watermarking: true,
          desktop_unlimit_upload: true,
          doculink_perm: true,
          dropbox_upload: true,
          email_to_dataroom_upload: true,
          favourites: true,
          google_drive_upload: true,
          id: 2,
          la_admin_access: true,
          module_perm: true,
          one_drive_upload: true,
          proj_management: true,
          proj_overview: true,
          proj_updates: true,
          proj_video_intro: true,
          qa_submit: true,
          qa_with_cat: true,
          is_excel_ms_viewer: true,
          redaction: true,
          sharepoint_upload: true,
          two_factor_auth: true,
          voting_perm: true,
          auto_logout: true,
          co_current_logins: true,
          is_irm_protected: true,
          voting_report_perm: true,
          index_report_others: true,
          self_upload_status: true,
          all_user_upload_status: true,
          activity_tracker_perm: true,
          file_view_limit: true,
          viewer_support: true,
          fence_viewer: true,
          print_screen_perm: true,
        }
      } else {
        this.features = res[0];
      }
      console.log("features>>", this.features)
    });
  }

  yourFn1() { }
  ProperSelection(value) {
    this.all_contacts;
    if (value == 0) {
      this.select = true;
      this.all_contacts_groups.forEach((res) => {
        res.select = false;
      });
      this.getAllContacts();
    } else {
      this.select = false;
      this.all_contacts_groups.forEach((res) => {
        if (res.id == value) {
          res.select = true;
        } else {
          res.select = false;
        }
      });
      this.getAllContactGroupMembers(value);
    }
  }

  getAllContactGroupMembers(group) {
    this.dataRoomService
      .getAllContactsAssociatedWithGroup(group)
      .subscribe((res) => {
        //
        console.log("get all contacts related field successfully");
        console.log("Result is", res);
        this.all_contacts = res;
        // this.status = !this.status;
      });
  }

  all_contacts: any;
  getAllContacts() {
    this.dataRoomService.getAllContacts().subscribe((res) => {
      this.all_contacts = res.filter((data) => (data.selected = true));
    });
  }

  all_contacts_groups: any;
  getAllContactGroups() {
    this.dataRoomService.getAllContactsGroup().subscribe((res) => {
      this.all_contacts_groups = res;
      //this.initializeContactFrom();
    });
  }

  show_spinner: boolean = true;
  nodes: any = [];
  getFolderHierarchyPermission() {
    this.dataRoomService
      .getFoldersHierarchyPermission(
        this.currentDataroomId,
        this.enduser_group_id,
        0
      )
      .subscribe((res) => {
        console.log(res, "get APi");
        this.nodes = res;
        this.IndeterminateFuntion(this.nodes);
        this.show_spinner = false
      });
  }

  options: ITreeOptions = {
    getChildren: this.getSubFolderElement.bind(this),
    useCheckbox: false,
  };

  children: any = [];
  getChildren(node: any) {
    // return this.getSubFolderElement(node.data.id);

    console.log(node);
  }

  hidemsg: boolean = false;

  getSubFolderElement(id): any {
    console.log(id);
    const parent = id;
    id = id.data.id;
    this.dataRoomService
      .getFoldersHierarchyPermission(
        this.currentDataroomId,
        this.enduser_group_id,
        id
      )
      .subscribe((res) => {
        //
        // return res;

        this.changeChildren(res, parent);
        this.children = res;
      });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.children);
        console.log(this.children);
      }, 5000);
    });

    // return [];
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
      console.log(res.children, "IndeterminateFuntion");

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

            //console.log(upload_children_folder, "Upload InterMinate");
            // res.is_no_access = false;
            //res.is_access = false;
            //res.upload_indeterminate = false
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
    // var editor_inder = this.nodes.filter(
    //   (res) => res.perm.is_shortcut == true
    // );
    // if (editor_inder.length > 0 && this.nodes.length > editor_inder.length) {
    //   this.is_editor_indeterminate = true;
    // }else if(this.nodes.length == editor_inder.length){
    //   this.is_shortcut = true;
    // }else{
    //   this.is_editor_indeterminate = false;
    // }
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
        res.children.forEach((res) => {
          this.InderminateSubFunction(res);
        });
      }
    }
  }


  all_files: any;
  all_folders: any;
  // getFilesFolders(){
  //     this.dataRoomService.getFilesFolders(this.currentDataroomId, this.enduser_group_id)
  //     .subscribe((res=>{
  //       this.all_files = res;
  //       this.all_folders = this.all_files.filter((res)=>res.is_folder===true);
  //       this.all_folders.forEach((res)=>{
  //         res.expanded = false;
  //       })
  //       this.all_files = this.all_files.filter((res)=>res.is_folder===false);
  //     }))
  // }

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
        // this.group_all_folders = this.group_all_files.filter((res)=>res.is_folder == true);
        // this.group_all_files = this.group_all_files.filter((res)=>res.is_folder == false);
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
    // console.log("this.group_id", this.group_id);
    // var all_files = this.group_all_files.concat(this.group_all_folders);
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
  get_end_user_groups() {
    this.dataRoomService
      .getEndUserGroup(this.currentDataroomId)
      .subscribe((res) => {
        this.all_dataroom_groups = res.data.filter(
          (res) =>
            res.id != this.enduser_group_id && res.limited_access == false
        );
        console.log(this.all_dataroom_groups, "all_dataroom_groups");
        this.apply_update = false;
      });
  }

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





  emailPattern =
    "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
    "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  initializeNewAdminForm() {
    this.adminForm = new FormGroup({
      first_name: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        this.onlyTextValidator
      ]),
      last_name: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        this.onlyTextValidator
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(this.emailPattern),
      ]),
    });
  }

  intializerNewGroupForm() {
    this.newGroupForm = new FormGroup({
      group_name: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
    });
  }

  // initilization member addition form
  all_end_users: any = [];
  intializeMemberAdditionForm() {
    console.log("member addition form");
    this.ThirdMemberAdditionForm = new FormGroup({
      first_name: new FormControl("", [
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      last_name: new FormControl("", [
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      email: new FormControl("", [
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
    });
  }

  initializeEndUserGroup() {
    this.FirstEndUserGroup = new FormGroup({
      group_name: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
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

  initializeEndUserMemberGroup() {
    this.enduser_group_member_form = this._formBuilder.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(this.emailPattern)]],
    });
  }

  // on submit admin form
  onSubmitAdminForm(adminForm: any) {
    let custom_message = "Hi";
    this.dataRoomService
      .create_an_dataroom_admin(
        this.currentDataroomId,
        adminForm.value,
        custom_message
      )
      .subscribe(
        (res: any) => {
          this.all_admin_list.push(res);
          this.msg = "Admin successfully added !";
          this.showInfo();
          this.adminForm.reset();
        },
        (error: any) => {
          console.log("error", error);
          this.msg = error.error.msg;
          this.showError();
        }
      );
  }

  // create end user group member
  createEnduserGroupMember() {
    this.all_end_user_group_members.push(this.enduser_group_member_form.value);
    this.enduser_group_member_form.reset();
  }

  // delete member from end user group

  deleteMemberFromGroup(i) {
    this.all_end_user_group_members.splice(i, 1);
    this.msg = "Member successfully deleted !";
    this.showError();
  }

  // common success messges
  all_groups: any = [];
  newGroupFormSubmit(groupForm: any) {
    this.all_groups.push(groupForm.value);
    this.msg = "Group successfully added !";
    this.showInfo();

    // reset the group form submit
    this.newGroupForm.reset();
  }
  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  showInfo() {
    this.toastr.info(this.msg);
  }

  // delete admin
  deleteAdmin(i, admin_id) {
    this.dataRoomService.delete_dataroom_admin(admin_id).subscribe((res) => {
      this.all_admin_list.splice(i, 1);
      this.msg = "Delete Member successfully !";
      this.showError();
    });
  }

  resendInvitation(member) {
    console.log(member);
    console.log(23232);
    this.getSingleDataroom(this.currentDataroomId);
    console.log(this.dataroom_detail.is_dataroom_on_live, "live");
    if (this.dataroom_detail.is_dataroom_on_live) {
      this.dataRoomService.resendInvitationLink(member).subscribe((res) => {
        this.msg =
          "End User invitation to join the data room re-sent successfully.";
        this.showInfo();
      });
    } else {
      this.msg =
        "Dataroom is on hold stage. User invitation will be sent once dataroom is on Live stage.";
      this.showInfo();
    }
  }

  resendInvitationBulk(member) {
    console.log(member);
    console.log(23232);
    this.getSingleDataroom(this.currentDataroomId);
    console.log(this.dataroom_detail.is_dataroom_on_live, "live");
    if (this.dataroom_detail.is_dataroom_on_live) {
      this.dataRoomService.resendInvitationLink(member).subscribe((res) => {
        console.log(this.all_admin_list[this.selectedAll1.length - 1]['id'])
        if (this.selectedAll1[this.selectedAll1.length - 1]['id'] == member.id) {
          this.msg = "Invitation resent successfully";
          this.showInfo();
        }
        console.log(res);
      });
    }
  }

  addNewEndUserMember(ThirdMemberAdditionForm) {
    console.log("add new end user admin");
    console.log("admin form value is", ThirdMemberAdditionForm);
    this.all_end_users.push(ThirdMemberAdditionForm);
    this.ThirdMemberAdditionForm.reset();
    this.msg = "Team Member added successfully.";
    this.showInfo();
  }

  // FourthDocumentPermissions

  //isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  // delete member
  deleteMemberSuccessfully(i) {
    this.all_end_users.splice(i, 1);
    this.msg = "Member successfully deleted !";
    this.showError();
  }

  // get all end user groups
  submitEndUserGroup(end_user_group_information: any) {
    console.log(end_user_group_information)
    let selectedDate = end_user_group_information['access_revoke'];
    end_user_group_information['access_revoke'] = this.datepipe.transform(selectedDate, 'yyyy-MM-ddT00:01');
    console.log(end_user_group_information['access_revoke'])

    this.dataRoomService
      .edit_enduser_group_information(end_user_group_information)
      .subscribe((res) => {
        this.msg = "End User group data updated successfully.";
        this.showInfo();
        //this.selectedIndex = 2;
      });
  }

  // irm_group_protection() {
  //   const group_data = {
  //     is_active: this.irm_protected_files,
  //     days:this.irm_protected_files_days
  //   }
  //   console.log(group_data)

  //   this.dataRoomService
  //     .irm_protected_files(this.enduser_group_id,group_data)
  //     .subscribe((res) => {
  //       if(this.irm_protected_files){
  //         this.msg = "IRM has been activated.";
  //       }else{
  //         this.msg = "IRM has been deactivated.";
  //       }
  //       //this.msg = "End User group data updated successfully.";
  //       this.showInfo();
  //       //this.selectedIndex = 2;
  //     });
  // }


  //   irm_group_protection_get() {
  //   // const group_data = {
  //   //   is_active: this.irm_protected_files,
  //   //   days:this.irm_protected_files_days
  //   // }
  //   // console.log(group_data)

  //   this.dataRoomService
  //     .irm_protected_files_get(this.enduser_group_id)
  //     .subscribe((res) => {
  //       this.irm_protected_files = res.irm_perm;
  //       this.irm_protected_files_days = res.days || 1;
  //       console.log(res)
  //       //this.msg = "End User group data updated successfully.";
  //       //this.showInfo();
  //       //this.selectedIndex = 2;
  //     });
  // }


  defaultApplyStatus: boolean = false;
  changeApply() {
    console.error("Apply Has Change")
    this.defaultApplyStatus = true;
  }

  q_flag: boolean = false;
  end_user_group_information: any;
  getEndUserGroupInformation() {
    this.dataRoomService
      .get_end_user_group_information(this.enduser_group_id)
      .subscribe((res) => {
        this.q_flag = res.is_q_and_a;
        console.log(this.q_flag)
        this.end_user_group_information = res;
        console.log(res, "end users info");

        if (this.end_user_group_information.dataroom_groups.is_active) {
          this.groupStatus = true
        } else {
          this.groupStatus = false
        }


      });
  }

  checkfirstpage: any;
  getCheckfirstpage() {
    this.dataRoomService
      .checkfirstpage(this.currentDataroomId)
      .subscribe((res) => {
        this.checkfirstpage = res;
        console.log(res, "check users info");
      });
  }


  GroupActivationFunction() {
    this.dataRoomService.GroupDeactivateactivate(this.enduser_group_id, this.notify)
      .subscribe((res) => {
        console.log(res);
        this.msg = "Group status has been updated";
        this.showSuccess();
        this.groupStatus = res;
        this.getEndUserGroupInformation()
      });
  }

  groupStatus;
  GroupDeactivateactivate() {
    console.log(this.groupStatus)
    if (this.groupStatus == true) {
      this.openDialog();
    }
    else {
      this.notify = "No"
      this.GroupActivationFunction();
    }
  }

  notify: any = "No";
  modal_action: boolean = false;
  openDialog(): void {
    const dialogRef = this.dialog.open(ActiveEmailConfirmationPopup, {
      width: "300px",
      data: { yes: true, no: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result != undefined) {
        if (result == true) {
          this.notify = "Yes";
          this.GroupActivationFunction();
        }
      }
      if (!result && result != undefined) {
        this.modal_action = true;
        this.notify = "No";
        this.GroupActivationFunction();
      }
    });
  }


  enableWatermarking(event) { }

  goBack() {
    this.router.navigate(["/user-and-permissions"]);
  }

  // get first name and last name
  getFirstnameAndLastname(event: any) {
    let values = "dhananjay.s@axat-tech.com";
    if (typeof values != "undefined" || values != "") {
      console.log("values are ", values);
      this.dataRoomService
        .getFirstnameAndLastnameUsingEmail(values)
        .subscribe((res) => {
          console.log("result data is ", res);
        });
    }
    {
      console.log("Please eneter something");
    }
  }


  onlyTextValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^[a-zA-Z\s]*$/.test(control.value);
    return valid ? null : { 'invalidText': { value: control.value } };
  }

  memberForm: FormGroup;
  initCreateNewMemberForm() {
    this.memberForm = this._formBuilder.group({
      email: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(this.emailPattern),
        ],
      ],
      first_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          this.onlyTextValidator
        ],
      ],
      last_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          this.onlyTextValidator
        ],
      ],
      is_end_user: [true],
      dataroom_group_id: [0],
    });
  }

  all_new_admin: any[] = [];
  addNewAdminMember() {
    console.log("add new member method called", this.memberForm.value);
    // this.memberForm.
    this.memberForm.get("dataroom_group_id").setValue(this.enduser_group_id);
    this.dataRoomService.checkLaUser(this.memberForm.value).subscribe(
      (res) => {
        this.all_new_admin.push(this.memberForm.value);
        this.initCreateNewMemberForm();
        console.log("result data is ", res);
        if (!res.result) {
          this.msg = res.msg;
          this.showSuccess();
        }
      },
      (error: any) => {
        console.log("error", error);
        this.msg = error.error.msg;
        this.showError();
      }
    );
  }

  checkNewAdminMember(member, event) {
    member.is_la_user = true;
    member.dataroom_group_id = this.enduser_group_id;

    if (event.checked == true) {
      this.dataRoomService.checkLaUser(member).subscribe(
        (res) => {
          this.all_new_admin.push(member);
          console.log("result data is ", res);
        },
        (error: any) => {
          console.log("error", error);
          this.msg = error.error.msg;
          this.showError();
        }
      );
    } else {
      var index = this.all_new_admin.findIndex(
        (res) => res.email === member.email
      );
      if (index >= 0) {
        this.all_new_admin.splice(index, 1);
      }

      // this.all_new_admin.splice(index, 1);
    }
  }

  getAllAdmins() {
    this.dataRoomService
      .getALLEndUsers(this.currentDataroomId, this.enduser_group_id)
      .subscribe((res) => {
        this.all_admin_list = res;
        if (!res.memberactivestatus) {
          this.all_admin_list.is_q_a_submitter_user = false;
          console.log(
            this.all_admin_list.is_q_a_submitter_user,
            "submitter_user"
          );
        }
        console.log(this.all_admin_list, "end user member");
        // this.all_admin_list = res.filter((res)=>res.is_end_user==true)
        this.all_new_admin = this.all_admin_list.filter(
          (res) => res.selected == true
        );
      });
  }

  // update users and permnission
  updateUsersAndPermission(end_user_group_information) {
    this.selectedIndex = 3;
    this.dataRoomService
      .update_endusers_and_permission_data1(end_user_group_information)
      .subscribe((res) => {
        this.msg = "End User group permissions applied successfully";
        this.showSuccess();
        this.getEndUserGroupInformation();
        // this.selectedIndex = 2;
      });
  }
  managemerbers() {
    console.log("Manage Members");
    this.dataRoomService
      .getSingleDataroom(this.currentDataroomId)
      .subscribe((res) => {
        this.dataroom_live = res.is_dataroom_on_live;
        console.log(this.dataroom_live, "invitation_send_successfully");
        if (this.dataroom_live) {
          this.dataRoomService
            .getALLEndUsers(this.currentDataroomId, this.enduser_group_id)
            .subscribe((res) => {
              this.all_admin_list = res;
              // this.all_admin_list = res.filter((res)=>res.is_end_user==true)
              this.all_new_admin = this.all_admin_list.filter(
                (res) => res.selected == true
              );
            });
        }
      });
  }
  is_review_added = false;

  addReview() {
    console.log("add review");
    this.is_review_added = !this.is_review_added;
  }
  dataroom_live: any;
  checkedArray: boolean;
  invitation_send_successfully() {

    this.selectedIndex = 1;
    this.getSingleDataroom(this.currentDataroomId);
    this.dataRoomService
      .getSingleDataroom(this.currentDataroomId)
      .subscribe((res) => {
        this.dataroom_live = res.is_dataroom_on_live;
        console.log(this.dataroom_live, "invitation_send_successfully");
        if (this.dataroom_live) {
          this.dataRoomService
            .addEndUsers(
              this.currentDataroomId,
              this.enduser_group_id,
              this.all_new_admin,
              "Live",
              this.item
            )
            .subscribe(
              (res) => {
                this.addValue();
                // this.all_admin_list.splice(i, 1);
                this.msg =
                  "End User invited to join the data room successfully.";
                this.getAllAdmins();
                // this.add_user_list = this.all_admin_list.filter((res)=>res.selected == true);
                this.showSuccess();
                this.checkedArray = true;
                this.selectedIndex = 1;
              },
              (error) => {
                this.msg = error.error.msg;
                this.showError();
              }
            );
        } else {
          this.msg =
            "Dataroom is on hold stage. User invitation will be sent once dataroom is on Live stage";
          this.showInfo();
          this.getAllAdmins();
          this.selectedIndex = 3;
          this.checkedArray = true;
          this.dataRoomService
            .addEndUsers(
              this.currentDataroomId,
              this.enduser_group_id,
              this.all_new_admin,
              "Hold",
              this.item
            )
            .subscribe(
              (res) => {
                this.addValue();
                console.log(res, "Hold");
              },
              (error) => {
                // this.msg = error._body;
                this.msg = "Memeber Not Added";
                this.showError();
              }
            );
        }
      });

    console.log("delete admin", this.enduser_group_id, this.all_new_admin);
  }

  dataroom_detail: any;
  getSingleDataroom(dataroomId) {
    // this.dataRoomService.getSingleDataroom(dataroomId).subscribe((res) => {
    //   this.dataroom_detail = res;
    //   console.log(res, "live");
    // });
  }

  receiveAutoMsgHandler(p) {
    this.dataroom_detail = p.singledataroom;
    console.log(p, "overview???????????????????????????????/");
  }


  deleteNeelyAddedAdmin(i) {
    this.all_new_admin.splice(i, 1);
    console.log(this.all_new_admin.splice(i, 1), "admin delete");
    this.msg = "Member Deleted Successfully";
    this.showError();
    if (this.all_new_admin.length > 0) {
      this.is_review_added = false;
    }
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

  submitEditedMember(member) {
    console.log("member data is:", member);
    this.msg = "Member successfully edited";
    this.showSuccess();
    this.editedIndex = -1;
  }

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
    console.log("only file view click");
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
    // file.perm.is_view_only = true;
    // file.perm.is_shortcut = true;
    // file.perm.is_upload = true;
    // file.perm.is_view_and_print = true;
    file.perm.is_view_and_print_and_download = false;
    if (file.children != undefined) {
      if (file.children.length > 0) {
        file.children.forEach((res) => {
          this.ViewPrintElseDownload(res);
        });
      }
    }
  }
  // clickDRM(event, file)
  clickViewPrintDownload(event, file) {
    if (event.checked == true) {
      this.is_view_and_print_indeterminate = false;
      this.is_view_only_indeterminate = false;

      this.is_view_and_print_and_download_indeterminate = true;
      this.ViewPrintDownload(file);
    } else {
      //
      // this.is_drm = false;

      this.ViewPrintElseDownload(file);
      // this.ViewShortcutElsePermission(file);
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
      // this.msg = "You cant give this permission to files "+file.name
      // this.showInfo();
      file.perm.is_upload = false;
    }
  }
  ElseUpload(file) {
    file.perm.is_upload = false;
    //  file.perm.is_view_only = true;
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
    console.log(event, "---", file);
    if (event.checked == true) {
      this.is_upload_indeterminate = true;
      this.is_view_only_indeterminate = true;

      this.IfUpload(file);
    } else {
      this.ElseUpload(file);
      //  this.clickUploadPermission();
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
    //  console.log("NoAccessAndAccess");
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
        //  console.log("NoAccessAndAccess");
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
      } // }else{
    });
  }

  UpdateFoldersFilesPermission() {
    this.dataRoomService
      .createFolderSpecificPermission(
        this.nodes,
        this.currentDataroomId,
        this.enduser_group_id
      )
      .subscribe(
        (res) => {
          console.log(res, "Update Permission");

          // this.all_admin_list.splice(i, 1);
          this.msg = "End User group folder permissions updated successfully.";
          if (res === true) {
            this.getFolderHierarchyPermission();
            console.log(res, "teststt123");

            // this.add_user_list = this.all_admin_list.filter((res)=>res.selected == true);
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
        }
      );
  }

  // bulk button show functionality
  cb_man_mem_count: number = 0;
  checkboxManageMember(event, member) {
    member.selected = event.checked;
    let all_admins_count = this.all_admin_list.filter(
      (res) => res.state === true
    );
    this.selectedAll1 = all_admins_count;

    console.log("all admins count is", this.selectedAll1);
    if (all_admins_count.length > 0) {
      this.isManageActionBar = true;
    } else {
      this.isManageActionBar = false;
    }
  }


  SendInvitation() {
    if (this.dataroom_detail.is_dataroom_on_live) {
      this.selectedAll1.map((p) => {
        this.resendInvitationBulk(p)
      });

    }
    else {
      this.msg = "Dataroom is on hold stage. You can send reinvitations  when dataroom is on Live stage";
      this.showInfo();
      console.error("Send Invitation to all selected members", this.selectedAll1);
    }
  }



  removeManageMember() {
    console.log("delete all admin list", this.all_admin_list);
    console.log("deleted all new admin", this.all_new_admin);
    this.dataRoomService
      .delete_dataroom_all_admin(this.all_admin_list)
      .subscribe((res) => {
        this.all_admin_list = [];
        this.msg = "Delete all admin successfully !";
        this.showError();
        // this.ngAllChecked = false;
      });
  }


  deleteForm: FormGroup;
  is_disabled_delete_button: boolean = false;
  onKeyCheckDelete(event) {
    console.log("data is ", event);
    if (event.toLowerCase() == "delete") {
      this.is_disabled_delete_button = true;
    }
  }

  deletes: any = "";
  data: any = []
  deleteBulk() {
    const ids = this.selectedAll1.map(item => item.id);
    this.data = {
      id: ids,
      is_deleted: "is_deleted_end"
    }
    console.log(this.data)
    this.dataRoomService.DeleteUser(this.currentDataroomId, this.enduser_group_id, this.data).subscribe((res) => {
      console.log(res);
      this.deletes = '';
      this.selectedAll1 = [];
      this.msg = "Admin deleted successfully";
      this.showError();
      this.getAllAdmins();
    }, (error) => {
      console.log(error);
    });
  }



  toggle1: boolean = false;
  selectedAll1: any = [];
  checkboxAllAddedManageMember(key) {
    this.toggle1 = !this.toggle1;
    if (this.toggle1 === true) {

      if (key == 'first') {
        this.selectedAll1 = this.all_admin_list.filter(function (contact) {
          return (contact.state = true && contact.memberactivestatus == false);
        });
      } else if (key == 'second') {
        this.selectedAll1 = this.all_admin_list.filter(function (contact) {
          return (contact.state = true);
        });
      }

      let checkbox = this.all_admin_list;
      this.cb_man_mem_count = checkbox.length;

      console.log(">>>>>>>>>>>>>", this.selectedAll1)

      if (this.selectedAll1.length >= 1) {
        this.isManageActionBar = true;
      } else {
        this.cb_man_mem_count = 0;
        this.isManageActionBar = false;
      }
    } else {
      this.isManageActionBar = false;
      this.selectedAll1 = this.all_admin_list.filter(function (contact) {
        return (contact.state = false);
      });
      this.cb_man_mem_count = 0;
      console.log(">>>>>>>>>>>>>", this.selectedAll1)
    }
  }
  checkboxAddedAdminList(i, event) {
    this.all_new_admin[i].state = event.checked;
    // this.bulk_checkbox = this.bulk_checkbox + 1
    let checkbox = this.all_new_admin.filter((res) => res.state == true);
    this.checkbox_count = checkbox.length;
    console.log("bulk_checkbox:-------------" + this.checkbox_count);
  }

  toggle: boolean = false;
  selectedAll: any = [];
  checkboxAllAddedAdmin() {
    this.toggle = !this.toggle;
    if (this.toggle === true) {
      this.selectedAll = this.all_new_admin.filter(function (contact) {
        return (contact.state = true);
      });
      let checkbox = this.all_new_admin;
      this.checkbox_count = checkbox.length;
    } else {
      this.selectedAll = this.all_new_admin.filter(function (contact) {
        return (contact.state = false);
      });
      this.checkbox_count = 0;
    }
  }

  ngAllChecked: boolean = false;
  deleteAllAddedAdmin() {
    this.all_new_admin = [];
    this.msg = "Deleted All Member Successfully";
    this.showError();
    this.checkbox_count = 0;
    this.ngAllChecked = false;
  }

  submitUpdatedMember(member) {
    this.dataRoomService.UpdatedMember(member).subscribe((res) => {
      this.msg = res.data;
      this.showInfo();
    });
  }

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
    // this.IndeterminateFuntion(this.nodes);
  }

  clickAllNoAccess(event) {
    if (event == true) {
      this.is_view_only = false;
      this.is_view_and_print = false;
      this.is_view_and_print_and_download = false;
      this.is_upload = false;
      this.is_watermark = false;
      this.is_drm = false;
      this.is_editor = false;
      this.is_shortcut = false;
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

  clickShortcut(event, file) {
    console.log("clickShortcut1");
    if (event.checked == true) {
      this.is_shortcut_indeterminate = true;
      this.is_view_only_indeterminate = true;
      this.ViewShortcutPermission(file);
    } else {
      console.log("clickShortcut2");
      this.ViewShortcutElsePermission(file);
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

  ChangesByEmail(email) {
    this.dataRoomService.getUserByEmail(email).subscribe(
      (res) => {
        this.memberForm.get("first_name").setValue(res.first_name);
        this.memberForm.get("last_name").setValue(res.last_name);
      },
      (error) => {
        console.log("error");
      });
  }

  toggles(expanded) {
    expanded = !expanded;
  }
}


@Component({
  selector: "upload-confirmation-popup",
  templateUrl: "active-email-confirmation-popup.html",
})
export class ActiveEmailConfirmationPopup {
  constructor(
    public dialogRef: MatDialogRef<ActiveEmailConfirmationPopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}