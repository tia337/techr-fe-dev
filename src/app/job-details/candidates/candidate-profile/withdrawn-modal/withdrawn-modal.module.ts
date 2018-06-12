import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithdrawnModalComponent } from './withdrawn-modal.component';
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
  declarations: [WithdrawnModalComponent],
  entryComponents: [ WithdrawnModalComponent]
})
export class WithdrawnModalModule { }
