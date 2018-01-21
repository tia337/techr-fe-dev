import { Injectable } from '@angular/core';
import { ViewContainerRef, ComponentFactoryResolver } from '@angular/core';


@Injectable()
export class RootVCRService {

	private _vcr: ViewContainerRef;

	constructor(private _cfr: ComponentFactoryResolver) {}

	setViewContainerRef(vcr: ViewContainerRef): void {
		this._vcr = vcr;
	}



	public clear() {
		this._vcr.clear();
	}

	public createComponent(component: any): any {
		return this._vcr.createComponent(this._cfr.resolveComponentFactory(component)).instance;
	}

	public remove(viewRef: any) {
		console.log(this._vcr.indexOf(viewRef));
	}

	// get length() {
	// 	return this._vcr.length;
	// }

}
