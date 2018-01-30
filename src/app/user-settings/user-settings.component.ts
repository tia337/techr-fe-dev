import { Component, OnInit } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {Parse} from "../parse.service";

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
    isChecked;
    emailFormControl = new FormControl('', [
        Validators.email,
    ]);
    matcher = new MyErrorStateMatcher();
  constructor(private _parse: Parse) {
  }

  ngOnInit() {
      // this.getCurrentPartner().then(partnerResult=>{
      //     console.log('Partner result --------------', partnerResult);
      //     console.log('partnerResult.has(\'pingStatus\')',partnerResult.has('pingStatus'));
      //     console.log('partnerResult.has(\'isActivated\')',partnerResult.has('isActivated'));
      // });
      this.getCurrentPartner().then(partner=>{
          if (partner.has("candidateDistanceUnitPreferrences")){
             let codeOfUnit =  partner.get("candidateDistanceUnitPreferrences");
              if(codeOfUnit == 1) {
                  this.isChecked = false;
              }
              else if (codeOfUnit == 2) {
                  this.isChecked = true;
              }
           console.log('123123123123123partner',partner.get("candidateDistanceUnitPreferrences"));
          }
          else {
              partner.set("candidateDistanceUnitPreferrences",1);
              partner.save();
              console.log('partner.set("candidateDistanceUnitPreferrences",1);', partner.set("candidateDistanceUnitPreferrences",1));
          }
      })
  }
    getCurrentPartner() {
        return this._parse.getPartner(this._parse.Parse.User.current());
    }

    changeKmAndMiles() {
      this.getCurrentPartner().then(curPartner=>{
          //curPartner.set("candidateDistanceUnitPreferrences",1);
      })
    }
}
