import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { StarRatingComponent } from './star-rating.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ StarRatingComponent ],
  exports: [ StarRatingComponent ]
})
export class StarRatingModule { }
