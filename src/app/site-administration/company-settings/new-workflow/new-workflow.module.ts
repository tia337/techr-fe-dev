import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewWorkflowComponent } from './new-workflow.component';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  declarations: [NewWorkflowComponent]
})
export class NewWorkflowModule { }
