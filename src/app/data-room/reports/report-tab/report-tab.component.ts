import { Component, OnInit } from '@angular/core';
import { DataRoomService } from 'src/app/services';

@Component({
  selector: 'app-report-tab',
  templateUrl: './report-tab.component.html',
  styleUrls: ['./report-tab.component.css']
})
export class ReportTabComponent implements OnInit {

  currentDataroomId: any;
  constructor(
    private dataRoomService: DataRoomService,

  ) { }

  ngOnInit() {
    this.currentDataroomId = localStorage.getItem("currentDataroomId");
    this.getFeatures(this.currentDataroomId);
  }

  features: any;
  getFeatures(dataroomId) {
    this.dataRoomService.get_dataroom_features(dataroomId).subscribe((res) => {
      if (res[0] === undefined) {
        this.features = {
          auto_expire:true,
          bulk_users_upload:true,
          country_perm:true,
          custom_external_link:true,
          custom_logo:true,
          custom_watermarking:true,
          desktop_unlimit_upload:true,
          doculink_perm:true,
          dropbox_upload:true,
          email_to_dataroom_upload:true,
          favourites:true,
          google_drive_upload:true,
          id:2,
          la_admin_access:true,
          module_perm:true,
          one_drive_upload:true,
          proj_management:true,
          proj_overview:true,
          proj_updates:true,
          proj_video_intro:true,
          qa_submit:true,
          qa_with_cat:true,
          redaction:true,
          sharepoint_upload:true,
          two_factor_auth:true,
          voting_perm:true,
          auto_logout: true,
          co_current_logins: true,
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

}
