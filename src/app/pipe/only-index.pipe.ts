import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onlyIndex'
})
export class OnlyIndexPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let splitString = value.split(" ");
    let index = splitString['0']
    return index;
  }

}
