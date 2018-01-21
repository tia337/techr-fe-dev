import { Component, OnInit } from '@angular/core';
import { BillingHistoryService } from './billing-history.service';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RootVCRService } from '../../../root_vcr.service';
import * as JSPdf from 'jspdf';


@Component({
	selector: 'app-billing-history',
	templateUrl: './billing-history.component.html',
	styleUrls: ['./billing-history.component.scss']
})
export class BillingHistoryComponent implements OnInit {

	private _invoices: Array<any>;

	constructor(
		private _billingHistoryService: BillingHistoryService,
		private _root_vcr: RootVCRService,
		private _currency: CurrencyPipe,
		private _date: DatePipe
	) { }

	ngOnInit() {
		this._billingHistoryService.getInvoices().then(invoices => {
			console.log(invoices);
			this._invoices = invoices;
		});

	}

	get invoices() {
		return this._invoices;
	}

	previewInvoice(invoiceObject: any) {
		this._root_vcr.clear();
		const invoicePreview = this._root_vcr.createComponent(InvoicePreviewComponent);
		invoicePreview.invoice = invoiceObject;
	}

	downloadInvoice(invoiceObject: any) {
		const pdfDoc = new JSPdf('p', 'mm', 'a4');
		pdfDoc.setFont('arial');
		pdfDoc.setFontType('normal');
		pdfDoc.setFontSize(20);
		pdfDoc.text('Receipt', 105, 13, 'center');
		pdfDoc.setFillColor(0, 141, 228);
		pdfDoc.rect(0, 20, 297, 35, 'F');
		pdfDoc.setFontSize(26);
		pdfDoc.setTextColor(255, 255, 255);
		pdfDoc.text(
			this._currency.transform(invoiceObject.total / 100, invoiceObject.currency, true, '1.0-0') + ' at SwipeIn',
			105, 35, 'center'
		);
		pdfDoc.setFontSize(14);
		pdfDoc.text(
			this._date.transform(invoiceObject.date * 1000, 'longDate'),
			5, 50
		);
		pdfDoc.text(
			'#' + invoiceObject.number,
			205, 50, 'right'
		);

		pdfDoc.setTextColor(0, 0, 0);

		pdfDoc.text('Amount', 200, 70, 'right');
		pdfDoc.text('Description', 10, 70);

		invoiceObject.lines.data.forEach((subscription, index) => {
			let topOffset = 80 + index * 10;
			pdfDoc.text(subscription.plan.name + ' x ' + subscription.quantity + ' user(s)', 10, topOffset);
			pdfDoc.text(this._currency.transform(subscription.amount / 100, subscription.currency, true, '1.0-0'), 200, topOffset, 'right');
			pdfDoc.lines([[190, 0]], 10, topOffset + 3);
			if (index === invoiceObject.lines.data.length - 1) {
				topOffset += 10;
				pdfDoc.text('Total(before taxes and discounts): ', 105, topOffset);
				pdfDoc.text(this._currency.transform(invoiceObject.subtotal / 100, invoiceObject.currency, true, '1.0-0'), 200, topOffset, 'right');
				pdfDoc.lines([[95, 0]], 105, topOffset + 3);

				pdfDoc.text('Final Price:  ', 105, topOffset + 10);
				pdfDoc.text(this._currency.transform(invoiceObject.total / 100, invoiceObject.currency, true, '1.0-0'), 200, topOffset + 10, 'right');
				pdfDoc.lines([[95, 0]], 105, topOffset + 13);
			}
		});

		pdfDoc.text('Swipein Ltd. registered in England and Wales with company number 09755830', 10, 105 + invoiceObject.lines.data.length * 10);

		pdfDoc.save('swipein-invoice-' + invoiceObject.number + '.pdf');
	}

}
