import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { ScorecardsService } from '../scorecards.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-add-questions',
	templateUrl: './add-questions.component.html',
	styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent implements OnInit, OnDestroy {

	private numOfAreasByDefault = 2;

	type: number;

	questionsForm: FormGroup;

	constructor(
		private _formBuilder: FormBuilder,
		private _scorecardsService: ScorecardsService,
		private _router: Router,
		private _renderer: Renderer2,
		private _elRef: ElementRef
	) { }

	ngOnInit() {
		this._scorecardsService.setActiveStage(2);


		this.questionsForm = this._formBuilder.group({
			role: ['', Validators.required],
			questions: this._formBuilder.array([])
		});


		this.type = this._scorecardsService.type.value;
		console.log(this.type);

		if(this._scorecardsService.questions.value) {
			let questionsFormArray = this.questionsForm.controls['questions'] as FormArray;
			this._scorecardsService.questions.value['questions'].forEach(area => {
				let questionsArray = [];
				area.questions.forEach(question => {
					questionsArray.push(
						this._formBuilder.group({
							content: question.content
						})
					)
				});

				questionsFormArray.push(
					this._formBuilder.group({
						area: [area.area, Validators.required],
						questions: this._formBuilder.array(questionsArray)
					})
				);


			});

			this.questionsForm.patchValue(this._scorecardsService.questions.value);

		} else {
			for(let i = 0; i < this.numOfAreasByDefault; ++i)
				this.addForm();
		}



	}

	ngOnDestroy() {
		this._formBuilder = null;
		this._scorecardsService = null;
		this._router = null;
		this.questionsForm = null;
		this.type = null;
		this.numOfAreasByDefault = null;
	}

	addForm() {
		const questionsFormArray = this.questionsForm.controls['questions'] as FormArray;
		questionsFormArray.push(
			this._formBuilder.group({
				area: ['', Validators.required],
				questions: this._formBuilder.array([
					this._formBuilder.group({
						content: ''
					})
				])
			})
		);
	}

	removeArea(index: number) {
		const questionsFormArray = this.questionsForm.controls['questions'] as FormArray;
		if (questionsFormArray.length > 1) {
			questionsFormArray.removeAt(index);
		}
	}

	goBack() {
		this._router.navigate(['/', 'scorecards', { outlets: { 'scorecard-stage': ['select-stage'] } }], {skipLocationChange: true});
	}

	// private isValid(): boolean {
	// let questions = this.questionsForm.controls['questions'] as FormArray;
	// for(let i = 0; i < questions.length; ++i) {
	//   if(questions[i].invalid)
	//     return false;
	// }
	// return this.questionsForm.form.valid;
	// }

	shakeForms() {
		// validation-animation
		console.log(this._elRef.nativeElement.querySelectorAll('input.ng-invalid'));
		this._elRef.nativeElement.querySelectorAll('input.ng-invalid').forEach(element => {
			console.log(element);
			this._renderer.addClass(element, 'validation-animation');
			setTimeout(() => {
				this._renderer.removeClass(element, 'validation-animation');
			}, 1000);
		});
	}

	submitForm() {
		// this._scorecardsService.questions = this.questionsForm.value;
		// this._router.navigate(['/', 'scorecards', { outlets: { 'scorecard-stage': ['score-candidate'] } }], {skipLocationChange: true});

		if(this.questionsForm.valid) {
			this._scorecardsService.questions = this.questionsForm.value;
			this._router.navigate(['/', 'scorecards', { outlets: { 'scorecard-stage': ['score-candidate'] } }], {skipLocationChange: true});
		} else {
			this.shakeForms();
		}


		// console.log(this.questionsForm);


		//   console.log('valid: ', this.questionsForm.controls['role']);
		// else
		//   console.log('error: ', this.questionsForm.controls['role']);
	}

	toFormArray(abstractControll) {
		return <FormArray>abstractControll;
	}

}
