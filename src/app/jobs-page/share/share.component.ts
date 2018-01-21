import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Renderer2 } from '@angular/core';
// import { ShareService } from './share.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';


import { Global } from '../../shared/global';

@Component({
  selector: 'sn-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
  // providers: [ ShareService ]
})
export class ShareComponent implements OnInit, OnDestroy {

  contract: any;

  shareMessage: FormGroup;

  @ViewChild('twitterButton') twitterButton;
  @ViewChild('linkedinButton') linkedinButton;

  constructor (
    private _formBuilder: FormBuilder,
    // private _shareService: ShareService,
    // private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _fbService: FacebookService
  ) {
    let initParams: InitParams = {
      appId: '1072188206248025',
      xfbml: true,
      version: 'v2.9'
    };

    _fbService.init(initParams);
  }

  ngOnDestroy() {
    console.log("share component destroy");
  }

  ngOnInit() {
    console.log("share component init");

    // this.shareMessage = this._formBuilder.group({
    //  title: this.contract.title,
    //  comment: 'Check out new position '+this.contract.title,
    //  // content: 'testing message',

       
    // });

  }


  shareWithLinkedin() {

    let summary = "Check out new job offer";
    let title = "SwipeIn";
    let url = "https://www.swipein.co.uk/";
    this._renderer.setAttribute(this.linkedinButton.nativeElement, 'href',
      'https://www.linkedin.com/shareArticle?mini=true&url='+url+'&title='+title+'&summary='+summary+'&source=SwipeIn');

  }

  shareWithFacebook() {
    console.log(this.contract);
    console.log("Shared with facebook "+this.contract.id);
    if(this.contract) {
      let params: UIParams = {
        method: 'share',
        href: 'https://www.swipein.co.uk/'
      };

      this._fbService.ui(params)
        .then(() => alert('Job successfully shared!'))
        .catch((e: any) => console.error(e));
    }
  }

  shareWithTwitter() {
    let text = "Check out new job offer: ";
    let url = "https://www.swipein.co.uk/";
    this._renderer.setAttribute(this.twitterButton.nativeElement, 'href',
      'https://twitter.com/intent/tweet?text='+text+'&url='+url);

    // Global.getGlobal().twttr.ready((twttr) => {
    //   twttr.events.bind('tweet', (event) => {
    //       alert('Job successfully shared!');
    //   });
    // });
  }

}
