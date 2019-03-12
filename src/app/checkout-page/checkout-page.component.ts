import { Component, OnInit, ViewChild, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { Parse } from '../parse.service';
import { CartAdding } from '../header/cartadding.service';
import { Router } from '@angular/router';
import { CheckoutPageService } from './checkout-page.service';
import { RootVCRService } from '../root_vcr.service';
import * as _ from 'underscore';
import { AddCardComponent } from '../shared/stripe/add-card/add-card.component';
import { AlertComponent } from '../shared/alert/alert.component';
import {Location} from '@angular/common';

@Component({
	selector: 'app-checkout-page',
	templateUrl: './checkout-page.component.html',
	styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent implements OnInit, OnDestroy {

	tosell: any[] = [];
	freetosell: any[] = [];
	test: string;
	total: number;
	totalwthtaxes: number;
	currentcurrency: string;
	showCheckout: boolean = false;
	taxes: number;
	indexN: number = 0;
	uniqueContracts: any[] = [];
	emptyFree: boolean;
	emptyPaid: boolean;

	private _addCardSubscription;

	private client: any;
	private cards: any[];
	private customer: any;
	private defaultCard: any;
	private defaultCardObject: any;
	private cardtype: boolean = true;
	private optionalCard: string;
	private optionalCards: any[];

	selectedIndex:number=0;

	selectedCard:string;
	selectedCardObj:any;

	useNewCard: boolean;

	useLastCard: boolean = false;

	dropdownValue: string;

	hasStripeId: boolean = false;
	error: any;

	checkoutProcess: boolean = false;;

	errorLog: string = '';

	errorPushData: any[] = [];
	errorFreePushData: any[] = [];

	successfullPushing: boolean = true;

	@ViewChild('deleteCross') deleteCross: ElementRef;

	constructor(
		private _renderer: Renderer2,
		private router: Router,
		private _CartAdding: CartAdding,
		private _parse: Parse,
		private _CheckoutPageService: CheckoutPageService,
		private _root_vcr: RootVCRService,
		private _location: Location
	) {
		this._CartAdding.CartTotal.subscribe(CartTotal => {
			this.total= CartTotal;
		});
		this._CartAdding.TotalPlusTaxes.subscribe(TotalPlusTaxes => {
			this.totalwthtaxes= TotalPlusTaxes;
		});
		this._CartAdding.Taxes.subscribe(Taxes => {
			this.taxes= Taxes;
		});
	}

	getCheckoutInf(){
		this._CheckoutPageService.findPaidJobBoardsContr().then(res=>{
			let tosellPaidVar = [];
			if(res.length == 0){
				this.emptyPaid = true;
				this.tosell = [];
			}else{
				for(let r of res){
					let contract: any;
					this._CheckoutPageService.getContract(r).then(contr=>{
						contract = contr;
						return this._CheckoutPageService.findPaidJobBoards(r);
					}).then(result=>{
						for(let re of result){
							tosellPaidVar.push({"contract":r, "JobBoardPrice": re, "location": contract.get('JobLocationFEinput'), "title": contract.get('title')});
						}
						this.currentcurrency = tosellPaidVar[0].JobBoardPrice.get("Currency");
						return tosellPaidVar;
					}).then(paidvar=>{
						this.emptyPaid = false;
						this.tosell = paidvar;
					})
				}
			}
			return this._CheckoutPageService.findFreeJobBoardsContr()
		}).then(res=>{
			let tosellFreeVar = [];
			if(res.length == 0){
				this.freetosell = [];
				this.emptyFree = true;
			}else{
				for(let r of res){
					let contract: any;
					this._CheckoutPageService.getContract(r).then(contr=>{
						contract = contr;
						return this._CheckoutPageService.findFreeJobBoards(r)
					}).then(result=>{
						for(let re of result){
							tosellFreeVar.push({"contract":r, "JobBoard": re, "location": contract.get('JobLocationFEinput'), "title": contract.get('title')});
						}
					}).then(()=>{
						this.freetosell = tosellFreeVar;
					}).then(()=>{
						this.emptyFree = false;
					})
				}
			}
		});
	}


	deleteItem(sell: any){
		this._CartAdding.deleteItem(sell).then(res=>{
			this.getCheckoutInf();
		})

	}
	deleteFreeItem(freesell: any){
		this._CartAdding.deleteFreeItem(freesell).then(res=>{
			this.getCheckoutInf();
		})
	}
	cardChange(card){
		this.dropdownValue = '1';
		this.cardtype = false;
		this.selectedCard = card.brand + ' ' + card.last4 + ' Exp. ' + card.exp_month + '/' + card.exp_year;
		this.selectedCardObj = card;
	}

	paymentSuccessful(){
		alert("Payment successfull. Check your e-mail for detailes. Thank You for using swipeIn!");
	}

	ngOnInit() {
		this.getCheckoutInf();

		// STRIPE FUNCTIONALITY

		this.getCards();

		const elements = this._CheckoutPageService.stripe.elements();
		const style = {
			base: {
				fontSize: '14px',
				lineHeight: '24px',
			}
		};


	}
	animation(event) {
		this._renderer.addClass(event.target.parentElement.parentElement, 'delete-anim');
	}
	back(){
		this._location.back();
	}
	changeIndex(num:number){
		this.selectedIndex = num;
	}
	AddNewPaymentMethod(){
		const addCardAlert = this._root_vcr.createComponent(AddCardComponent);
		if(this.hasStripeId == false){
			addCardAlert.hasStripeId = false;
		}
		this._addCardSubscription = addCardAlert.useCardNowSubsc.subscribe(() => {
			this.useLastCard = addCardAlert.useCardNowBool;
		});
		this._addCardSubscription = addCardAlert.updateCardEvent.subscribe(() => {
			this.testOne();
		});
		if (this.cards && this.cards.length > 0) {
			addCardAlert.useCardNow = true;
			addCardAlert.isDefault = true;
		} else {
			addCardAlert.alwaysDefault = true;
		}
	}

	testOne() {
		this.getCards();
		if(this.useNewCard === true){
		}

	}

	ngOnDestroy() {
		if(this._addCardSubscription){
			this._addCardSubscription.unsubscribe();
		}AlertComponent
	}

	getCards(){
		this._CheckoutPageService.getClient().then(client=>{
			this.client = client;
			return this._parse.Parse.Cloud.run('getStripeCustomer', {customerId: this.client.get("stripeCustomerId")})
		}).then(customer=>{
				this.customer = customer;
				if(customer.default_source){
					this.defaultCard = customer.default_source;
					for(let cards of customer.sources.data){
						if (cards.id == customer.default_source){
							this.defaultCardObject = cards;
						}
					}
				}
				this.cards = customer.sources.data;
				this.optionalCards = _.without(this.cards, _.findWhere(this.cards, {
					id: this.defaultCard
				}));
				this.hasStripeId = true;
			},
			error =>{
				if(error.code === 141){
					this.hasStripeId = false;
				}else{
					if(!this.error)
						this.error = error;
				}
			}).then(()=>{
			this.selectedCard = this.defaultCardObject.brand + ' ' + this.defaultCardObject.last4 + ' Exp. ' + this.defaultCardObject.exp_month + '/' + this.defaultCardObject.exp_year;
			this.selectedCardObj = this.defaultCardObject;
			this.dropdownValue = '1';
			if(this.useLastCard == true){
				this.selectedCard = this.optionalCards[0].brand + ' ' + this.optionalCards[0].last4 + ' Exp. ' + this.optionalCards[0].exp_month + '/' + this.optionalCards[0].exp_year;
				this.selectedCardObj = this.optionalCards[0];
			}
		});
	}

	successAlert(){

	}

	errorPush(JobBoardsNames, freeJBNames){
		let errorLog: string = '';
		let self = this;
		setTimeout(() => {
			this._CheckoutPageService.getErrorPushes(this.errorPushData, this.errorFreePushData).then(errorLogRes=>{
				if(errorLogRes[1] == false){
					this._root_vcr.clear();
					const alert = this._root_vcr.createComponent(AlertComponent);
					alert.title = 'Job publishing information';
					alert.icon = 'list-alt';
					alert.type = "simple";
					alert.contentAlign = 'center';
					alert.content = `<a>` + errorLogRes[0] + `</a>`;
					alert.addButton({
						title: 'Close',
						type: 'primary',
						onClick: () => this._root_vcr.clear()
					});
				}else if(errorLogRes[1] == true){
					this._root_vcr.clear();
					const alert = this._root_vcr.createComponent(AlertComponent);
					alert.title = 'Congratulations!';
					alert.icon = 'check';
					alert.type = "congrats";
					alert.contentAlign = 'left';
					if(this.uniqueContracts.length>1){
						alert.content = `<a style = "white-space:nowrap">Your job offers were successfully pushed on the following job boards: </a><a style = "white-space:nowrap">` + JobBoardsNames + freeJBNames + `</a>`;
					}else{
						alert.content = `<a style = "white-space:nowrap">Your job offer was successfully pushed on the following job boards:</a><a style = "white-space:nowrap">` + JobBoardsNames + freeJBNames + `</a>`;
					}
					alert.addButton({
						title: 'Close',
						type: 'primary',
						onClick: () => this._root_vcr.clear()
					})
				}
				// }else if(this.errorLog && this.successfullPushing === true){
				// 	
				// }
				return this._CartAdding.clearCart();
			}).then(res=>{
				return this._CartAdding.cartLoad();
			}).then(res=>{
				return this.getCheckoutInf();
			}).then(()=>{
				this.checkoutProcess = false;
			})
			console.log(this.errorLog);
		}, 2000);
	}

	stripeCharge(JobBoardsNames, freeJBNames, JobBoardsPricesIds){
		if(this.tosell.length > 0){
			return this._parse.Parse.Cloud.run('stripeCreateCharge', {JobBoardsPricesIds: JobBoardsPricesIds, jobBoardsNames: JobBoardsNames, source: this.selectedCardObj, stripeCustomerId: this.customer.id}).then(resp =>{
				let paidContracts = this._CartAdding.contracts;
				for(let contr of paidContracts){
					this._CheckoutPageService.doPaidJobBoardPushes(contr.JobBoardPrice.get("JobBoard"), contr.contract, contr.JobBoardPrice).then(jBPush=>{
					this.errorPushData.push({
						"jBPId" : jBPush.id,
						"jBName" : contr.JobBoardPrice.get("JobBoard").get("Name")
					})
					if(this.uniqueContracts.indexOf(contr.contract) === -1){
						this.uniqueContracts.push(contr.contract);
					}
				});
			}
				return "";
			}, error=>{
				if(!this.error)
					this.error = error;
				return ;
			});
		}else if(!(this.tosell.length > 0)){
			return new Promise((resolve, reject) => {
				return resolve();
			});
		}
	}

	completeCheckout(){
		this.checkoutProcess = true;
		if(this.tosell.length>0){
			if(this.selectedCard){
				let JobBoardsNames = '';
				let freeJBNames = '';
				let JobBoardsPricesIds: any[] = [];
				let addedJBsIds = [];
				this.tosell = _.sortBy(this.tosell, function(jb){
					return jb.JobBoardPrice.get("JobBoard").get("Name"); 
				});
				for (let i = 0; i < this.tosell.length; i++){
					if(this.tosell[i].JobBoardPrice.get("JobBoard").get("Name") && addedJBsIds.indexOf(this.tosell[i].JobBoardPrice.id) == -1){
						JobBoardsNames += "<br>" + this.tosell[i].JobBoardPrice.get("JobBoard").get("Name");
						addedJBsIds.push(this.tosell[i].JobBoardPrice.id);
					}else if(addedJBsIds.indexOf(this.tosell[i].JobBoardPrice.id) !== -1){
						JobBoardsNames += " x2";
					}
				}
				for(let jb of this.tosell){
					JobBoardsPricesIds.push(jb.JobBoardPrice.id);
				}

				if(this.freetosell.length > 0){
					let addedFreeJBsIds = [];
					let freeContracts = this._CartAdding.freecontracts;
					freeContracts = _.sortBy(freeContracts, function(jb){
						if(jb.jobBoard.jobBoard.Name){
							return jb.jobBoard.jobBoard.Name; 
						}else{
							return jb.jobBoard.jobBoard.get('Name');
						}
					});
					for(let contr of freeContracts){
						this._CheckoutPageService.doFreeJobBoardPushes(contr.jobBoard, contr.contract).then(push=>{
							this.errorFreePushData.push({
								"jBPId" : push.id,
								"jBName" : contr.jobBoard.jobBoard.get('Name')
							});
						})
						if(contr.jobBoard.jobBoard.Name && addedFreeJBsIds.indexOf(contr.jobBoard.jobBoard) == -1){
							freeJBNames +=  "<br>" + contr.jobBoard.jobBoard.Name;
							addedFreeJBsIds.push(contr.jobBoard.jobBoard.id);
						}else if(addedFreeJBsIds.indexOf(contr.jobBoard.jobBoard.id) == -1){
							freeJBNames +=  "<br>" + contr.jobBoard.jobBoard.get('Name');
							addedFreeJBsIds.push(contr.jobBoard.jobBoard.id);
						}else if(addedFreeJBsIds.indexOf(contr.jobBoard.jobBoard.id) !== -1){
							freeJBNames += " x2";
						}
						if(this.uniqueContracts.indexOf(contr.contract) === -1){
							this.uniqueContracts.push(contr.contract);
						}
					}
				}
				
				this.stripeCharge(JobBoardsNames, freeJBNames, JobBoardsPricesIds).then(result=>{
					if(this.error){
						const alert = this._root_vcr.createComponent(AlertComponent);
						alert.title = 'Error';
						alert.icon = 'frown-o';
						alert.type = "sad";
						alert.contentAlign = 'center';
						alert.content = `<a>
				Sorry, an error occurred while processing the payment.<br>Check your Internet connection, payment details and try again later.<br>
				Error: ` + this.error.code + `<br>` + `Message: ` + this.error.message + `</a>`;
						alert.addButton({
							title: 'Close',
							type: 'primary',
							onClick: () => this._root_vcr.clear()
						})
						return ;
					}else{
						
					}
					this.errorPush(JobBoardsNames, freeJBNames);
				});
			}else if(!this.selectedCard){
				const alert = this._root_vcr.createComponent(AlertComponent);
				alert.title = 'Add a card';
				alert.icon = 'credit-card';
				alert.type = "simple";
				alert.contentAlign = 'left';
				alert.content = `<a style = "white-space:nowrap">Please, add a card to complete the purchase</a><a style = "white-space:nowrap"></a>`;
				alert.addButton({
					title: 'Ok',
					type: 'primary',
					onClick: () => this._root_vcr.clear()
				})
				this.checkoutProcess = false;
			}
		}else if(this.freetosell.length > 0){
			this.checkoutProcess = true;
			let freeJBNames = '';
			let addedFreeJBsIds = [];
			let freeContracts = this._CartAdding.freecontracts;
			freeContracts = _.sortBy(freeContracts, function(jb){
				if(jb.jobBoard.jobBoard.Name){
					return jb.jobBoard.jobBoard.Name; 
				}
			});
			for(let contr of freeContracts){
				this._CheckoutPageService.doFreeJobBoardPushes(contr.jobBoard, contr.contract).then(push=>{
					this.errorFreePushData.push({
						"jBPId" : push.id,
						"jBName" : contr.jobBoard.jobBoard.get('Name')
					});
				});
				if(contr.jobBoard.jobBoard.Name && addedFreeJBsIds.indexOf(contr.jobBoard.jobBoard.id) == -1){
					freeJBNames += "<br>" + contr.jobBoard.jobBoard.Name;
					addedFreeJBsIds.push(contr.jobBoard.jobBoard.id);
				}else if(addedFreeJBsIds.indexOf(contr.jobBoard.jobBoard.id) == -1){
					freeJBNames += "<br>" + contr.jobBoard.jobBoard.get('Name');
					addedFreeJBsIds.push(contr.jobBoard.jobBoard.id);
				}else if(addedFreeJBsIds.indexOf(contr.jobBoard.jobBoard.id) !== -1){
					freeJBNames += " x2";
				}
				if(this.uniqueContracts.indexOf(contr.contract) === -1){
					this.uniqueContracts.push(contr.contract);
				}
			}
			this.errorPush('', freeJBNames);
			
		}
	}
	goDashboard(){
		this.router.navigateByUrl('/dashboard');
	}
	goJobs(){
		this.router.navigateByUrl('/jobs');
	}
}
