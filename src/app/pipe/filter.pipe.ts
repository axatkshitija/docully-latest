import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "dataroomFilter"
})

export class DataroomFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
        	debugger
            return _.filter(array, row=>row.dataroom_name.toLowerCase().indexOf(query.toLowerCase()) > -1);
        }
        return array;
    }
}


