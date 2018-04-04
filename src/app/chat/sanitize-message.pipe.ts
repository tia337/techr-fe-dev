import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';



@Pipe({
  name: 'sanitizeMessage'
})
export class SanitizeMessagePipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {}

  transform(content) {
    const value = new FormControl;
    value.setValue(decodeURIComponent(content));
    return value;
  }

}
