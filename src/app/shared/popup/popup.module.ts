import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopupComponent } from './popup.component';

@NgModule({
  declarations: [
    PopupComponent

  ],
  imports: [
    BrowserModule,
    CommonModule,
  ],
  // entryComponents: [ InfoModalComponent ],
  exports: [ PopupComponent ]

})
export class PopupModule { }
