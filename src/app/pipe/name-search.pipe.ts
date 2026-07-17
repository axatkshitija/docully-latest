import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "nameSearch"
})

export class NameSearchFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row=>(row.user.first_name.toLowerCase().indexOf(query.toLowerCase()) > -1) || (row.user.last_name.toLowerCase().indexOf(query.toLowerCase()) > -1));
        }
        return array;
    }
}