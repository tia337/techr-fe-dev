import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsComponent } from './skills.component';
import { SkillsService } from './skills.service';
import { KeysPipe } from './skills.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SkillsComponent, KeysPipe],
  exports:[
    SkillsComponent,
  ],
  providers:[
    SkillsService,
  ],
})
export class SkillsModule { }
