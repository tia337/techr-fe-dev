import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsUpgradeComponent } from './subscriptions-upgrade.component';
import { SubscriptionsUpgradeService } from './subscriptions-upgrade.service';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../shared/alert/alert.component';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  declarations: [SubscriptionsUpgradeComponent],
  providers: [SubscriptionsUpgradeService],
  entryComponents: [ AlertComponent ]

})
export class SubscriptionsUpgradeModule { }
