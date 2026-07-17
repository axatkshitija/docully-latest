import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "folderSearch"
})

export class FolderSearchFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
        	
            return _.filter(array, row=>(row.title.toLowerCase().indexOf(query.toLowerCase()) > -1));
        }
        return array;
    }
}