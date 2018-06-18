import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RejectModalComponent } from './reject-modal.component';
import { MatIconModule } from '@angular/material';
import { ClickOutsideModule } from 'ng-click-outside';
import { FormsModule, FormControlDirective } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    ClickOutsideModule,
    FormsModule,
  ],
  declarations: [RejectModalComponent],
  entryComponents: [RejectModalComponent]
})
export class RejectModalModule { }
