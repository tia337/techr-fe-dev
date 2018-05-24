import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(value: number): any {
    if (!value) {
      return null;
    };
    const megaBytes = value/1000000;
    return megaBytes.toFixed(1);
  }

}
