import { Component, OnInit, OnDestroy } from '@angular/core';
import { CandidatesService } from './candidates.service';
import { ParseUser, ParsePromise, ParseObject } from 'parse';
import { JobDetailsService } from '../job-details.service';
import { Router } from '@angular/router';
import { DeveloperListType, Loading } from '../../shared/utils';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from "@angular/forms";

@Component({
	selector: 'app-candidates',
	templateUrl: './candidates.component.html',
	styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit, OnDestroy {

	contractId: string;
	checked:false;
	candidateWeight: number;
	candidates;
	userId: string;

	private _candidatesCount: number;

	private _displayLoader;

	private _from;
	private _limit;

	private _stageSubscription;
	hasCandidates: number;
	private _activeStage;

	private _candidatesCountObject;

	private _candidatesCountSubscription;

	constructor(
		private _candidatesService: CandidatesService,
		private _jobDetailsService: JobDetailsService,
		private _router: Router
	) {
		this._router.navigate(['/', 'jobs', this._jobDetailsService.contractId, 'candidates'], { skipLocationChange: true });
	}

	ngOnInit() {
		this._candidatesService.contractId = this._jobDetailsService.contractId;
		this.contractId = this._jobDetailsService.contractId;

		this._candidatesCountSubscription = this._jobDetailsService.candidatesCount.subscribe(candidatesCounts => {
			console.log('CANDIDATES COUNT: ', candidatesCounts);
			if (candidatesCounts) {
				this._candidatesCountObject = candidatesCounts;
				if (this._activeStage) {
					this._candidatesCount = this._candidatesCountObject.find(count => {
						return count.type === this._activeStage;
					}).value;
					console.log('COOOOUNT: ', this._candidatesCount);
				}
			}
		});

		this._stageSubscription = this._jobDetailsService.activeStage.subscribe(activeStage => {
			this._activeStage = activeStage;

			if (this._candidatesCountObject) {
				console.log(activeStage);
				this._candidatesCount = this._candidatesCountObject.find(count => {
					return count.type === activeStage;
				}).value;
				console.log('COOOOUNT: ', this._candidatesCount);
			}
			console.log('Active Stage: ', activeStage);
			delete this.candidates;
			delete this.userId;
			delete this.candidateWeight;
			this._from = 0;
			this._limit = 10;

			this.hasCandidates = Loading.loading;
			this._jobDetailsService.isStagesDisabled = Loading.loading;

			switch (activeStage) {

				case DeveloperListType.suggested:
					this._candidatesService.getSuggestedCandidates(this.contractId, this._from, this._limit).then(suggestions => {
						console.log('SUGGESTIONS: ', suggestions);
						if (suggestions && suggestions.results.length > 0) {
							this.hasCandidates = Loading.success;
							this._jobDetailsService.isStagesDisabled = Loading.success;
							this.candidates = suggestions;
							const firstUser = suggestions.results[0];
							this._candidatesService.userId = firstUser.id;
							this.userProfile(firstUser.id, this.getPercentageMatch(firstUser));
						} else {
							this.hasCandidates = Loading.error;
							this._jobDetailsService.isStagesDisabled = Loading.error;
						}
					});
					break;

				case DeveloperListType.applied:
					this._candidatesService.getAppliedCandidates(this.contractId).then(suggestions => {
						if (suggestions && suggestions.results.length > 0) {
							this.hasCandidates = Loading.success;
							this._jobDetailsService.isStagesDisabled = Loading.success;
							this.candidates = suggestions;
							const firstUser = suggestions.results[0];
							this._candidatesService.userId = firstUser.id;
							this.userProfile(firstUser.id, this.getPercentageMatch(firstUser));
						} else {
							this.hasCandidates = Loading.error;
							this._jobDetailsService.isStagesDisabled = Loading.error;
						}
					}, error => {
						console.error(error);
					});
					break;

				case DeveloperListType.employeeReferrals:
					this._candidatesService.getReferrals(this.contractId).then(referrals => {
						if (referrals && referrals.results.length > 0) {
							this.hasCandidates = Loading.success;
							this._jobDetailsService.isStagesDisabled = Loading.success;
							this.candidates = referrals;
							const firstUser = referrals.results[0];
							this._candidatesService.userId = firstUser.id;
							this.userProfile(firstUser.id, this.getPercentageMatch(firstUser));
							console.log('employeeReferrals Users: ', this.getPercentageMatch(firstUser));
						} else {
							this.hasCandidates = Loading.error;
							this._jobDetailsService.isStagesDisabled = Loading.error;
						}
					});
					break;

				default:
					this._candidatesService.getUsersForList(this.contractId, activeStage).then(suggestions => {
						if (suggestions && suggestions.results.length > 0) {
							this.hasCandidates = Loading.success;
							this._jobDetailsService.isStagesDisabled = Loading.success;
							this.candidates = suggestions;
							let res;
							let id;
							console.log('this._jobDetailsService.movedUser', this._jobDetailsService.movedUser);
							if (this._jobDetailsService.movedUser) {
								id = this._jobDetailsService.movedUser;
								this._jobDetailsService.movedUser = null;
							} else {
								id = suggestions.results[0].id;
							}
							suggestions.results.forEach(el => {
								if (el.id === id) {
									res = el;
								}
							});
							const firstUser = res;
							this._candidatesService.userId = firstUser.id;
							this.userProfile(firstUser.id, this.getPercentageMatch(firstUser));
						} else {
							this.hasCandidates = Loading.error;
							this._jobDetailsService.isStagesDisabled = Loading.error;
						}
					});
					break;
			}

		});
	}

	loadCandidatesAtTheEnd(event) {
		if (event.target.scrollHeight - event.target.scrollTop - event.target.offsetHeight === 0) {
			console.log('END');
			this.loadMoreCandidates(event.target);
		}
	}

	loadMoreCandidates(candidatesBlock) {
		if (this._from + this._limit < this._candidatesCount) {
			console.log('LOAD MORE......');
			this._jobDetailsService.isStagesDisabled = Loading.loading;
			this._from += this._limit;
			this._displayLoader = true;
			switch (this._activeStage) {
				case DeveloperListType.suggested:
					this._candidatesService.getSuggestedCandidates(this.contractId, this._from, this._limit).then(suggestions => {
						this.candidates.weights = Object.assign({}, this.candidates.weights, suggestions.weights);
						this.candidates.distances = Object.assign({}, this.candidates.distances, suggestions.distances);
						this.candidates.results = this.candidates.results.concat(suggestions.results);
						this.scrollTo(candidatesBlock, candidatesBlock.scrollTop + candidatesBlock.offsetHeight, 500);
						this._jobDetailsService.isStagesDisabled = Loading.success;
					});
					break;

				case DeveloperListType.applied:
					this._candidatesService.getAppliedCandidates(this.contractId, this._from, this._limit).then(suggestions => {
						this.candidates.weights = Object.assign({}, this.candidates.weights, suggestions.weights);
						this.candidates.distances = Object.assign({}, this.candidates.distances, suggestions.distances);
						this.candidates.results = this.candidates.results.concat(suggestions.results);
						this.scrollTo(candidatesBlock, candidatesBlock.scrollTop + candidatesBlock.offsetHeight, 500);
						this._jobDetailsService.isStagesDisabled = Loading.success;
					}, error => {
						console.error(error);
					});
					break;
			}

		}
	}

	private scrollTo(element, to, duration) {
		const start = element.scrollTop;
		const change = to - start;
		const increment = 20;
		let currentTime = 0;

		const easeInOutQuad = (t, b, c, d) => {
			t /= d / 2;
			if (t < 1) {
				return c / 2 * t * t + b;
			}
			t--;
			return -c / 2 * (t * (t - 2) - 1) + b;
		};

		const animateScroll = () => {
			currentTime += increment;
			const val = easeInOutQuad(currentTime, start, change, duration);
			element.scrollTop = val;
			if (currentTime < duration) {
				setTimeout(animateScroll, increment);
			}
		};
		animateScroll();
	}

	get displayLoader() {
		return this._displayLoader;
	}

	limitArray(array: Array<any>): Array<any> {
		if (!array) {
			return [];
		}
		return array.filter((element, index) => {
			return index < 6;
		});
	}

	getPercentageMatch(user: ParseUser): number {
		const developerId = user.get('developer').id;
		return this.candidates.weights[developerId] ? this.candidates.weights[developerId] : 0;
	}

	userProfile(userId: string, candidateWeight: number) {
		this.userId = userId;
		this.candidateWeight = candidateWeight;
	}

	errorHandler(event) {
		event.target.src = '../../../assets/img/default-userpic.png';
	}

	get Loading() {
		return Loading;
	}

	ngOnDestroy() {
		this._stageSubscription.unsubscribe();
		this._candidatesCountSubscription.unsubscribe();
		this._jobDetailsService = null;
	}

}
