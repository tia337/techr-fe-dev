import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';

@Component({
	selector: 'question',
	templateUrl: './question.component.html',
	styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input('parentFormGroup') parentFormGroup: FormGroup;
	@Input('question') question: FormGroup;

	@ViewChild('questionElement') questionElement: ElementRef;

	constructor(private _formBuilder: FormBuilder) {}

	ngOnInit() {

		// this._questionService.parentFormGroup = this.parentFormGroup;
		// this._questionService.addElement(this.questionElement);
	}

	ngAfterViewInit() {
		// console.log(this.questionElement);
		// this.setFocus();
		// console.log(this.questionElement);

	}


	addQuestionForm() {
		const questionForm = <FormArray>this.parentFormGroup.controls['questions'];
		questionForm.push(
			this._formBuilder.group({
				content: ''
			})
		);

		// this._questionService.addQuestionForm();
	}

	ngOnDestroy() {
		console.log('Destroyed');
		this.parentFormGroup = null;
		this.question = null;
		this._formBuilder = null;
		this.questionElement = null;
	}

	setFocus(): void {
		this.questionElement.nativeElement.focus();
	}

	getIndex(): number {
		const questionForm = <FormArray>this.parentFormGroup.controls['questions'];
		return questionForm.controls.indexOf(this.question);
	}

	removeQuestionForm() {
		const questionForm = <FormArray>this.parentFormGroup.controls['questions'];
		// let index = questionForm.controls.indexOf(this.question);
		const index = this.getIndex();
		if (questionForm.length > 1) {
			questionForm.removeAt(index);
		}
	}

	handleKeysEvents(event) {
		if(event.keyCode === 13 && !event.shiftKey) {
			event.preventDefault();
			this.addQuestionForm();
			console.log(this.parentFormGroup);

		}
		if(event.target.value.length === 0 && event.keyCode === 8) {
			this.removeQuestionForm();
		}
	}

}
