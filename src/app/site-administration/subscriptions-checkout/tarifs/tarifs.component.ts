import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Parse } from '../../../parse.service';
import { CheckoutServService } from '../../shared/checkout-serv.service'
import { TarifsService } from './tarifs.service'

@Component({
  selector: 'app-tarifs',
  templateUrl: './tarifs.component.html',
  styleUrls: ['./tarifs.component.scss']
})
export class TarifsComponent implements OnInit {
 
  curTarif: string = '';
  tarif: string = '';//not subscribee value, to chande it with ngModel
  anualPrice: number;
  curCurrency: string;
  billingType: string;
  monthlyPrice: number;
  teamMembers: number;

  constructor(private router: Router, private _CheckoutServService: CheckoutServService, private _parse: Parse,
  private _TarifsService: TarifsService) {
    
   }
    changeCurTarif(newTarif:string){
      this._CheckoutServService.curTarif.next(newTarif);
      this._CheckoutServService.setNewTarif(newTarif);
      this._TarifsService.getAnuallyPrice();
      this._TarifsService.getMonthlyPrice(); 
    }
    updateCurPaying(payingType:string){
      this._CheckoutServService.curPayingPlan.next(payingType); 
      console.log(payingType);
      this._CheckoutServService.setNewPayingPlan(payingType);
    }  
    ngOnInit() {
      this._CheckoutServService.curTarif.subscribe(curTarif => {
            this.curTarif = curTarif; 
        });
      this._CheckoutServService.curPrice.subscribe(curPrice => {
            this.anualPrice = curPrice; 
        });
      this._CheckoutServService.curCurrency.subscribe(curCurrency => {
            this.curCurrency = curCurrency; 
        });
      this._CheckoutServService.monthlyPrice.subscribe(MonthlyPrice => {
            this.monthlyPrice = MonthlyPrice; 
        });
      this._CheckoutServService.curPayingPlan.subscribe(curPayingPlan => {
            this.billingType = curPayingPlan; 
        });
      if(!this.curCurrency){
        this._CheckoutServService.getCartObj().then(()=>{
          this._TarifsService.getAnuallyPrice();
          this._TarifsService.getMonthlyPrice();
          this._TarifsService.getAmountOfUsers().then(results=>{
            // console.log(results);
            this.teamMembers = results.get("TeamMembers").length;
          });
          this.tarif = this.curTarif;
        });
      }else{
        this._TarifsService.getMonthlyPrice();
        this._TarifsService.getAmountOfUsers().then(results=>{
          // console.log(results);
          this.teamMembers = results.get("TeamMembers").length;
        });
        this.tarif = this.curTarif;
      }
    }
}
