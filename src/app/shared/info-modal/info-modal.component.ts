import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { IInfoOptions } from './info-modal.interface';

@Component({
  selector: 'info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent implements OnInit, AfterViewInit {

  public options: IInfoOptions;
  private offsetX: number;
  private offsetY: number;
  private modalHeight;
  @ViewChild('modal') modal: ElementRef;

  constructor(private _renderer: Renderer2, private _host: ElementRef) { }

  ngOnInit() {
    this._renderer.appendChild(document.body, this._host.nativeElement);
  }

  ngAfterViewInit() {
    this.modalHeight = this.modal.nativeElement.offsetHeight;
    this._host.nativeElement.style.left = (this.offsetX - 50) + 'px';
    this._host.nativeElement.style.top = (this.offsetY - this.modalHeight + 35) +'px';
  }

  public setOffset(x: number, y: number) {
    this.offsetX = x;
    this.offsetY = y;
  }

}
