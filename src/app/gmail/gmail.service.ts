import { Parse } from './../parse.service';
import { Injectable } from '@angular/core';
import { ParsePromise, ParseObject } from 'parse';
import { Promise } from 'q';
@Injectable()
export class GmailService {

	constructor(private _parse: Parse) {}

	createPointer(objectClass, objectID) {
		const Foo = this._parse.Parse.Object.extend(objectClass);
		const pointerToFoo = new Foo();
		pointerToFoo.id = objectID;
		return pointerToFoo;
	}

	getStandardTemplates(templateTypeId?: string): any {
		if (!templateTypeId) {
			return (0);
		}
		let templates = [];
		const query = this._parse.Query('TemplatesStandard');
		query.include('Type');
		query.equalTo('Type', this.createPointer('TemplatesType', templateTypeId));
		return query.find().then(foundTempaltes => {
			templates = foundTempaltes;
			return templates;
		});
	};

	getCustomTemplatesForClient(templateTypeId?: string): any {
		if (!templateTypeId) {
			return (0);
		}
		const author = this.createPointer('_User', this._parse.getCurrentUser().id);
		let clientId;
		return author.fetch('Client_Pointer').then(fetchedAthor => {
			clientId = fetchedAthor.get('Client_Pointer').id;
		}).then(() => {
			let templates = [];
			const query = this._parse.Query('TemplatesCustomized');
			query.equalTo('Client', this.createPointer('Clients', clientId));
			query.notEqualTo('isDeleted', true);
			query.include('Type');
			query.equalTo('Type', this.createPointer('TemplatesType', templateTypeId));
			query.include('Author');
			return query.find().then(foundTempaltes => {
				templates = foundTempaltes;
				return templates;
			});
		});
	};

	getFillers(contractId: string, candidateId?: string | Array<any>): any {
		const data = {
			fCompanyName: <string>'',
			fCandidateName: <string>'',
			fJobTitle: <string>'',
			fMyName: <string>'',
			fMyPosition: <string>'',
			fCandidateEmail: <string>'',
			fERPContract: <string>'',
			fERPPWD: <string>'',
			fERPPage: <string>'',
			ERPJobpage: <string>''
		};
		const promises = [];
		// console.log('Getting fillers');
		const curUser = this._parse.Query('User');
		curUser.include('Client_Pointer');
		promises.push(curUser.get(this._parse.getCurrentUser().id));

		const query = this._parse.Query('Contract');
		promises.push(query.get(contractId));

		if (candidateId) {
			const candidate = this._parse.Query('User');
			promises.push(candidate.get(candidateId));
		}
		// console.log('Waiting for promises');
		return this._parse.Parse.Promise.when(promises).then(results => {
			if (results[0]) {
				data.fCompanyName = results[0].get('Client_Pointer').get('ClientName');
				data.fERPPWD = `Your ERP password: ${results[0].get('Client_Pointer').get('erpPagePwd') ? results[0].get('Client_Pointer').get('erpPagePwd') : '[There is no password for your page.]'}`;
				data.fMyName = results[0].get('firstName');
				data.fMyPosition = results[0].get('headline');
			}
			if (results[1]) {
				data.fJobTitle = results[1].get('title');
			}
			if (results[2]) {
				data.fCandidateName = results[2].get('firstName');
			}
			if (results[0] && results[1]) {
				data.fERPContract = `Your ERP Contract link: ${this._parse.ErpCompanyPageLink}${results[0].get('Client_Pointer').get('employeeReferralURL')}/${results[1].id}`;
				data.fERPPage = `Your ERP Page link: ${this._parse.ErpCompanyPageLink}${results[0].get('Client_Pointer').get('employeeReferralURL')}`;
			}
			// console.log(data);
			if (!candidateId)
				return (data);
			if (results[2].get('Work_email')) {
				data.fCandidateEmail = results[2].get('Work_email');
				// console.log(data);
				return data;
			} else {
				return this._parse.execCloud('getUserEmail', { 'userId': candidateId }).then(email => {
					data.fCandidateEmail = email;
					// console.log(data);
					return data;
				});
			}
		});
	}

	prepareText(text: string, fillData: {
		fEmail: string,
		fCompanyName: string,
		fCandidateName: string,
		fJobTitle: string,
		fMyName: string,
		fMyPosition: string,
		fERPPage: string,
		fERPPWD: string,
		fERPContract: string,
	}) {
		const tEmail = /%MyEmail/g,
			tCompanyName = /%MyCompanyName/g,
			tCandidateName = /%CandidateName/g,
			tJobTitle = /%JobTitle/g,
			tMyName = /%MyName/g,
			tMyPosition = /%MyPosition/g,
			fERPPage = /%ERPURL/g,
			tERPPWD = /%ERPPWD/g,
			fERPContract = /%ERPJobpage/g;
		text = text.replace(tEmail, fillData.fEmail);
		text = text.replace(tCompanyName, fillData.fCompanyName);
		text = text.replace(tCandidateName, fillData.fCandidateName);
		text = text.replace(tJobTitle, fillData.fJobTitle);
		text = text.replace(tMyName, fillData.fMyName);
		text = text.replace(tMyPosition, fillData.fMyPosition);
		text = text.replace(fERPPage, fillData.fERPPage);
		text = text.replace(tERPPWD, fillData.fERPPWD);
		text = text.replace(fERPContract, fillData.fERPContract);
		return (text);
	}

	getCompanyName(): any {
		const query = this._parse.Query('User');
		return query.get(this._parse.getCurrentUser().id).then(user => {
			return user.get('Client');
		});
	};

}
