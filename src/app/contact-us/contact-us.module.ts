import { MatSelectModule } from '@angular/material/select';
import { ContactUsComponent } from './contact-us.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactUsService } from "app/contact-us/contact-us.service";
import { MatButtonModule, MatInputModule} from '@angular/material';

@NgModule({
	declarations: [
        ContactUsComponent
	],
	imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CommonModule,
        MatSelectModule,
        MatButtonModule,
        MatInputModule,
	],
	providers: [
        ContactUsService
    ],
	entryComponents: [
        ContactUsComponent,
    ]
})
export class ContactUsModule {
}

