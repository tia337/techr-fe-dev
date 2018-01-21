import { Parse } from './../../../../parse.service';
import {Component, OnInit, Input, OnChanges, OnDestroy} from '@angular/core';
import { BrowserModule ,DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {CandidatesService} from "../../candidates.service";


@Component({
  selector: 'candidate-cv',
  templateUrl: './candidate-cv.component.html',
  styleUrls: ['./candidate-cv.component.scss']
})
export class CandidateCvComponent implements OnInit, OnDestroy {

  // private _userId: string;
  // @Input('userId') private _userId: string;

  pdfSrc:string;
  pageurl: SafeResourceUrl;
  private _userIdSubscriprion;

  constructor(private _parse: Parse,private domSanitizer: DomSanitizer, private _candidatesService: CandidatesService) {

  }

  ngOnInit() {
    this._userIdSubscriprion = this._candidatesService.userId.subscribe(userId => {
      this.pdfSrc = '';
      this.pageurl = '';
      const query = this._parse.Query('User');
      query.include('developer.documentCV');
      query.get(userId);
      query.first().then(user => {
        if (user.get('developer').get('documentCV'))
          this.pdfSrc = (user.get('developer').get('documentCV').get('documentFile')._url);
        else
          this.pdfSrc = 'nodata';
      }).then(() => {
        if (this.pdfSrc == 'nodata')
          this.pageurl = false;
        else
          this.pageurl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
        console.log('this is our url:');
        console.log(this.pageurl);
      });
    });
  }

  ngOnDestroy() {
    this._userIdSubscriprion.unsubscribe();
  }


}
