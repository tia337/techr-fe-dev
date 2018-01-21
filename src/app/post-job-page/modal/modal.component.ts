import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: [ './modal.component.scss' ]
})

export class ModalComponent implements OnInit {

  constructor (private _elementRef: ElementRef, private _renderer: Renderer2) {}

  private currentModal: ElementRef;

  @Output('onLoad') loadModal: EventEmitter<any> = new EventEmitter();
  @Output('onClose') closeModal: EventEmitter<any> = new EventEmitter();

  hideModal(): void {
    this.closeModal.emit();
    this._renderer.addClass(this.currentModal, 'hidden');
  }

  showModal(): void {
    this.loadModal.emit();
    this._renderer.removeClass(this.currentModal, 'hidden');

  }

  ngOnInit() {
    // this._renderer.appendChild(document.body, this._elementRef.nativeElement);
    this.currentModal = this._elementRef.nativeElement.querySelector('div.modal-back-screen');
  }

}
