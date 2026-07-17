// import {
//     Component,
//     Injectable,
//     OnInit,
//     ViewEncapsulation,
//     Inject,
//   } from "@angular/core";
  
//   import { BaseUrlClass, ApiListClass } from "../../common/index";
//   import { DataRoomService } from "../../services/index";
//   import { ToastrService } from "ngx-toastr";
//   import { TimezoneService } from "../../services/timezone.service";
//   import { Router, ActivatedRoute } from "@angular/router";
//   import {
//     MatDialog,
//     MatDialogRef,
//     MAT_DIALOG_DATA,
//   } from "@angular/material/dialog";
//   import { FormControl, FormGroup, Validators } from "@angular/forms";
//   import { CookieService } from "ngx-cookie-service";
  
//   export interface DialogData {
//     destination: string;
//     source: string;
//     copy: string;
//     move: string;
  
//   }
  
//   @Component({
//     selector: "app-trash",
//     templateUrl: "./trash.component.html",
//     styleUrls: ["./trash.component.css"],
//   })
//   export class TrashComponent implements OnInit {
//     is_upload_file: any;
//     show__aspinner:boolean=true;
//     baseUrl: any;
//     timezone: any;
//     all_root_folder_list: any = [];
//     show_spinner: boolean = true;
//     dataroomId: number;
//     msg: string;
//     p: number = 1;
//     size: number = 0;
//     restoremsg: any;
//     versoinlist: any;
//     deletemsg: any;
//     deleteForm: FormGroup;
  
//     constructor(
//       private baseUrlClass: BaseUrlClass,
//       private apiListClass: ApiListClass,
//       private router: Router,
//       public dialogdownload: MatDialog,
//       private dataRoomService: DataRoomService,
//       private toastr: ToastrService,
//       private cookieService:CookieService,
//       private timeZone: TimezoneService
//     ) {
//       this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
//       this.baseUrl = this.baseUrlClass.baseUrl;
//       this.timezone = this.timeZone.userTimeZone;
//     }
  
//     ngOnInit() {
//       this.getDateWise();
//       this.show_spinner = true;
  
//     }
  
  
//     initializeDeleteForm() {
  
//     }
//     nodata: boolean = false;
  
  
//     getIcons(res, is_folder) {
//       if (is_folder == true) {
//         let url = "assets/images/ICONS_PNG/folder.png";
//         return url;
//       } else {
//         if (
//           res.name.endsWith(".avi") ||
//           res.name.endsWith(".mov") ||
//           res.name.endsWith(".3gp") ||
//           res.name.endsWith(".mpeg") ||
//           res.content_type == "video/msvideo" ||
//           res.content_type == "video/avi" ||
//           res.content_type == "video/x-msvideo"
//         ) {
//           let url = "assets/images/ICONS_PNG/avi.png";
//           return url;
//         } else if (res.content_type == "text/css" || res.name.endsWith(".css")) {
//           let url = "assets/images/ICONS_PNG/css.png";
//           return url;
//         } else if (res.content_type == "text/csv" || res.name.endsWith(".csv")) {
//           let url = "assets/images/ICONS_PNG/csv.png";
//           return url;
//         } else if (
//           res.content_type == "application/msword" ||
//           res.name.endsWith(".doc")
//         ) {
//           let url = "assets/images/ICONS_PNG/doc.png";
//           return url;
//         } else if (
//           res.name.endsWith(".docx") ||
//           res.content_type ==
//           "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//         ) {
//           let url = "assets/images/ICONS_PNG/docx.png";
//           return url;
//         } else if (
//           res.content_type == "application/vnd.ms-excel" ||
//           res.name.endsWith(".xls")
//         ) {
//           let url = "assets/images/ICONS_PNG/xls.png";
//           return url;
//         } else if (
//           res.content_type ==
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
//           res.name.endsWith(".xlsx")
//         ) {
//           let url = "assets/images/ICONS_PNG/xlsx.png";
//           return url;
//         } else if (
//           res.content_type == "application/pdf" ||
//           res.name.endsWith(".pdf")
//         ) {
//           let url = "assets/images/ICONS_PNG/pdf.png";
//           return url;
//         } else if (
//           res.content_type == "audio/mp3" ||
//           res.name.endsWith(".mp3") ||
//           res.name.endsWith(".wav") ||
//           res.name.endsWith(".m4a") ||
//           res.name.endsWith(".wma")
//         ) {
//           let url = "assets/images/ICONS_PNG/mp3.png";
//           return url;
//         } else if (res.content_type == "video/mp4" || res.name.endsWith(".mp4")) {
//           let url = "assets/images/ICONS_PNG/mp4.png";
//           return url;
//         } else if (
//           res.content_type == "image/jpeg" ||
//           res.content_type == "image/jpg" ||
//           res.name.endsWith(".jpg") ||
//           res.name.endsWith(".jpeg")
//         ) {
//           let url = "assets/images/ICONS_PNG/jpg.png";
//           return url;
//         } else if (res.content_type == "image/png" || res.name.endsWith(".png")) {
//           let url = "assets/images/ICONS_PNG/png.png";
//           return url;
//         } else if (
//           res.content_type == "text/plain" ||
//           res.name.endsWith(".txt")
//         ) {
//           let url = "assets/images/ICONS_PNG/txt.png";
//           return url;
//         } else {
//           let url = "assets/images/ICONS_PNG/default.png";
//           return url;
//         }
//       }
//     }
  
//     showHideUploadDiv() { }
  
//     // permanat delete folder
  
  
  
//     permanant_delete_folder(folder, i) {
//       this.dataRoomService.permanant_delete_folder(folder.id).subscribe((res) => {
//         console.log("permanant delete folder", res);
//         this.msg = res.msg;
//         this.showInfo();
//         this.getAllTrashedFoldersAndFiles(this.p)
//         if(this.all_root_folder_list.length == 0){
//           this.getAllTrashedFoldersAndFiles(this.p - 1)
//         }
       
//       });
//     }
  
//     children: any = [];
//     getChildren(node: any) {
//       this.getSubFolderElement(node.data.id);
//       return new Promise((resolve, reject) => {
//         setTimeout(() => resolve(this.children), 4000);
//       });
//     }
//     getSubFolderElement(id) {
//       this.dataRoomService
//         .getFoldersTree(this.dataroomId, id)
//         .subscribe((res) => {
//           console.log(id);
//           this.children = res;
//           console.log(this.children);
//         });
//     }
  
//     nodes: any;
//     data_show: boolean = false;
//     showTrashFoldersTree(folder) {
//       this.dataRoomService.trashShowDeletedFiles(folder.id).subscribe((res) => {
//         this.nodes = res.data;
//         if (this.nodes.length > 0) {
//           this.data_show = true;
//         }
//         if (this.nodes.length == 0) {
//           this.nodes[0] = { ok: 1 };
//         }
//         //    this.download_popup(this.nodes);
//         console.log(this.nodes, "showTrashFoldersTree");
//       });
//     }
  
//     delete_confirm_box(folder, i) {
//       console.log("delete confirm box");
//       if (confirm("Are you sure to permemnantly delete folder/file ?")) {
//         console.log("Implement delete functionality here");
//         this.permanant_delete_folder(folder, i);
//       } else {
//         console.log("no need to delete permanantly");
//       }
//     }
  
//     restore_folders_file(folder, i) {
//       console.log(folder.id, i, "folder restored");
//       var files = [];
//       files.push(folder);
//       this.dataRoomService
//         .restore_folders_files(folder.id, files)
//         .subscribe((res) => {
//           this.msg = "Folder / File restored successfully ";
//           this.showInfo();
  
//          // this.all_root_folder_list.splice(i, 1);
//           if(this.all_root_folder_list.length == 0){
//             if(this.p ==1){
//               this.getAllTrashedFoldersAndFiles(this.p)
//             }
//             else{
//               this.getAllTrashedFoldersAndFiles(this.p - 1)
//             }
//           }else{
//             this.getAllTrashedFoldersAndFiles(this.p)
//           }
//           this.router.navigate(["/folder_detail", folder.id]);
//         });
//     }
  
//     file_folder: any = "";
  
//      restore_selected_folders_file() {
//       var files = this.all_root_folder_list.filter((res) => res.selected == true);
//       console.log(files);
  
//       for (let i = 0; i < files.length; i++) {
//         this.file_folder = files[i].id;
//       }
//       // files.forEach((res)=>{
//       this.dataRoomService
//         .restore_folders_files(this.dataroomId, files)
//         .subscribe((ress) => {
//           this.msg = "Folder / File restored successfully ";
//           this.showInfo();
  
//           if(this.all_root_folder_list.length == 0){
//             if(this.p ==1){
//               this.getAllTrashedFoldersAndFiles(this.p)
//             }
//             else{
//               this.getAllTrashedFoldersAndFiles(this.p - 1)
//             }
//           }else{
//             this.getAllTrashedFoldersAndFiles(this.p)
//           }
//           if (this.file_folder !== "") {
//             this.router.navigate(["/folder_detail", this.file_folder]);
//           }
//         });
//       // })
//     }
  
//     deletes: string ='';
//     bulk_permanant_delete_folder() {
//       var files = this.all_root_folder_list.filter((res) => res.selected == true);
//       console.log(files);
  
//       for (let i = 0; i < files.length; i++) {
//         this.file_folder = files[i].id;
//       }
//       // files.forEach((res)=>{
//       this.dataRoomService
//         .bulk_permanant_delete_folder(this.dataroomId, files)
//         .subscribe((ress) => {
//           this.msg = "Folders / Files deleted successfully ";
//           this.showInfo();
//          // this.getAllTrashedFoldersAndFiles(this.p);
  
//                 //this.all_root_folder_list.splice(i, 1);
//         if(this.all_root_folder_list.length == 0){
//           if(this.p ==1){
//             this.getAllTrashedFoldersAndFiles(this.p)
//           }
//           else{
//             this.getAllTrashedFoldersAndFiles(this.p - 1)
//           }
//         }else{
//           this.getAllTrashedFoldersAndFiles(this.p)
//         }
//         this.deletes=""
//           // if (this.file_folder !== "") {
//           //   this.router.navigate(["/folder_detail", this.file_folder]);
//           // }
//         });
//       // })
//     }
  
//     reloadpage(){
     
//       if(this.p != 1 && this.all_root_folder_list.length == 0){
//         this.getAllTrashedFoldersAndFiles(this.p - 1)
//       }
//     }
//     showSuccess() {
//       this.toastr.success(this.msg);
//     }
  
//     showError() {
//       this.toastr.error(this.msg);
//     }
  
//     getAllTrashedFoldersAndFiles(pageNumber) {
//    this.show__aspinner = true;
//    this.all_root_folder_list = null;
//       var todays =
//       new Date(this.to_date).getFullYear() +
//       "-" +
//       (new Date(this.to_date).getMonth() + 1) +
//       "-" +
//       new Date(this.to_date).getDate();
//     var first =
//       new Date(this.from_date).getFullYear() +
//       "-" +
//       (new Date(this.from_date).getMonth() + 1) +
//       "-" +
//       new Date(this.from_date).getDate();
  
//       this.p = pageNumber;
//       console.log("dataroom id is", this.dataroomId);
//       this.show_spinner =true;
//       this.dataRoomService
//         .get_all_trashed_folder_and_files(
//           this.dataroomId,
//           this.deleted_by,
//           pageNumber,
//           todays,
//           first
//         )
//         .subscribe((res) => {
//           this.show__aspinner = false;
//           this.show_spinner =false;
//           this.all_root_folder_list = res.data;
//           //console.log(res.data.selectedversion,"selected versison")
//           console.log(this.all_root_folder_list, "trash");
//           this.size = res.size;
//           var length = this.all_root_folder_list.length;
  
//           this.show_spinner = false;
  
        
//           if (length > 1) {
//             for (let i = 0; i < this.all_root_folder_list.length; i++) {
//               if (
//                 this.all_root_folder_list[0].is_deleted_permanent &&
//                 this.all_root_folder_list[length - 1].is_deleted_permanent &&
//                 this.all_root_folder_list[i].is_deleted_permanent
  
//               ) {
//                 this.nodata = true;
//               } else {
//                 this.nodata = false;
//               }
//             }
//           }
//           this.all_root_folder_list.forEach((res) => {
//             res.selected = false;
//             res.icons = this.getIcons(res, res.is_folder);
//           });
//         });
//     }
  
  
  
  
  
  
  
  
//     showInfo() {
//       this.toastr.info(this.msg);
//     }
  
//     from_date: any;
//     to_date: any;
//     deleted_by: any = "";
//     changeDateWise(from_date, to_date) {
//       this.to_date = to_date;
//       this.from_date = from_date;
//    this.getAllTrashedFoldersAndFiles(this.p=1);
//     }
  
  
//     fromdate: any;
//     getDateWise() {
//       var today = new Date();
//       this.to_date = new Date(
//         today.getFullYear(),
//         today.getMonth(),
//         today.getDate()
//       );
//       this.from_date = new Date(
//         today.getFullYear(),
//         today.getMonth() - 1,
//         today.getDate()
//       );
//       this.dataRoomService.getSingleDataroom(this.dataroomId).subscribe((res) => {
//         this.fromdate = res.created_date;
//         console.log(res.created_date, "from date");
//         this.from_date = new Date(this.fromdate);
//         this.to_date = new Date(
//           today.getFullYear(),
//           today.getMonth(),
//           today.getDate()
//         );
  
//         this.getAllTrashedFoldersAndFiles(this.p);
//       });
  
//       // this.GetActivityByDate(this.p);
//     }
  
  
//     // getDateWise(){
//     //   var today = new Date();
//     //   this.to_date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//     //   this.from_date = new Date(today.getFullYear(), (today.getMonth()-1), today.getDate());
//     //   this.getAllTrashedFoldersAndFiles();
//     // }
  
//     SelectBy() {
//       this.deleted_by;
  
//       this.getAllTrashedFoldersAndFiles(this.p);
//     }
  
//     selectedTrash() {
//       var folder = this.all_root_folder_list.filter(
//         (res) => res.selected === true
//       );
//       if (folder.length > 0) {
//         this.showRestore = true;
//       } else {
//         this.showRestore = false;
//       }
//     }
  
//     download_popup(nodes) {
//       this.openDialogDownload(nodes);
//     }
//     openDialogDownload(nodes): any {
//       const dialogRef = this.dialogdownload.open(trashPopup, {
//         width: "500px",
//         data: { copy: nodes },
//       });
  
//       dialogRef.afterClosed().subscribe((result) => {
//         if (result && result != undefined) {
//           if (result == true) {
//             console.log(result, "result");
//             //  this.download_all_files();
//           }
//         }
//         if (!result && result != undefined) {
//           console.log(result, "result");
//           // this.notify = "No";
//           // this.startUpload();
//         }
//       });
//     }
  
   
//     selectAll: boolean = false;
//     showRestore: boolean = false;
//     selectAllTrash(event) {
//       if (event.checked == true) {
//         this.showRestore = true;
//         this.all_root_folder_list.forEach((res) => {
//           res.selected = true;
//         });
//       } else {
//         this.showRestore = false;
//         this.all_root_folder_list.forEach((res) => {
//           res.selected = false;
//         });
//       }
//     }
//   }
//   @Component({
//     selector: "./document/copy-paster-popup",
//     templateUrl: "trashpopup.html",
//   })
//   export class trashPopup {
//     constructor(
//       public dialogRefs: MatDialogRef<trashPopup>,
//       private dataRoomService: DataRoomService,
  
//       @Inject(MAT_DIALOG_DATA) public data: DialogData
//     ) { }
//     nodes: any;
//     showTrashFoldersTree(folder) {
  
//       this.dataRoomService.trashShowDeletedFiles(folder.id).subscribe((res) => {
//         this.nodes = res.data;
//         //this.download_popup(this.nodes);
//         console.log(this.nodes, "showTrashFolders");
//       });
//     }
  
//     onNoClick(): void {
//       this.dialogRefs.close();
//     }
//   }
  
  
  
  