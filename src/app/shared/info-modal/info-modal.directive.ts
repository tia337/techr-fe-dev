import {
  Directive,
  ViewContainerRef,
  Input,
  AfterViewInit,
  ComponentFactoryResolver,
  HostListener
} from '@angular/core';
import { InfoModalComponent } from './info-modal.component';
import { IInfoOptions } from './info-modal.interface';

@Directive({
  selector: '[info]'
})
export class InfoDirective implements AfterViewInit {

  @Input('info') modalOptions: IInfoOptions;

  private offsetX: number;
  private offsetY: number;

  private opened: boolean = false;

  constructor(private _vcr: ViewContainerRef, private _cfr: ComponentFactoryResolver) { }

  ngAfterViewInit() {
    const hostElement = this._vcr.element.nativeElement;
    this.offsetX = hostElement.offsetLeft + (hostElement.clientWidth / 2);
    this.offsetY = hostElement.offsetTop;

    console.log(this.offsetX, this.offsetY);


    // this.offsetX = hostElement.offsetLeft - window.scrollX;
    // this.offsetY = hostElement.offsetTop - window.scrollY;



  }

  @HostListener('click') onClick() {
    if(!this.opened) {
      let modal = this._vcr.createComponent(this._cfr.resolveComponentFactory(InfoModalComponent)).instance;
      // console.log(this._vcr);
      // let modal = this._vcr.createComponent(this._cfr.resolveComponentFactory(InfoModalComponent)).instance;
      modal.options = this.modalOptions;
      modal.setOffset(this.offsetX, this.offsetY);
      this.opened = true;
    }
  }

  @HostListener('mouseleave') mouseLeave() {
    if(this.opened) {
      this._vcr.clear();
      this.opened = false;
    }
  }

}
