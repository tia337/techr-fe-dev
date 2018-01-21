import { Component, OnInit, OnDestroy, Input, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ScorecardsService } from '../../scorecards.service';

@Component({
	selector: 'subform',
	templateUrl: './subform.component.html',
	styleUrls: ['./subform.component.scss']
})
export class SubformComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input('questionsForm') questionsForm: FormGroup;
	@Input('edit') edit?: boolean;

	@ViewChildren('questionsList') questionsList: QueryList<ElementRef>;


	private _questionListSubscription;
	private numOfQuestionsByDefault = 3;

	constructor(private _formBuilder: FormBuilder, private _scorecardService: ScorecardsService) { }

	ngOnInit() {
		if (!this._scorecardService.questions.value && !this.edit) {
			for (let i = 0; i < (this.numOfQuestionsByDefault - 1); ++i) {
				this.addQuestion();
			}
		}
	}

	ngAfterViewInit() {
		this._questionListSubscription = this.questionsList.changes.subscribe(questionObject => {
			setTimeout(() => {
				questionObject.last.setFocus();
			}, 0);
		});
	}


	ngOnDestroy() {
		this._formBuilder = null;
		this.questionsForm = null;
		this.numOfQuestionsByDefault = null;
		this._scorecardService = null;
		this._questionListSubscription.unsubscribe();
	}

	addQuestion() {
		const questionForm = <FormArray>this.questionsForm.controls['questions'];
		questionForm.push(
			this._formBuilder.group({
				content: ''
			})
		);
	}

	toFormArray(abstractControl) {
		return <FormArray>abstractControl;
	}

}


