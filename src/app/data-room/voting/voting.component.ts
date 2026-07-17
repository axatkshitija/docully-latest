import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Directive,
  Input,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { DataRoomService } from "../../services/index";
import { Router, ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs";

import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { BaseUrlClass, ApiListClass } from "../../common/index";
import {
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable } from "rxjs";
import { FileClass } from "../../share-data/file-class";

import { map, startWith } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import * as _ from "lodash";
import { TimezoneService } from "../../services/timezone.service";

@Directive({ selector: "MemberInput" })
@Directive({ selector: "groupsInput" })
export class MemberInput {
  // TODO(issue/24571): remove '!'.
  @Input() id!: string;
}

// export class GroupsInput {
//   // TODO(issue/24571): remove '!'.
//   @Input() id!: string;
// }

@Component({
  selector: "app-voting",
  templateUrl: "./voting.component.html",
  styleUrls: ["./voting.component.css"],
})
export class VotingComponent implements OnInit {
  dataroomId: any;
  vote: any;
  timezone: any;
  create_folder: boolean = true;

  showGroups: boolean = true;
  showMembers: boolean = false;
  public start: Date = new Date();
  public end: Date = new Date();
  labelPosition = "No";
  finalVote: string;
  votes: string[] = ["Yes", "No", "Neutral"];
  folder_id: any;
  is_upload_file: boolean = false;
  public newFolderForm: FormGroup; // our form model
  msg: string = "";
  filterQuery: string;
  filterQuery1: string;

  all_folder_list: any;
  deleteForm: FormGroup;
  copyForm: FormGroup;
  moveForm: FormGroup;
  baseUrl: any;
  message: any;
  subs: Subscription;

  allMembers: any = [];
  allFilteredMembers: any = [];
  allFilteredGroups: any = [];
  allGroups: any = [];
  group_data: any = {};
  selectedVote: any;
  settings = {
    bigBanner: true,
    timePicker: true,
    format: "MMM d, y h:mm:ss a",
    defaultOpen: false,
    closeOnSelect: true,
  };
  fromdate: any;
  dataroom_name: any;
  maxDate: any;
  minDate: any;
  dataroom_detail: any;
  current_date: string;
  usertimezone: any;
  token: any = '';
  constructor(
    private dataRoomService: DataRoomService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,

    public baseUrlclass: BaseUrlClass,
    private timeZone: TimezoneService
  ) {
    this.token = localStorage.getItem("token");
    this.dataroomId = localStorage.getItem("currentDataroomId").toString();
    if (this.route.snapshot.params.fid) {
      this.update.file = this.route.snapshot.params.fid;
      this.show_file = true;
    }
    this.timezone = this.timeZone.userTimeZone;
    this.vote = {
      dataroom: this.dataroomId,
      title: "",
      start_date: this.start,
      end_date: this.end,
      description: "",
      groups: [],
      voters: [],
      attachement: "",
      file: "",
      result: "",
    };
    this.baseUrl = this.baseUrlclass.baseUrl;
    this.filteredMembers = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allFilteredMembers.slice()
      )
    );
    console.log(this.filteredMembers, "filter member");

    this.filteredGroups = this.groupCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._groupFilter(fruit) : this.allFilteredGroups.slice()
      )
    );
  }
  ngOnInit() {
    this.getUserInfo();
    //this.getVoteList();
    this.getAllUsers();
    this.getAllVoterGroups();
    //this.getFilesList();
    this.getDateWise();
    this.usertimezone = localStorage.getItem("currentUser")
    this.usertimezone = JSON.parse(this.usertimezone)
    this.usertimezone = this.usertimezone['user_time_zone'][0];
  }

  onChangeDate(data) {
    //alert("Triggered" + data);
    console.log("Triggered", data);

  }

  onChangeDate1(data) {
    console.log("Triggered", data);

  }

  update: any = {
    send_update_email: true,
    file: "",
  };

  dataroom_users_list: any;
  getAllUsers() {
    this.dataRoomService
      .getDataroomAllUsers(this.dataroomId)
      .subscribe((res) => {
        this.allMembers = res;
        for (let n = 0; n < this.allMembers.length; n++) {
          if (this.user.email !== this.allMembers[n].email) {
            this.allFilteredMembers.push(
              this.allMembers[n].first_name +
              "(" +
              this.allMembers[n].email +
              ")"
            );
          }
        }
        console.log(this.allMembers);
      });
  }

  checkMemButton(check_mem_button) {
    if (check_mem_button == "mem_list") {
      this.showMembers = true;
      this.showGroups = false;
    } else {
      this.showMembers = false;
      this.showGroups = true;
    }
  }

  radioChange(event) {
    // this.filter['property'] = event.value;
    this.selectedVote = event;
    console.log(event);
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  visibleGroup = true;
  selectableGroup = true;
  removableGroup = true;
  addOnBlurGroup = false;
  selectedMembers = [];
  selectedGroups = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  separatorKeysCodesGroup: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  groupCtrl = new FormControl();
  filteredMembers: Observable<string[]>;
  filteredGroups: Observable<string[]>;
  members: any = [];
  groups: any = [];

  @ViewChild("MemberInput") MemberInput: ElementRef;
  @ViewChild("groupsInput") groupsInput: ElementRef;

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || "").trim()) {
      this.members.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.fruitCtrl.setValue(null);
  }

  addGroups(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || "").trim()) {
      this.groups.push({
        title: value.trim(),
      });
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.groupCtrl.setValue(null);
  }

  remove(fruit, indx): void {
    this.members.splice(indx, 1);
    this.selectedMembers.splice(indx, 1);
    console.log(this.selectedMembers);
  }

  removeGroup(fruit, indx): void {
    this.groups.splice(indx, 1);
    this.selectedGroups.splice(indx, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.check_duplicate(event.option.value, this.members)) {
      this.selectedMembers.push(this.get_member(event.option.value));
      this.members.push(event.option.value);
    }
    this.MemberInput.nativeElement.value = "";
    this.fruitCtrl.setValue(null);
    console.log(this.members)
  }
  goToViewerPage(folder) {
    console.log("folder id is", folder);
    //this.fileClass.file = folder;
    let token = localStorage.getItem("token");
    document.cookie = "token=" + token;
    this.dataRoomService.getFilesUpdated(folder.id, "view").subscribe((res) => {
      let token = localStorage.getItem("token");
      document.cookie = "token=" + token;
      // window.open(url, '_blank');
      // href="{{baseUrl}}/file-view/{{folder.id}}/{{user.id}}/" target="_blank"
      // this.router.navigate(['/file-views', folder.dataroom_folder_uuid]);
    });
  }

  check_duplicate(value, data) {
    for (let n = 0; n < data.length; n++) {
      if (data[n] === value) {
        return false;
      }
    }
    return true;
  }
  selectedGroup(event: MatAutocompleteSelectedEvent): void {
    console.log(45667, event);
    if (this.check_duplicate(event.option.value, this.groups)) {
      this.selectedGroups.push(this.get_group(event.option.value));

      this.groups.push(event.option.value);
      console.log(this.groups);
    }
    this.groupsInput.nativeElement.value = "";
    this.groupCtrl.setValue(null);
  }

  private _filter(value: any): string[] {
    console.log(value);

    return this.allFilteredMembers.filter(
      (fruit) => fruit.toLowerCase().indexOf(value.toLowerCase()) > -1
    );

    // console.log(_.filter(this.allMembers, row=>row.first_name.toLowerCase().indexOf(value.toLowerCase()) > -1));
    // return this.allMembers.filter(fruit => fruit.id === value);
    // return _.filter(this.allMembers, row=>row.first_name.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  private get_member(value: any) {
    for (let n = 0; n < this.allMembers.length; n++) {
      var temp = value.split("(")[1];

      if (temp.split(")")[0] == this.allMembers[n].email) {
        return this.allMembers[n];
      }
    }
  }

  private get_group(value: any) {
    for (let n = 0; n < this.allGroups.length; n++) {
      console.log(this.allGroups, value, value, "this.allGroups");
      if (this.allGroups[n].title === value) {
        console.log("get groups");
        return this.allGroups[n];
      }
    }
  }

  private _groupFilter(value: any): string[] {
    return this.allFilteredGroups.filter(
      (fruit) => fruit.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  delete_folder_or_file(folder_id, a) {
    this.dataRoomService.deleteFolderOrFile(folder_id).subscribe((res) => {
      this.msg =
        "Folder/file successfully deleted but Unless permanently deleted, items in trash add to your current storage";
      // this.all_root_folder_list = res;//.splice(i, 1);
      this.getAllSubfolderList();
      this.showSuccess();
    });
  }

  is_edit_folder_name: boolean = false;
  is_edit_index_number: boolean = false;

  // is edit folder name
  isEditFolderName(i) {
    this.edittedName = i;
    this.is_edit_folder_name = true;
  }

  selectedRowGride: number;
  editedIndexGride: number;
  edittedNameGride: number;
  is_edit_folder_name_gride: boolean = false;
  is_edit_index_number_gride: boolean = false;
  isEditFolderNameGride(i) {
    this.edittedNameGride = i;
    this.is_edit_folder_name_gride = true;
  }

  isEditIndexNumber(i) {
    this.editedIndex = i;
    this.is_edit_index_number = true;
  }

  editFolderName(folder) {
    this.dataRoomService
      .update_folder_or_file_name(folder)
      .subscribe((res: any) => {
        this.is_edit_folder_name = false;
        this.msg = "Folder / File name is successfully updated !";
        this.showInfo();
        this.edittedName = -1;
      });
  }

  editFolderNameGride(folder) {
    this.dataRoomService
      .update_folder_or_file_name(folder)
      .subscribe((res: any) => {
        this.is_edit_folder_name_gride = false;
        this.msg = "Folder / File name is successfully updated !";
        this.showInfo();
        this.edittedNameGride = -1;
      });
  }

  editIndexNumber(folder) {
    this.dataRoomService
      .edit_index_of_root_folder(this.dataroomId, folder)
      .subscribe(
        (res) => {
          console.log("data is", res);
          this.is_edit_index_number = false;
          this.msg = res.msg;
          // this.all_root_folder_list = res.data;
          this.getAllSubfolderList();

          this.showInfo();
          this.editedIndex = -1;
        },

        (err) => {
          this.msg = err.error.msg;
          this.showError();
          console.log("error is", err);
          this.is_edit_index_number = false;
          this.editedIndex = -1;
        }
      );
  }

  selectedRow: number;
  editedIndex: number;
  edittedName: number;

  setClickedRow(i) {
    this.selectedRow = i;
  }

  // select all functionality

  all_folder_file_list: number[] = [];
  toggle: boolean = false;
  selectedFolderList: any = [];
  isActionBar: boolean = false;
  selected_folder_list_count: number = 0;

  onChangeSelect() {
    this.toggle = !this.toggle;
    let counter = -1;
    this.all_root_folder_list.forEach((folder) => {
      folder.selected = this.toggle;
      this.all_folder_file_list.push(counter + 1);
    });

    if (this.toggle === true) {
      let all_root_folder = this.all_root_folder_list.filter(
        (res) => res.selected === true
      );
      this.selected_folder_list_count = all_root_folder.length;
      if (all_root_folder.length >= 1) {
        this.isActionBar = true;
      } else {
        this.selected_folder_list_count = 0;
        this.isActionBar = false;
      }
    } else {
      this.isActionBar = false;
      this.selected_folder_list_count = 0;
      let all_root_folder = this.all_root_folder_list.filter(
        (res) => (res.selected = false)
      );
    }
    this.all_root_folder_list.forEach((res) => {
      if (res.selected === true) {
        res.isAction = true;
      } else {
        res.isAction = false;
      }
    });
  }
  all_root_folder_list: any = [];
  // this function will create subfolders and files
  createNewSubFolder(newFolderForm) {
    console.log("folder id is:", this.folder_id);
    // disabled form value
    // this.newFolderForm.disable();
    //console.log("new folder name ", newFolderForm.value.folder_name);
    this.dataRoomService
      .create_new_sub_folder(
        this.dataroomId,
        newFolderForm.value.folder_name,
        this.folder_id
      )
      .subscribe((res) => {
        if (res.msg) {
          this.msg = res.msg;
          this.showInfo();
        } else {
          this.msg = "Folder successfully created !";
          res.icons = this.getIcons(res, res.is_folder);
          this.showSuccess();
          this.getAllSubfolderList();
        }

        this.newFolderForm.reset();
      });
  }

  // check box selection
  checkbox_value(folder: any, i) {
    folder.selected = folder.selected ? false : true;
    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.selected === true
    );
    this.all_root_folder_list.forEach((res) => {
      if (res.selected === true) {
        res.isAction = true;
      } else {
        res.isAction = false;
      }
    });
    let length = all_root_folder.length;
    if (length >= 1) {
      this.isActionBar = true;
      this.selected_folder_list_count = length;
    } else {
      this.isActionBar = false;
      this.selected_folder_list_count = length;
    }
  }
  DownloadFiles(folder) {
    this.dataRoomService
      .getDownloadFiles(folder.id, "download")
      .subscribe((res) => {
        console.log(res, "resresresresres");
        console.log(res.type, "type");
        var typedata = res.type;
        // console.log(res.headers.get('content-disposition'));
        if (res.size == 0) {
          this.msg = "You dont have access to download this file ";
          this.showInfo();
        } else if (res.size > 0 && typedata == "application/pdf") {
          this.msg = "File successfully Downloaded";
          this.showInfo();
          const url = window.URL.createObjectURL(res); // <-- work with blob directly
          // create hidden dom element (so it works in all browsers)
          const a = document.createElement("a");
          a.setAttribute("style", "display:none;");
          document.body.appendChild(a);

          // create file, attach to hidden element and open hidden element
          var filenamee = folder.names;
          var fileExt = filenamee.split(".");
          console.log(filenamee, "filenamee");
          console.log(fileExt, "fileExt");
          a.href = url;
          a.download = fileExt[0] + ".pdf";
          // a.download = folder.names;
          a.click();
          return url;
        } else {
          this.msg = "File successfully Downloaded";
          this.showInfo();
          const url = window.URL.createObjectURL(res); // <-- work with blob directly
          // create hidden dom element (so it works in all browsers)
          const a = document.createElement("a");
          a.setAttribute("style", "display:none;");
          document.body.appendChild(a);

          // create file, attach to hidden element and open hidden element
          var filenamee = folder.names;
          var fileExt = filenamee.split(".").pop();
          console.log(filenamee, "filenamee");
          console.log(fileExt, "fileExt");
          a.href = url;
          // a.download = fileExt + ".pdf";
          a.download = folder.names;
          a.click();
          return url;
        }
      });
  }

  // donwload all files
  selectedDownload = [];
  singleFile = false;
  a: any;
  download_all_files() {
    this.selectedDownload = [];
    this.singleFile = false;

    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.selected === true
    );
    if (all_root_folder.length > 0) {
      all_root_folder.forEach((res) => {
        this.selectedDownload.push(res);
      });
      var finalData = {
        data: this.selectedDownload,
        token: localStorage.getItem("token"),
      };

      if (this.selectedDownload.length == 1) {
        if (!this.selectedDownload[0]["is_folder"]) {
          this.DownloadFiles(this.selectedDownload[0]);
          this.singleFile = true;
        }
      }

      if (!this.singleFile) {
        this.dataRoomService
          .bulkDownload(JSON.stringify(finalData), 1)
          .subscribe((ress) => {
            if (ress.name) {
              var zip_file_path = this.baseUrl + "/" + ress.path; //put inside "" your server path with file.zip
              var zip_file_name = ress.name; //put inside "" file name or something
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.href = zip_file_path;
              a.download = zip_file_name;
              a.click();
              document.body.removeChild(a);

              this.msg =
                "Depending on your access, folders & files permitted to be downloaded by the admin will be downloaded shortly from your selection. Please check your Downloads folder on your device.";
              this.showInfo();
            } else {
              this.msg =
                "You dont have access to download this file " + ress.name;
              this.showInfo();
            }
          });
      }
    } else {
      this.msg = "Only files can be Download... ";
      this.showInfo();
    }
  }

  //Download Single Folder

  download_single_folder(data) {
    this.selectedDownload = [];

    console.log(data);
    this.selectedDownload.push(data);

    var finalData = {
      data: this.selectedDownload,
      token: localStorage.getItem("token"),
    };

    this.dataRoomService
      .bulkDownload(JSON.stringify(finalData), 1)
      .subscribe((ress) => {
        if (ress.name) {
          var zip_file_path = this.baseUrl + "/" + ress.path; //put inside "" your server path with file.zip
          var zip_file_name = ress.name; //put inside "" file name or something
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = zip_file_path;
          a.download = zip_file_name;
          a.click();
          document.body.removeChild(a);
          this.msg =
            "Depending on your access, folders & files permitted to be downloaded by the admin will be downloaded shortly from your selection. Please check your Downloads folder on your device.";
          this.showInfo();
        } else {
          this.msg = "You dont have access to download this file " + ress.name;
          this.showInfo();
        }
      });
  }

  // delete all files
  delete_all_files() {
    let all_root_folder = this.all_root_folder_list.filter(
      (x) => x.selected === true
    );
    this.dataRoomService
      .delete_all_folder_or_files(all_root_folder)
      .subscribe((res) => {
        // for (var n= 0; n<= all_root_folder.length-1; n++) {
        //     const index = this.all_root_folder_list.indexOf(all_root_folder[n]);
        //      console.log("index is", index);
        //      if (index !== -1) {
        //           this.all_root_folder_list.splice(index, 1);
        //           console.log("element is successfully removed !");
        //       }

        // }
        this.getAllSubfolderList();
        // this.getAllSubfolderList();
        this.msg =
          "Folder/file successfully deleted but Unless permanently deleted, items in trash add to your current storage";
        this.showInfo();
        this.isActionBar = false;
      });
  }
  single_folder_data: any;
  single_perm: any;
  // get single folder details


  getDateWise() {
    var today = new Date();
    this.to_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    this.from_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    this.dataRoomService.getSingleDataroom(this.dataroomId).subscribe((res) => {
      this.fromdate = res.created_date;
      this.dataroom_name = res.dataroom_nameFront;
      this.maxDate = this.to_date;
      this.minDate = res.created_date
      // console.log(this.fromdate, "from date");
      this.from_date = res.created_date;
      //this.from_date.setDate(this.from_date.getDate() - 7);
      this.to_date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
      this.dataroom_detail = res;
      this.dataroom_name = res.dataroom_nameFront;

let todays_date = new Date();
this.current_date = `${todays_date.getFullYear()}-${String(todays_date.getMonth()+1).padStart(2, '0')}-${String(todays_date.getDate()).padStart(2, '0')} ${String(todays_date.getHours()).padStart(2, '0')}-${String(todays_date.getMinutes()).padStart(2, '0')}-${String(todays_date.getSeconds()).padStart(2, '0')}`;
      this.getVoteList();

    });

  }
  getSingleFolderDetails() {
    this.dataRoomService
      .getSingleFolderDetails(this.folder_id)
      .subscribe((res) => {
        this.single_folder_data = res;
        this.single_perm = res.perm;
        this.single_folder_data.parent_folders.reverse();
      });
  }
  search_by_type: any = "";
  search_by_name: any = "";
  search_by_uploaded_by: any = "";
  from_date: any = "";
  to_date: any = "";

  ResetFields() {
    this.search_by_name = "";
    this.search_by_uploaded_by = "";
    this.from_date = "";
    this.to_date = "";
    this.search_by_type = "";
    // this.getAllSubfolderList();
  }

  getAllSubfolderList() {
    var start_date;
    var end_date;
    if (this.from_date == "" || this.from_date == null) {
      start_date = "";
    } else {
      start_date =
        this.from_date.getFullYear() +
        "-" +
        (this.from_date.getMonth() + 1) +
        "-" +
        this.from_date.getDate();
    }
    if (this.to_date == "" || this.to_date == null) {
      end_date = "";
    } else {
      end_date =
        this.to_date.getFullYear() +
        "-" +
        (this.to_date.getMonth() + 1) +
        "-" +
        this.to_date.getDate();
    }
    this.dataRoomService
      .getAllSubfolderList(
        this.folder_id,
        this.search_by_name,
        this.search_by_type,
        this.search_by_uploaded_by,
        start_date,
        end_date
      )
      .subscribe((res) => {
        console.log(res);
        this.all_root_folder_list = res.filter(
          (res) => res.perm.is_view_only == true
        );

        this.all_root_folder_list.forEach((res) => {
          res.icons = this.getIcons(res, res.is_folder);
        });
      });
  }
  getIcons(res, is_folder) {
    if (is_folder == true) {
      let url = "assets/images/ICONS_PNG/folder.png";
      return url;
    } else {
      if (
        res.name.endsWith(".avi") ||
        res.name.endsWith(".mov") ||
        res.name.endsWith(".3gp") ||
        res.name.endsWith(".mpeg") ||
        res.content_type == "video/msvideo" ||
        res.content_type == "video/avi" ||
        res.content_type == "video/x-msvideo"
      ) {
        let url = "assets/images/ICONS_PNG/avi.png";
        return url;
      } else if (res.content_type == "text/css" || res.name.endsWith(".css")) {
        let url = "assets/images/ICONS_PNG/css.png";
        return url;
      } else if (res.content_type == "text/csv" || res.name.endsWith(".csv")) {
        let url = "assets/images/ICONS_PNG/csv.png";
        return url;
      } else if (
        res.content_type == "application/msword" ||
        res.name.endsWith(".doc")
      ) {
        let url = "assets/images/ICONS_PNG/doc.png";
        return url;
      } else if (
        res.name.endsWith(".docx") ||
        res.content_type ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        let url = "assets/images/ICONS_PNG/docx.png";
        return url;
      } else if (
        res.content_type == "application/vnd.ms-excel" ||
        res.name.endsWith(".xls")
      ) {
        let url = "assets/images/ICONS_PNG/xls.png";
        return url;
      } else if (
        res.content_type ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        res.name.endsWith(".xlsx")
      ) {
        let url = "assets/images/ICONS_PNG/xlsx.png";
        return url;
      } else if (
        res.content_type == "application/pdf" ||
        res.name.endsWith(".pdf") ||
        res.name.endsWith(".PDF")
      ) {
        let url = "assets/images/ICONS_PNG/pdf.png";
        return url;
      } else if (
        res.content_type == "audio/mp3" ||
        res.name.endsWith(".mp3") ||
        res.name.endsWith(".wav") ||
        res.name.endsWith(".m4a") ||
        res.name.endsWith(".wma")
      ) {
        let url = "assets/images/ICONS_PNG/mp3.png";
        return url;
      } else if (res.content_type == "video/mp4" || res.name.endsWith(".mp4")) {
        let url = "assets/images/ICONS_PNG/mp4.png";
        return url;
      } else if (
        res.content_type == "image/jpeg" ||
        res.content_type == "image/jpg" ||
        res.name.endsWith(".jpg") ||
        res.name.endsWith(".jpeg")
      ) {
        let url = "assets/images/ICONS_PNG/jpg.png";
        return url;
      } else if (res.content_type == "image/png" || res.name.endsWith(".png")) {
        let url = "assets/images/ICONS_PNG/png.png";
        return url;
      } else if (
        res.content_type == "text/plain" ||
        res.name.endsWith(".txt")
      ) {
        let url = "assets/images/ICONS_PNG/txt.png";
        return url;
      } else {
        let url = "assets/images/ICONS_PNG/default.png";
        return url;
      }
    }
  }
  show_file: boolean = false;
  files: any;
  file_id: any;
  getFilesList() {
    this.dataRoomService.getFilesList(this.dataroomId).subscribe((res) => {
      this.files = res;
      this.file_id = res.id;

      console.log(this.files, "voting dataroom");
    });
  }
  // go to folder
  goToNextFolder(folder_id) {
    this.router.navigate(["/folder_detail", folder_id]);
    this.folder_id = folder_id;
    this.initializeUserForm();
    this.getSingleFolderDetails();
    this.getAllSubfolderList();
  }
  folder_name_validation = '^[^\\/?%*:|"<>]+$';
  initializeUserForm() {
    this.newFolderForm = this._fb.group({
      folder_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(this.folder_name_validation),
        ],
      ],
    });
  }

  all_folder: any;
  all_folders: any;
  hideEditIndex(n) {
    this.is_edit_folder_name = false;
    this.is_edit_index_number = false;
    this.editedIndex = -1;
    this.edittedName = -1;
    this.all_folder = this.all_folders.filter(
      (res) => res.id !== this.all_root_folder_list[n].id
    );
  }

  is_upload_new_version: boolean = false;
  // upload_new_version
  upload_new_version() {
    console.log("upload new version ");
    this.is_upload_new_version = true;
  }
  getAllVoterGroups() {
    this.dataRoomService.getVoterGroup(this.dataroomId).subscribe((res) => {
      this.allGroups = res;

      if (this.allGroups.length > 0) {
        for (let n = 0; n < this.allGroups.length; n++) {
          this.allFilteredGroups.push(this.allGroups[n].title);
        }
      } else {
        this.allFilteredGroups.push("Voters group not created");
      }
      console.log(this.allGroups, "ALl groups");
    });
  }

  user: any = { member: {} };
  user_id: number = 0;
  getUserInfo() {
    this.dataRoomService
      .getUserProfileDatroom(this.dataroomId)
      .subscribe((res) => {
        this.user = res;
        this.user_id = res.id;

        console.log(this.user, "profile dataroom");
      });
  }

  
  voteList: any = [];
  voteListSize: any = undefined;
  getVoteList() {
    var todays =
      new Date(this.to_date).getFullYear() +
      "-" +
      (new Date(this.to_date).getMonth() + 1) +
      "-" +
      (new Date(this.to_date).getDate());
    var first =
      new Date(this.from_date).getFullYear() +
      "-" +
      (new Date(this.from_date).getMonth() + 1) +
      "-" +
      (new Date(this.from_date).getDate());
    console.log(3434);
    this.dataRoomService.getAllVoteList(this.dataroomId, first, todays).subscribe((res) => {
      console.log(res, "Vote Detail");
      //this.voteList = res.data;
      const newdata = res.data;
      this.voteList = newdata.map((obj, i) => ({ ...obj, start: obj.start + '+00:00', end: obj.end + '+00:00' }));
      this.voteListSize = res.size;
    });
  }


  file_size: any;
  onFileChange(event) {
    var size = event.target.files[0].size;
    this.file_size = size;
    var file_size1 = Math.round(size / 1024) + " KB";
    console.log(file_size1, event.target.files[0]);

    this.file = event.target.files;
  }

  fileid: any;
  filename: any;
  onVoteFileChange(file, file_name) {
    console.log(this.vote.file, file, "Vote File Change");
    this.fileid = this.vote.file;
    if (this.vote.file == file.target.value) {
      console.log(file_name);
    }
  }
  file: any = [];
  //To Create Vote

  createVote(data) {
    console.log(data);
    data.groups = this.selectedGroups;
    data.voters = this.selectedMembers;
    console.log(data, data.groups.length, data.voters.length);
    if (data.groups.length == 0 && data.voters.length == 0) {
      this.msg = 'Please select groups or members'
      this.showError();
      return;
    }
    data["end"] = new Date(Date.parse(data["end_date"])).toISOString();
    data["start"] = new Date(Date.parse(data["start_date"])).toISOString();

    console.log(data, this.vote.file, "file-view");
    this.dataRoomService
      .createVote(
        data,
        this.dataroomId,
        this.file[0],
        this.vote.file,
        this.file_size
      )
      .subscribe((res) => {
        console.log(res, "Post Vote");
        this.msg = "New Voting request created successfully.";
        this.showSuccess();
        // this.voteList = res;
        this.getVoteList();
        // this.voteList = res;
      });
  }

  fileList;
  getFilesOnSearch(event) {
    this.dataRoomService.getFilesOnSearch(this.dataroomId, event.target.value).subscribe((res) => {
      console.log(res, "search response");
      this.fileList = res;
    });
  }

  folderName;
  getFileName(value) {
    console.log(value)
    this.folderName = value.name
    this.vote.file = value.id
  }

  showSuccess() {
    console.log(322);
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  showInfo() {
    this.toastr.info(this.msg);
  }
  //To Create Vote

  submitVote(vote) {
    vote.result = this.selectedVote;
    console.log(vote);
    this.dataRoomService.Makevote(vote).subscribe((res) => {
      console.log(res);
      // this.voteList = res;
      this.msg = "Thank You For Vote.";
      this.showSuccess();
      this.getVoteList();
      // this.voteList = res;
    });
  }

  restrictSave: boolean = false;
  onChange(value) {
    console.log(value);
    if (value != undefined && value != "") {
      console.log(34334);
      this.restrictSave = true;
    } else {
      this.restrictSave = false;
    }
  }
}
