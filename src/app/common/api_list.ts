// all constants declare here
export class ApiListClass {
  constructor() {}

  public sign_up: string = "/register/"; 
  public login: string = "/login_web/";
  public logout: string = "/logout/";
  public is_email_exist: string = "/is_email_exist";
  public forgot: string = "/api_forgot/";
  public user_profile: string = "/user_profile/";
  public category_user_profile: string = "/category_user_profile/";
  public change_password: string = "/change_password/";
  public access_history: string = "/access_history/";
  public dataroom: string = "/dataroom_web/";
  public bulk_downloaddrm: string = "/bulk_downloaddrm/";
  public bulkDownloadfilecount: string = "/bulkDownloadfilecount_web/";
  public bulkdownloadstatuscreate: string = "/bulkdownloadstatuscreate/";
  public bulkdownloadrequesrtlist: string = "/bulkdownloadrequesrtlist_web/";
  public bulkdownloadpermission: string = "/bulkdownloadpermission/";
  public bulkdownload_reportlog: string = "/bulkdownload_reportlog_web/";
  public Viewbulk_files: string = "/Viewbulk_files/";
  public ShowDeletedFiles: string = "/ShowDeletedFiles/";
  public get_dataroom_usage: string = "/get_dataroom_usage/";
  public dataroom_detail: string = "/dataroom_detail/";
  public editonlinedataroom: string = "/editonlinedataroom/";
  public archive_request_api: string = "/archive_request_api/";
  public delete_request_api: string = "/delete_request_api/";
  public change_dataroom_stage: string = "/change_dataroom_stage/";
  public update_dataroom_overview_setting: string =
    "/update_dataroom_overview_setting/";
  public dataroom_overview: string = "/dataroom_overview/";
  public create_user_from_superadmin: string = "/create_user_from_superadmin/";
  public buttonvisibilitycheck: string = "/buttonvisibilitycheck/";
  public create_contact: string = "/create_contact/";
  public upload_dataroom_pic: string = "/upload_dataroom_pic/";
  public set_default_dataroom_pic: string = "/set_default_dataroom_pic/";
  public remove_dataroom_overview_video: string =
    "/remove_dataroom_overview_video/";
  public add_new_dataroom_disclaimer: string = "/add_new_dataroom_disclaimer/";
  public dataroom_disclaimer: string = "/dataroom_disclaimer/";
  public create_contact_group: string = "/create_new_contact_group/";
  public add_new_member_to_contact_group: string =
    "/add_new_member_to_contact_group/";
  public get_all_contacts_associated_with_the_group: string =
    "/get_all_contacts_associated_with_the_group/";
  public silveronline: string = "/silveronline/";
  public goldonline: string = "/goldonline/";
  public platinumonline: string = "/platinumonline/";
  public trialonline: string = "/trialonline/";
  public GroupDeactivateactivate: string = "/GroupDeactivateactivate/";
  public my_chanel: string = "/my_chanel/";
  public team_allmember: string = "/team_allmember/";
  public chanel_allmember: string = "/chanel_allmember/";
  public chanel_dashboard: string = "/chanel_dashboard/";
  public chanelteamapi: string = "/chanelteamapi/";
  public Delete_channel: string = "/Delete_channel/";
  public myteamonlinedashboard: string = "/myteamonlinedashboard/";
  public teamalluseronline: string = "/teamalluseronline/";
  public teamalluseronline2: string = "/teamalluseronline/";
  public teamdeletiononline: string = "/teamdeletiononline/";
  public dataroomapiadmin: string = "/dataroomapiadmin/";
  public directdeletedataroom: string = "/directdeletedataroom/";
  public my_team: string = "/my_team/";
  public globalsearchteamdataroom: string = "/globalsearchteamdataroom/";
  public globalsearchteamdataroomid: string = "/globalsearchteamdataroomid/";
  public Delete_team: string = "/Delete_team/";
  public my_team_detail_view: string = "/my_team_detail_view/";
  public my_team_branding_detail_view: string =
    "/my_team_branding_detail_view/";
  public revert_default_my_team_setting: string =
    "/revert_default_my_team_branding_setting/";
  public upload_my_team_logo: string = "/upload_my_team_logo/";
  public upload_my_team_branding_logo: string =
    "/upload_my_team_branding_logo/";
  public get_all_my_team_members: string = "/get_all_my_team_members/";
  public add_new_member_to_my_team: string = "/add_new_member_to_my_team/";
  public add_new_member_to_my_chanel: string = "/add_new_member_to_my_chanel/";
  public delete_member_from_my_team: string = "/delete_member_from_my_team/";
  public delete_member_from_chanel: string = "/delete_member_from_chanel/";
  public create_dataroom_from_my_team: string =
    "/create_dataroom_from_my_team/";
  public create_new_folder: string = "/create_new_folder_web/";
  public redacte_pdf: string = "/redacte_pdf/";
  public get_all_root_folders: string = "/get_all_root_folders_web/";
  public get_single_folder_detail: string = "/get_single_folder_detail_web/";
  public create_new_sub_folder: string = "/create_new_sub_folder_web/";
  public get_all_subfolder_list: string = "/get_all_subfolder_list_web/";
  public GetSingleFolderBreadCrumps: string = "/GetSingleFolderBreadCrumps/";
  public upload_file_inside_folder: string = "/upload_file_inside_folder/";
  public delete_folder_or_file: string = "/delete_folder_or_file/";
  public update_folder__or_file_name: string = "/update_folder_or_file_name/";
  public delete_all_selected_files: string = "/delete_all_selected_files/";
  public favourite_all_selected_files: string = "/favourite_all_selected_files/";
  public get_list_redacted_pdf: string = "/get_list_redacted_pdf/";
  public get_all_trashed_files: string = "/get_all_trashed_files_and_folders/";
  public get_all_recent_document: string = "/get_all_recent_document/";
  public get_file_folders: string = "/get_file_folders/";
  public get_group_file_folders: string = "/get_group_file_folders/";
  public get_update_group_file_folders: string =
    "/get_update_group_file_folders/";
  public TimeOutApi: string = "/TimeOutApi/";
  public get_dataroom_usage_details_for_graph: string =
    "/get_dataroom_usage_details_for_graph/";
  public download_indexing_report: string = "/download_dataroom_index_report/";
  public edit_index_of_root_folder: string = "/edit_index_of_root_folder/";
  public permanant_delete_folder: string = "/permanant_delete_folder/";
  public permanant_delete_foldernew: string = "/permanant_delete_foldernew/";
  public permanant_delete_folder_redact: string = "/permanent_delete_restore_redact/";
  public upload_new_csv: string = "/upload_new_contact_csv/";
  public download_sample_contact: string = "/download_sample_contact_csv/";
  public create_dataroom_admin: string = "/create_dataroom_admin/";
  public create_datroom_contact: string = "/create_datroom_contact/";
  public create_new_dataroom_contact_group: string =
    "/create_new_dataroom_contact_group/";
  public get_file_info: string = "/get_file_info/";
  public create_dataroom_enduser_group: string =
    "/create_dataroom_enduser_group/";
  public delete_dataroom_admins: string = "/delete_dataroom_admins/";
  public receive_email: string = "/receive_email/";
  public update_category: string = "/update_category/";


  public get_all_dataroom_root_folders: string =
    "/get_all_root_folders_for_users_and_permission/";
  public get_end_user_group_information: string = "/get_end_user_information/";
  public get_check_first_page: string = "/checkfirstpage/";
  public get_firstname_and_lastname_using_email: string =
    "/get_firstname_and_lastname_using_emailid/";
  public get_users_and_permission_data: string =
    "/get_users_and_permission_data/";
  public create_dataroom_la_group: string = "/create_dataroom_la_group/";
  public resend_invitation_link: string = "/resend_invitation_link/";
  public user_and_perm_bulk_delete: string = "/user_and_perm_bulk_delete/";
  public add_dataroom_la_user_group: string = "/add_dataroom_la_user_group/";
  public all_end_users: string = "/all_end_users/";
  public get_members_permission: string = "/get_members_permission/";
  public dataroom_features: string = "/dataroom_features/";
    public get_group_details: string = "/get_group_details/"
  public create_dataroom_folder_permission: string =
    "/create_dataroom_folder_permission/";
  public create_dataroom_folder_only_permission: string =
    "/create_dataroom_folder_only_permission/";
  public count_page: string = "/count_page/";

  public get_all_not_viewed_files: string = "/get_all_not_viewed_files/";
  public get_all_not_printed_files: string = "/get_all_not_printed_files/";
  public get_all_not_downloaded: string = "/get_all_not_downloaded/";
  public get_files_updated: string = "/get_files_updated/";
  public download_files: string = "/download_files_web/";
  public bulk_download: string = "/bulk_download/";
  public bulk_downloadtwo: string = "/bulk_downloadtwo_web/";
  public folders_hierarchy: string = "/folders_hierarchy/";
  public get_all_upload_status_documents: string =
    "/get_all_upload_status_documents/";
  public recent_document: string = "/recent_document/";
  public categories_list: string = "/categories_list/";
  public delete_category: string = "/delete_category/";
  public dataroom_user_list: string = "/dataroom_user_list/";
  public dataroom_mem_list: string = "/dataroom_mem_list/";
  public new_update: string = "/new_update/";
  public download_dataroom_index_report: string = "/download_dataroom_index_report/";
  public bulkdownloadstatuscreateindex: string = "/bulkdownloadstatuscreateindex/";
  public get_groups: string = "/get_groups/";
  public get_user_groups: string = "/get_user_groups/";
  public get_user_dataroom_last_view: string = "/get_user_dataroom_last_view/";
  public get_users_status: string = "/get_users_status/";
  public activity_by_date: string = "/activity_by_date/";
  public get_index_report: string = "/get_index_report/";

  public get_all_files_viewed: string = "/get_all_files_viewed/";
  public get_all_files_printed: string = "/get_all_files_printed/";
  public get_all_files_download: string = "/get_all_files_download/";

  public get_dataroom_viewed: string = "/get_dataroom_viewed/";
  public get_barchart_dataroom_viewed: string =
    "/get_barchart_dataroom_viewed/";
  public qna_view: string = "/qna_view/";
  public qa_view: string = "/qa_view/";
  public qna_view_detail: string = "/qna_view_detail/";
  public get_reqply_list: string = "/get_reqply_list/";
  public accept_question: string = "/accept_question/";
  public get_recent_updates: string = "/get_recent_updates/";
  public get_single_member: string = "/get_single_member/";
  public copy_file: string = "/copy_file/";
  public move_file: string = "/move_file/";
  public get_folders: string = "/get_folders/";
  public get_detaroom_all_users: string = "/get_detaroom_all_users/";
  public restore_folders_files: string = "/restore_folders_files/";
  public bulk_permanant_delete_folder: string = "/bulk_permanant_delete_folder/";
  public ShowDeletedFilesold: string = '/ShowDeletedFilesold/';
  public restore_folders_check: string = '/restore_folders_check/';
  public delete_dataroom_all_admins: string = "/delete_dataroom_all_admins/";
  public delete_dataroom_admin_type: string = "/delete_dataroom_admin_type/";
  public dataroom_group_list: string = "/dataroom_group_list/";
  public clone_dataroom: string = "/clone_dataroom/";
  public dataroom_folder: string = "/dataroom_folder/";
  public check_admin: string = "/check_admin/";
  public check_la_user: string = "/check_la_user/";
  public check_admin_user: string = "/check_admin_user/";
  public get_end_user_groups: string = "/get_end_user_groups/";
  public add_dataroom_primary_contact: string =
    "/add_dataroom_primary_contact/";
  public get_dataroon_contact: string = "/get_dataroon_contact/";
  public send_message: string = "/send_message/";
  public get_dataroom_message: string = "/get_dataroom_message/";
  public time_zones_list: string = "/time_zones_list/";
  public chat_message_list: string = "/chat_message_list/";
  public get_dataroom_notification: string = "/get_dataroom_notification/";
  public get_dataroom_notification_count: string =
    "/get_dataroom_notification_count/";
  public get_all_notification: string = "/get_all_notification/";
  public bulkupload_files_check: string = "/bulkupload_files_check/";
  public manage_category: string = "/manage_category/";
  public send_question: string = "/send_question/";
  public reg_question: string = "/reg_question/";
  public watermark_settings: string = "/watermark_settings/";
  public update_watermark_settings: string = "/update_watermark_settings/";
  public get_all_primary_users: string = "/get_all_primary_users/";
  public change_disclaimer_status: string = "/change_disclaimer_status/";
  public export_activity_by_date: string = "/export_activity_by_date/";
  public dataroom_disclaimer_api: string = "/dataroom_disclaimer_api/";
  public multiple_diclaimer_overview: string = "/multiple_diclaimer_overview/";
  public get_dataroom_disclaimer: string = "/get_dataroom_disclaimer/";
  public check_2fa_permission: string = "/check_2fa_permission/";
  public export_files_downloaded: string = "/export_files_downloaded/";
  public qna_report: string = "/qna_report/";
  public dataroom_enduser_submitter: string = "/dataroom_enduser_submitter/";
  public export_qna: string = "/export_qna/";
  public export_users_status: string = "/export_users_status/";
  public activity_by_date_report: string = "/activity_by_date_report/";
  public export_activity_by_date_report: string =
    "/export_activity_by_date_report/";
  public export_users_groups: string = "/export_users_groups/";
  public archive_dataroom: string = "/archive_dataroom/";
  public get_all_folders: string = "/get_all_folders/";
  public get_all_activity_documents: string = "/get_all_activity_documents/";
  public user_by_email: string = "/user_by_email/";
  public all_groups: string = "/all_groups/";
  public move_selected_files: string = "/move_selected_files/";
  public copy_selected_files: string = "/copy_selected_files/";
  public export_overview_report: string = "/export_overview_report/";
  //public folders_hierarchy_permission: string = "/tree_view_permission/";
  public folders_hierarchy_permission: string =
    "/folders_hierarchy_permission/";
  public folders_hierarchy_permissionnew: string = "/folders_hierarchy_permissionnew/";
  public user_activity: string = "/user_activity/";
  public allbulkupload: string = "/allbulkupload/";
  public dataroom_activity: string = "/dataroom_activity/";
  public index_report_user_wise: string = "/index_report_user_wise/";
  public get_dataroom_members: string = "/get_dataroom_members/";
  public get_files_list: string = "/get_files_list/";
  public get_update_list: string = "/get_update_list/";
  public files_activity: string = "/files_activity/";
  public user_profile_dataroom: string = "/user_profile_dataroom/";
  public contact_support_trial: string = "/contact_support_trial/";
  public send_document_update: string = "/send_document_update/";
  public get_search_folder_files: string = "/get_search_folder_files/";
  public qna_analytics: string = "/qna_analytics/";
  public qna_filter_view: string = "/qna_filter_view/";
  public search_auto_complete_user: string = "/search_auto_complete_user/";
  public send_message_to_user: string = "/send_message_to_user/";
  public user_qna_details: string = "/user_qna_details/";
  public voting: string = "/voting/";
  public voter_group: string = "/voter_group/";
  public make_vote: string = "/make_vote/";
  public Create_question: string = "/Create_question/";
  public vote_count_analysis: string = "/vote_count_analysis/";
  public vote_result: string = "/vote_result/";
  public export_voter_status: string = "/export_voter_status/";
  public export_vote: string = "/export_vote/";
  public add_voter: string = "/add_voter/";
  public voter_group_member: string = "/voter_group_member/";
  public del_group_member: string = "/del_group_member/";
  public folders_tree: string = "/folders_tree/";
  public short_cut_icon: string = "/short_cut_icon/";
  public subscribe_plans: string = "/plan-staus/";
  public subscribe_plan: string = "/user/plans/";
  public plan_subscribe: string = "/plan_subscription/";
  public subscribe_plan_status: string = "/plan-staus";
  public add_on: string = "/addons";
  public addAddOn: string = "/update_adon/";
  public buyDataDVD: string = "/addon_dvd_post/"
  public cancelonaddon: string = "/canceluserplan/"
  public cancelonaddonexpired: string = "/userplan_stopat_monthend/"
  public reactivationplanlink: string = "/reactivate_user_plan/"
  public notificationStatus: string = "/notification-status/"
  public set_2fa_permission: string = "/set_2fa_permission/"
  public bulUploadStatus: string = "/uploadstatus_id/"
  public uploadStatusResponse: string = "/bulkupload_response/"
  public invoiceHistory: string = "/invoice_history/"
  public dvdInvoiceHistory: string = "/invoice_history/addon/"
  public exportInvoice: string = "/export_invoice/"
  public exportAddOnDvdInvoice: string = "/exportaddondvd_invoice/"
  public exportAddOnStorageInvoice: string = "/exportaddon_invoice/"
  public paymentOverdue: string = "/payment_overdue/"
  public subscribeAddOn: string = "/addons/add";
  public userplandetails: string = "/userplandetails/";
  public addons_detail: string = "/addon_get/"
  public currentplandetail: string = "/currentplandetail/"
  public exportuseractivity: string = "/export_user_activity/"
  public create_dataroom_folder_permission_for_time: string = "/create_dataroom_folder_permission_for_time/"
  public upload_end_user_timer_check: string = "/upload_end_user_timer_check/"
}
