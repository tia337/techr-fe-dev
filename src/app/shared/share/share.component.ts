import {
  Component,
  ElementRef,
  ViewChild,
  Renderer2,
  Directive,
  OnInit,
  ViewContainerRef,
  Input,
  ComponentFactoryResolver,
  HostListener,
  AfterViewInit
} from '@angular/core';
import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';


@Directive({
  selector: '[share]'
})
export class ShareDirective {

  @Input('share') url: string;

  constructor(public viewContainerRef: ViewContainerRef, private _cfr: ComponentFactoryResolver) {}

  @HostListener('click') onClick() {
    console.log('test');
    this.viewContainerRef.createComponent(this._cfr.resolveComponentFactory(ShareComponent)).instance;
  }
}


@Component({
  selector: 'share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  // @Input() url: string;

  @ViewChild('twitterButton') twitterButton;
  @ViewChild('linkedinButton') linkedinButton;

  @ViewChild(ShareDirective) overlay: ShareDirective;

  constructor (
    private _renderer: Renderer2,
    private _fbService: FacebookService,
    private _elRef: ElementRef
  ) {
    let initParams: InitParams = {
      appId: '1072188206248025',
      xfbml: true,
      version: 'v2.9'
    };

    _fbService.init(initParams);


  }

  ngOnInit() {
    this._renderer.appendChild(document.body, this._elRef.nativeElement);
  }


  shareWithLinkedin() {

    let summary = "Check out new job offer";
    let title = "SwipeIn";
    let url = "https://www.swipein.co.uk/";
    this._renderer.setAttribute(this.linkedinButton.nativeElement, 'href',
      'https://www.linkedin.com/shareArticle?mini=true&url='+url+'&title='+title+'&summary='+summary+'&source=SwipeIn');

  }

  shareWithFacebook() {
    // console.log("Shared with facebook "+this.contract.id);
    // if(this.contract) {
      let params: UIParams = {
        method: 'share',
        href: 'https://www.swipein.co.uk/'
      };

      this._fbService.ui(params);
        // .then(() => alert('Job successfully shared!'))
        // .catch((e: any) => console.error(e));
    // }
  }

  shareWithTwitter() {
    let text = "Check out new job offer: ";
    let url = "https://www.swipein.co.uk/";
    this._renderer.setAttribute(this.twitterButton.nativeElement, 'href',
      'https://twitter.com/intent/tweet?text='+text+'&url='+url);
  }

  destroyShareModal() {
    console.log(this.overlay);
    //this.overlay.viewContainerRef.clear();
    this._renderer.removeChild(document.body, this._elRef.nativeElement);
  }

}
