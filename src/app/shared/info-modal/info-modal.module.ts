import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoModalComponent } from './info-modal.component';
import { InfoDirective } from './info-modal.directive';

@NgModule({
  declarations: [
    InfoModalComponent,
    InfoDirective

  ],
  imports: [
    BrowserModule,
    CommonModule,
  ],
  entryComponents: [ InfoModalComponent ],
  exports: [ InfoModalComponent, InfoDirective ]

})
export class InfoModalModule { }
