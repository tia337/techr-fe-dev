/*
 * @Author: Andrew Faraponov 
 * @Date: 2017-10-31 16:29:21 
 * @Last Modified by: Andrew Faraponov
 * @Last Modified time: 2017-10-31 20:14:23
 */
import { Injectable } from '@angular/core';
import { Parse } from './../parse.service';
import { ContractInfo } from 'app/graphics/graphics.service';

@Injectable()
export class EmReferralService {

	empRefsArray: EmpReferalObject[];
	empRefsSamplesArray: EmpReferalObject[];
	contracts: ContractInfo[];
	constructor(private _parse: Parse) { }

	getEmpRefTmplts() {
		let query = this._parse.Query('EmployeeReferralPrograms');
		let client = this.getUserClient();
		query.equalTo('Client', client);
		query.include('Type');
		query.include('Author');
		query.equalTo('isRemoved', false);
		this.empRefsArray = new Array();
		return query.find().then(res => {
			res.forEach(element => {
				let local = new EmpReferalObject();
				let author = element.get('Author');
				let firstName = author != undefined ? author.get('firstName') : "";
				let lastName = author != undefined ? author.get('lastName') : "";
				local.author = firstName + ' ' + lastName;
				local.title = element.get('Title');
				local.type = new ERPType(element.get('Type').get('Type'), element.get('Type').get('objectId'));
				local.descr = element.get('Description');
				local.postedAt = element.get('createdAt');
				local.updatedAt = element.get('updatedAt') != undefined ? element.get('updatedAt') : local.postedAt;
				local.id = element.id;
				let tmpLstUpdt = element.get('WhoLastEdited');
				if (tmpLstUpdt == undefined)
					local.whoUpdateLast = local.author;
				else {
					local.whoUpdateLast = tmpLstUpdt[tmpLstUpdt.length - 1].fullname;
				}
				this.empRefsArray.push(local);
			});
			return this.empRefsArray;
		});
	}
	getEmpRefSamplesTmplts() {
		let query = this._parse.Query('EmployeeReferralPrograms');
		let client = this.getUserClient();
		query.equalTo('Client', undefined);
		query.include('Type');
		this.empRefsSamplesArray = new Array();
		return query.find().then(res => {
			res.forEach(element => {
				let local = new EmpReferalObject();
				local.author = 'Sample';
				local.title = element.get('Title');
				local.type = new ERPType(element.get('Type').get('Type'), element.get('Type').get('objectId'));
				local.descr = element.get('Description');
				local.postedAt = element.get('createdAt');
				local.updatedAt = element.get('updatedAt') != undefined ? element.get('updatedAt') : local.postedAt;
				local.id = element.id;
				this.empRefsSamplesArray.push(local);
			});
			return this.empRefsSamplesArray;
		});
	}
	getSingleEmpRef(id: string) {
		let query = this._parse.Query('EmployeeReferralPrograms');
		let client = this.getUserClient();
		query.equalTo('objectId', id);
		query.include('Type');
		query.include('Author');
		let singleEmpRef = new EmpReferalObject();
		return query.find().then(res => {
			let element = res[0];
			let singleEmpRef = new EmpReferalObject();
			if (element != undefined) {
				let author = element.get('Author');
				let firstName = author != undefined ? author.get('firstName') : "";
				let lastName = author != undefined ? author.get('lastName') : "";
				singleEmpRef.author = firstName + ' ' + lastName;
				singleEmpRef.title = element.get('Title');
				singleEmpRef.type = new ERPType(element.get('Type').get('Type'), element.get('Type').id);
				singleEmpRef.eleg = element.get('Elegibility');
				singleEmpRef.descr = element.get('Description');
				singleEmpRef.postedAt = element.get('createAt');
				singleEmpRef.updatedAt = element.get('updatedAt') != undefined ? element.get('updatedAt') : singleEmpRef.postedAt;
				singleEmpRef.id = element.id;
				let tmpLstUpdt = element.get('WhoLastEdited');
				if (tmpLstUpdt == undefined)
					singleEmpRef.whoUpdateLast = singleEmpRef.author;
				else {
					singleEmpRef.whoUpdateLast = tmpLstUpdt[tmpLstUpdt.length - 1].fullname;
				}
			}			
			return singleEmpRef;
		});
	}
	getUserClient() {
		let user = this._parse.Parse.User.current();
		let client = user.get('Client_Pointer');
		return client;
	  }

	getCompanyName() {
		return this._parse.getCurrentUser().get('Client');
	}
	getEmpRefTypes() {
		let query = this._parse.Query('EmployeeReferralAwardType');
		return query.find().then(res => {
			let result: ERPType[] = new Array();
			res.forEach(element => {
				if (element.get('Type') != undefined)
					result.push(new ERPType(element.get('Type'), element.id));
			});
			return result;
		});
	}
	saveCustomERP(erp: EmpReferalObject) {
		let operation = this._parse.Query('EmployeeReferralPrograms');
		operation.get(erp.id).then(res => {
			res.set('Elegibility', erp.eleg);
			res.set('Description', erp.descr);
			res.set('Title', erp.title);
			res.set('Type', this.createPointer('EmployeeReferralAwardType', erp.type.id));
			let lstUpdtArr = res.get('WhoLastEdited');
			let user = this._parse.getCurrentUser();
			if (lstUpdtArr == undefined) {
				lstUpdtArr = new Array();
				lstUpdtArr.push({id: user.id, fullname: `${user.get('firstName')} ${user.get('lastName')}`, date: new Date()});
			} else {
				lstUpdtArr.push({id: this._parse.getCurrentUser().id, fullname: `${user.get('firstName')} ${user.get('lastName')}`, date: new Date()});
			}
			res.set('WhoLastEdited', lstUpdtArr);
			res.save();
		});
	}
	createCustomERP(erp: EmpReferalObject) {
		let newProgram = this._parse.Object('EmployeeReferralPrograms');
		newProgram.set('Elegibility', erp.eleg);
		newProgram.set('Description', erp.descr);
		newProgram.set('Title', erp.title);
		newProgram.set('Author', this.createPointer('_User', this._parse.getCurrentUser().id));
		console.log(this._parse.getCurrentUser().get('Client_Pointer'));
		newProgram.set('Client', this.createPointer('Clients', this._parse.getCurrentUser().get('Client_Pointer').id));
		newProgram.set('Type', this.createPointer('EmployeeReferralAwardType', erp.type.id));
		newProgram.set('isRemoved', false);
		let lstUpdtArr = new Array();
		let user = this._parse.getCurrentUser();
		lstUpdtArr.push({id: user.id, fullname: `${user.get('firstName')} ${user.get('lastName')}`, date: new Date()});
		newProgram.set('WhoLastEdited', lstUpdtArr);
		newProgram.save();
	}
	createPointer(objectClass, objectID) {
		var pointer = this._parse.Object(objectClass);
		pointer.id = objectID;
		return pointer;
	}
	deleteERPProgram(erp: EmpReferalObject) {
		let deletion = this._parse.Query('EmployeeReferralPrograms');
		deletion.get(erp.id).then(result => {
			if (result != undefined) {
				result.set('isRemoved', true);
				result.save();
			}
		});
	}
	getErpActivity(activitiParams?: boolean) {
		let query = this._parse.Query('Contract');
		let result = new Array();
		query.notEqualTo('status', 3);
		query.equalTo('Client', this._parse.getCurrentUser().get('Client_Pointer'));
		if (activitiParams == undefined)
			query.exists('isActiveForReferralPage');
		else
			query.equalTo('isActiveForReferralPage', activitiParams);
		query.include('employeeReferralProgram');
		query.include('employeeReferralProgram.Type');
		return query.find().then(res => {
			res.forEach(cont => {
				this._parse.Query('EmployeeReferrals')
				.equalTo('contract', this.createPointer('Contract', cont.id))
				.count().then(rrr => {
					cont.count = rrr;
				});
				result.push(cont);
			});
			console.log(result);
			return result;
		});
	}
}
export class EmpReferalObject {
	id: string;
	author: string;
	title: string;
	type: ERPType;
	descr: string;
	eleg: string;
	postedAt: Date;
	updatedAt: Date;
	whoUpdateLast: string;	
}
export class ERPType {
	name: string;
	id: string;
	constructor(name: string, id: string) {
		this.name = name;
		this.id = id;
	}
}
export class EMPRFContractInfo extends ContractInfo {
	ERPType: string;
	ERP: string;
}