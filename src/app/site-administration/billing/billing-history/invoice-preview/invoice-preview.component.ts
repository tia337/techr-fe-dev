import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RootVCRService } from '../../../../root_vcr.service';

import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

@Component({
	selector: 'app-invoice-preview',
	templateUrl: './invoice-preview.component.html',
	styleUrls: ['./invoice-preview.component.scss']
})
export class InvoicePreviewComponent implements OnInit {

	private _invoice: any;

	@ViewChild('receipt') receipt: ElementRef;

	constructor(private _root_vcr: RootVCRService) { }

	ngOnInit() {
		console.log(this._invoice);

	}

	set invoice(invoiceObject: any) {
		this._invoice = invoiceObject;
	}

	get invoice() {
		return this._invoice;
	}

	download() {
		// html2canvas(this.receipt.nativeElement).then(canvas => {
		//   const imgData = canvas.toDataURL('image/jpeg', 1.0);
		//   const pdfDoc = new jsPDF('p', 'mm', 'a4');
		//   pdfDoc.addImage(imgData, 'JPEG', 0, 0);
		//   pdfDoc.save('test.pdf');
		// });
		window.print();
	}

	close() {
		this._root_vcr.clear();
	}

}
