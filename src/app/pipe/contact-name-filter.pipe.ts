import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "contactNameFilter"
})

export class ContactNameFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row=>row.first_name.toLowerCase().indexOf(query.toLowerCase()) > -1);
        }
        return array;
    }
}