import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RecaptchaModule } from "ng-recaptcha";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxFileDropModule } from "ngx-file-drop";
//import { ChartModule } from 'angular-highcharts';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SelectModule } from 'angular2-select';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { NgxUploaderModule } from 'ngx-uploader';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ColorPickerModule } from 'ngx-color-picker';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgxEditorModule } from 'ngx-editor';
import { LoginComponent } from './login/login.component';
import { AuthenticationService, DataRoomService, SharedService, SubscriptionService, UserService } from './services';

import { ApiListClass, BaseUrlClass, DmsApiListClass } from './common';
import { CommonModule, DatePipe } from '@angular/common';
import { SessionService } from './common/session.service';
import { ActivityInterceptor } from './common/activity.interceptor';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DashboardComponent, SessionActivePopup } from './admin-dash/dashboard/dashboard.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { AdminLeftSideBarComponent } from './admin-dash/admin-left-side-bar/admin-left-side-bar.component';
import { AdminRightSideBarComponent } from './admin-dash/admin-right-side-bar/admin-right-side-bar.component';
import { EditDataroomComponent } from './admin-dash/edit-dataroom/edit-dataroom.component';
import { DataroomFilterPipe } from './pipe/filter.pipe';
import { ContactNameFilterPipe } from './pipe/contact-name-filter.pipe';
import { SpecialCharacterDirective } from './inputvalid';
import { ImportantNotificationsComponent } from './admin-dash/important-notifications/important-notifications.component';
import { OfflineComponent } from './offline.component';
import { DataroomLockComponent } from './admin-dash/dataroom-lock/dataroom-lock.component';
import { RegisterComponent } from './register/register.component';
import { EmailVerificationLoginComponent } from './email-verification-login/email-verification-login.component';
import { ExistingUserComponent } from './existing-user/existing-user.component';
import { BillingTermComponent } from './billing-term/billing-term.component';
import { BillingDetailsCPIDIComponent, BillingDetailsComponent } from './billing-details/billing-details.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PaymentSuccessfulComponent } from './payment-successful/payment-successful.component';
import { ForgetComponent } from './forget/forget.component';
import { PersonalInfoComponent } from './profile-setting/personal-info/personal-info.component';
import { EmailNotificationComponent } from './profile-setting/email-notification/email-notification.component';
import { DataroomHeaderComponent } from './data-room/dataroom-header/dataroom-header.component';
import { UserForgotPassComponent } from './profile-setting/user-forgot-pass/user-forgot-pass.component';
import { DataRoomLeftComponent } from './data-room/data-room-left/data-room-left.component';
import { DataRoomRightComponent } from './data-room/data-room-right/data-room-right.component';
import { OverviewComponent } from './data-room/overview/overview.component';
import { CopyPastePopup_1, DocumentComponent, bulkDownloadFail, documentNoteConfirmPopup, downloadPopup, downloadShortcutPopup, fileLimitPopup } from './data-room/document/document.component';
import { ActiveEmailConfirmationPopup, ManageGroupPermissionComponent } from './data-room/permissions/manage-group-permission/manage-group-permission.component';
import { TreeModule } from '@bugsplat/angular-tree-component';
import { TruncatePipe } from './pipe/truncate-pipe';
import { NotificationsComponent } from './notifications/notifications.component';
import { MessagesComponent } from './messages/messages.component';
import { IndexReportComponent } from './data-room/reports/index-report/index-report.component';
import { DataroomIdFilterPipe } from './pipe/dataroomId-filter.pipe';
import { ReportTabComponent } from './data-room/reports/report-tab/report-tab.component';
import { VotingReportComponent } from './data-room/reports/voting-report/voting-report.component';
import { VotingStatusComponent } from './data-room/reports/voting-report/voting-status/voting-status.component';
import { FolderSearchFilterPipe } from './pipe/folder-search.pipe';
import { VoteSearchFilterPipe } from './pipe/vote_search.pipe';
import { NameSearchFilterPipe } from './pipe/name-search.pipe';
import { EventSearchFilterPipe } from './pipe/event.pipe';
import { OnlyIndexPipe } from './pipe/only-index.pipe';
import { UserPermissionComponent } from './admin-dash/user-permission/user-permission.component';
import { UserPermissionAdminComponent } from './admin-dash/user-permission-admin/user-permission-admin.component';
import { AccessHistoryComponent } from './admin-dash/access-history/access-history.component';
import { AdminDocumentsGraphComponent } from './admin-dash/admin-documents-graph/admin-documents-graph.component';
import { ChartModule } from 'angular-highcharts';
import { DataroomUsageComponent } from './admin-dash/dataroom-usage/dataroom-usage.component';
import { DisclaimerViewerComponent } from './data-room/disclaimer/disclaimer-viewer/disclaimer-viewer.component';
import { DisclaimerPopUpComponent } from './data-room/disclaimer/disclaimer-pop-up/disclaimer-pop-up.component';
import { MyTeamComponent } from './admin-dash/my-team-section/my-team/my-team.component';
import { DisclaimerPageComponent } from './data-room/disclaimer/disclaimer-page/disclaimer-page.component';
import { ContactsComponent } from './admin-dash/contacts/contacts.component';
import { UpdateDocComponent } from './data-room/update-doc/update-doc.component';
import { NewUpdateComponent } from './data-room/new-update/new-update.component';
import { NewMessageComponent } from './admin-dash/new-message/new-message.component';
import { NewNotificationComponent } from './admin-dash/new-notification/new-notification.component';
import { FileValueAccessor } from './pipe/file-control-value-accessor';
import { FileValidator } from './pipe/file-input.validator';
import { MembersComponent } from './admin-dash/my-team-section/members/members.component';
import { DataroomsComponent } from './admin-dash/my-team-section/datarooms/datarooms.component';
import { MyTeamOverviewComponent } from './admin-dash/my-team-section/my-team-overview/my-team-overview.component';
//import { UploadConfirmationPopups, UploadFilesComponent } from './data-room/upload-files/upload-files.component';
import { CopyCutPopup, FolderDetailComponent, bulkDownloadFails, downloadConfirmationPopups, downloadPopups } from './data-room/folder-detail/folder-detail.component';
import { DocumentRightSideMenuComponent } from './data-room/document-right-side-menu/document-right-side-menu.component';
import { IndexesReportComponent, TimeOutPopup } from './indexes-report/indexes-report.component';
import { DocumentPermissionComponent, TimeOutPopupD } from './data-room/permissions/document-permission/document-permission.component';
import { FolderPermissionComponent, TimeOutPopupF } from './data-room/permissions/folder-permission/folder-permission.component';
import { ActiveByFilesComponent, TimeOutPopupA } from './data-room/reports/active-by-files/active-by-files.component';
import { ReportOverviewComponent, TimeOutPopupR } from './data-room/reports/report-overview/report-overview.component';
import { ViewReportFileComponent } from './data-room/reports/view-report-file/view-report-file.component';
import { QnaReportsComponent } from './data-room/reports/qna-reports/qna-reports.component';
import { DownloadReportsComponent } from './data-room/reports/download-reports/download-reports.component';
import { UsersStatusComponent } from './data-room/reports/users-status/users-status.component';
import { MemberInfoComponent } from './data-room/reports/member-info/member-info.component';
import { QaUserComponent } from './data-room/qa-user/qa-user.component';
import { UsageReportComponent } from './data-room/reports/usage-report/usage-report.component';
import { UsersAndGroupsComponent } from './data-room/reports/users-and-groups/users-and-groups.component';
import { QaQuestionsComponent } from './data-room/qa-questions/qa-questions.component';
import { FaqComponent } from './data-room/faq/faq.component';
import { ManageCategoriesComponent } from './data-room/manage-categories/manage-categories.component';
import { RecentDocumentsComponent } from './data-room/recent-documents/recent-documents.component';
import { TrashComponent, trashPopup } from './data-room/trash/trash.component';
import { ActiveByDateComponent } from './data-room/reports/active-by-date/active-by-date.component';
import { ContactListsComponent } from './admin-dash/contact-lists/contact-lists.component';
import { AddQuestionComponent } from './data-room/add-question/add-question.component';
import { UploadNewVersionComponent } from './data-room/upload-new-version/upload-new-version.component';
import { MyContactsAdminComponent } from './data-room/my-contacts-admin/my-contacts-admin.component';
import { EndUserGroupComponent } from './data-room/permissions/end-user-group/end-user-group.component';
import { WatermarkingSettingComponent } from './watermarking-setting/watermarking-setting.component';
 import { UploadConfirmationPopup, UploadConfirmationPopups, UploadFilesComponent, UploadConfirmationGoogle } from './data-room/upload-files/upload-files.component';
 import { UploadConfirmationDropboxPopup, UploadConfirmationOndrivePopup, UploadConfirmationPopupL, UploadConfirmationPopupsL, uploadrestrictionL } from './data-room/latest-upload/latest-upload.component';
import { UploadConfirmationPopup_1, UploadConfirmationPopup_2,UploadFoldersComponent } from './data-room/upload-folders/upload-folders.component';
// import { FileViewComponent } from './data-room/file-view/file-view.component';
import { ManageAdminGroupsComponent } from './data-room/permissions/manage-admin-groups/manage-admin-groups.component';
import { UsersAndPermissionsComponent } from './data-room/permissions/users-and-permissions/users-and-permissions.component';
import { MemberInput, VotingComponent } from './data-room/voting/voting.component';
import { GroupSettingComponent, MemberGroupInput } from './data-room/voting/group-setting/group-setting.component';
import { ManageVotersComponent, MemberManageInput } from './data-room/voting/manage-voters/manage-voters.component';
import { ManageGroupMembersComponent, MemberManageGroupInput } from './data-room/voting/manage-group-members/manage-group-members.component';
import { ManageLaAdminComponent } from './data-room/permissions/manage-la-admin/manage-la-admin.component';
import { NotViewedComponent } from './data-room/not-viewed/not-viewed.component';
import { NotPrintedComponent } from './data-room/not-printed/not-printed.component';
import { NotDownloadedComponent } from './data-room/not-downloaded/not-downloaded.component';
import { UploadStatusComponent } from './data-room/upload-status/upload-status.component';
import { AllUsersListComponent } from './data-room/permissions/all-users-list/all-users-list.component';
import { ViewUpdateDocComponent } from './data-room/view-update-doc/view-update-doc.component';
import { MineTeamComponent } from './admin-dash/my-team-section/mine-team/mine-team.component';
import { ChannelComponent } from './admin-dash/my-channel/channel/channel.component';
import { SelectionTreeComponent } from './data-room/selection-tree/selection-tree.component';
import { SubscriptionComponent } from './admin-dash/subscription/subscription.component';
import { SubsciptionFilterPipe } from './pipe/subscription';
import { AutoRenewConfirmationDialog, CancelSubscriptionConfirmationDialog, ManageSubscriptionComponent, ReactivateSubscriptionConfirmationDialog } from './admin-dash/subscription/manage-subscription/manage-subscription.component';
import { NewManageSubscriptionComponent } from './admin-dash/subscription/new-manage-subscription/new-manage-subscription.component';
import { AddOnsComponent } from './admin-dash/add-ons/add-ons.component';
import { BillingpageComponent } from './billingpage/billingpage.component';
import { BillingDetailsCPIDComponent, PlanpaymentComponent } from './planpayment/planpayment.component';
import { PaysuccessComponent } from './paysuccess/paysuccess.component';
import { UpgradeplanComponent } from './upgradeplan/upgradeplan.component';
import { PaycanelComponent } from './paycanel/paycanel.component';
import { DrmCheckComponent } from './drm-check/drm-check.component';
import { ManageAddonsComponent } from './admin-dash/billing-history/billing-history.component';
import { TeamMemberComponent } from './admin-dash/my-channel/team-member/team-member.component';
import { TeamsComponent } from './admin-dash/my-channel/teams/teams.component';
import { DataroomComponent } from './admin-dash/my-channel/dataroom/dataroom.component';
import { AllUsersComponent } from './admin-dash/my-channel/all-users/all-users.component';
import { AllMembersComponent } from './admin-dash/my-channel/all-members/all-members.component';
import { DataroomMembersComponent } from './admin-dash/my-channel/dataroom-members/dataroom-members.component';
import { DownloadStatusComponent } from './data-room/download-status/download-status.component';
import { OnlineDataroomComponent } from './admin-dash/online-channels/online-dataroom/online-dataroom.component';
import { OnlineChannelComponent } from './admin-dash/online-channels/online-channel/online-channel.component';
import { OnlineTeamComponent } from './admin-dash/online-channels/online-team/online-team.component';
import { AllUserOnlineComponent } from './online-channels/all-user-online/all-user-online.component';
import { SignedDisclaimersComponent } from './data-room/disclaimer/signed-disclaimers/signed-disclaimers.component';
import { PlanupgradesuccessComponent } from './planupgradesuccess/planupgradesuccess.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { DropZoneComponent } from './data-room/redactor/drop-zone/drop-zone.component';
import { RedactorComponent } from './data-room/redactor/redactor.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { downloadPopupFav, FavouriteTabComponent } from './data-room/favourite-tab/favourite-tab.component';
import { VersionshistoryComponent } from './data-room/versionshistory/versionshistory.component'
import {MatExpansionModule} from '@angular/material/expansion';
import { appNoScientificNotation } from 'src/appNoScientificNotation';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { UploadRestrictionsComponent } from './data-room/permissions/upload-restrictions/upload-restrictions.component';
import { UploadRestrictionFolderComponent } from './data-room/permissions/upload-restriction-folder/upload-restriction-folder.component';
import { LatestUploadComponent } from './data-room/latest-upload/latest-upload.component';
import { DRFilterPipe } from './pipe/dreport.pipe';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: true,
};



export const DateFormats = {
  parse: {
    dateInput: ['DD-MM-YYYY']
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    OfflineComponent,
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    DropZoneComponent,
    RedactorComponent,
    TruncatePipe,
    SessionActivePopup,
    ActiveEmailConfirmationPopup,
    AdminLeftSideBarComponent,
    AdminRightSideBarComponent,
    EditDataroomComponent,
    DataroomFilterPipe,
    PlanupgradesuccessComponent,
    ContactNameFilterPipe,
    SpecialCharacterDirective,
    appNoScientificNotation,
    SignedDisclaimersComponent,
    ImportantNotificationsComponent,
    DataroomLockComponent,
    RegisterComponent,
    EmailVerificationLoginComponent,
    ExistingUserComponent,
    BillingTermComponent,
    BillingDetailsComponent,
    BillingDetailsCPIDIComponent,
    PaymentSuccessfulComponent,
    BillingDetailsCPIDIComponent,
    ForgetComponent,
    UploadConfirmationPopupsL,
    UploadConfirmationPopupL,
    uploadrestrictionL,
    PersonalInfoComponent,
    UploadConfirmationDropboxPopup,
    UploadConfirmationOndrivePopup,
    LatestUploadComponent,
    EmailNotificationComponent,
    DataroomHeaderComponent,
    UserForgotPassComponent,
    DataRoomLeftComponent,
    DataRoomRightComponent,
    OverviewComponent,
    DocumentComponent,
    fileLimitPopup,
    downloadPopup,
    downloadShortcutPopup,
    ManageGroupPermissionComponent,
    documentNoteConfirmPopup,
    CopyPastePopup_1,
    NotificationsComponent,
    MessagesComponent,
    IndexReportComponent,
    DataroomIdFilterPipe,
    ReportTabComponent,
    VotingReportComponent,
    VotingStatusComponent,
    FolderSearchFilterPipe,
    VoteSearchFilterPipe,
    NameSearchFilterPipe,
    EventSearchFilterPipe,
    DRFilterPipe,
    OnlyIndexPipe,
    UserPermissionComponent,
    UserPermissionAdminComponent,
    AccessHistoryComponent,
    AdminDocumentsGraphComponent,
    AdminLeftSideBarComponent,
    DataroomUsageComponent,
    DisclaimerViewerComponent,
    DisclaimerPopUpComponent,
    MyTeamComponent,
    DisclaimerPageComponent,
    ContactsComponent,
    UpdateDocComponent,
    NewUpdateComponent,
    NewMessageComponent,
    NewNotificationComponent,
    FileValueAccessor,
    FileValidator,
    MembersComponent,
    UploadConfirmationPopup,
    downloadPopupFav,
    UploadConfirmationGoogle,
    DataroomsComponent,
    MyTeamOverviewComponent,
    UploadFilesComponent,
    UploadConfirmationPopups,
    FolderDetailComponent,
    bulkDownloadFails,
    DocumentRightSideMenuComponent,
    downloadConfirmationPopups,
    downloadPopups,
    DocumentRightSideMenuComponent,
    CopyCutPopup,
    TimeOutPopup,
    TimeOutPopupD,
    TimeOutPopupF,
    TimeOutPopupA,
    TimeOutPopupR,
    IndexReportComponent,
    FooterComponent,
    IndexesReportComponent,
    ReportOverviewComponent,
    FolderPermissionComponent,
    DocumentPermissionComponent,
    ActiveByFilesComponent,
    bulkDownloadFail,
    ViewReportFileComponent,
    QnaReportsComponent,
    DownloadReportsComponent,
    UsersStatusComponent,
    MemberInfoComponent,
    QaUserComponent,
    UsageReportComponent,
    UsersAndGroupsComponent,
    QaQuestionsComponent,
    FaqComponent,
    ManageCategoriesComponent,
    RecentDocumentsComponent,
    TrashComponent,
    trashPopup,
    ActiveByDateComponent,
    ContactListsComponent,
    AddQuestionComponent,
    UploadNewVersionComponent,
    MyContactsAdminComponent,
    EndUserGroupComponent,
    WatermarkingSettingComponent,
    // UploadConfirmationPopup,
    // UploadConfirmationPopups,
    UploadConfirmationPopup_1,
    UploadConfirmationPopup_2,
    //  FileViewComponent,
    ManageAdminGroupsComponent,
    UsersAndPermissionsComponent,
    VotingComponent,
    GroupSettingComponent,
    MemberGroupInput,
    MemberInput,
    MemberManageInput,
    ManageVotersComponent,
    ManageGroupMembersComponent,
    MemberManageGroupInput,
    ManageLaAdminComponent,
    NotViewedComponent,
    NotPrintedComponent,
    NotDownloadedComponent,
    UploadStatusComponent,
    AllUsersListComponent,
    ViewUpdateDocComponent,
    MineTeamComponent,
    ChannelComponent,
    UploadFoldersComponent,
    SelectionTreeComponent,
    SubscriptionComponent,
    SubsciptionFilterPipe,
    ManageSubscriptionComponent,
    CancelSubscriptionConfirmationDialog,
    AutoRenewConfirmationDialog,
    ReactivateSubscriptionConfirmationDialog,
    NewManageSubscriptionComponent,
    AddOnsComponent,
    BillingpageComponent,
    PlanpaymentComponent,
    BillingDetailsCPIDComponent,
    PaysuccessComponent,
    UpgradeplanComponent,
    PaycanelComponent,
    DrmCheckComponent,
    ManageAddonsComponent,
    TeamMemberComponent,
    TeamsComponent,
    DataroomComponent,
    AllUsersComponent,
    AllMembersComponent,
    DataroomMembersComponent,
    DownloadStatusComponent,
    OnlineDataroomComponent,
    OnlineChannelComponent,
    OnlineTeamComponent,
    AllUserOnlineComponent,
    FavouriteTabComponent,
    VersionshistoryComponent,
    UploadRestrictionsComponent,
    UploadRestrictionFolderComponent,
    LatestUploadComponent
  ],
  imports: [
    BrowserModule,
    [TreeModule],
    AppRoutingModule,
    DropzoneModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    RecaptchaModule,
    ChartModule,
    NgxMatSelectSearchModule,
    HttpClientModule,
    NgxPaginationModule,
    NgxFileDropModule,
    NgxUploaderModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatIconModule,
    MatTreeModule,
    MatExpansionModule,
    MatStepperModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatDialogModule,
    MatCardModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatButtonModule,
    [NgxEditorModule],
    // SelectModule,
    BrowserAnimationsModule,
    [FlexLayoutModule],
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    //TreeModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    PdfViewerModule,
    ColorPickerModule,
    // AngularDateTimePickerModule,
    // AngularMultiSelectModule,
    NgScrollbarModule,
  ],

  providers: [
    HttpClientModule,
    AuthenticationService,
    SubscriptionService,
    UserService,
    DataRoomService,
    SharedService,
    BaseUrlClass,
    ApiListClass,
    DmsApiListClass,
    DatePipe,
    SessionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ActivityInterceptor,
      multi: true,
    },
    // {provide: 'googleTagManagerId', useValue: 'GTM-5NQKVD5'},
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
