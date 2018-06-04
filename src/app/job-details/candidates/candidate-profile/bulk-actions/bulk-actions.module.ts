import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkActionsComponent } from './bulk-actions.component';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  imports: [
    CommonModule,
    ClickOutsideModule
  ],
  declarations: [
    BulkActionsComponent
  ]
})
export class BulkActionsModule { }
