import {Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { RootVCRService } from '../../root_vcr.service';

@Component({
	selector: 'alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, AfterViewInit, OnDestroy {

	private _title: string;
	private _content: string;
	private _buttons: Array<IAlertButton> = [];
	private _icon: string;
	private _type: 'congrats' | 'sad' | 'simple';
	private _contentAlign: string;
	private _onDestroy: Function;

	private _width: number;

	loaderActive: any[] = [];

	@ViewChild('content') contentBlock: ElementRef;


	constructor(private _root_vcr: RootVCRService, private _changesDetector: ChangeDetectorRef) { }

	ngOnInit() {
		// this.contentBlock.nativeElement.innerHTML = this._content;
	}

	ngAfterViewInit() {
		this.contentBlock.nativeElement.innerHTML = this._content;
	}

	set title(value: string) {
		this._title = value;
		this._changesDetector.detectChanges();
	}

	set icon(value: string) {
		this._icon = value;
	}

	set type(value: 'congrats' | 'sad' | 'simple') {
		this._type = value;
	}

	set content(value: string) {
		this._content = value;
	}

	set contentAlign(value: string) {
		this._contentAlign = value;
	}

	set width(value: number) {
		this._width = value;
	}

	set onDestroy(func: Function) {
		this._onDestroy = func;
	}

	// addLine(value: string) {
	//   this._content = value;
	//   // this._changesDetector.detectChanges();
	// }

	get buttons() {
		return this._buttons;
	}

	get type() {
		return this._type;
	}

	get title() {
		return this._title;
	}

	get contentAlign() {
		return this._contentAlign;
	}

	// get content() {
	//   return this._content;
	// }

	get icon() {
		return this._icon;
	}

	get width() {
		return this._width;
	}

	addButton(button: IAlertButton) {
		// console.log(button);
		this._buttons.push(button);
	}

	close() {
		this._root_vcr.clear();
	}

	activateLoader(index, loaderBool){
		console.log(loaderBool);
		console.log(index);
		if(loaderBool == true){
			this.loaderActive.push(index);
		}
		
	}

	// execute(function: any) {
	//
	// }

	ngOnDestroy() {
		if (this._onDestroy) {
			this._onDestroy();
		}
	}
	destroy() {
		this._root_vcr.clear();
	}
}

interface IAlertButton {
	title: string;
	loader?: boolean;
	onClick: Function;
	type: 'primary' | 'secondary' | 'warn';
}
