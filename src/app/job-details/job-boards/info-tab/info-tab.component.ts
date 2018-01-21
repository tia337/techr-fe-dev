import { Component, HostListener, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { RootVCRService } from '../../../root_vcr.service';

@Component({
	selector: 'app-info-tab',
	templateUrl: './info-tab.component.html',
	styleUrls: ['./info-tab.component.scss']
})


export class InfoTabComponent implements OnInit {

	@HostListener('window:scroll', ['$event'])
	onScroll(event) {
		console.log(event);
		// this.close();
	}

	@ViewChild('modal') modal: ElementRef;

	private _imgUrl;
	private _website;
	private _description;
	private _target;

	constructor(
		private _renderer: Renderer2,
		private _root_vcr: RootVCRService,
		private _host: ElementRef
	) { }

	ngOnInit() {

	}

	createInfoTab(offsetX, offsetY, modalHeight) {
		this._renderer.appendChild(document.body, this._host.nativeElement);
		this._host.nativeElement.style.left = (offsetX - 50) + 'px';
		this._host.nativeElement.style.top = (offsetY - modalHeight + 35) + 'px';
	}

	set imgUrl(value: string) {
		console.log(value);
		this._imgUrl = value;
	}

	set website(value: string) {
		this._website = value;
	}

	set description(value: string) {
		this._description = value;
	}

	set target(value: string) {
		this._target = value;
	}
	close(){
		console.log('clos');
		this._root_vcr.clear();
	}

	get imgUrl() {
		return this._imgUrl;
	}

}
