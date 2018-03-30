import {Component, OnInit, OnDestroy, Input, OnChanges} from '@angular/core';
import { CandidatesService } from './candidates.service';
import { ParseUser, ParsePromise, ParseObject } from 'parse';
import { JobDetailsService } from '../job-details.service';
import { Router } from '@angular/router';
import { DeveloperListType, Loading } from '../../shared/utils';
import { ChangeDetectorRef } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import {Modal1Component } from "../../post-job-page/modal1/modal1.component";
import { RootVCRService } from "../../root_vcr.service";
import { Parse } from "../../parse.service";
import { GmailComponent}  from "../../gmail/gmail.component";
import { LoaderDirective } from '../../shared/loader/loader.directive';
import * as _ from 'underscore';
import { MatProgressSpinnerModule, MatSelectModule, MatFormFieldModule } from '@angular/material';
import { element } from 'protractor';

import { Observable, } from 'rxjs/Rx';
// tslint:disable


@Component({
	selector: 'app-candidates',
	templateUrl: './candidates.component.html',
	styleUrls: ['./candidates.component.scss']
})

export class CandidatesComponent implements OnInit, OnDestroy, OnChanges {
	countryArray:Array<any> = [];
	sortSelect:string = "skillsMatch";
	skillMatchSelect:string;
	contractId: string;
	selectedAll:false;
	candidateWeight: number;
	candidateDistance: number;
	candidates;
	unitPreference;
	viewCandidates;
	SuggestedCandidates;
	copySuggestedCandidates;
	allSuggestionsObject;
	userId: string;
	arrayOfDevs: Array<any> = [];
	sortedArray: Array<any> = [];
	sortedIdArray: Array<any> = [];
	sortBySkills: boolean = false;
	sortByRelocation: boolean = false;
	sortByCountry: boolean = false;
	filtersParameters: Array<any> = [];
	sortMethod: string = 'weight';
	candidatesCount: number = 0;
	postLoader: boolean = false;
	filterCount: number = 0;
	countriesCount: number = 0;
    private countriesSourcing: Array<any> = [];
	private _candidatesCount: number;
	public queryParams;
  @Input() contractObj;
	private _displayLoader;

	private _from;
	private _limit;

	private _stageSubscription;
	hasCandidates: number;
	public _activeStage;

	private _candidatesCountObject;
	private _candidatesCountSubscription;

	constructor(
		private _candidatesService: CandidatesService,
		private _jobDetailsService: JobDetailsService,
		private _router: Router,
        private _root_vcr: RootVCRService,
		private _parse: Parse
	) {
		this._router.navigate(['/', 'jobs', this._jobDetailsService.contractId, 'candidates'], { skipLocationChange: true });
	}

	ngOnChanges () {
	}

	ngOnInit() {
		
		console.log('ON INIT');

		this._candidatesService.contractId = this._jobDetailsService.contractId;
		this.contractId = this._jobDetailsService.contractId;
		this._parse.getPartner(this._parse.Parse.User.current()).then( partner => {
			this.unitPreference = partner.get('candidateDistanceUnitPreferrences');
		});

		this._candidatesCountSubscription = this._jobDetailsService.candidatesCount.subscribe( candidatesCount => {
			if (candidatesCount) {
				this._candidatesCountObject = candidatesCount;
				if (this._activeStage) {
					this._candidatesCount = this._candidatesCountObject.find(count => {
						return count.type === this._activeStage;
					}).value;
					console.log('Subsribed for candidatesCount: ', this._candidatesCount);
				}
			}
		});

		this._stageSubscription = this._jobDetailsService.activeStage.subscribe(activeStage => {
			this._activeStage = activeStage;
			if (this._candidatesCountObject) {
				this._candidatesCount = this._candidatesCountObject.find( count => {
					return count.type === activeStage;
				}).value;
				console.log('Subscribed for stage. CandidatesCount: ', this._candidatesCount);
			}
			console.log('Active Stage: ', activeStage);
			localStorage.setItem('activeStage', activeStage);
			delete this.candidates;
			delete this.userId;
			delete this.candidateWeight;
			delete this.candidateDistance;

			this._from = 0;
			this._limit = 10;

			this.hasCandidates = Loading.loading;
			this._jobDetailsService.isStagesDisabled = Loading.loading;

			switch (activeStage) {

				case DeveloperListType.suggested:

					this._candidatesService.getSuggestedCandidatesWeb(this.contractId).then( SuggestedCandidates => {
						console.log('SuggestedCandidates: ', SuggestedCandidates);
						if (SuggestedCandidates && SuggestedCandidates.developersSorted.length > 0) {
                            	this.hasCandidates = Loading.success;
                            	this._jobDetailsService.isStagesDisabled = Loading.success;
                            	SuggestedCandidates.developersSorted = _.sortBy(SuggestedCandidates.developersSorted, 'weight').reverse();
                            	let tempArray = [];
								console.log('Developers sorted: ', SuggestedCandidates.developersSorted);
								this.copySuggestedCandidates = SuggestedCandidates.developersSorted;
								this.SuggestedCandidates = Object.assign({},SuggestedCandidates);
                            	this.candidates = Object.assign({},SuggestedCandidates);
                            	this.candidates.results = [ ];
                            	this.candidates.weights = SuggestedCandidates.weights;
								this.candidates.distances = SuggestedCandidates.distances;
								
                            	SuggestedCandidates.developersSorted.slice(this._from,this._limit).forEach(dev => {
                            		tempArray.push(dev.id);
								});
								this._candidatesService.getDevelopersById(tempArray).then(response => {
                            		// console.log('Response from server Get Developers', response.results);
                            		this.candidates.results = this.candidates.results.concat(response.results);
									console.log('This.candidate.results', this.candidates.results);
									const firstUser = this.candidates.results[0];
									this._candidatesService.userId = firstUser.id;
									if (localStorage.getItem('queryParams')) {
										console.log('in queryparams');
										let data = JSON.parse(localStorage.getItem('queryParams'));
										this.userProfile(data.candidateId, this.getPercentageMatchQueryParams(data.candidateId), this.getLocationMatchQueryParams(data.canidateId));
									} else {
										this.userProfile(firstUser.id, this.getPercentageMatch(firstUser), this.getLocationMatch(firstUser));
									}
								})
								this.loadCountryList();
								
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
							// this.userProfile(firstUser.id, this.getPercentageMatch(firstUser), this.getLocationMatch(firstUser));
							if (localStorage.getItem('queryParams')) {
								console.log('in queryparams');
								let data = JSON.parse(localStorage.getItem('queryParams'));
								this.userProfile(data.candidateId, this.getPercentageMatchQueryParams(data.candidateId), this.getLocationMatchQueryParams(data.canidateId));
							} else {
								this.userProfile(firstUser.id, this.getPercentageMatch(firstUser), this.getLocationMatch(firstUser));
							}
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
							// this.userProfile(firstUser.id, this.getPercentageMatch(firstUser), this.getLocationMatch(firstUser));
							if (localStorage.getItem('queryParams')) {
								console.log('in queryparams');
								let data = JSON.parse(localStorage.getItem('queryParams'));
								this.userProfile(data.candidateId, this.getPercentageMatchQueryParams(data.candidateId), this.getLocationMatchQueryParams(data.canidateId));
							} else {
								this.userProfile(firstUser.id, this.getPercentageMatch(firstUser), this.getLocationMatch(firstUser));
							}
							console.log('employeeReferrals Users: ', this.getPercentageMatch(firstUser));
							this.postLoader = false;							
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
							// this.userProfile(firstUser.id, this.getPercentageMatch(firstUser), this.getLocationMatch(firstUser));
							if (localStorage.getItem('queryParams')) {
								console.log('in queryparams');
								let data = JSON.parse(localStorage.getItem('queryParams'));
								this.userProfile(data.candidateId, this.getPercentageMatchQueryParams(data.candidateId), this.getLocationMatchQueryParams(data.canidateId));
							} else {
								this.userProfile(firstUser.id, this.getPercentageMatch(firstUser), this.getLocationMatch(firstUser));
							}
							this.postLoader = false;							
						} else {
							this.hasCandidates = Loading.error;
							this._jobDetailsService.isStagesDisabled = Loading.error;
						}
					});
					break;
			}

		});
	};

	loadCandidatesAtTheEnd(event) {
		if (event.target.scrollHeight - event.target.scrollTop - event.target.offsetHeight === 0) {
			if (this._activeStage == -2 ) {
				this.loadMoreCandidates(event.target);
			} else {
				return;
			}
			console.log('No more candidates to load');
		}
	};

	loadMoreCandidatesAnotherStage(candidatesBlock) {
		let difference = this.candidatesCount - this._from;
		
		if (this._from < this._candidatesCount) {
			this.postLoader = true;
			console.log('LOAD MORE......');
			this._jobDetailsService.isStagesDisabled = Loading.loading;
			this._from += 10;
			this._limit += 10;
			this._displayLoader = true;
            let someArrayOfIds = [];
			let suggestionsCut =  Object.assign({},this.SuggestedCandidates);
			suggestionsCut.developersSorted.slice(this._from,this._limit).forEach(dev => {
				someArrayOfIds.push(dev.id);
				console.log('Slice array', dev.id, dev.weight);
			});
            
			switch (this._activeStage) {
				case DeveloperListType.suggested:
                    this._candidatesService.getDevelopersById(someArrayOfIds).then(result => {
                        console.log('RESULT FROM GET DEVS BY ID',result);
                        this.candidates.results = this.candidates.results.concat(result.results);
						this._jobDetailsService.isStagesDisabled = Loading.success;
						this.postLoader = false;
                    });
					break;

				case DeveloperListType.applied:
					this._candidatesService.getAppliedCandidates(this.contractId, this._from, this._limit).then(suggestions => {
						this.candidates.weights = Object.assign({}, this.candidates.weights, suggestions.weights);
						this.candidates.distances = Object.assign({}, this.candidates.distances, suggestions.distances);
						this.candidates.results = this.candidates.results.concat(suggestions.results);
						this.scrollTo(candidatesBlock, candidatesBlock.scrollTop + candidatesBlock.offsetHeight, 500);
						this._jobDetailsService.isStagesDisabled = Loading.success;
						this.postLoader = false;						
					}, error => {
						console.error(error);
					});
					break;
			}
		} else {
			this.postLoader = false;
		}
	}

	loadMoreCandidates(candidatesBlock) {
		if (this._limit > this._candidatesCount) {
			return;
		}
		console.log(this._candidatesCount, ' this._candidatesCount IN LOAD MORE FNC');
		console.log(this._from, ' THIS FROM IN LOAD MORE FNC');
		if (this._from < this._candidatesCount) {
			this.postLoader = true;
			console.log('LOAD MORE......');
			this._jobDetailsService.isStagesDisabled = Loading.loading;
			this._from += 10;
			this._limit += 10;
			this._displayLoader = true;
            let someArrayOfIds = [];
			let suggestionsCut = this.copySuggestedCandidates;
			let sortedArray = this.sortedArray;
			if (this.sortMethod === 'weight') { // checking if the sort method changes
				suggestionsCut = _.sortBy(suggestionsCut, 'weight').reverse();
				sortedArray = _.sortBy(sortedArray, 'weight').reverse();
			} else if (this.sortMethod === 'distance') { // checking sort method for the correct distance === -1 visibility
				suggestionsCut = _.sortBy(suggestionsCut, function(item) {
					if (item.distance === -1) {
						return 99999; // if distance === -1 returning it for 99999 to be item in the end
					}
					return item.distance;
				});
				sortedArray = _.sortBy(sortedArray, function(item) {
					if (item.distance === -1) {
						return 99999; // if distance === -1 returning it for 99999 to be item in the end
					}
					return item.distance;
				});
			};
			console.log(sortedArray);

			if (this.sortBySkills === true || this.sortByRelocation === true || this.sortByCountry === true) {
				sortedArray.slice(this._from,this._limit).forEach(dev => {
					someArrayOfIds.push(dev.id);
					console.log('Slice array', dev.id, dev.weight);
				});
			} else {
				suggestionsCut.slice(this._from,this._limit).forEach(dev => {
					someArrayOfIds.push(dev.id);
					console.log('Slice array', dev.id, dev.weight);
				});
			};
			
            
			switch (this._activeStage) {
				case DeveloperListType.suggested:
                    this._candidatesService.getDevelopersById(someArrayOfIds).then(result => {
                        console.log('RESULT FROM GET DEVS BY ID',result);
                        this.candidates.results = this.candidates.results.concat(result.results);
						this._jobDetailsService.isStagesDisabled = Loading.success;
						this.postLoader = false;
                    });
					break;

				case DeveloperListType.applied:
					this._candidatesService.getAppliedCandidates(this.contractId, this._from, this._limit).then(suggestions => {
						this.candidates.weights = Object.assign({}, this.candidates.weights, suggestions.weights);
						this.candidates.distances = Object.assign({}, this.candidates.distances, suggestions.distances);
						this.candidates.results = this.candidates.results.concat(suggestions.results);
						this.scrollTo(candidatesBlock, candidatesBlock.scrollTop + candidatesBlock.offsetHeight, 500);
						this._jobDetailsService.isStagesDisabled = Loading.success;
						this.postLoader = false;						
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

    loadCountries() {
        if (this.countriesSourcing.length == 0) {
            const query = this._parse.Query('Country');
            query.ascending('Country');
            query.find().then(res => {
                res.forEach((country, index) => {
                    this.countriesSourcing.push({
                        country: country,
                        checked: false
                    });

                    if (this.contractObj) {
                        this.contractObj.get('countriesSourcing').forEach(countryObj => {
                            if (country.id == countryObj.id) {
                                this.countriesSourcing[index].checked = true;
                            }
                        });
                    }
                });
            });
        }
        return 'success';
    }
    addCountries(){
        const addCount = this._root_vcr.createComponent(Modal1Component);
        this.loadCountries();
        console.log(this.countriesSourcing);
        setTimeout(() => {
            addCount.countries = this.countriesSourcing;
        }, 0);
        addCount.closeModal.subscribe(() => {
            this._root_vcr.clear();
        });
    }

	getPercentageMatch(user: ParseUser): number {
		const developerId = user.get('developer').id;
		return this.candidates.weights[developerId] ? this.candidates.weights[developerId] : 0;
	}

	getLocationMatch(user: ParseUser): number {
		const developerId = user.get('developer').id;
		let unitCoefficient = (this.unitPreference == 2) ? 0.67 : 1;
		return this.candidates.distances[developerId] ? Math.round(this.candidates.distances[developerId] * unitCoefficient) : 0;
	}

	getPercentageMatchQueryParams(user): number {
		return this.candidates.weights[user] ? this.candidates.weights[user] : 0;
	}

	getLocationMatchQueryParams(user): number {
		let unitCoefficient = (this.unitPreference == 2) ? 0.67 : 1;
		return this.candidates.distances[user] ? Math.round(this.candidates.distances[user] * unitCoefficient) : 0;
	}

	userProfile(userId: string, candidateWeight: number, candidateDistance: number) {
		this.userId = userId;
		this.candidateWeight = candidateWeight;
		this.candidateDistance = candidateDistance;
	}

	errorHandler(event) {
		event.target.src = '../../../assets/img/default-userpic.png';
	}
   
	loadCountryList () {
		let countryArray = [];
		this.copySuggestedCandidates.forEach(candidate => {
			countryArray.push(candidate.country);
		})
		countryArray.forEach(country => {
			if (this.countryArray.indexOf(country) == -1) {
				this.countryArray.push(country);
			}
		})
	}

	checkIdOfDev(value,e){
        if (e.checked) {
        console.log('Id of dev', value);
        this.arrayOfDevs.push(value);
        console.log('Array if true', this.arrayOfDevs);
        }
        else {
            let index = this.arrayOfDevs.indexOf(value);
            if (index !== -1) {
                this.arrayOfDevs.splice(index,1);
            }
            console.log('Array if false', this.arrayOfDevs);
        }
    }
    sendEmail(){
        const email = this._root_vcr.createComponent(GmailComponent);
        email.userId = this.arrayOfDevs;
        email.contractId = this.contractId;
        email.saveNote = true;
        email.saveChat = true;
        email.needTemplates = true;
        email.templateOptions = ['all'];
        email.emailBody = '';
        email.emailSubj = '';
        email.attachments = [];
        const onSendSubscription = email.onSend.subscribe(e => {
            this._router.navigate(['/', 'jobs', this.contractId, 'candidates', 'chat'], {skipLocationChange: true});
            console.log('onSend works');
            onSendSubscription.unsubscribe();
        });
    }

	sortBySkillFunc(){
        this._candidatesService.getSuggestedCandidates(this.contractId, 0, 1000).then(suggestions => {
            console.log('SUGGESTIONS: ', suggestions);
            if (suggestions && suggestions.results.length > 0) {
                suggestions.results.forEach(candidate=>{
                    console.log('Candidate id ==============', candidate.id);
                });
            }
            console.log('Suggestion results================', suggestions.results);
        });
	}

    selectionFunc(selectedAllValue) {
    	this.selectedAll = selectedAllValue;
    	if(!selectedAllValue) {
    		this.arrayOfDevs = [];
    		console.log('ArraYOFDEVSS', this.arrayOfDevs);
		}
	}

	get Loading() {
		return Loading;
	}

	ngOnDestroy() {
		this._stageSubscription.unsubscribe();
		this._candidatesCountSubscription.unsubscribe();
		this._jobDetailsService = null;
		// localStorage.removeItem('queryParams');
	}

	changeSortMethod(value) {
		this.postLoader = true;
		console.log('CHANGE SKILLS-LOCATION METHOD STARTED');
		let someArray = [];
		let copyLength = this.candidates.results.length;
		let newCopy = this.SuggestedCandidates;
		console.log(this.sortedArray, ' this.sortedArray');
		console.log(this.SuggestedCandidates.developersSorted, ' this.SuggestedCandidates.developersSorted');
		if (value == 'weight') {
			this.sortMethod = 'weight';
			
			if (this.sortBySkills === true || this.sortByRelocation === true || this.sortByCountry === true) {
				newCopy.developersSorted = _.sortBy(this.sortedArray, value).reverse();
			} else {
				newCopy.developersSorted = _.sortBy(this.SuggestedCandidates.developersSorted, value).reverse();
			} 
		} else if (value == 'distance') {
			this.sortMethod = 'distance';
			if (this.sortBySkills === true || this.sortByRelocation === true || this.sortByCountry === true) {
				newCopy.developersSorted = _.sortBy(this.sortedArray, function(item) {
					if (item.distance === -1) {
						return 99999;
					}
					return item.distance;
				});
			} else {
				newCopy.developersSorted = _.sortBy(this.SuggestedCandidates.developersSorted, function(item) {
					if (item.distance === -1) {
						return 99999;
					}
					return item.distance;
				});
				
			}
			console.log(newCopy.developersSorted);
		}
		this._from = 0;
		this._limit = 10;
		newCopy.developersSorted.slice(this._from,this._limit).forEach(res => {
			someArray.push(res.id);
		});
		this._candidatesService.getDevelopersById(someArray).then(getRes => {
			console.log('GET RES',getRes);
			this.candidates.results = this.candidates.results.concat(getRes.results);
			console.log('This candidate results after concat',this.candidates.results);
			this.postLoader = false;	
			return this.candidates.results;
		}).then(resultOfGet=>{
			console.log('ResultOfGet (2nd then)',resultOfGet);
			this.candidates.results = this.candidates.results.slice(copyLength);
			this.candidates.results = this.candidates.results.slice(0);
			this.postLoader = false;			
		});
		console.log('Candidates results: ', this.candidates.results);
		console.log('SuggestedCandidates: ', this.SuggestedCandidates);
	}

	skillsChecked (value: Array<any>) {
		this.sortBySkills = true;
		if (value.length === 0 || value.length === 3) {
			this.sortBySkills = false;
		}
	}

	relocationChecked (value: Array<any>) {
		this.sortByRelocation = true;
		if (value.length === 0) {
			this.sortByRelocation = false;
		}
	}

	countryChecked (value: Array<any>) {
		this.countriesCount = value.length;
		this.sortByCountry = true;
		if (value.length === 0) {
			this.sortByCountry = false;
		} 
	}

	addToFiltersParameters (value: string) {
		value.toString();
		if (this.filtersParameters.length === 0) {
			this.filtersParameters.push(value);
			this.filterCandidates(this.filtersParameters);
			return;
		};
		if (this.filtersParameters.length > 0) {
			if (this.filtersParameters.includes(value)) {
				this.filtersParameters.splice(this.filtersParameters.indexOf(value), 1);
				this.filterCandidates(this.filtersParameters);				
				return;
			};
			if (!this.filtersParameters.includes(value)) {
				this.filtersParameters.push(value);
				this.filterCandidates(this.filtersParameters);
			}
		};
	}

	filterCandidates (value) {
		this.postLoader = true;
		let sortedIdArray = [];
		this._from = 0; // setting new limit for scroll load function
		this._limit = 10; // setting new limit for scroll load function

		if (this.sortMethod === 'weight') { // checking if the sort method changes
			this.copySuggestedCandidates = _.sortBy(this.copySuggestedCandidates, 'weight').reverse();
		} else if (this.sortMethod === 'distance') { // checking sort method for the correct distance === -1 visibility
			this.copySuggestedCandidates = _.sortBy(this.copySuggestedCandidates, function(item) {
				if (item.distance === -1) {
					return 99999; // if distance === -1 returning it for 99999 to be item in the end
				}
				return item.distance;
			});
		};

		let sortedArray = this.copySuggestedCandidates; 

		if (this.sortBySkills === true) {
			sortedArray = sortedArray.filter(candidate => { // filtering the inital array and making a new sortedArrayBySkills
				if (value.includes('greatFit')) {
					if (value.includes('greatFit') && !value.includes('goodFit') && !value.includes('potentialFit')) { // case if only 'Great Fit' is choosen
						return candidate.weight > 70;
					};
					if (value.includes('goodFit')) { // case if 'Good Fit' and 'Great Fit' are choosen 
						return candidate.weight >= 30;
					};
					if (value.includes('potentialFit')) { // case if 'Potential Fit' and 'Good Fit' are choosen
						if (candidate.weight > 70) {
							return candidate.weight;
						} else if (candidate.weight < 30) {
							return candidate.weight;
						} 
					};
				};
				if (value.includes('goodFit') && !value.includes('greatFit')) {
					if (value.includes('potentialFit')) { //case if 'Good Fit' and 'Potential Fit' are choosen
						return candidate.weight < 70;
					}
					if ((candidate.weight < 70 && candidate.weight > 30)) { //case if only 'Good Fit' is choosen
						return candidate.weight;
					};
				};
				if (value.includes('potentialFit') && !value.includes('greatFit') && !value.includes('goodFit')) { // case if only 'Potential Fit' is choosen
					return candidate.weight <= 30;
				};
			});
		};

		if (this.sortByRelocation === true) {
			let array = [];
			if (value.includes('international') && value.includes('national')) {
				let array = [];
				sortedArray.forEach(candidate => {
					if (candidate.isNationalRelocate || candidate.isInternationalRelocate) {
						array.push(candidate);
					}
				});
				sortedArray = array;
				if (this.sortMethod === 'weight') { // checking if the sort method changes
					sortedArray = _.sortBy(sortedArray, 'weight').reverse();
				} else if (this.sortMethod === 'distance') { // checking sort method for the correct distance === -1 visibility
					sortedArray = _.sortBy(sortedArray, function(item) {
						if (item.distance === -1) {
							return 99999; // if distance === -1 returning it for 99999 to be item in the end
						}
						return item.distance;
					});
				};
			} else {
				sortedArray = sortedArray.filter(candidate => {
					if (value.includes('international')) {
						return candidate.isInternationalRelocate === true;
					};
					if (value.includes('national')) {
						return candidate.isNationalRelocate === true;
					};
				})
			}
		};

		if (this.sortByCountry === true) {
			let array = [];
			value.forEach(element => {
				sortedArray.forEach(candidate => {
					if (candidate.country === element) {
						array.push(candidate);
					}
				})
			});
			sortedArray = array;
			if (this.sortMethod === 'weight') { // checking if the sort method changes
				sortedArray = _.sortBy(sortedArray, 'weight').reverse();
			} else if (this.sortMethod === 'distance') { // checking sort method for the correct distance === -1 visibility
				sortedArray = _.sortBy(sortedArray, function(item) {
					if (item.distance === -1) {
						return 99999; // if distance === -1 returning it for 99999 to be item in the end
					}
					return item.distance;
				});
			};
		}

		this.sortedArray = sortedArray; // setting the global sortedArrayBySkills for loading more function
		this._candidatesCount = sortedArray.length; // making a new candidates count

		if ((sortedArray.length === this.copySuggestedCandidates.length)) {
			this.candidatesCount = 0;
		} else {
			this.candidatesCount = sortedArray.length;
		}
		if (sortedArray.length >= 10) { // checking if there are more than 10 sorted candidates, not to display more than 10
			sortedArray.slice(0,10).forEach(candidate => {
				sortedIdArray.push(candidate.id);
			});
		} else { // checking if there are less than 10 candidates to dislpay less count
			sortedArray.forEach(candidate => {
				sortedIdArray.push(candidate.id);
			});
		}; 

		this._candidatesService.getDevelopersById(sortedIdArray).then(getRes => {
			this.candidates.results = getRes.results;
			this.postLoader = false;
			return this.candidates.results;
		});
	}
}
