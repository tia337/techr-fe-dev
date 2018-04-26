import {Component, OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {Parse} from "../parse.service";
import {MatButtonModule} from '@angular/material';
import {RootVCRService} from "../root_vcr.service";
import {AlertComponent} from "../shared/alert/alert.component";
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
//tslint:disable 
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
    settings; //current settings from user input
    settingsInit; // initial state from DB on ngOnInit()
    //settingsChanged; // uncomment if checkSettingsChanged() for button disable/enable is fixed
    distanceUnits:boolean;
    distanceUnitsInit:boolean;
    themeStyle: boolean;
    isButtonDisabled:boolean = true; // i think deprecated: never used
    matcher = new MyErrorStateMatcher();
    public currentEmailSetting; 
    public clicked;
    constructor(private _parse: Parse,
                private _root_vcr: RootVCRService) {
  }
//for button disable/enable to work 'Partner' properties should be defined in DB
async ngOnInit() {
    this.settings = {};
    this.settingsInit = {};
    //this.settingsChanged = {};  // uncomment if checkSettingsChanged() for button disable/enable is fixed
    let partner = await this.getCurrentPartner();
    this.settings = partner.toJSON();
    this.settingsInit = partner.toJSON();
    console.log(this.settings);
    this.distanceUnits = (this.settings.candidateDistanceUnitPreferrences == 2);
    this.distanceUnitsInit = (this.settingsInit.candidateDistanceUnitPreferrences == 2);
    this.clicked = this.settingsInit.emailNotificatoinsFrequency;
    console.log(this.settingsInit.emailNotificatoinsFrequency);
  }
  getCurrentPartner() {
      return this._parse.getPartner(this._parse.Parse.User.current());
  }
  async saveChanges() {
    this.settings.candidateDistanceUnitPreferrences = (this.distanceUnits) ? 2 : 1;

    await this._parse.execCloud('changeUserSettings', {settings: this.settings});
    this.settingsInit = Object.assign({}, this.settings);
    this.distanceUnitsInit = (this.settingsInit.candidateDistanceUnitPreferrences == 2);
          const alert = this._root_vcr.createComponent(AlertComponent);
          alert.title = 'Saved';
          alert.icon = 'thumbs-o-up';
          alert.type = 'simple';
          alert.contentAlign = 'left';
          alert.content = `<a style = "white-space:nowrap">Changes successfully saved.</a>`;
          alert.addButton({
              title: 'Ok',
              type: 'primary',
              onClick: () => this._root_vcr.clear()
          });
  }

  checkSettingsChanged() {
    if (this.distanceUnits !== this.distanceUnitsInit || this.currentEmailSetting != this.settingsInit.emailNotificatoinsFrequency) {
      return true;
    }
    // add check for emailNotificatoinsFrequency
    for (let setting in this.settingsInit) {
      if (this.settingsInit[setting] !== this.settings[setting])
        //with this line button is enabled always, and properties are not saved in settingsChanged
        //this.settingsChanged[setting] = this.settings[setting];
        return true;
    }
  }
  click(a) {
      this.settings.emailNotificatoinsFrequency = a;
      console.log(this.settings.emailNotificatoinsFrequency);
      this.currentEmailSetting = a;
  }

  changeTheme() {
      if (this.themeStyle === true) {
            const body = document.getElementById('body');
			body.classList.add('new');
			localStorage.setItem('theme', 'new');
      };
      if (this.themeStyle === false) {
            const body = document.getElementById('body');
			body.classList.remove('new');
			localStorage.setItem('theme', 'old');
      }
  }

}