import { Component, OnInit } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {Parse} from "../parse.service";
import {MatButtonModule} from '@angular/material';
import {RootVCRService} from "../root_vcr.service";
import { DomSanitizer } from '@angular/platform-browser';
import { AlertComponent} from "../shared/alert/alert.component";


export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
    isCheckedInitial;
    isChecked;
    isButtonDisabled:boolean = true;
    matcher = new MyErrorStateMatcher();
    reedPostKey:string;
    reedPostEmail:string;
    reedPostKeyInitial:string;
    reedPostEmailInitial:string;
  constructor(private _parse: Parse,
              private sanitizer: DomSanitizer,
              private _root_vcr: RootVCRService) {
  }

  ngOnInit() {
      this.getCurrentPartner().then(partner=>{
          if (partner.has("candidateDistanceUnitPreferrences")){
             let codeOfUnit =  partner.get("candidateDistanceUnitPreferrences");
              if(codeOfUnit == 1) {
                  this.isCheckedInitial = false;
              }
              else if (codeOfUnit == 2) {
                  this.isCheckedInitial = true;
              }
          }
          else {
              partner.set("candidateDistanceUnitPreferrences",1);
              partner.save();
          }
          if (partner.has("reedPostingKey")){
              this.reedPostKeyInitial = partner.get("reedPostingKey");
              this.reedPostKey = partner.get("reedPostingKey");
          }
          else {
              this.reedPostKeyInitial = '';
          }
          if (partner.has('reedPostEmail')) {
              this.reedPostEmailInitial = partner.get("reedPostEmail");
              this.reedPostEmail = partner.get("reedPostEmail");
          }
          else {
              this.reedPostEmailInitial = '';
          }
      });
  }
    getCurrentPartner() {
        return this._parse.getPartner(this._parse.Parse.User.current());
    }

    saveChanges() {
        if (this.reedPostEmail != this.reedPostEmailInitial || this.reedPostKey != this.reedPostKeyInitial || this.isChecked != this.isCheckedInitial){
            this.getCurrentPartner().then(partner => {
                this.reedPostKeyInitial = this.reedPostKey;
                this.reedPostEmailInitial = this.reedPostEmail;
                partner.set('reedPostingKey', this.reedPostKey);
                partner.set('reedPostEmail', this.reedPostEmail);
                partner.save();
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
            })
        }
    }
    checkEmailStatus(){
        return this.reedPostEmailInitial == this.reedPostEmail;
    }

    checkKeyStatus() {
        return this.reedPostKeyInitial== this.reedPostKey;
    }

    changeKmAndMiles(value) {
      this.getCurrentPartner().then(curPartner=>{
          if (value.checked == true) {
              curPartner.set("candidateDistanceUnitPreferrences",2);
              curPartner.save();
          }
          else {
              curPartner.set("candidateDistanceUnitPreferrences",1);
              curPartner.save();
          }
      });

}
}
