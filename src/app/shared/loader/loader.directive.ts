import { Directive, Input, ElementRef, OnInit, Renderer2, OnChanges, SimpleChange, OnDestroy } from '@angular/core';

@Directive({
  selector: '[loader]'
})
export class LoaderDirective implements OnInit, OnChanges, OnDestroy {

  @Input('loader') isLoaderActive: boolean;
  private spinner;
  private overlay;

  constructor(private _elRef: ElementRef, private _renderer: Renderer2) { }

  ngOnInit() {
    this._elRef.nativeElement.style.position = 'relative';

    this.spinner = this._renderer.createElement('img');
    this._renderer.setAttribute(this.spinner, 'src', '../../../assets/img/loader.gif');
    this._renderer.setStyle(this.spinner, 'width', '50px');
    this._renderer.setStyle(this.spinner, 'height', '50px');

    this.overlay = this._renderer.createElement('div');
    this._renderer.setStyle(this.overlay, 'position', 'sticky');
    this._renderer.setStyle(this.overlay, 'display', 'flex');
    this._renderer.setStyle(this.overlay, 'justify-content', 'center');
    this._renderer.setStyle(this.overlay, 'align-items', 'center');
    this._renderer.setStyle(this.overlay, 'top', '0');
    this._renderer.setStyle(this.overlay, 'right', '0');
    this._renderer.setStyle(this.overlay, 'bottom', '0');
    this._renderer.setStyle(this.overlay, 'left', '0');
    this._renderer.setStyle(this.overlay, 'height', '100%');
    this._renderer.setStyle(this.overlay, 'background-color', 'rgba(0, 0, 0, 0.6)');
  }

  ngOnChanges(changes) {
    const overlay = this._renderer.createElement('div');
    this._renderer.setStyle(overlay, 'position', 'absolute');
    this._renderer.setStyle(overlay, 'top', '0');
    this._renderer.setStyle(overlay, 'right', '0');
    this._renderer.setStyle(overlay, 'bottom', '0');
    this._renderer.setStyle(overlay, 'left', '0');
    // this._renderer.setStyle(overlay, 'width', '100%');
    this._renderer.setStyle(overlay, 'height', '100%');
    this._renderer.setStyle(overlay, 'z-index', '99999');
    this._renderer.setStyle(overlay, 'background-color', 'rgba(0, 0, 0, 0.6)');

    if (changes.isLoaderActive.currentValue) {
      this._renderer.setStyle(this._elRef.nativeElement, 'overflow', 'hidden');
      // console.log('AAAAAAABBBBBBB');
      this._renderer.appendChild(this._elRef.nativeElement, overlay);
    } else {
      this._renderer.removeStyle(this._elRef.nativeElement, 'overflow');
      this._renderer.removeChild(this._elRef.nativeElement, overlay);

    if (this.overlay && this.spinner) {
      if (changes.isLoaderActive.currentValue) {
        this._renderer.setStyle(this._elRef.nativeElement, 'overflow', 'hidden');
        this._renderer.appendChild(this.overlay, this.spinner);
        this._renderer.appendChild(this._elRef.nativeElement, this.overlay);
      } else {
        this._renderer.removeStyle(this._elRef.nativeElement, 'overflow');
        this._renderer.removeChild(this._elRef.nativeElement, this.overlay);
        this._renderer.removeChild(this.overlay, this.spinner);
      }
    }
  }
  }

  ngOnDestroy() {
    delete this.overlay;
    delete this.spinner;
    delete this._elRef;
    delete this._renderer;
  }

}
