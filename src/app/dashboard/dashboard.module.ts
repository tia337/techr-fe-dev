import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardService } from './dashboard.service';

import { DashboardComponent } from './dashboard.component';
import { JobsPageModule } from '../jobs-page/jobs-page.module';
import { GraphicsModule } from '../graphics/graphics.module';

import { RouterModule } from '@angular/router';

import { MatProgressSpinnerModule, MatButtonModule } from '@angular/material';

import { Login } from '../login.service';
import { PreloaderComponent } from 'app/shared/preloader/preloader.component';

@NgModule({
  declarations: [ DashboardComponent, PreloaderComponent ],
  imports: [
    BrowserModule,
    CommonModule,
    MatProgressSpinnerModule,
    JobsPageModule,
    RouterModule,
	  JobsPageModule,
    GraphicsModule,
    MatButtonModule
  ],
  exports: [ PreloaderComponent ],
  entryComponents: [ PreloaderComponent ],
  providers: [ Login, DashboardService ]

})
export class DashboardModule { }
