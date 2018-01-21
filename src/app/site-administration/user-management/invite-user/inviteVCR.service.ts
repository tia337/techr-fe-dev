import { Injectable, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ViewRef } from '@angular/core';
import 'rxjs/Observable';

@Injectable()
export class InviteVCR {

	private vcr: ViewContainerRef;
	private _forms: Array<any> = [];

	constructor(private cfr: ComponentFactoryResolver) {}

	setVCR(vcr) {
		this.vcr = vcr;
	}

	createComponent(component: any): any {
		const compRef = this.vcr.createComponent(this.cfr.resolveComponentFactory(component));
		this._forms.push(compRef.instance);
		console.log(this._forms);
		return compRef;
	}

	removeComponent(index: number, instance: any) {
		this.vcr.remove(index);
		this._forms.splice(this._forms.indexOf(instance));
		instance = null;
		console.log(this._forms);
		console.log(instance);
	}

	getIndex(viewRef: ViewRef): number {
		return this.vcr.indexOf(viewRef);
	}

	move(viewRef: ViewRef, currentIndex: number) {
		return this.vcr.move(viewRef, currentIndex);
	}

	getViewRef(index: number) {
		return this.vcr.get(index);
	}

	length() {
		return this.vcr.length;
	}

	getForms() {
		return Promise.resolve(this._forms);
	}

	set forms(value) {
		this._forms = value;
	}


}
