import { Component, ViewContainerRef } from '@angular/core';
import { RootVCRService } from './root_vcr.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	constructor(private _root_vcr: RootVCRService, private _vcr: ViewContainerRef ) {
		this._root_vcr.setViewContainerRef(this._vcr);
	}

}
