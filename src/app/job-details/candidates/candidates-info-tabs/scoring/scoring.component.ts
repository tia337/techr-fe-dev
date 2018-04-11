import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScoringService } from './scoring.service';
import { DatePipe } from '@angular/common';
import { Parse } from '../../../../parse.service';
import { ParseUser, ParsePromise, ParseObject } from 'parse';
import { CandidatesService } from '../../candidates.service';
import { FinalVerdict } from '../../../../shared/utils';
import { RootVCRService } from '../../../../root_vcr.service';
import { ScoreCandidateComponent } from '../scorecards-assessments/score-candidate/score-candidate.component';
import { PreviewScoringComponent } from './preview-scoring/preview-scoring.component';
import { GmailComponent } from 'app/gmail/gmail.component';
import { PreviewScoringService } from 'app/job-details/candidates/candidates-info-tabs/scoring/preview-scoring/preview-scoring.service';
import * as _ from 'underscore';
import * as jsPDF from 'jspdf'

@Component({
	selector: 'app-scoring',
	templateUrl: './scoring.component.html',
	styleUrls: ['./scoring.component.scss']
})
export class ScoringComponent implements OnInit, OnDestroy {

	private _contractId: string;
	private _scorings: ParseObject[];
	// private date: string;
	private curUserId: string;
	// stars: number = 3;
	private _userIdSubscriprion;

	// candidateId
	// contractId
	// scorecard
	contractTitle;
	subject;

	body;
	tmpScore;
	scorecard;
	candidate;

	editLoader: any[] = [];
	previewLoader: any[] = [];
	emailLoader: any[] = [];

	constructor(
		private _ScoringService: ScoringService,
		private _parse: Parse,
		private _candidatesService: CandidatesService,
		private _root_vcr: RootVCRService,
		private _previewServ: PreviewScoringService
	) {
	}
	ngOnInit() {
		this._contractId = this._candidatesService.contractId;
		this._userIdSubscriprion = this._candidatesService.userId.subscribe(userId => {
			this.curUserId = this._parse.getCurrentUser().id;
			this._ScoringService.getScoring(userId, this._contractId).then(result => {
				this._scorings = result;
				this.readScoringCard(this._scorings);
			});
		});
		const query = this._parse.Query('Contract');
		query.get(this._contractId).then(result => {
			if (result) {
				this.contractTitle = result.get('title');
			}
		});
	}

	readScoringCard (scorings: Array<any>) {
		const scorecardQuery = new this._parse.Parse.Query('ScorecardWeightedScore');
		const currentUser: ParseObject = this._parse.getCurrentUser();
		scorings.forEach(scoring => {
			scorecardQuery.equalTo('objectId', scoring.id).find().then(result => {
				const taggedArray: Array<any> = result[0].get('TaggedColleagues');
				taggedArray.forEach(tagged => {
					if (tagged.id === currentUser.id) {
						const arrayIsRead = result[0].get('isReadByTaggedColleagues');
						if (arrayIsRead !== undefined && !arrayIsRead.includes(currentUser.id)) {
							arrayIsRead.push(currentUser.id);
							result[0].set('isReadByTaggedColleagues', arrayIsRead);
							result[0].save();
							return;
						} else if (arrayIsRead === undefined) {
							result[0].set('isReadByTaggedColleagues', [currentUser.id]);
							result[0].save();
						};
					}
				});
			});
		});
	}

	get FinalVerdict() {
		return FinalVerdict;
	}
	ngOnDestroy() {
		this._userIdSubscriprion.unsubscribe();
	}
	editScorecard(scorecardWeightedScore: ParseObject) {
		this.editLoader.push(scorecardWeightedScore.id);
		console.log('editLoader = true');
		console.log(scorecardWeightedScore);
		const editScorecardModal = this._root_vcr.createComponent(ScoreCandidateComponent);
		editScorecardModal.candidate = scorecardWeightedScore.get('Candidate');
		editScorecardModal.contract = scorecardWeightedScore.get('Job');
		editScorecardModal.scorecard = scorecardWeightedScore.get('Scorecard');
		editScorecardModal.onLoadFinnished.subscribe(() => {
			const index = this.editLoader.indexOf(scorecardWeightedScore.id);
			this.editLoader.splice(index, 1);
		});

	}

	isMyScoring(weightedScore) {
		return weightedScore.get('Author').equals(this._parse.Parse.User.current());
	}

	previewScoring(scorecardWeightedScore: ParseObject) {
		this.previewLoader.push(scorecardWeightedScore.id);
		const preview = this._root_vcr.createComponent(PreviewScoringComponent);
		preview._contractId = this._contractId;
		preview.subjectForMail = this.subject;
		preview.contractTitle = this.contractTitle;
		preview.bodyForMail = this.body;
		preview.scorecardWeightedScore = scorecardWeightedScore;
		preview.onLoadFinnished.subscribe(() => {
			const index = this.previewLoader.indexOf(scorecardWeightedScore.id);
			this.previewLoader.splice(index, 1);
		});
	}
	mailIt(score) {
		this.emailLoader.push(score.id);
		this.tmpScore = score;
		this.scorecard = score.get('Scorecard');
		this.candidate = score.get('Candidate');
		this.subject = `Scorecard – ${this.candidate.get('firstName')} ${this.candidate.get('lastName')} - ${this.contractTitle}.`;
		this.body = ['Please find attached the Scorecard of', this.candidate.get('firstName'), this.candidate.get('lastName')];
		this.body.push('for the');
		this.body.push(this.contractTitle);
		this.body.push(' position.\n\nLet me know your thoughts when you have a chance!\n\nKind Regards\n');
		this.body.push(`\r${this._ScoringService.getCurrentUser().get('firstName')}`);
		this.body.push(this._ScoringService.getCurrentUser().get('lastName'));
		this.body = this.body.join(' ');
		let areas;
		let qa;
		let groupedQuestions;
		let notes;
		let areaScorings;
		this._previewServ.getScorecardsAreas(this.scorecard).then(as => {
			areas = as;
			return this._previewServ.getScorecardsQuestions(this.scorecard);
		}).then(questions => {
			qa = questions;
			groupedQuestions = _.groupBy(questions, question => {
				return question.get('ScorecardArea').id;
			});
			return this._previewServ.getScorecardsQuestionNotes(score);
		}).then(ns => {
			notes = _.indexBy(ns, note => {
				return note.get('Question').id;
			});
			return this._previewServ.getScorecardAreaScorings(score);
		}).then(ars => {
			areaScorings = _.indexBy(ars, areaScoring => {
				return areaScoring.get('ScorecardArea').id;
			});
		}).then(res => {
			let y = 100;
			const pdf = new jsPDF('p', 'pt', 'a4');
			this.pdfDrawNameListTitle(pdf);
			if (areas && groupedQuestions && notes && areaScorings) {
				for (let area of areas) {
					y = this.addPageAndMoveYAREA(pdf, y);
					if (areas.indexOf(area) > 0) {
						pdf.setLineWidth(1);
						pdf.line(15, y - 20, 580, y - 20);
					}
					y = this.pdfDrawAreaName(pdf, y, area.get('AreaTitle'), areaScorings[area.id].get('Scoring'));
					pdf.setFontSize(12);
					for (let i = 0; i < groupedQuestions[area.id].length; i++) {
						const qIndex = i + 1;
						const question = groupedQuestions[area.id][i];
						const t2 = notes[question.id].get('QuestionNote');
						y = this.pdfDrawQuestion(pdf, qIndex, y, question.get('Question'));
						y = this.pdfDrawAnswer(pdf, qIndex, y, t2);
						y += 10;
					}
				}
				this.pdfPrintVerdict(pdf, y, score);
			}


			// ---------------------------------GMAIL---------------------------------
			const name = this.candidate.get('firstName') + this.candidate.get('lastName');
			const z = this.dataURLtoFile(pdf.output('datauristring'), name + '_Scorecard.pdf');
			const email = this._root_vcr.createComponent(GmailComponent);
			email.contractId = this._contractId;
			email.needTemplates = false;
			email.emailBody = this.body ? this.body : 'No Mail body configured';
			email.emailSubj = this.subject ? this.subject : 'No Mail subject configured';
			email.attachments = new Array();
			email.attachments.push(z);
			const index = this.emailLoader.indexOf(score.id);
			this.emailLoader.splice(index, 1);
		});
	}
	dataURLtoFile(dataurl, filename) {
		let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	}
	pdfDrawNameListTitle(pdf: jsPDF) {
		const fullname = `Candidate: ${this.candidate.get('firstName')} ${this.candidate.get('lastName')}`;
		// let title: string = `${this.contractTitle} Scorecard: ${this.scorecard.get('ScorecardTitle')}`;
		let typeName;
		let contractTitle: string = `Job: ${this.contractTitle}`;
		let scorecardTitle: string = `Scorecard: ${this.scorecard.get('ScorecardTitle')}`;
		// title = title.toUpperCase();
		if (scorecardTitle.length > 71) {
			scorecardTitle = scorecardTitle.slice(0, 68) + '...';
		} else {
			// scorecardTitle = this.ft_createSpaces((51 - scorecardTitle.length) / 2) + scorecardTitle;
		}
		if (contractTitle.length > 61) {
			contractTitle = contractTitle.slice(0, 58) + '...';
		} else {
			// contractTitle = this.ft_createSpaces((51 - contractTitle.length) / 2) + contractTitle;
		}
		pdf.setFontSize(12);
		pdf.text(20, 20, fullname);
		switch (this.scorecard.get('Scorecard_type')) {
			case 1: typeName = 'Phone Interview stage';
				break;
			case 2: typeName = 'F2F Interview stage';
				break;
			default: typeName = 'No type';
		}
		pdf.text(450, 20, typeName);
		pdf.setFontSize(18);
		pdf.setFont('helvetica');
		pdf.setFontType('bold');
		pdf.text(15, 50, contractTitle);
		pdf.text(15, 70, scorecardTitle);
		// pdf.text(-80, 70, title);
		pdf.setFont('courier');
		pdf.setFontType('normal');
		pdf.rect(15, 80, 565, 740, 'dashed');
	}
	ft_createSpaces(count) {
		let str;

		count = Math.floor(count * 2);
		str = '';
		while (count > 0) {
			str += ' ';
			count--;
		}
		return (str);
	}
	remove_non_ascii(str) {
		if ((str === null) || (str === ''))
			return false;
		else
			str = str.toString();

		return str.replace(/[^\x20-\x7E]/g, '');
	}
	pdfPrintVerdict(pdf: jsPDF, y, scorescore) {
		if (y > 700) {
			pdf.addPage();
			y = 110;
			pdf.rect(15, 80, 565, 740, 'dashed');
		} else {
			y = 652;
		}
		let notes = scorescore.get('FinalVerdictNotes');
		pdf.setFontSize(14);
		pdf.setFontStyle('italic');
		if (notes) {
			notes = notes.trim();
		}
		let a, n;
		n = 0;
		a = notes;
		if (a && a.length < 57) {
			this.remove_non_ascii(a);
			pdf.text(51, y, '"' + a + '"');
			y += 30;
		} else if (a) {
			this.remove_non_ascii(a);
			pdf.text(44, y, '"');
			while (1) {
				if (a.length > 57 && n < 4) {
					pdf.text(51, y, a.slice(0, 57));
					a = a.slice(57).trim();
					y += 20;
				} else {
					if (a.length > 57) {
						pdf.text(51, y, a.slice(0, 53) + '..."');
					} else {
						pdf.text(51, y, a + '"');
					}
					y += 30;
					break;
				}
				n++;
			}
		}

		pdf.setFontSize(16);
		pdf.text(410, y, 'Average Eval: ' + Math.round(scorescore.get('WeightedScore')) + '/5');
		pdf.setFontType('bold');
		pdf.text(50, y, 'Should we move this candidate');
		pdf.text(50, y + 20, 'to the next stage?');
		y += 30;
		switch (this.tmpScore.get('FinalVerdict')) {
			case 1: pdf.text(430, y, 'Not Sure');
				break;
			case 2: pdf.text(430, y, 'Yes');
				break;
			case 3: pdf.text(430, y, 'Definitely');
				break;
			default: pdf.text(430, y, 'No Answer');
		}
	}
	pdfDrawAreaName(pdf: jsPDF, y, area, score) {
		pdf.setFontSize(18);
		pdf.setLineWidth(1);

		let b = 0;
		let a = area;
		if (a.length < 35) {
			pdf.line(15, y + 6, 580, y + 6);
			pdf.text(50, y, a);
		} else {
			b = -30;
			while (a.length > 35) {
				pdf.text(50, y, a.slice(0, 35));
				a = a.slice(35);
				y += 30;
			}
			// while (1) {
			// 	if (a.length > 35 ) {
			// 		pdf.text(51, y, a.slice(0, 35));
			// 		a = a.slice(35);
			// 		y += 20;
			// 	} else {
			// 		if (a.length > 35) {
			// 			pdf.text(51, y, a.slice(0, 32) + '...');
			// 		} else {
			// 			pdf.text(51, y, a + '');
			// 		}
			// 		y += 30;
			// 		break;
			// 	}
			// }
			y -= 30;
			pdf.line(15, y + 6, 580, y + 6);
		}
		pdf.text(450, y + b, 'Eval. ' + score + '/5');
		y += 30;
		return (y);
	}
	pdfDrawQuestion(pdf: jsPDF, qIndex, y, answ) {
		answ = 'Q' + qIndex + ': ' + answ;
		const characters = 60;
		const margin_bottom = 22;
		pdf.setFontSize(12);
		answ = answ.replace(new RegExp('\n', 'g'), ' ');
		pdf.setLineWidth(1);
		pdf.line(70, y + 4, 520, y + 4);
		if (answ.length > characters) {
			const arr = answ.split(' ');
			let sumStr = '';
			for (let dd = 0; dd < arr.length; dd++) {
				if ((sumStr.length + arr[dd].length + 1) > characters && !(dd == (arr.length - 1))) {
					y = this.addPageAndMoveY(pdf, y);
					pdf.text(70, y, sumStr);
					y += margin_bottom;
					sumStr = arr[dd];
				} else if ((sumStr.length + arr[dd].length + 1) <= characters && !(dd == (arr.length - 1))) {
					sumStr = sumStr + ' ' + arr[dd];
				} else if (dd == (arr.length - 1)) {
					y = this.addPageAndMoveY(pdf, y);
					pdf.text(70, y, sumStr);
					y += margin_bottom;
				}
			}
		} else {
			y = this.addPageAndMoveY(pdf, y);
			pdf.text(75, y, answ);
			y += margin_bottom;
		}
		return (y);
	}
	pdfDrawAnswer(pdf: jsPDF, qIndex, y, answ: string) {
		const characters = 60;
		const margin_bottom = 22;
		pdf.setFontSize(12);
		answ = 'A: ' + answ;
		answ = answ.replace(new RegExp('\n', 'g'), ' ');
		if (answ.length > characters) {
			const arr = answ.split(' ');
			let sumStr = '';
			let first = true;
			for (let dd = 0; dd < arr.length; dd++) {
				if ((sumStr.length + arr[dd].length + 1) > characters && !(dd == (arr.length - 1))) {
					y = this.addPageAndMoveY(pdf, y);
					pdf.text(first ? 75 : 85, y, sumStr);
					first = false;
					y += margin_bottom;
					sumStr = arr[dd];
				} else if ((sumStr.length + arr[dd].length + 1) <= characters && !(dd == (arr.length - 1))) {
					sumStr = sumStr + ' ' + arr[dd];
				} else if (dd == (arr.length - 1)) {
					y = this.addPageAndMoveY(pdf, y);
					pdf.text(85, y, sumStr);
					y += margin_bottom;
				}
			}
		} else {
			y = this.addPageAndMoveY(pdf, y);
			pdf.text(75, y, answ);
			y += margin_bottom;
		}
		return (y);
	}
	addPageAndMoveY(pdf: jsPDF, y) {
		if (y > 750) {
			pdf.addPage();
			pdf.roundedRect(15, 20, 565, 800, 5, 1, 'S');
			return (50);
		} else {
			return (y);
		}
	}
	addPageAndMoveYAREA(pdf: jsPDF, y) {
		if (y > 650) {
			pdf.addPage();
			pdf.roundedRect(15, 30, 565, 790, 5, 1, 'S');
			return (50);
		} else {
			return (y);
		}
	}

	get scorings() {
		return this._scorings;
	}
}
