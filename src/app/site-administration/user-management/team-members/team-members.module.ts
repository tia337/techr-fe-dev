import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {TeamMembersComponent} from "./team-members.component";
import {TeamMembersService} from "./team-members.service";
import {SearchPipe} from "./search.pipe";
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material";


@NgModule({
  declarations: [
    TeamMembersComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    FormsModule,
    MatSelectModule,
  ],
  providers: [
    TeamMembersService
  ],
  entryComponents: []

})
export class TeamMembersModule { }
