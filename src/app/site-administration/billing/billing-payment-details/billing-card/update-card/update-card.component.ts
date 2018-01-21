import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { RootVCRService } from '../../../../../root_vcr.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateCardService } from './update-card.service';


@Component({
  selector: 'app-update-card',
  templateUrl: './update-card.component.html',
  styleUrls: ['./update-card.component.scss']
})
export class UpdateCardComponent implements OnInit, OnDestroy {

  private _card;
  updateCardForm: FormGroup;
  private _updateCardEvent: EventEmitter<any>;


  constructor(private _root_vcr: RootVCRService, private _updateCardService: UpdateCardService, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.updateCardForm = this._formBuilder.group({
      name: this._card.name,
      exp_month: [this._card.exp_month, Validators.maxLength(2)],
      exp_year: [this._card.exp_year, Validators.maxLength(4)],
      address_zip: this._card.address_zip,
      address_country: this._card.address_country,
      address_city: this._card.address_city,
      address_state: this._card.address_state,
      address_line1: this._card.address_line1,
      address_line2: this._card.address_line2
    });
  }

  set card(card: any) {
    this._card = card;
  }

  get card() {
    return this._card;
  }

  set updateCardEvent(event: EventEmitter<any>) {
    this._updateCardEvent = event;
  }

  close() {
    this._root_vcr.clear();
  }

  updateCard() {
    this._updateCardService.updateCard(this._card.id, this.updateCardForm.value).then(() => {
      this._updateCardEvent.emit();
      this._root_vcr.clear();
    });
  }

  ngOnDestroy() {
    // this._updateCardEvent.emit();
  }

}
