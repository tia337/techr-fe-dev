import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { RootVCRService } from "app/root_vcr.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
  selector: 'app-modal1',
  templateUrl: './modal1.component.html',
  styleUrls: ['./modal1.component.scss']
})
export class Modal1Component implements OnInit {

  countries: any[] = [];
  selectedCoun: any[];
  countriesFilter;

  @Output('onClose') closeModal: EventEmitter<any> = new EventEmitter();
  selectedCountries: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(this.selectedCoun);

  constructor(private _root_vcr: RootVCRService, private _changesDetector: ChangeDetectorRef) { }

  ngOnInit() {
    
  }

  close(){
    this.closeModal.emit();
  }

  test(){
    console.log(this.countries);
  }

  updateFilter(value) {
		this.countriesFilter = value;
	}

}
