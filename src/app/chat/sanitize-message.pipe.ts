import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';



@Pipe({
  name: 'sanitizeMessage'
})
export class SanitizeMessagePipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {}

  transform(value: any, args?: any): any {
    if (value.indexOf('id=') > -1) {
      console.log(value);
    }
    return value;
  }

}
