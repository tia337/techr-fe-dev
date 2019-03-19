import { Component, OnInit, OnDestroy, ViewRef, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, FormControl} from '@angular/forms';
import { EditScorecardService } from './edit-scorecard.service';
import { Parse } from '../../parse.service';
import { RootVCRService } from '../../root_vcr.service';
import * as _ from 'underscore';


@Component({
	selector: 'edit-scorecard',
	templateUrl: './edit-scorecard.component.html',
	styleUrls: ['./edit-scorecard.component.scss']
})
export class EditScorecardComponent implements OnInit, OnDestroy {

	private _scorecardId: string;
	private _scorecardObject: any;
	private _areas: any[] = [];
	editForm: FormGroup;
	editProcessing = false;

	private _scorecardUpdated: EventEmitter<any> = new EventEmitter();

	constructor(
		private _formBuilder: FormBuilder,
		private _editScorecardService: EditScorecardService,
		private _root_vcr: RootVCRService,
		private _parse: Parse
	) { }

	// ngOnInit() {
	//
	// 	this.editForm = this._formBuilder.group({
	// 		type: 0,
	// 		role: '',
	// 		areas: this._formBuilder.array([])
	// 	});
	//
	// 	this._editScorecardService.getScorecard(this._scorecardId).then(scorecardObj => {
	//
	// 		this._scorecardObject = scorecardObj;
	// 		this.editForm.controls.type.setValue(this._scorecardObject.get('Scorecard_type'));
	// 		this.editForm.controls.role.setValue(this._scorecardObject.get('ScorecardTitle'));
	//
	// 		this._editScorecardService.getAreas(scorecardObj).then(scorecardAreas => {
	// 			console.log(scorecardAreas);
	// 			scorecardAreas.forEach(scorecardArea => {
	// 				console.log('AREA ORDER: ', scorecardArea.get('order'));
	// 				const _area = {
	// 					area: scorecardArea,
	// 					questions: []
	// 				};
	// 				const areaObject = this._formBuilder.group({
	// 					area: scorecardArea.get('AreaTitle'),
	// 					areaId: scorecardArea.id,
	// 					questions: this._formBuilder.array([])
	// 				});
	// 				this._editScorecardService.getQuestions(scorecardArea).then(questions => {
	// 					console.log('START RETRIEVING QUESTIONS FOR ', scorecardArea.get('order'));
	// 					const areaQuestions = areaObject.controls.questions as FormArray;
	// 					questions.map(question => {
	// 						areaQuestions.push(this._formBuilder.group({
	// 							content: question.get('Question'),
	// 							questionId: question.id
	// 						}));
	// 						_area.questions.push(question);
	// 					});
	// 					this._areas.push(_area);
	// 					return areaObject;
	// 				}).then(area => {
	// 					console.log('FINISHED RETRIEVING QUESTIONS FOR ', scorecardArea.get('order'));
	// 					const areas = this.editForm.controls.areas as FormArray;
	// 					areas.push(area);
	// 				});
	// 			});
	// 		});
	// 	});
	// }

	// ----------------------------------------------------------------------

	ngOnInit() {

		this.editForm = this._formBuilder.group({
			type: 0,
			role: '',
			areas: this._formBuilder.array([])
		});

		const _areas = [];
		const _areaObjects = [];

		this._editScorecardService.getScorecard(this._scorecardId).then(scorecardObj => {

			this._scorecardObject = scorecardObj;
			this.editForm.controls.type.setValue(this._scorecardObject.get('Scorecard_type'));
			this.editForm.controls.role.setValue(this._scorecardObject.get('ScorecardTitle'));

			return this._editScorecardService.getAreas(scorecardObj);
		}).then(scorecardAreas => {
			console.log(scorecardAreas);
			const questionsPromises = [];
			scorecardAreas.forEach(scorecardArea => {
				console.log('AREA ORDER: ', scorecardArea.get('order'));
				_areas[scorecardArea.get('order')] = {
					area: scorecardArea,
					questions: []
				};
				_areaObjects[scorecardArea.get('order')] = this._formBuilder.group({
					area: scorecardArea.get('AreaTitle'),
					areaId: scorecardArea.id,
					questions: this._formBuilder.array([])
				});
				questionsPromises.push(this._editScorecardService.getQuestions(scorecardArea));
			});
			return this._parse.Parse.Promise.when(questionsPromises);
		}).then(areasQuestions => {
			console.log(areasQuestions);
			areasQuestions.forEach((questions, index) => {
				const areaQuestions = _areaObjects[index].controls.questions as FormArray;
				questions.map(question => {
					areaQuestions.push(this._formBuilder.group({
						content: question.get('Question'),
						questionId: question.id
					}));
					_areas[index].questions.push(question);
				});
				this._areas.push(_areas[index]);
				// return areaObject;

				const areas = this.editForm.controls.areas as FormArray;
				areas.push(_areaObjects[index]);
			});
		});
		// 	.then(area => {
		// 			console.log('FINISHED RETRIEVING QUESTIONS FOR ', scorecardArea.get('order'));
		// 			const areas = this.editForm.controls.areas as FormArray;
		// 			areas.push(area);
		// 		});
		// 	});
		// });
	}

	// ----------------------------------------------------------------------

	set scorecardId(id: string) {
		this._scorecardId = id;
	}

	updateScorecard() {
		const promises = [];
		this.editProcessing = true;
		const scorecardObjectPromise = this._scorecardObject.save({
			'ScorecardTitle': this.editForm.value.role,
			'Scorecard_type': this.editForm.value.type
		});
		promises.push(scorecardObjectPromise);
		scorecardObjectPromise.then(() => {
			const areas = this.editForm.controls['areas'] as FormArray;

			// Remove deleted areas
			const areaToBeDelete = this.findDeletedAreas(this._areas, areas.controls as FormGroup[]);
			if (areaToBeDelete) {
				areaToBeDelete.map(areaToBeDelete => {
					promises.push(this._editScorecardService.deleteArea(areaToBeDelete));
				});
			}

			areas.controls
				// .filter(area => {
				// 	return area.touched || area.dirty;
				// })
				.map((areaVal, areaIndex) => {
					const areaObj = this._areas.find(area => {
						return area.area.id === areaVal.value.areaId;
					});

					if (areaObj) {

						const areaSavePromise = areaObj.area.save({
							'AreaTitle': areaVal.value.area,
							'order': areaIndex
						});
						promises.push(areaSavePromise);
						areaSavePromise.then(() => {
							const questionsValArray = (areaVal as FormGroup).controls['questions'] as FormArray;

							// Delete questions
							const questionsToBeDeleted = this.findDeletedQuestions(areaObj.questions, questionsValArray.controls as FormGroup[]);
							if (questionsToBeDeleted) {
								questionsToBeDeleted.map(deletedQuestion => {
									promises.push(this._editScorecardService.deleteQuestion(deletedQuestion));
								});
							}

							questionsValArray.controls.map((questionValue, questionIndex) => {
								promises.push(this.initAreaQuestions(areaObj, <FormGroup>questionValue, questionIndex));
							});
						});

					} else {
						const newArea = this._editScorecardService.addArea(this._scorecardId, areaVal.value.area, areaIndex);
						promises.push(newArea);
						newArea.then(newAreaObj => {
							const questionsFormGroup = (areaVal as FormGroup).controls['questions'] as FormArray;
							questionsFormGroup.controls.map((questionFormGroup, questionIndex) => {
								promises.push(this.addQuestion(newAreaObj, questionFormGroup, questionIndex));
							});
						});
					}

				});
			return this._parse.Parse.Promise.when(promises);
		}).then(() => {
				console.log('scorecard updated');
				this._root_vcr.clear();
				this._scorecardUpdated.emit();
			},
			error => {
				console.error('Error: ', error);
			});
	}

	// ---------------------------------------------------------------------


	private initAreaQuestions(areaObj: any, questionValue: FormGroup, order: number) {
		const updatedQuestion = areaObj.questions.find(value => {
			return questionValue.value.questionId === value.id;
		});

		if (updatedQuestion) {
			return updatedQuestion.save({
				'Question': questionValue.value.content,
				'order': order
			});
		} else {
			return this.addQuestion(areaObj.area, questionValue, order);
		}
	}

	private addQuestion(area, questionFormGroup, order: number) {
		return this._editScorecardService.addQuestion(area, questionFormGroup.value.content, order).then(newQuestion => {
			const questionIdFormControl = new FormControl(newQuestion.id);
			questionFormGroup.addControl('questionId', questionIdFormControl);
			return newQuestion;
		});
	}

	addArea() {
		const areas = this.editForm.controls['areas'] as FormArray;
		areas.push(
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
		const areaFormArray = this.editForm.controls['areas'] as FormArray;
		if (areaFormArray.length > 1) {
			areaFormArray.removeAt(index);
		}
	}

	findDeletedQuestions(parseObjArray: any[], formControlsArray: FormGroup[]): any[] {
		const formQuestionsIds = formControlsArray.map(value => {
			return value.value.questionId;
		});
		const parseQuestionsIds = parseObjArray.map(value => {
			return value.id;
		});
		const deletedQuestionsId =  _.difference(parseQuestionsIds, formQuestionsIds);
		const deletedQuestions = parseObjArray.filter(object => {
			return deletedQuestionsId.includes(object.id);
		});
		return deletedQuestions;
	}

	findDeletedAreas(parseObjArray: any[], formControlsArray: FormGroup[]) {
		const formAreasIds = formControlsArray.map(value => {
			return value.value['areaId'];
		});
		const parseAreasIds = parseObjArray.map(value => {
			return value.area.id;
		});
		const deletedQuestionsId =  _.difference(parseAreasIds, formAreasIds);
		const deletedAreas = parseObjArray.filter(object => {
			return deletedQuestionsId.includes(object.area.id);
		})
			.map(value => {
				return value.area;
			});
		return deletedAreas;
	}

	closeEditModal() {
		this._root_vcr.clear();
	}

	toFormArray(abstractControll) {
		return <FormArray>abstractControll;
	}

	get scorecardUpdated() {
		return this._scorecardUpdated;
	}

	ngOnDestroy() {
		this._scorecardId = null;
		this._scorecardObject = null;
		this._areas = null;
		this._root_vcr = null;
		this.editForm = null;
		this._formBuilder = null;
		this._editScorecardService = null;
	}

}
