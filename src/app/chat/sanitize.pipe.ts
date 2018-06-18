import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
//tslint:disable
@Pipe({
  name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer,
    private _router: Router  
  ) {
  }
  transform(content) {
    if (content === undefined) return;
    if (content.indexOf('class="job-link') > -1) {
      const start = content.indexOf('class="job-link ') + 16;
      const finish = content.indexOf('class="job-link ') + 26;
      const id = content.slice(start, finish);
      setTimeout(()=> {
        const array = document.getElementsByClassName(id);
        for (let i = 0; i < array.length; i++) {
          array[i].addEventListener('click', (event)=> {
              event.preventDefault();
              this._router.navigate(['/jobs', id])
            })
        }
      }, 1);
    };
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

}
