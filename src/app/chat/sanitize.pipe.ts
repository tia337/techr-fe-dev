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
    if (content.indexOf('id=') > -1) {
      console.log(content);
      const start = content.indexOf('id=') + 4;
      const finish = content.indexOf('id=') + 14;
      const id = content.slice(start, finish);
      setTimeout(()=> {
        const element = document.getElementById(id);
        element.addEventListener('click', () => {
          this._router.navigate(['/jobs', id]);
        });
      },1)
    };
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

}
