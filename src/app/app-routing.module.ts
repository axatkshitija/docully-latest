import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './common/auth.guard';
import { DashboardComponent } from './admin-dash/dashboard/dashboard.component';
import { BillingTermComponent } from './billing-term/billing-term.component';
import { DataroomLockComponent } from './admin-dash/dataroom-lock/dataroom-lock.component';
import { BillingDetailsCPIDIComponent, BillingDetailsComponent } from './billing-details/billing-details.component';
import { DrmCheckComponent } from './drm-check/drm-check.component';
import { PaymentSuccessfulComponent } from './payment-successful/payment-successful.component';
import { RegisterComponent } from './register/register.component';
import { ExistingUserComponent } from './existing-user/existing-user.component';
import { ForgetComponent } from './forget/forget.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { PersonalInfoComponent } from './profile-setting/personal-info/personal-info.component';
import { EmailNotificationComponent } from './profile-setting/email-notification/email-notification.component';
import { UserForgotPassComponent } from './profile-setting/user-forgot-pass/user-forgot-pass.component';
import { OverviewComponent } from './data-room/overview/overview.component';
import { DocumentComponent } from './data-room/document/document.component';
import { FolderDetailComponent } from './data-room/folder-detail/folder-detail.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MessagesComponent } from './messages/messages.component';
import { UserPermissionComponent } from './admin-dash/user-permission/user-permission.component';
import { UserPermissionAdminComponent } from './admin-dash/user-permission-admin/user-permission-admin.component';
import { MyTeamComponent } from './admin-dash/my-team-section/my-team/my-team.component';
import { MineTeamComponent } from './admin-dash/my-team-section/mine-team/mine-team.component';
import { ChannelComponent } from './admin-dash/my-channel/channel/channel.component';
import { OnlineChannelComponent } from './admin-dash/online-channels/online-channel/online-channel.component';
import { UpdateDocComponent } from './data-room/update-doc/update-doc.component';
import { NewUpdateComponent } from './data-room/new-update/new-update.component';
import { NewMessageComponent } from './admin-dash/new-message/new-message.component';
import { NewNotificationComponent } from './admin-dash/new-notification/new-notification.component';
import { EmailVerificationLoginComponent } from './email-verification-login/email-verification-login.component';
import { ReportOverviewComponent } from './data-room/reports/report-overview/report-overview.component';
import { ActiveByFilesComponent } from './data-room/reports/active-by-files/active-by-files.component';
import { ViewReportFileComponent } from './data-room/reports/view-report-file/view-report-file.component';
import { QnaReportsComponent } from './data-room/reports/qna-reports/qna-reports.component';
import { DownloadReportsComponent } from './data-room/reports/download-reports/download-reports.component';
import { UsersStatusComponent } from './data-room/reports/users-status/users-status.component';
import { IndexReportComponent } from './data-room/reports/index-report/index-report.component';
import { UsageReportComponent } from './data-room/reports/usage-report/usage-report.component';
import { UsersAndGroupsComponent } from './data-room/reports/users-and-groups/users-and-groups.component';
import { MemberInfoComponent } from './data-room/reports/member-info/member-info.component';
import { QaUserComponent } from './data-room/qa-user/qa-user.component';
import { WatermarkingSettingComponent } from './watermarking-setting/watermarking-setting.component';
import { QaQuestionsComponent } from './data-room/qa-questions/qa-questions.component';
import { ManageCategoriesComponent } from './data-room/manage-categories/manage-categories.component';
import { UsersAndPermissionsComponent } from './data-room/permissions/users-and-permissions/users-and-permissions.component';
import { RecentDocumentsComponent } from './data-room/recent-documents/recent-documents.component';
import { TrashComponent } from './data-room/trash/trash.component';
import { ActiveByDateComponent } from './data-room/reports/active-by-date/active-by-date.component';
import { ContactListsComponent } from './admin-dash/contact-lists/contact-lists.component';
import { AddQuestionComponent } from './data-room/add-question/add-question.component';
import { MyContactsAdminComponent } from './data-room/my-contacts-admin/my-contacts-admin.component';
import { ManageGroupPermissionComponent } from './data-room/permissions/manage-group-permission/manage-group-permission.component';
import { DocumentPermissionComponent } from './data-room/permissions/document-permission/document-permission.component';
import { FolderPermissionComponent } from './data-room/permissions/folder-permission/folder-permission.component';
import { ManageAdminGroupsComponent } from './data-room/permissions/manage-admin-groups/manage-admin-groups.component';
import { ManageLaAdminComponent } from './data-room/permissions/manage-la-admin/manage-la-admin.component';
import { NotViewedComponent } from './data-room/not-viewed/not-viewed.component';
import { NotPrintedComponent } from './data-room/not-printed/not-printed.component';
import { NotDownloadedComponent } from './data-room/not-downloaded/not-downloaded.component';
import { UploadStatusComponent } from './data-room/upload-status/upload-status.component';
import { AllUsersListComponent } from './data-room/permissions/all-users-list/all-users-list.component';
import { ViewUpdateDocComponent } from './data-room/view-update-doc/view-update-doc.component';
import { DisclaimerPopUpComponent } from './data-room/disclaimer/disclaimer-pop-up/disclaimer-pop-up.component';
import { IndexesReportComponent } from './indexes-report/indexes-report.component';
import { SignedDisclaimersComponent } from './data-room/disclaimer/signed-disclaimers/signed-disclaimers.component';
import { FaqComponent } from './data-room/faq/faq.component';
import { DownloadStatusComponent } from './data-room/download-status/download-status.component';
import { GroupSettingComponent } from './data-room/voting/group-setting/group-setting.component';
import { VotingComponent } from './data-room/voting/voting.component';
import { VotingReportComponent } from './data-room/reports/voting-report/voting-report.component';
import { VotingStatusComponent } from './data-room/reports/voting-report/voting-status/voting-status.component';
import { ManageGroupMembersComponent } from './data-room/voting/manage-group-members/manage-group-members.component';
import { ManageVotersComponent } from './data-room/voting/manage-voters/manage-voters.component';
import { SubscriptionComponent } from './admin-dash/subscription/subscription.component';
import { AddOnsComponent } from './admin-dash/add-ons/add-ons.component';
import { ManageAddonsComponent } from './admin-dash/billing-history/billing-history.component';
import { ManageSubscriptionComponent } from './admin-dash/subscription/manage-subscription/manage-subscription.component';
import { BillingpageComponent } from './billingpage/billingpage.component';
import { BillingDetailsCPIDComponent, PlanpaymentComponent } from './planpayment/planpayment.component';
import { PaysuccessComponent } from './paysuccess/paysuccess.component';
import { UpgradeplanComponent } from './upgradeplan/upgradeplan.component';
import { PlanupgradesuccessComponent } from './planupgradesuccess/planupgradesuccess.component';
import { PaycanelComponent } from './paycanel/paycanel.component';
 import { UploadFoldersComponent } from './data-room/upload-folders/upload-folders.component';
import { UploadFilesComponent } from './data-room/upload-files/upload-files.component';
import { RedactorComponent } from './data-room/redactor/redactor.component';
import { FavouriteTabComponent } from './data-room/favourite-tab/favourite-tab.component';
import { VersionshistoryComponent } from './data-room/versionshistory/versionshistory.component';
import { UploadRestrictionsComponent } from './data-room/permissions/upload-restrictions/upload-restrictions.component';
import { UploadRestrictionFolderComponent } from './data-room/permissions/upload-restriction-folder/upload-restriction-folder.component';
import { LatestUploadComponent } from './data-room/latest-upload/latest-upload.component';

const routes: Routes = [

  {
    path: "login",
    component: LoginComponent,
  },

  { path: '',   redirectTo: '/login', pathMatch: 'full' },

  { path: "billing-term", component: BillingTermComponent, canActivate: [AuthGuard] },
  { path: "dataroom-lock/:id", component: DataroomLockComponent, canActivate: [AuthGuard] },
  { path: "billing-term/:state", component: BillingTermComponent, canActivate: [AuthGuard] },
  //billing-details
  { path: "billing-details", component: BillingDetailsComponent, canActivate: [AuthGuard] },
  { path: "billing-details/:state", component: BillingDetailsComponent, canActivate: [AuthGuard] },
  { path: "drm_access_check/:folderId", component: DrmCheckComponent, canActivate: [AuthGuard] },
  { path: "billing-details-cpid", component: BillingDetailsCPIDIComponent},
  { path: "payment-successful/:id", component: PaymentSuccessfulComponent},
  { path: "payment-successful", component: PaymentSuccessfulComponent},
  { path: "signupform", component: RegisterComponent },
  { path: "existing-user", component: ExistingUserComponent },
  { path: "login/:folderId/:userId", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "forget", component: ForgetComponent },
  { path: "forgot-pass", component: ForgotPassComponent },
  { path: "user-personal-info", component: PersonalInfoComponent, canActivate: [AuthGuard] },
  { path: "file-editor", component: RedactorComponent, canActivate: [AuthGuard] },
  { path: "favourites", component: FavouriteTabComponent, canActivate: [AuthGuard] },
  { path: "file-editor/:dataroomId/:folderId/:fileId", component: RedactorComponent, canActivate: [AuthGuard] },
  { path: "file-editor/:dataroomId/:folderId/:fileId/:redactid/:redact", component: RedactorComponent, canActivate: [AuthGuard] },
  { path: "email-notification-info", component: EmailNotificationComponent, canActivate: [AuthGuard] },
  { path: "changepassword", component: UserForgotPassComponent, canActivate: [AuthGuard] },
  { path: "overview", component: OverviewComponent, canActivate: [AuthGuard] },
  { path: "overview/:dataroomId", component: OverviewComponent, canActivate: [AuthGuard] },
  { path: "documents", component: DocumentComponent, canActivate: [AuthGuard] },
  //FolderDetailComponent
  { path: "notifications", component: NotificationsComponent, canActivate: [AuthGuard] },

  { path: "messages", component: MessagesComponent, canActivate: [AuthGuard] },
  { path: "user-permission", component: UserPermissionComponent, canActivate: [AuthGuard] },
  { path: "user-permission-admin", component: UserPermissionAdminComponent, canActivate: [AuthGuard] },
  { path: "my-team/:myteamId", component: MyTeamComponent, canActivate: [AuthGuard] },
  { path: "my-team", component: MineTeamComponent, canActivate: [AuthGuard] },
  { path: "channel", component: ChannelComponent, canActivate: [AuthGuard] },
  { path: "online-channel", component: OnlineChannelComponent, canActivate: [AuthGuard] },
  { path: "update-doc", component: UpdateDocComponent, canActivate: [AuthGuard] },
  { path: "new-update", component: NewUpdateComponent, canActivate: [AuthGuard] },
  { path: "new-message", component: NewMessageComponent, canActivate: [AuthGuard] },
  { path: "new-notification", component: NewNotificationComponent, canActivate: [AuthGuard] },
  { path: "signup", component: EmailVerificationLoginComponent },
  { path: "report-overview", component: ReportOverviewComponent, canActivate: [AuthGuard] },
  { path: "report-byfiles", component: ActiveByFilesComponent, canActivate: [AuthGuard] },
  { path: "reportfiles-view/:id", component: ViewReportFileComponent, canActivate: [AuthGuard] },
  { path: "report-qa", component: QnaReportsComponent, canActivate: [AuthGuard] },
  { path: "report-download", component: DownloadReportsComponent, canActivate: [AuthGuard] },
  { path: "report-userstatus", component: UsersStatusComponent, canActivate: [AuthGuard] },
  { path: "report-index", component: IndexReportComponent, canActivate: [AuthGuard] },
  { path: "report-usage", component: UsageReportComponent, canActivate: [AuthGuard] },
  { path: "report-usergroups", component: UsersAndGroupsComponent, canActivate: [AuthGuard] },
  { path: "member-info/:id", component: MemberInfoComponent, canActivate: [AuthGuard] },
  { path: "qa-user", component: QaUserComponent, canActivate: [AuthGuard] },
  { path: "watermarking-setting", component: WatermarkingSettingComponent, canActivate: [AuthGuard] },
  { path: "qa-questions/:id", component: QaQuestionsComponent, canActivate: [AuthGuard] },
  { path: "manage-categories", component: ManageCategoriesComponent, canActivate: [AuthGuard] },
  // { path: 'user-permissions', component: UserPermissionsComponent },
  { path: "user-and-permissions", component: UsersAndPermissionsComponent, canActivate: [AuthGuard] },
  { path: "recent-doc", component: RecentDocumentsComponent, canActivate: [AuthGuard] },
  { path: "version-history", component: VersionshistoryComponent, canActivate: [AuthGuard] },
  { path: "version-history/:dataroomId/:folderId/:fileId", component: VersionshistoryComponent, canActivate: [AuthGuard] },
  { path: "trash-doc", component: TrashComponent, canActivate: [AuthGuard] },
  { path: "report-bydate", component: ActiveByDateComponent, canActivate: [AuthGuard] },
  { path: "my-contacts", component: ContactListsComponent, canActivate: [AuthGuard] },
  { path: "add-que", component: AddQuestionComponent, canActivate: [AuthGuard] },
  { path: "my-contacts-admin", component: MyContactsAdminComponent, canActivate: [AuthGuard] },
  { path: "folder_detail/:folderId", component: FolderDetailComponent, canActivate: [AuthGuard] },
  // { path: "file-views/:file_uuid", component: FileViewComponent },
  // create new admin group
  {
    path: "manage-permission/:group_id/:indx",
    component: ManageGroupPermissionComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "manage-permission/:group_id/:indx",
    component: ManageGroupPermissionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "document-permission/:group_id/:indx",
    component:DocumentPermissionComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "document-upload-restriction/:group_id/:indx",
    component:UploadRestrictionsComponent,
    canActivate: [AuthGuard]
  },
  
  {
    path: "folder-permission/:group_id/:indx/:id",
    component: FolderPermissionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "folder-upload-restriction/:group_id/:indx/:id",
    component: UploadRestrictionFolderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "manage-admin-group-permission/:indx",
    component: ManageAdminGroupsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "manage-la-permission/:group_id/:indx",
    component: ManageLaAdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "manage-la-admin-group-permission",
    component: ManageLaAdminComponent,
    canActivate: [AuthGuard]
  },
  //{ path: 'create-new-la-admin-group', component: CreateNewLaAdminComponent},

  { path: "not-view-documents", component: NotViewedComponent, canActivate: [AuthGuard] },
  { path: "not-print-documents", component: NotPrintedComponent, canActivate: [AuthGuard] },
  { path: "not-download-documents", component: NotDownloadedComponent, canActivate: [AuthGuard] },
  { path: "upload-status-documents", component: UploadStatusComponent, canActivate: [AuthGuard] },
  { path: "all-users-list", component: AllUsersListComponent, canActivate: [AuthGuard] },
  { path: "view-update-doc/:id", component: ViewUpdateDocComponent, canActivate: [AuthGuard] },
  { path: "disclaimer-popup/:id", component: DisclaimerPopUpComponent, canActivate: [AuthGuard] },
  { path: "indexes-report", component: IndexesReportComponent, canActivate: [AuthGuard] },
  { path: "signed-disclaimer", component: SignedDisclaimersComponent, canActivate: [AuthGuard] },
  { path: "faq", component: FaqComponent, canActivate: [AuthGuard] },
  { path: "download-status-documents", component: DownloadStatusComponent, canActivate: [AuthGuard] },

  //For Voter Group Setting 
  { path: "group-setting", component: GroupSettingComponent, canActivate: [AuthGuard] },

  //For Voting List Module

  { path: "voting", component: VotingComponent, canActivate: [AuthGuard] },

  { path: "voting-report", component: VotingReportComponent, canActivate: [AuthGuard] },

  { path: "voting-status/:voteId", component: VotingStatusComponent, canActivate: [AuthGuard] },

  {
    path: "manager-group-members/:groupId",
    component: ManageGroupMembersComponent,
    canActivate: [AuthGuard]
  },

  { path: "manager-voters/:voteId", component: ManageVotersComponent, canActivate: [AuthGuard] },
  { path: "manager-voters/:voteId/:statusId", component: ManageVotersComponent, canActivate: [AuthGuard] },
  { path: "subscription/:state", component: SubscriptionComponent, canActivate: [AuthGuard] },
  { path: "subscription", component: SubscriptionComponent, canActivate: [AuthGuard] },
  { path: "add-ons/:subscriptionId", component: AddOnsComponent, canActivate: [AuthGuard] },
  { path: "manage-add-ons/:id", component: ManageAddonsComponent, canActivate: [AuthGuard] },
  // { path: "manage-add-ons", component: ManageAddonsComponent },

  {
    path: "manage-subscription/:subscriptionId/:state/:id",
    component: ManageSubscriptionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "manage-subscription/:subscriptionId/:state",
    component: ManageSubscriptionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "manage-subscription/:subscriptionId",
    component: ManageSubscriptionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "subscription-new/:dataroomId",
    component: ManageSubscriptionComponent,
    canActivate: [AuthGuard]
  },

  //  himanshu 
  { path: "billingpage", component: BillingpageComponent, canActivate: [AuthGuard] },
  { path: "pay/:state", component: PlanpaymentComponent, canActivate: [AuthGuard] },
  { path: "pay", component: PlanpaymentComponent, canActivate: [AuthGuard] },
  { path: "billing-details-cpid", component: BillingDetailsCPIDComponent, canActivate: [AuthGuard] },
  { path: "paysuccess", component: PaysuccessComponent, canActivate: [AuthGuard] },
  { path: "plan/:type/:id", component: UpgradeplanComponent, canActivate: [AuthGuard] },
  { path: "planupgardesuccess", component: PlanupgradesuccessComponent, canActivate: [AuthGuard] },
  { path: "paycancel", component: PaycanelComponent, canActivate: [AuthGuard] },
  { path: "upload-folders-sections/:dataroom", component: UploadFoldersComponent, canActivate: [AuthGuard] },
  { path: "upload-files-sections/:dataroom/:id", component: LatestUploadComponent, canActivate: [AuthGuard] },  
  { path: "upload-files-sections/:dataroom/:id/:google", component: LatestUploadComponent, canActivate: [AuthGuard] },
  { path: "upload-files-sec/:dataroom/:id", component: UploadFilesComponent, canActivate: [AuthGuard] },
  
  
  
];

@NgModule({
  imports:[RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
