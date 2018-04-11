import {
	Component, OnInit, OnDestroy, ViewChildren, ElementRef, QueryList, AfterViewInit,
	Renderer2, ViewChild, EventEmitter
} from '@angular/core';
import { RootVCRService } from '../../../../../root_vcr.service';
import { ScoreCandidateService } from './score-candidate.service';
import { ParseObject } from 'parse';
import { FormControl } from '@angular/forms';
import { IScoringOptions } from './score-candidate.interface';
import { AlertComponent } from '../../../../../shared/alert/alert.component';
import { Router } from '@angular/router';
import { FinalVerdict } from '../../../../../shared/utils';
import * as _ from 'underscore';
import { CandidateProfileService } from 'app/job-details/candidates/candidate-profile/candidate-profile.service';

@Component({
	selector: 'app-score-candidate',
	templateUrl: './score-candidate.component.html',
	styleUrls: ['./score-candidate.component.scss']
})
export class ScoreCandidateComponent implements OnInit, AfterViewInit, OnDestroy {

	private _candidate;
	private _contract;
	private _scorecard;
	private _areas;
	private _questions;
	private _team;
	private _questionListSubscription;

	// ScorecardWeightedScore ParseObject (if exists)
	private _scorecardWeightedScore;

	private scoringInProcess : boolean = false;

	public loadFinished = false;

	weightedScore = 0;
	verdict: string;
	finalMark: number;
	scoringExist = false;

	testvar = false;

	onLoadFinnished: EventEmitter<any> = new EventEmitter();

	@ViewChildren('questionList') questionsList: QueryList<ElementRef>;
	@ViewChild('finalVerdictElement') finalVerdictElement;


	constructor(
		private _root_vcr: RootVCRService,
		private _scoreCandidateService: ScoreCandidateService,
		private _router: Router,
		private _candidateProfileService: CandidateProfileService,
		private _renderer: Renderer2
	) {}

	ngOnInit() {
		this._scoreCandidateService.getScorecardWeightedScores(this._candidate, this._contract, this._scorecard).then(weightedScore => {
			this.finalMark = weightedScore.get('FinalVerdict');
			this.verdict = weightedScore.get('FinalVerdictNotes');
			this._scorecardWeightedScore = weightedScore;
		});

		this._scoreCandidateService.getScorecardAreas(this._scorecard).then(areas => {
			this._areas = areas.map(area => {
				return {
					area: area,
					rating: new FormControl(0)
				};
			});
			return this._scoreCandidateService.getScorecardAreaScoring(this._candidate, this._contract, areas);
		}).then(areaScorings => {
			// Update areas stars with existing values(if exists) for editing
			if (areaScorings && areaScorings.length > 0) {
				this.scoringExist = true;
				this._areas.map(area => {
					const existingAreaScoring = areaScorings.find(areaScoring => {
						return areaScoring.get('ScorecardArea').equals(area.area);
					});
					area.rating.patchValue(existingAreaScoring.get('Scoring'));
					area.parseObj = existingAreaScoring;
				});
				this.countAverage();
			}
		});

		this._scoreCandidateService.getScorecardQuestions(this._scorecard).then(questions => {
			const questionsObj = _.groupBy(questions, question => {
				return question.get('ScorecardArea').id;
			});

			this._questions = _.mapObject(questionsObj, areaQuestions => {
				return areaQuestions.map(question => {
					return {
						question: question,
						note: new FormControl()
					};
				});
			});

			return this._scoreCandidateService.getScorecardQuestionNotes(this._candidate, this._contract, questions);
		}).then(scorecardQuestionNotes => {
			// Update question notes with existing values(if exists) for editing
			if (scorecardQuestionNotes && scorecardQuestionNotes.length > 0) {
				this.scoringExist = true;
				console.log('ScorecardQuestionNotes');
				_.mapObject(this._questions, areaQuestions => {
					areaQuestions.map(question => {
						const existingQuestionNote = scorecardQuestionNotes.find(questionNote => {
							return questionNote.get('Question').equals(question.question);
						});
						question.note.patchValue(existingQuestionNote.get('QuestionNote'));
						question.parseObj = existingQuestionNote;
					});
				});
			}
		});

		this._scoreCandidateService.getTeamMembers().then(teamMembers => {
			this._team = teamMembers.map(member => {
				return {
					name: member.get('firstName') + member.get('lastName'),
					user: member
				};
			});
			this.loadFinished = true;
			this.onLoadFinnished.emit();
		});
	}

	ngAfterViewInit() {
		this._questionListSubscription = this.questionsList.changes.subscribe( list => {
			if (list.length > 0) {
				list.first.nativeElement.focus();
				this._questionListSubscription.unsubscribe();
			}
		});
	}

	close() {
		this._root_vcr.clear();
	}

	set candidate(value) {
		this._candidate = value;
	}

	get candidate() {
		return this._candidate;
	}

	set contract(value) {
		this._contract = value;
	}

	set scorecard(value) {
		this._scorecard = value;
	}

	get scorecard() {
		return this._scorecard;
	}

	get areas() {
		if (this._areas) {
			return this._areas;
		}
	}

	get team() {
		return this._team;
	}

	get questions() {
		if (this._questions) {
			return this._questions;
		}
	}

	countAverage() {
		let result = 0;
		const valuesArray = this._areas.map(area => {
			return area.rating.value;
		});
		valuesArray.forEach(starsValue => {
			result += starsValue;
		});
		this.weightedScore = result / valuesArray.length;
	}

	test(){
		console.log('test');
		// setTimeout(()=>{
		// 	this.scoringInProcess = true;
		// }, 2000)
		this.scoringInProcess = true;
		// this.scoringInProcess = true;
		// this.testvar = true;
	}

	scoreCandidate() {
		this.scoringInProcess = true;
		const options: IScoringOptions = {
			scorecard: this._scorecard,
			candidate: this._candidate,
			verdict: this.verdict,
			weightedScore: this.weightedScore,
			finalMark: this.finalMark,
			contract: this._contract,
			questions: [],
			taggedUsers: [],
			areas: this._areas
		};
		console.log(options.taggedUsers);

		if (this._scorecardWeightedScore) {
			options.ScorecardWeightedScore = this._scorecardWeightedScore;
		}
		_.mapObject(this._questions, areaQuestions => {
			areaQuestions.map(questionObj => {
				return options.questions.push(questionObj);
			});
		});

		if(this.verdict) {
			let taggedUsersName = this.verdict.match(/@\S+/g);

			if(taggedUsersName) {
				taggedUsersName = taggedUsersName.map(tag => {
					return tag.substr(1);
				});
				options.taggedUsers = this._team.filter(teamMember => {
					return taggedUsersName.includes(teamMember.name);
				}).map(teamMember => {
					return teamMember.user;
				});
			}
		}

		if (this.finalMark !== undefined) {
			let contract = this._contract;
			this._scoreCandidateService.scoreCandidate(options).then(res => {
				console.log('scoring result: ', res);
				return this._candidateProfileService.getScorecardWeightedScores(this._contract.id, this._candidate);
			}, error => {
				this.scoringInProcess = false;
				console.error(error);
			}).then(scorecardWeightedScores => {
				this._candidateProfileService.verdicts.definitely = scorecardWeightedScores.filter(score => {
					return score.get('FinalVerdict') === FinalVerdict.definitely;
				}).length;
				this._candidateProfileService.verdicts.yes = scorecardWeightedScores.filter(score => {
					return score.get('FinalVerdict') === FinalVerdict.yes;
				}).length;
				this._candidateProfileService.verdicts.notSure = scorecardWeightedScores.filter(score => {
					return score.get('FinalVerdict') === FinalVerdict.notSure;
				}).length;
				let scoreSum = 0;
				scorecardWeightedScores.forEach(scoreObject => {
					scoreSum += scoreObject.get('WeightedScore');
				});
				if (scorecardWeightedScores.length > 0) {
					this._candidateProfileService.scoreSum = scoreSum;
					this._candidateProfileService.scoreCount = scorecardWeightedScores.length;
				}
				this.scoringInProcess = false;
				const firstName : string = this._candidate.get('firstName');
				const lastName : string = this._candidate.get('lastName');
				this._root_vcr.clear();
				this._router.navigate(['/', 'jobs', contract.id, 'candidates', 'scoring'], {skipLocationChange: true});
				let alert = this._root_vcr.createComponent(AlertComponent);
				if(this.scoringExist){
					alert.title = 'Scoring successfully edited';
					alert.content = `Your scoring for ` + firstName + ' ' + lastName + ` was successfully edited.`;
				}else if(!this.scoringExist){
					alert.title = 'Candidate successfully scored!';
					alert.content = `New candidate scoring was successfully created!`;
				}
				alert.addButton({
					type: 'primary',
					title: 'OK',
					onClick: () => {
						console.log(this._contract);
						this._root_vcr.clear();
						alert = null;
					}
				});
			});
		} else {
			this.scoringInProcess = false;
			this._renderer.addClass(this.finalVerdictElement.nativeElement, 'validation-animation');
			setTimeout(() => {
				this._renderer.removeClass(this.finalVerdictElement.nativeElement, 'validation-animation');
			}, 1000);

		}
		console.log(this._contract);
	}
	get FinalVerdict() {
		return FinalVerdict;
	}

	ngOnDestroy() {
		this._questionListSubscription.unsubscribe();
		this.questionsList = null;
		this._candidate = null;
		this._contract = null;
		this._scorecard = null;
		this._areas = null;
		this._questions = null;
		this._team = null;
		this.weightedScore = null;
		this.verdict = null;
		this.finalMark = null;
	}
}
