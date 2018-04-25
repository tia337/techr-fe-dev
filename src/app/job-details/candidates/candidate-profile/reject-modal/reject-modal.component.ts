import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reject-modal',
  templateUrl: './reject-modal.component.html',
  styleUrls: ['./reject-modal.component.scss']
})
export class RejectModalComponent implements OnInit {

  private _candidate;
	private _icon: string;

  constructor() { }

  ngOnInit() {
  }

  set icon(value: string) {
		this._icon = value;
  }
  
  get icon() {
		return this._icon;
	}
  
  get setCandidate () {
    return this._candidate;
  }

}
