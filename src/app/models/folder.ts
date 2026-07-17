export class Folder {
	id:any;
	data : any;
	parent_folder_id:any;
	is_no_access : boolean = false; 
    is_view_only : boolean = false;//new FormControl('', []), 
    is_view_and_print : boolean = false;//new FormControl('', []), 
    is_view_and_print_download : boolean = false;//new FormControl('', []), 
    is_upload : boolean = false;//new FormControl('', []), 
    is_watermark : boolean = false;//new FormControl('', []), 
    is_drm : boolean = false;//new FormControl('', []), 
    is_editor : boolean = false;//new FormControl('', []) 
}
