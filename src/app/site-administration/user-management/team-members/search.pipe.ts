import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';

@Pipe({
  name: 'SearchPipe',
  pure: false
})
export class SearchPipe implements PipeTransform {
  transform(data: any[], searchTerm: string, type: 'members' | 'invitations'): any[] {
    searchTerm = searchTerm.toLowerCase();

    if (type === 'members') {
      return data.filter(item => {
		let fullName;
		  if (item.get('firstName'))
		  {
			fullName = item.get('firstName') + item.get('lastName');
		  } else {
			fullName = item.get('Full_Name');
		  }
        if (fullName) {
          return fullName.toLowerCase().includes(searchTerm);
        }
        return false;
      });
    } else if (type === 'invitations') {
      return data.filter(item => {
        if (item.get('Full_Name')) {
          return item.get('Full_Name').toLowerCase().includes(searchTerm);
        }
        return false;
      });
    }
  }
}
