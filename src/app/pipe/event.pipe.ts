import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "eventSearch",
})
export class EventSearchFilterPipe implements PipeTransform {
  transform(array: any[], query: string): any {
    if (query) {
      return _.filter(
        array,
        (row) => row.folder__name.toLowerCase().indexOf(query.toLowerCase()) > -1
      );
    }
    return array;
  }
}
