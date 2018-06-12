import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchJob'
})
export class SearchJobPipe implements PipeTransform {

  transform(value: Array<any>, args?: any): any {
    if (!args) {
      return value;
    };
    return value.filter(value => {
      const searchString = args.toLowerCase();
      const title = value.title.toLowerCase();
      return title.includes(searchString);
    });
  }

}
