import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clearString'
})
export class ClearStringPipe implements PipeTransform {

  transform(value: any): any {
    let newValue;
    newValue = value.slice(value.indexOf('$') + 1);
    return newValue;
  }

}
