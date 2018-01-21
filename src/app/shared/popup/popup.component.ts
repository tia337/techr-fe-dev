import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  constructor(private _renderer: Renderer2, private _elRef: ElementRef) { }

  ngOnInit() {
    // this._renderer.appendChild(document.body, this._elRef.nativeElement);
  }

  open() {
    this._renderer.appendChild(document.body, this._elRef.nativeElement);
  }

  close() {
    
  }

}
