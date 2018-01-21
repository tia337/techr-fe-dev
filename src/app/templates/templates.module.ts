import { MentionModule } from 'angular2-mentions/mention';
import { TemplateDetailsService } from './template-details/template-details.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TemplatesService } from './templates.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './templates.component';
import { TemplateComponent } from './template/template.component';
import { TemplateDetailsComponent } from './template-details/template-details.component';
import { MatTabsModule } from '@angular/material';
import { TemplateDetailsCustomComponent } from './template-details-custom/template-details-custom.component';
import { AppRoutingModule } from './../app-routing.module';
import { AlertComponent } from 'app/shared/alert/alert.component';
import { AutosizeModule } from '../shared/autosize/autosize.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MentionModule,
    AutosizeModule,
    MatTabsModule
  ],
  declarations: [TemplatesComponent, TemplateComponent, TemplateDetailsComponent, TemplateDetailsCustomComponent],
  providers: [TemplatesService, TemplateDetailsService],
  entryComponents: [AlertComponent]
})
export class TemplatesModule { }
