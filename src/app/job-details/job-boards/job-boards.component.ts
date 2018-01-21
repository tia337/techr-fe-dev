import {
	Component,
	OnInit,
	Renderer2,
	ElementRef,
	ViewChild,
	HostListener,
	Pipe
} from '@angular/core';
import {
	JobBoardsService
} from './job-boards.service';
import {
	IInfoOptions
} from '../../shared/info-modal/info-modal.interface';
import {
	ActivatedRoute
} from '@angular/router';
import {
	CartAdding
} from '../../header/cartadding.service';
import {
	Parse
} from '../../parse.service';
import {
	ParseObject
} from 'parse';
import {
	JobDetailsService
} from '../job-details.service';
import {
	InfoTabComponent
} from './info-tab/info-tab.component';
import {
	RootVCRService
} from '../../root_vcr.service';
import {
	AlertComponent
} from '../../shared/alert/alert.component';

import * as _ from 'underscore';
import { UrlInputComponent } from 'app/job-details/job-boards/url-input/url-input.component';
import { ReedAuthComponent } from 'app/job-details/job-boards/reed-auth/reed-auth.component';



@Component({
	selector: 'job-boards',
	templateUrl: './job-boards.component.html',
	styleUrls: ['./job-boards.component.scss']
})
export class JobBoardsComponent implements OnInit {

	// @HostListener('window:scroll', ['$event']) onScrollEvent($event){
	//   console.log($event);
	//   console.log('scrolling');
	// }

	private boards = [];
	boardsToShow = [];

	isForJobBoardURL = false;

	activeSpinners: any[] = [];

	freeBoadsAmount: number;
	premiumBoadsAmount: number;

	statusAddToCart: boolean;

	isPremium = true;
	// Andriy M: contractId for pushing data for buying 
	contractId: string;
	contractStatus;

	inCart: any[] = [];

	activeInfo = false;

	freePushesId: any[] = [];
	paidPushesId: any[] = [];

	freePushes: any[] = [];
	paidPushes: any[] = [];

	todaysDate = new Date();

	flags: any[] = [];
	flagIds: any[] = [];

	activeDeleteProccess: any[] = [];

	reedApiExistance = false;

	@ViewChild('infoButton') infoButton: ElementRef;

	constructor(
		public _CartAddingService: CartAdding,
		private _route: ActivatedRoute,
		private _jobBoardsService: JobBoardsService,
		private _renderer: Renderer2,
		private _elRef: ElementRef,
		private _JobDetailsService: JobDetailsService,
		private _rootVCR: RootVCRService,
	) {}

	ngOnInit() {
		// Andriy M: contractId for pushing data for buying 
		this.contractId = this._JobDetailsService.contractId;
		this._jobBoardsService.getContractStatus(this.contractId).then(res=>{
			this.contractStatus = res;
		})
		this._jobBoardsService.hasContractUrl(this.contractId).then(res => {
			this.isForJobBoardURL = res;
		});

		this.getPushedJB();

		this._CartAddingService.cartLoad();

		this._jobBoardsService.getBoards().then(boards => {
			boards.every((brd) => {
				if (brd.get('workingForCountries')) {
					let full = false;
					brd.get('workingForCountries').forEach(img => {
						if (((this.flagIds.length - _.without(this.flagIds, brd.id).length) == 4) == true) {
							if (full !== true) {
								this.flags.push({
									'id': brd.id,
									'flag': '../../../assets/img/and_more2.png'
								});
								full = true;
								return false;
							} else {
								return false;
							}
						}
						this.flagIds.push(brd.id);
						img.fetch().then(() => {
							this.flags.push({
								'id': brd.id,
								'flag': img.get('countryFlag').url()
							});
						});
					});
					this.flagIds = this.flagIds.reverse();
					this.flags = this.flags.reverse();
					return true;
				} else {
					return true;
				}
			});
			boards.forEach(board => {
				this._jobBoardsService.getPrices(board).then(prices => {
					this.boards.push({
						jobBoard: board,
						prices: prices,
						currentPrice: 0
					});
				})
				.then(() => this.filterBoards())
				.then(() => {
					this.freeBoadsAmount = this.boards.filter(board => {
						return board.jobBoard.get('Is_Premium') == false
					}).length;
					this.premiumBoadsAmount = this.boards.filter(board => {
						return board.jobBoard.get('Is_Premium') == true
					}).length;
				});
			});
		});
		this._jobBoardsService.getCurrentPartner().then(partner => {			
			if (partner.get('reedPostingKey') && partner.get('reedPostEmail')) {
				this.reedApiExistance = true;
			}
		});
		this.getInCart();
	}

	getPushedJB() {
		this._jobBoardsService.getPushedJB(this.contractId).then(res => {
			this.paidPushes = [];
			this.paidPushesId = [];
			this.freePushes = [];
			this.freePushesId = [];
			for (let jbp of res) {
				if (!jbp.get('PriceSeleted')) {
					this.freePushesId.push(jbp.get('PushOnBoard').id);
					this.freePushes.push(jbp);
				} else {
					this.paidPushesId.push(jbp.get('PushOnBoard').id);
					this.paidPushes.push(jbp);
				}
			}
		});
	}

	getInCart() {
		return this._jobBoardsService.getInCart().then(res => {
			const inCart = [];
			for (let fc of res.free) {
				if (fc.contract === this.contractId) {
					if (fc.jobBoard.jobBoard.id) {
						inCart.push(fc.jobBoard.jobBoard.id);
					} else if (fc.jobBoard.jobBoard.objectId) {
						inCart.push(fc.jobBoard.jobBoard.objectId);
					}
				}
			}
			for (let fc of res.paid) {
				if (fc.contract === this.contractId) {
					if (fc.JobBoardPrice.JobBoard) {
						if (fc.JobBoardPrice.JobBoard.id) {
							inCart.push(fc.JobBoardPrice.JobBoard.id);
						} else if (fc.JobBoardPrice.JobBoard.objectId) {
							inCart.push(fc.JobBoardPrice.JobBoard.objectId);
						}
					} else if (fc.JobBoardPrice.get('JobBoard')) {
						if (fc.JobBoardPrice.get('JobBoard').id) {
							inCart.push(fc.JobBoardPrice.get('JobBoard').id);
						} else if (fc.JobBoardPrice.get('JobBoard').objectId) {
							inCart.push(fc.JobBoardPrice.get('JobBoard').objectId);
						}
					}
				}
			}
			this.inCart = inCart;
			return ;
		});
	}

	deleteFromCart(id, isPaid, index) {
		this.activeDeleteProccess.push(index);
		if (isPaid === true) {
			this._jobBoardsService.deletePaidItemCart(id, this.contractId).then(res => {
				return this._CartAddingService.cartLoad();
			}).then(result => {
				this.getInCart();
			}).then(() => {
				this.activeDeleteProccess.splice(this.activeDeleteProccess.indexOf(index), 1);
			});
		} else if (isPaid === false) {
			this._jobBoardsService.deleteFreeItemCart(id, this.contractId).then(res => {
				return this._CartAddingService.cartLoad();
			}).then(result => {
				this.getInCart();
			}).then(() => {
				this.activeDeleteProccess.splice(this.activeDeleteProccess.indexOf(index), 1);
			});
		}
	}

	addToCart(jobBoard: ParseObject, board: ParseObject, index: number) {
		if (board.jobBoard.get('needsContractUrl') && !this.isForJobBoardURL) {
			const inputUrl = this._rootVCR.createComponent(UrlInputComponent);
			inputUrl.jobBoard = jobBoard;
			inputUrl.board = board;
			inputUrl.index = index;
			inputUrl.parent = this;
		} else if (board.jobBoard.get('Name').toLowerCase() === 'reed' && !this.reedApiExistance) {
			const reddAuth = this._rootVCR.createComponent(ReedAuthComponent);
			reddAuth.jobBoard = jobBoard;
			reddAuth.board = board;
			reddAuth.index = index;
			reddAuth.parent = this;
		} else {
			this.activeSpinners.push(index);
			this._CartAddingService.callAnimation();
			if (jobBoard) {
				this._CartAddingService.addPaid(jobBoard, this.contractId).then(() => {
					return this.getInCart();
				}).then(() => {
					this.activeSpinners.splice(this.activeSpinners.indexOf(index), 1);
				});
			} else {
				this._CartAddingService.addFree(board, this.contractId).then(() => {
					this.getInCart();
				}).then(res => {
					this.activeSpinners.splice(this.activeSpinners.indexOf(index), 1);
				});
			}
		}
	}

	filterBoards() {
		this.boardsToShow = this.boards.filter(board => {
			return board.jobBoard.get('Is_Premium') == this.isPremium;
		});
	}

	showDropdown(boardID: string) {
		this._renderer.removeClass(this._elRef.nativeElement.querySelector('.prices-list-' + boardID), 'hidden');
		this._renderer.removeClass(this._elRef.nativeElement.querySelector('.overlay'), 'hidden');
	}

	hideDropdown(boardID ?: string) {
		if (boardID) {
			this._renderer.addClass(this._elRef.nativeElement.querySelector('.prices-list-' + boardID), 'hidden');
		} else {
			const elements = document.getElementsByClassName('prices-list');
			for (let i = 0; i < elements.length; ++i) {
				this._renderer.addClass(elements[i], 'hidden');
			}
		}

		this._renderer.addClass(this._elRef.nativeElement.querySelector('.overlay'), 'hidden');
	}
	addCartButton(event) {
		this._renderer.addClass(event.target, 'add-cart-visible');
	}
	hideCartButton(event) {
		this._renderer.removeClass(event.target, 'add-cart-visible');
	}

	createInfoTab(index, event, jb) {
		console.log(event);
		console.log(event.target);
		let elem = event.target.nextElementSibling;
		this._renderer.addClass(elem, 'to-display');
		let rect = event.target.getBoundingClientRect();
		let target = 'Target:'
		let description = jb.get('Description');
		let descriptionText = description.slice(0, description.indexOf(target));
		let targetText = description.slice(description.indexOf(target));
		event.target.nextElementSibling.children[0].children[2].children[0].textContent = descriptionText;
		event.target.nextElementSibling.children[0].children[2].children[1].textContent = targetText;
		this.activeInfo = true;
	}
	hideInfo(element, event) {
		if (this.activeInfo === true && event.target.classList.contains('info-icon') && element.children[0].children[0] !== event.target.nextElementSibling.children[0].children[0]) {
			this._renderer.removeClass(element, 'to-display');
		}
		if (element.classList.contains('to-display') && !event.target.classList.contains('info-icon')) {
			this._renderer.removeClass(element, 'to-display');
			this.activeInfo = false;
		}
	}
	onScroll(event) {
	}
	unpublish(id) {
		if (this.paidPushes.length > 0) {
			for (let pp of this.paidPushes) {
				if (pp.get('PushOnBoard').id === id) {
					return this._jobBoardsService.unpublishJB(pp.id).then(res => {
						this.getPushedJB();
						return 'success';
					});
				}
			}
		}
		if (this.freePushes.length > 0) {
			for (let fp of this.freePushes) {
				if (fp.get('PushOnBoard').id === id) {
					return this._jobBoardsService.unpublishJB(fp.id).then(res => {
						this.getPushedJB();
						return 'success';
					});
				}
			}
		}
	}

	showAlert(id: string, name: string) {
		const alert = this._rootVCR.createComponent(AlertComponent);
		alert.title = 'Unpublish job?';
		alert.icon = '';
		alert.type = 'simple';
		alert.contentAlign = 'left';
		alert.content = `<a style = 'white-space:nowrap'>Are you sure you want to unpublish the job from ` + name + `?</a>`;
		alert.addButton({
			title: 'Yes',
			type: 'primary',
			onClick: () => this.unpublish(id).then(res => {
				return this._rootVCR.clear();
			}).then(() => {
				this.alertSuccess(name);
			})
		});
	}

	alertSuccess(name: string) {
		const alert = this._rootVCR.createComponent(AlertComponent);
		alert.title = 'Success';
		alert.icon = 'thumbs-o-up';
		alert.type = 'simple';
		alert.contentAlign = 'left';
		alert.content = `<a style = 'white-space:nowrap'>Job successfully unpublished from ` + name + `.</a>`;
		alert.addButton({
			title: 'Ok',
			type: 'primary',
			onClick: () => this._rootVCR.clear()
		});
	}

}

@Pipe({
	name: 'round'
})
export class RoundPipe {
	transform(input: number) {
		return Math.floor(input);
	}
}

@Pipe({
	name: 'reverse'
})
export class ReversePipe {
	transform(values) {
		if (values) {
			let i = 0;
			let j = values.length - 1;
			while (i < j) {
				let x = values[i];
				values[i] = values[j];
				values[j] = x;
				i++;
				j--;
			}
			return values;
		}
	}
}

