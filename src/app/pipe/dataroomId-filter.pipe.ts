import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "dataroomIdFilter"
})

export class DataroomIdFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
        	
            return _.filter(array, row=>row.dataroom_id.toLowerCase().indexOf(query.toLowerCase()) > -1);
        }
        return array;
    }
}


