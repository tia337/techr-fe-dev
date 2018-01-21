import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutosizeDirective } from 'angular-autosize';
@NgModule({
  imports: [
    CommonModule,
    // AutosizeDirective
  ],
  declarations: [AutosizeDirective],
  exports:[AutosizeDirective],

})
export class AutosizeModule { }
