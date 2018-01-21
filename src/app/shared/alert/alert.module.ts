import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert.component';
import { MatProgressSpinnerModule } from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  declarations: [ AlertComponent ],
  entryComponents: [ AlertComponent ]
})
export class AlertModule { }
