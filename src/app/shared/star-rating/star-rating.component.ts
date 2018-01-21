import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'underscore';

@Component({
	selector: 'star-rating',
	templateUrl: './star-rating.component.html',
	styleUrls: ['./star-rating.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => StarRatingComponent),
			multi: true
		}
	]
})
export class StarRatingComponent implements OnInit, ControlValueAccessor {

	value = 0;
	@Input('disabled') disabled: boolean;
	@Input('size') size: 's' | 'm' | 'l' | 'xl';
	@Input('numberOfStars') numberOfStars: number;
	starsValues: Array<number>;


	constructor() { }


	ngOnInit() {
		if (!this.numberOfStars) {
			this.numberOfStars = 5;
		}
		this.starsValues = _.range(this.numberOfStars);
	}

	writeValue(value: number) {
		this.value = this.roundValue(value);
	}

	updateData(event) {
		this.value = event;
		this.onChange(event);
		this.onTouched(event);
	}

	onChange = (_: any) => {};
	onTouched = (_: any) => {};

	registerOnChange(fn) {
		this.onChange = fn;
	}

	registerOnTouched(fn) {
		this.onTouched = fn;
	}

	private roundValue(currentValue: number): number {
		if (currentValue > this.numberOfStars) {
			return this.numberOfStars;
		} else if (currentValue < 0) {
			return 0;
		} else {
			return Math.round(currentValue * 2) / 2;
		}
	}
}
