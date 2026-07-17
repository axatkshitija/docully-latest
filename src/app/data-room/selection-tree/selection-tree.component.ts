import { Component, OnInit } from "@angular/core";
import { DataRoomService, SharedService } from "../../services/index";
import { ITreeOptions, TreeNode } from "@bugsplat/angular-tree-component";
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-selection-tree",
  templateUrl: "./selection-tree.component.html",
  styleUrls: ["./selection-tree.component.css"],
})
export class SelectionTreeComponent implements OnInit {
  nodes: any[] = [];
  dataroomId: number;
  constructor(
    private dataRoomService: DataRoomService,
    private router: Router,
    private cookieService:CookieService,
  ) {
    this.dataroomId = parseInt(localStorage.getItem("currentDataroomId"));
  }

  ngOnInit() {
    this.getAllRootFolderTree();
    // this.getAllDataRooms();
  }
  getAllRootFolderTree() {
    this.dataRoomService.getFoldersTree(this.dataroomId, 0).subscribe((res) => {
      console.log("Tree nodes",res);
      this.nodes = res;
      
      if (this.nodes.length == 0) {
        this.nodes[0] = { ok: 1 };
      }
    });
  }
  // datarooms_indexing: any = { hide_file_indexing: "" };
  // getAllDataRooms() {
  //   this.dataRoomService.getAllDatarooms().subscribe((res) => {
  //     this.datarooms_indexing = res.data;
  //     this.datarooms_indexing = this.datarooms_indexing.filter(
  //       (res) => res.id == this.dataroomId
  //     );
  //     this.datarooms_indexing = this.datarooms_indexing[0].hide_file_indexing;
  //     console.log(this.datarooms_indexing, "this.datarooms_indexing[0]");
  //   });
  // }

  goToNextFolder(folder_id) {
    this.router.navigate(["/folder_detail", folder_id]);
  }

  options: ITreeOptions = {
    getChildren: this.getChildren.bind(this),
    useCheckbox: false,
  };

  children: any = [];
  getChildren(node: any) {
    this.getSubFolderElement(node.data.id);
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.children), 4000);
    });
  }

  getSubFolderElement(id) {
    this.dataRoomService
      .getFoldersTree(this.dataroomId, id)
      .subscribe((res) => {
        this.children = res;
        console.log("Sub folders", this.children);
      });
  }

  selected: any;
  checked: boolean = true;
  selectdvalue: any;
  var: any;
  folder1: any;
  select_destination(destination) {
    this.selected = destination;
    this.folder1 = destination;
  }
}
