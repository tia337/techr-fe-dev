import { Component, OnInit } from '@angular/core';
// tslint:disable:indent
@Component({
  selector: 'modal',
  templateUrl: './reject-modal.component.html',
  styleUrls: ['./reject-modal.component.scss']
})
export class RejectModalComponent implements OnInit {

  public candidate;

  constructor() { }

  ngOnInit() {
  }

  set setCandidate (candidate) {
    this.candidate = candidate;
    console.log(this.candidate);
  }

  get setCandidate () {
    return this.candidate;
  }

}


