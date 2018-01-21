import {
  Component, OnInit,
  Renderer2,
  ViewChild,
  Input, OnDestroy,
} from '@angular/core';

import { Global } from '../../shared/global';

import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';
import { JobDetailsService } from '../job-details.service';

@Component({
  selector: 'app-social-media-share',
  templateUrl: './social-media-share.component.html',
  styleUrls: ['./social-media-share.component.scss']
})
export class SocialMediaShareComponent implements OnInit, OnDestroy {

  contract: any;

  @ViewChild('twitterButton') twitterButton;
  @ViewChild('linkedinButton') linkedinButton;



  constructor(
    private _renderer: Renderer2,
    private _fbService: FacebookService,
    private _jobDetailsService: JobDetailsService
  ) {
    let initParams: InitParams = {
      appId: '1072188206248025',
      xfbml: true,
      version: 'v2.9'
    };

    _fbService.init(initParams);
   }

  ngOnInit() {
    this.contract = this._jobDetailsService.contract;
  }

  shareWithLinkedin() {
    console.log("test");
    let summary = "Check out new job offer";
    let title = "SwipeIn";
    let url = "https://www.swipein.co.uk/";
    console.log(this._renderer);
    console.log(this.linkedinButton.nativeElement);
    this._renderer.setAttribute(this.linkedinButton.nativeElement, 'href',
      'https://www.linkedin.com/shareArticle?mini=true&url='+url+'&title='+title+'&summary='+summary+'&source=SwipeIn');
      console.log("test1");
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

  ngOnDestroy() {
    this._jobDetailsService = null;
  }

}
