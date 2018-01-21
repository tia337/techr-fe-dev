import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginTabsModule } from './login-tabs/login-tabs.module';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '../header/header.module';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		LoginTabsModule,
		HeaderModule
	],
	declarations: [LoginComponent],
	exports: [LoginComponent]
})
export class LoginModule { }
