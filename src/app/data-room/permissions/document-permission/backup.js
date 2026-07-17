//  <app-header></app-header>
// <section id="cdr-body">
//   <div class="container-fluid">
//     <div fxLayout="row" fxLayoutAlign="space-between start" fxLayoutGap="15px" fxLayout.xs="column" fxLayout.sm="column"
//       fxLayoutAlign.xs="center stretch" fxLayoutAlign.sm="center stretch">
//       <app-data-room-left fxFlex="15" fxFlex.xs="100" fxFlexOrder.xs="1" (onInitEvent)="receiveAutoMsgHandler($event)">
//       </app-data-room-left>
//       <div fxFlex="85" fxFlex.xs="100" fxFlexOrder.xs="2" class="addclass" style="background-color: #fff !important;">
//         <div class="row"
//           style="background:#fff;z-index: 10;position: sticky !important; top: 0 !important;padding: 10px 10px;">
//           <div class="col-md-9">
//             <h4 style="font-family: poppins;">Manage Group Permissions </h4>
//             <p>You can go into folder to set subfolders and files permission.</p>
//           </div>

//           <div class="col-md-3 text-right">
//             <a href="javascript:void(0)" mat-raised-button class="cdr-btn big-btn blue-btn" (click)="goBack()">
//               Back</a>
//           </div>
//         </div>
//         <div class="managepermission mt-4">



//           <div class="table-thead">
//             <div class="usr-table-list tp-hdr-tb"
//               style="position: sticky !important; top:67px;background-color:#fff;z-index: 10;">
//               <div class="solvedHulalal" style="width: 42%;">
//                 <span style="width: 20%; margin-left: 20px;">Index</span>
//                 <span class="usr-title-th" style="width: 80%;margin-left: 70px;">Folder Name</span>
//               </div>
//               <div class="thanks" style="width:60% ;display: flex;font-size: 15px;">
//                 <span style="width: 100px;cursor: pointer;" matTooltip="No Access"><i class="fa fa-lock"></i></span>
//                 <span style="width: 100px;cursor: pointer;" matTooltip="View Only"><i class="fa fa-eye"
//                     aria-hidden="true"></i></span>
//                 <span style="width: 100px;cursor: pointer;" matTooltip="View and Download">
//                   <i class="fa fa-eye" aria-hidden="true"></i>
//                   <i class="fa fa-download" aria-hidden="true"></i>
//                 </span>
//                 <span style="width: 100px;cursor: pointer;" matTooltip="Upload">
//                   <i class="fa fa-upload" aria-hidden="true"></i>
//                 </span>
//                 <span style="width: 100px;cursor: pointer;" matTooltip="Doculink">
//                   <i class="fa fa-external-link" aria-hidden="true"></i>
//                 </span>
//                 <span style="width: 200px;cursor: pointer;" matTooltip="Doculink">
//                   <i class="fa fa-calendar" aria-hidden="true"></i>
//                 </span>
  
//               </div>
//             </div>

//             <div class="usr-table-list">
//               <div class="allfiles" style="width: 40%;">
//                 <span class="d-flex align-items-start flex-column" style="width: 30px;">
//                 </span>
//                 <span class="usr-title-td" style="margin-left: 138px;">All Files</span>
//               </div>
//               <div class="allfilessectioncheckboxes" style="width: 60%;display: flex;">
//                 <span style="width: 100px;">
//                   <mat-checkbox color="primary" name="is_no_access" [(ngModel)]="is_no_access"
//                     (change)="clickAllNoAccess($event.checked)" [indeterminate]="is_no_access_indeterminate">
//                   </mat-checkbox>
//                 </span>
//                 <span style="width: 100px;">
//                   <mat-checkbox color="primary" name="is_view_only" [(ngModel)]="is_view_only"
//                     (change)="clickAllView($event.checked)" [indeterminate]="is_view_only_indeterminate"></mat-checkbox>
//                 </span>
//                 <span style="width: 100px;">
//                   <mat-checkbox color="primary" name="is_view_and_print_and_download"
//                     [(ngModel)]="is_view_and_print_and_download" (change)="clickAllViewPrintDownload($event.checked)"
//                     [indeterminate]="
//                                 is_view_and_print_and_download_indeterminate
//                               "></mat-checkbox>
//                 </span>
//                 <span style="width: 100px;">
//                   <mat-checkbox color="primary" name="is_upload" [(ngModel)]="is_upload" [disabled]="!is_view_only"
//                     (change)="clickAllUpload($event.checked)" [indeterminate]="is_upload_indeterminate"></mat-checkbox>
//                 </span>

//                 <span style="width: 100px;">
//                   <mat-checkbox color="primary" name="is_shortcut" [(ngModel)]="is_shortcut"
//                     (change)="clickAllShortcut($event.checked)" [indeterminate]="is_shortcut_indeterminate">
//                   </mat-checkbox>
//                 </span>
//                 <span style="width: 100px;">
//                   <mat-checkbox color="primary" name="is_date" style="display: none;">
//                   </mat-checkbox>
//                 </span>
//               </div>


//             </div>
//             <div class="d-flex justify-content-center align-items-center">
//               <mat-progress-spinner class="progress-align-center" [mode]="'indeterminate'" *ngIf="show_spinner">
//               </mat-progress-spinner>
//             </div>

//             <tree-root *ngIf="!show_spinner" [nodes]="nodes" [options]="options">
//               <ng-template #treeNodeTemplate let-node let-index="index">
//                 <div class="usr-table-list tp-hdr-tb">
//                   <div class="allfoldersredered" style="width: 40%; display: flex; ">
//                     <span class="d-flex align-items-start flex-column" style="width: 20%;margin-left: 8px;">

//                       <span>{{node.data.names | onlyIndex}}</span>
//                     </span>
//                     <span class="usr-title-td" (click)="getSubFolderElement(node.data.id)" class="usr-title-td"
//                       style="word-break: break-word;width: 80%;">
//                       <span *ngIf="node.data.is_folder">
//                         <img src="../../../../assets/images/ICONS_PNG/folder.png" style="width: 17px !important" />
//                       </span>

//                       {{ node.data.name}}
//                     </span>
//                   </div>

//                   <div class="allcheckboxesrendered" style="width: 60%;display: flex;">
//                     <span style="width: 100px;">
//                       <mat-checkbox name="is_no_access" [(ngModel)]="node.data.perm.is_no_access"
//                         (change)="clickNoAccess($event, node.data)" [indeterminate]="node.data.noaccess_indeterminate">
//                       </mat-checkbox>
//                     </span>
//                     <span style="width: 100px;">
//                       <mat-checkbox [(ngModel)]="node.data.perm.is_view_only" name="is_view_only"
//                         (change)="clickView($event, node.data)" [indeterminate]="node.data.view_indeterminate">
//                       </mat-checkbox>
//                     </span>
             

//                     <span style="width: 100px;">
//                       <mat-checkbox (change)="clickViewPrintDownload($event, node.data)" [(ngModel)]="
//                                     node.data.perm.is_view_and_print_and_download
//                                   " name="is_view_and_print_and_download"
//                         [indeterminate]="node.data.vpd_indeterminate">
//                       </mat-checkbox>
//                     </span>
//                     <span style="width: 100px;" *ngIf="node.data.is_folder">
//                       <mat-checkbox (change)="clickUpload($event, node.data)" [(ngModel)]="node.data.perm.is_upload"
//                         [disabled]="!node.data.perm.is_view_only" name="is_upload"
//                         [indeterminate]="node.data.upload_indeterminate"></mat-checkbox>
//                     </span>
//                     <span style="width: 100px;" *ngIf="!node.data.is_folder">
//                       <mat-checkbox (change)="clickUpload($event, node.data)" [(ngModel)]="node.data.perm.is_upload"
//                         name="is_upload" [indeterminate]="node.data.upload_indeterminate" [disabled]="true">
//                       </mat-checkbox>
//                     </span>
//                     <span style="width: 100px;">
//                       <mat-checkbox (change)="clickShortcut($event, node.data)" [(ngModel)]="node.data.perm.is_shortcut"
//                         name="is_shortcut" [indeterminate]="node.data.shortcut_indeterminate"></mat-checkbox>
//                     </span>
//                     <span style="width: 200px">
//                       <mat-checkbox name="is_view_and_print">
//                       </mat-checkbox>
//                       <input [owlDateTime]="dt1" [owlDateTimeTrigger]="dt1" placeholder="Date Time" style="margin-right: 20px !important;width: 180px !important;">
//                       <owl-date-time #dt1></owl-date-time>
//                     </span>
//                   </div>
//                 </div>
//               </ng-template>
//             </tree-root>
//           </div>
//           <hr />

//           <div class="col-md-4 text-right"></div>
//           <div class="d-flex justify-content-center mt-3 mb-3">
//             <button type="submit" class="updates" style="margin-left: 0px;" (click)="UpdateFoldersFilesPermission()">
//               Update
//             </button>

//           </div>
//           <hr />
//         </div>
//       </div>

//     </div>
//   </div>
// </section>
// <app-footer></app-footer> 