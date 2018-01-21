/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   graphics.module.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afarapon <afarapon@student.unit.ua>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 18:20:55 by afarapon          #+#    #+#             */
/*   Updated: 2017/12/15 18:20:57 by afarapon         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { NgModule, enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphicsComponent } from './graphics.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatSelectModule,
	MatButtonToggleModule,
	MatButtonModule,
	MatInputModule,
	MatCheckboxModule,
	MatAutocompleteModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { GraphicsService } from './graphics.service';
import { SourcesService } from './sources.service';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserModule,
		FormsModule,
		MatSelectModule,
		MatButtonToggleModule,
		MatButtonModule,
		MatInputModule,
		MatCheckboxModule,
		MatAutocompleteModule,
		MatIconModule
	],
	declarations: [GraphicsComponent],
	providers: [
		GraphicsService,
		SourcesService
	],
	exports: [
		GraphicsComponent
	]
})
export class GraphicsModule { }
