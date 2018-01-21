import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareComponent } from './share.component';
import { ShareDirective } from './share.component';

@NgModule({
  declarations: [
    ShareComponent,
    ShareDirective

  ],
  imports: [
    BrowserModule,
    CommonModule,
  ],
  entryComponents: [ ShareComponent ],
  exports: [ ShareComponent, ShareDirective ]

})
export class ShareModule { }
