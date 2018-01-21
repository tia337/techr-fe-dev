import { Component, OnInit, EventEmitter } from '@angular/core';
import { RootVCRService } from '../../../../../root_vcr.service';
import { FinalVerdict } from '../../../../../shared/utils';
import { PreviewScoringService } from './preview-scoring.service';
import * as _ from 'underscore';
import { ScoreCandidateComponent } from '../../scorecards-assessments/score-candidate/score-candidate.component';
import { Parse } from '../../../../../parse.service';
import { GmailComponent } from 'app/gmail/gmail.component';
import * as jsPDF from 'jspdf';
import { ScoringService } from 'app/job-details/candidates/candidates-info-tabs/scoring/scoring.service';

@Component({
	selector: 'app-preview-scoring',
	templateUrl: './preview-scoring.component.html',
	styleUrls: ['./preview-scoring.component.scss']
})
export class PreviewScoringComponent implements OnInit {

	private _scorecardWeightedScore;

	scorecard;
	candidate;

	notes;

	private _areas;
	private _questions;
	private _areaScorings;

	groupedQuestions;

	_contractId;
	subjectForMail;
	bodyForMail;
	contractTitle;
	forMail = false;

	loaded: boolean = false;

	onLoadFinnished: EventEmitter<any> = new EventEmitter();

	constructor(private _root_vcr: RootVCRService, private _ScoringService: ScoringService, private _previewScoringService: PreviewScoringService, private _parse: Parse) { }

	ngOnInit() {
		this.loaded = false;
		this.scorecard = this._scorecardWeightedScore.get('Scorecard');
		this.candidate = this._scorecardWeightedScore.get('Candidate');

		this._previewScoringService.getScorecardsAreas(this.scorecard).then(areas => {
			this._areas = areas;
			return this._previewScoringService.getScorecardsQuestions(this.scorecard);
		}).then(questions => {
			this._questions = questions;
			this.groupedQuestions = _.groupBy(questions, question => {
				return question.get('ScorecardArea').id;
			});
			return this._previewScoringService.getScorecardsQuestionNotes(this._scorecardWeightedScore);
		}).then(notes => {
			this.notes = _.indexBy(notes, note => {
				return note.get('Question').id;
			});
			return this._previewScoringService.getScorecardAreaScorings(this._scorecardWeightedScore);
		}).then(areaScorings => {
			this._areaScorings = _.indexBy(areaScorings, areaScoring => {
				return areaScoring.get('ScorecardArea').id;
			});
			this.onLoadFinnished.emit();

			this._areas = this._areas.filter(area => {
				return !!this._areaScorings[area.id];
			});

			// this.groupedQuestions = this.groupedQuestions.filter(question => {
			// 	return !!this.notes[question.id];
			// });

			_.mapObject(this.groupedQuestions, (value, key) => {
				this.groupedQuestions[key] = value.filter(question => {
					return !!this.notes[question.id];
				});
			});
			this.loaded = true;

			console.log(this.groupedQuestions);
			console.log(this.notes);

		});
	}

	closePreviewModal() {
		this._root_vcr.clear();
	}

	editScorecard() {
		const scoreCandidateComponent = this._root_vcr.createComponent(ScoreCandidateComponent);
		scoreCandidateComponent.candidate = this._scorecardWeightedScore.get('Candidate');
		scoreCandidateComponent.contract = this._scorecardWeightedScore.get('Job');
		scoreCandidateComponent.scorecard = this._scorecardWeightedScore.get('Scorecard');
	}

	get isMyScoring() {
		return this._scorecardWeightedScore.get('Author').equals(this._parse.Parse.User.current());
	}

	set scorecardWeightedScore(value) {
		this._scorecardWeightedScore = value;
	}

	get scorecardWeightedScore() {
		return this._scorecardWeightedScore;
	}

	get FinalVerdict() {
		return FinalVerdict;
	}

	get areas() {
		return this._areas;
	}

	get areaScorings() {
		return this._areaScorings;
	}

	print() {
		window.print();
	}
	mailIt() {
		let y = 100;
		this.subjectForMail = `Scorecard – ${this.candidate.get('firstName')} ${this.candidate.get('lastName')} - ${this.contractTitle}.`;
		this.bodyForMail = ['Please find attached the Scorecard of', this.candidate.get('firstName'), this.candidate.get('lastName')];
		this.bodyForMail.push('for the');
		this.bodyForMail.push(this.contractTitle);
		this.bodyForMail.push(' position.\n\nLet me know your thoughts when you have a chance!\n\nKind Regards\n');
		this.bodyForMail.push(`\r${this._ScoringService.getCurrentUser().get('firstName')}`);
		this.bodyForMail.push(this._ScoringService.getCurrentUser().get('lastName'));
		this.bodyForMail = this.bodyForMail.join(' ');
		const pdf = new jsPDF('p', 'pt', 'a4');
		this.pdfDrawNameListTitle(pdf);
		if (this.areas && this.groupedQuestions && this.notes && this.areaScorings) {
			for (const area of this.areas) {
				y = this.addPageAndMoveYAREA(pdf, y);
				if (this.areas.indexOf(area) > 0) {
					pdf.setLineWidth(1);
					pdf.line(15, y - 20, 580, y - 20);
				}
				y = this.pdfDrawAreaName(pdf, y, area.get('AreaTitle'), this.areaScorings[area.id].get('Scoring'));
				pdf.setFontSize(12);
				for (let i = 0; i < this.groupedQuestions[area.id].length; i++) {
					const qIndex = i + 1;
					const question = this.groupedQuestions[area.id][i];
					const t2 = this.notes[question.id].get('QuestionNote');
					y = this.pdfDrawQuestion(pdf, qIndex, y, question.get('Question'));
					y = this.pdfDrawAnswer(pdf, qIndex, y, t2);
					y += 10;
				}
			}
			this.pdfPrintVerdict(pdf, y, this.scorecardWeightedScore);
		}

		const name = this.candidate.get('firstName') + this.candidate.get('lastName');
		const z = this.dataURLtoFile(pdf.output('datauristring'), name + '_Scorecard.pdf');
		const email = this._root_vcr.createComponent(GmailComponent);
		email.contractId = this._contractId;
		email.needTemplates = false;
		email.emailBody = this.bodyForMail ? this.bodyForMail : 'No Mail body configured';
		email.emailSubj = this.subjectForMail ? this.subjectForMail : 'No Mail subject configured';
		email.attachments = new Array();
		email.attachments.push(z);
	}
	dataURLtoFile(dataurl, filename) {
		const arr = dataurl.split(',');
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const mime = arr[0].match(/:(.*?);/)[1],
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	}
	pdfDrawNameListTitle(pdf: jsPDF) {
		const fullname = `Candidate: ${this.candidate.get('firstName')} ${this.candidate.get('lastName')}`;
		let title: string = `Scorecard: ${this.scorecard.get('ScorecardTitle')}`;
		let typeName;
		title = title.toUpperCase();
		if (title.length > 51) {
			title = title.slice(0, 48) + '...';
		} else {
			title = this.ft_createSpaces((51 - title.length) / 2) + title;
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
		pdf.text(10, 70, title);
		pdf.setFont('courier');
		pdf.setFontType('normal');
		pdf.rect(15, 80, 565, 720, );
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
	// pdfPrintVerdict(pdf: jsPDF, y, scorescore) {
	// 	console.log(y);
	// 	if (y > 700) {
	// 		pdf.addPage();
	// 		y = 110;
	// 		pdf.rect(15, 80, 565, 740, 'dashed');
	// 	} else {
	// 		y = 652;
	// 	}
	// 	const notes = scorescore.get('FinalVerdictNotes');
	// 	pdf.setFontSize(14);
	// 	pdf.setFontStyle('italic');
	// 	let a, n;
	// 	n = 0;
	// 	a = notes;
	// 	if (a && a.length < 57) {
	// 		pdf.text(51, y, '"' + notes + '"');
	// 		y += 30;
	// 	} else if (a) {
	// 		pdf.text(44, y, '"');
	// 		while (1) {
	// 			if (a.length > 57 && n < 4) {
	// 				pdf.text(51, y, a.slice(0, 57));
	// 				a = a.slice(57);
	// 				y += 20;
	// 			} else {
	// 				if (a.length > 57) {
	// 					pdf.text(51, y, a.slice(0, 53) + '..."');
	// 				} else {
	// 					pdf.text(51, y, a + '"');
	// 				}
	// 				y += 30;
	// 				break;
	// 			}
	// 			n++;
	// 		}
	// 	}
	// 	switch (this.scorecardWeightedScore.get('FinalVerdict')) {
	// 		case 1: pdf.text(430, y, 'Not Sure');
	// 			break;
	// 		case 2: pdf.text(430, y, 'Yes');
	// 			break;
	// 		case 3: pdf.text(430, y, 'Definitely');
	// 			break;
	// 		default: pdf.text(430, y, 'No Answer');
	// 	}
	// }
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
		switch (this.scorecardWeightedScore.get('FinalVerdict')) {
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
		console.log('area', area);
		if (a.length < 35) {
			pdf.line(15, y + 6, 580, y + 6);
			pdf.text(50, y, a);
		} else {
			b = -30;
			while (a.length > 35) {
				console.log('a', a);
				pdf.text(50, y, a.slice(0, 35));
				a = a.slice(35);
				y += 30;
			}
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
}
