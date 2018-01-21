import { Injectable } from '@angular/core';
import { Parse } from '../../parse.service';
import * as _ from 'underscore';

@Injectable()
export class JobBoardsService {

	constructor(private _parse: Parse) {}

	getContractStatus(id:string){
		const query = this._parse.Query('Contract');
		query.equalTo('objectId', id);
		return query.first().then(res=>{
			return res.get('status');
		});
	}

	getBoards(): Promise<any> {
		const query = this._parse.Query('JobBoards');
		query.equalTo('Is_Visible', true);
		query.ascending('JobBoard_Index');
		query.include('workingForCountries');
		console.log(query.find());
		return query.find();
	}

	getPushedJB(contractId){
		const query = this._parse.Query('JobBoardPush');
		query.equalTo('Job', new this._parse.Parse.Object('Contract', { id: contractId }));
		query.equalTo('Status', 1);
		query.include('PushOnBoard');
		query.include('PriceSeleted');
		console.log(query.find());
		return query.find(); 
	}

	getPrices(jobBoard: any) {
		const query = this._parse.Query('JobBoardPrices');
		query.equalTo('JobBoard', jobBoard);
		query.include('JobBoard');
		query.ascending('Price');
		return query.find();
		// let query = this._parse.Query('JobBoards');
		// // query.equalTo('objectId', jobBoard.id);
		// query.equalTo('Is_Visible', true);
		// query.ascending('Price');
		// console.log(query.find());
		// return query.find();
	}
	getInCart(){
		return this._parse.Parse.Session.current().then(res=>{
			return res.get('Shopping_Cart');
		});
	}

	deleteFreeItemCart(id, contractId){
		console.log(id);
		console.log(contractId);
		return this._parse.Parse.Session.current().then(res => {
			const oldShoppingCart = res.get('Shopping_Cart');
			for (let freeItems of res.get('Shopping_Cart').free) {
				if ((freeItems as any).jobBoard.jobBoard.id) {
					console.log('test');
					if ((freeItems as any).jobBoard.jobBoard.id === id && contractId === (freeItems as any).contract) {
						oldShoppingCart.free = _.without(res.get('Shopping_Cart').free, freeItems);
						console.log(oldShoppingCart.free);
					}
				} else if ((freeItems as any).jobBoard.jobBoard.objectId) {
					if ((freeItems as any).jobBoard.jobBoard.objectId === id && contractId === (freeItems as any).contract) {
						oldShoppingCart.free = _.without(res.get('Shopping_Cart').free, freeItems);
						console.log(oldShoppingCart.free);
					}
				}
			}
			res.set('Shopping_Cart',oldShoppingCart);
			return res.save();
		});
	}

	deletePaidItemCart(id, contractId) {
		return this._parse.Parse.Session.current().then(res => {
			const oldShoppingCart = res.get('Shopping_Cart');
			for (let paidItems of res.get('Shopping_Cart').paid){
				// console.log('paid Items test');
				// console.log(id);
				// console.log(contractId);
				// console.log((paidItems as any).JobBoardPrice);
				// console.log((paidItems as any).JobBoardPrice.get('JobBoard').id);
				if ((paidItems as any).JobBoardPrice.get('JobBoard').id) {
					if ((paidItems as any).JobBoardPrice.get('JobBoard').id === id && contractId === (paidItems as any).contract) {
						oldShoppingCart.paid = _.without(res.get('Shopping_Cart').paid, paidItems);
						console.log(oldShoppingCart.paid);
					}
				} else if ((paidItems as any).JobBoardPrice.get('JobBoard').objectId) {
					if ((paidItems as any).JobBoardPrice.get('JobBoard').objectId === id && contractId === (paidItems as any).contract) {
						oldShoppingCart.paid = _.without(res.get('Shopping_Cart').paid, paidItems);
						// console.log(oldShoppingCart.paid);
					}
				}
			}
			res.set('Shopping_Cart',oldShoppingCart);
			return res.save();
		});
	}

	unpublishJB(idJBP){
		console.log(idJBP);
		const query = this._parse.Query('JobBoardPush');
		query.equalTo('objectId', idJBP);
		// query.equalTo('Job', new this._parse.Parse.Object('Contract', { id: contractId }));
		// query.equalTo('PushOnBoard', new this._parse.Parse.Object('JobBoards', { id: idJB }));
		console.log(query.first());
		return query.first().then(res => {
			res.set('Status', 0);
			console.log(res.save());
			return res.save();
		});
	}

	hasContractUrl(id: string) {
		const query = this._parse.Query('Contract');
		return query.get(id).then(res => {
			if (res && res.get('ClientWebjobURL') && res.get('ClientWebjobURL').length > 1) {
				return true;
			}
			return false;
		});
	}
	setContractUrl(url, id) {
		const query = this._parse.Query('Contract');
		query.get(id).then(res => {
			if (res) {
				res.set('ClientWebjobURL', url);
				res.save();
			}
		});
	}
	getCurrentPartner() {
		return this._parse.getPartner(this._parse.Parse.User.current());
	}
	setPartnerReedPostingKeys(key: string, email: string) {
		this.getCurrentPartner().then(partnerResult => {
			if (partnerResult) {
				partnerResult.set('reedPostEmail', email);
				partnerResult.set('reedPostingKey', key);
				partnerResult.save();
			}
		});
	}
}
