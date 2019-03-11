import { Injectable } from '@angular/core';
import { Parse } from '../parse.service';
import {BehaviorSubject} from 'rxjs/Rx';
import { ContractStatus, JobBoardPush } from '../shared/utils';
import * as _ from 'underscore';



@Injectable()

export class CartAdding{
    taxes: number = 0;
    count:number = 0;
    freecount:number = 0;
    paidcount:number = 0;
    totalsum:number = 0;
    products:any[] = [];
    freeproducts:any[] = [];
    currency: string = '';
    contracts: any[] = [];
    freecontracts: any[] = [];
    animation: boolean = false;
    Currency: BehaviorSubject<string> = new BehaviorSubject<string>(this.currency);
    Taxes: BehaviorSubject<number> = new BehaviorSubject<number>(this.count);
    TotalPlusTaxes: BehaviorSubject<number> = new BehaviorSubject<number>(this.count);
    CartCount:BehaviorSubject<number> = new BehaviorSubject<number>(this.count);
    CartTotal:BehaviorSubject<number> = new BehaviorSubject<number>(this.totalsum);
    animationActive:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.animation);
    cartLoad(){
        // console.log("cartLoad works");
        this.totalsum = 0;
        let jBPriceObj: any;
        let notPushedPaidCart : any[];
        const client = this._parse.Parse.User.current().get('Client_Pointer');
        return this._parse.Parse.Session.current().then(res=>{
            this.count = 0;
            if(res.get("Shopping_Cart") && res.get("Shopping_Cart").free){
                // console.log("empty");
                if(res.get("Shopping_Cart").free.length > 0){
                    console.log(res.get("Shopping_Cart").free.length);
                    this.cartCheckFreePushed(client, res.get("Shopping_Cart").free);
                    this.freecontracts = res.get("Shopping_Cart").free;
                }
                if(res.get("Shopping_Cart").paid.length > 0){
                    this.cartCheckPaidPushed(client, res.get("Shopping_Cart").paid)
                    // .then(nPCart=>{
                    // console.log(nPCart);
                    // for(let pc of nPCart){
                    //     this.totalsum += pc.get("Price");
                    //     console.log(this.totalsum);
                    //     this.currency = pc.get("Currency");
                    //     this.Currency.next(this.currency);
                    //     this.CartTotal.next(this.totalsum);
                    //     this.TotalPlusTaxes.next(this.totalsum);
                    // }

                    // for(let pc of nPCart){
                    //     console.log("for test");
                    //     console.log(pc);
                    //     const contract = pc.contract;
                    //     let jbPrice = new this._parse.Parse.Query("JobBoardPrices");
                    //     if(pc.JobBoardPrice.id){
                    //         console.log(pc.JobBoardPrice.id);
                    //         jbPrice.equalTo("objectId", pc.JobBoardPrice.id);
                    //         jbPrice.include('JobBoard');
                    //     }
                    //     if(pc.JobBoardPrice.objectId){
                    //         console.log(pc.JobBoardPrice.objectId);
                    //         jbPrice.equalTo("objectId", pc.JobBoardPrice.objectId);
                    //         jbPrice.include('JobBoard');
                    //     }
                    //     jbPrice.first().then(res =>{
                    //         jBPriceObj = res;
                    //         console.log(jBPriceObj);
                    //         return this.cartCheckPushed(client, res.get('JobBoard'), contract);
                    //     }).then((jBPushExists, res)=>{
                    //         console.log(jBPushExists);
                    //         if(!jBPushExists){
                    //             console.log(res);
                    //             console.log("totalsum +");
                    //             console.log(res.get("Price"));
                    //             this.totalsum += res.get("Price");
                    //             this.currency = res.get("Currency");
                    //             this.Currency.next(this.currency);
                    //             this.CartTotal.next(this.totalsum);
                    //             this.TotalPlusTaxes.next(this.totalsum);
                    //         }else if(jBPushExists){
                    //             console.log(jBPushExists);
                    //             console.log('wa budet delete');
                    //             this.deleteItem(pc);
                    //         }
                    //     });
                    // }
                    this.contracts = res.get("Shopping_Cart").paid;
                    return "success";
                // });
                }else{
                    this.totalsum = 0;
                    this.currency = '';
                    this.CartCount.next(this.count);
                    this.Currency.next(this.currency);
                    this.CartTotal.next(this.totalsum);
                    this.TotalPlusTaxes.next(this.totalsum);
                    return "success";
                }
            }else{
                res.set("Shopping_Cart", {"free":[], "paid":[]});
                res.save();
                return "success";
            }
        });
        
    }

    cartCheckFreePushed(client, sCFree){
        let notPushedCart: any[] = [];
        let contract;
        for(let fc of sCFree){
            console.log("for test free");
            console.log(fc);
            let i:number = 0;
            let jBFreeObj;
            let queryClient = new this._parse.Parse.Query('Contract');
            queryClient.equalTo ('objectId', fc.contract);
            queryClient.first().then(contr=>{
            contract = contr;
            let jbFree = new this._parse.Parse.Query("JobBoards");
            console.log(fc);
            if(fc.jobBoard.jobBoard.id){
                console.log(fc.jobBoard.jobBoard.id);
                jbFree.equalTo("objectId", fc.jobBoard.jobBoard.id);
            }
            if(fc.jobBoard.jobBoard.objectId){
                console.log(fc.jobBoard.jobBoard.objectId);
                jbFree.equalTo("objectId", fc.jobBoard.jobBoard.objectId);
            }
            return jbFree.first()
            }).then(res =>{
                let jobBoardFree = res;
                jBFreeObj = res;
                let query = new this._parse.Parse.Query('JobBoardPush');
                query.equalTo('Client', client);
                query.equalTo('PushOnBoard', jobBoardFree);
                query.equalTo('Job', contract);
                query.equalTo('Status', JobBoardPush.active);
                return query.first();
            }).then(activeJB=>{
                if(!activeJB){
                    notPushedCart.push(jBFreeObj);
                    this.count += 1;
                    this.CartCount.next(this.count);
                    i=i+1;
                }else if(activeJB){
                    i=i+1;
                    const deleteFreeObj = {
                        "contract" : fc.contract,
                        "JobBoard" : fc.jobBoard.jobBoard
                    }
                    this.deleteFreeItem(deleteFreeObj);
                }
                if(i === sCFree.length - 1 && notPushedCart.length === 0){
                    this.count = this.count + 0;
                    this.CartCount.next(this.count);
                }
            });
        }
    }

    cartCheckPaidPushed(client, sCPaid){
        let notPushedCart: any[] = [];
        let contract;
        for(let pc of sCPaid){
            let i: number = 0;
            let jBPriceObj;
            let queryClient = new this._parse.Parse.Query('Contract');
            queryClient.equalTo ('objectId', pc.contract);
            queryClient.first().then(contr=>{
            contract = contr;
            let jbPrice = new this._parse.Parse.Query("JobBoardPrices");
            if(pc.JobBoardPrice.id){
                jbPrice.equalTo("objectId", pc.JobBoardPrice.id);
                jbPrice.include('JobBoard');
            }
            if(pc.JobBoardPrice.objectId){
                jbPrice.equalTo("objectId", pc.JobBoardPrice.objectId);
                jbPrice.include('JobBoard');
            }
            return jbPrice.first()
            }).then(res =>{
                jBPriceObj = res;
                let jobBoard = res.get('JobBoard')
                let query = new this._parse.Parse.Query('JobBoardPush');
                query.equalTo('Client', client);
                query.equalTo('PushOnBoard', jobBoard);
                query.equalTo('Job', contract);
                query.equalTo('Status', JobBoardPush.active);
                return query.first();
            }).then(activeJB=>{
                if(!activeJB){
                    notPushedCart.push(jBPriceObj);
                    if(jBPriceObj.get("Price"))
                        this.totalsum += jBPriceObj.get("Price");
                    if(!jBPriceObj.get("Price"))
                        this.totalsum += 0;
                    this.currency = jBPriceObj.get("Currency");
                    this.count += 1;
                    this.CartCount.next(this.count);
                    this.Currency.next(this.currency);
                    this.CartTotal.next(this.totalsum);
                    this.TotalPlusTaxes.next(this.totalsum);
                    i=i+1;
                }else if(activeJB){
                    i=i+1;
                    this.deleteItem(pc);
                }
                if(i === sCPaid.length - 1 && notPushedCart.length === 0){
                    this.totalsum = 0;
                    this.count = this.count + 0;
                    this.currency = '';
                    this.CartCount.next(this.count);
                    this.Currency.next(this.currency);
                    this.CartTotal.next(this.totalsum);
                    this.TotalPlusTaxes.next(this.totalsum);
                }
            });
        }
        return notPushedCart;
    }

    cartCheckPushed(client, jobBoard, contractId){
        const queryContract = new this._parse.Parse.Query('Contract');
        queryContract.equalTo("objectId", contractId);
        return queryContract.first().then(contract=>{
        let query = new this._parse.Parse.Query('JobBoardPush');
        query.equalTo('Client', client);
        query.equalTo('PushOnBoard', jobBoard);
        query.equalTo('Job', contract);
        query.equalTo('Status', JobBoardPush.active);
        return query.first();
        }).then(res=>{
            console.log(res);
            return res;
        }, error=>{
            console.log(error);
        });
    }

    addFree(JobBoard, contract){
        return this._parse.Parse.Session.current().then(res=>{
            let fc: any[];
            let obj: Object;
            fc = res.get("Shopping_Cart").free;
            for(let f of fc){
                if(f.jobBoard.jobBoard.id){
                    if(JobBoard.jobBoard.id === f.jobBoard.jobBoard.id && f.contract === contract){
                        alert("You already have this Job Board for this contract in shopping cart");
                        return;
                    }
                }
                if(f.jobBoard.jobBoard.objectId){
                    if(JobBoard.jobBoard.id === f.jobBoard.jobBoard.objectId && f.contract === contract){
                        alert("You already have this Job Board for this contract in shopping cart");
                        return;
                    }
                }
            }
            fc.push({contract: contract, jobBoard: JobBoard});
            obj = res.get("Shopping_Cart");
            (obj as any).free = fc;
            res.set("Shopping_Cart", obj);
            return res.save();
        }).then(savedres=>{
            this.cartLoad();
            return "success";
        });

    }

    callAnimation(){
        if(this.animationActive.value == true){
            this.animationActive.next(false);
        }
        setTimeout(() => { 
            this.animationActive.next(true);
          }, 100);
        setTimeout(() => { 
            this.animationActive.next(false);
          }, 3000);
    }

    addPaid(board, contract){
        return this._parse.Parse.Session.current().then(res=>{
            let pc: any[];
            let obj: Object;
            pc = res.get("Shopping_Cart").paid;
            for(let p of pc){
                if(p.JobBoardPrice.id){
                    if(board.id === p.JobBoardPrice.id && p.contract === contract){
                        alert("You already have this Job Board for this contract in shopping cart");
                        return;
                    }
                }
                if(p.JobBoardPrice.objectId){
                    if(board.id === p.JobBoardPrice.objectId && p.contract === contract){
                        alert("You already have this Job Board for this contract in shopping cart");
                        return;
                    }
                }
            }
            pc.push({contract: contract, JobBoardPrice: board});
            obj = res.get("Shopping_Cart");
            (obj as any).paid = pc;
            res.set("Shopping_Cart", obj);
            return res.save();
        }).then(()=>{
            this.cartLoad();
            return;
        });
    }

    cartAdd(JobBoardPrice, JobBoard, contract){
        this._parse.Parse.Session.current().then(res=>{
            if(res.get("Shopping_Cart") && res.get("Shopping_Cart").free){
                res.set("Shopping_Cart", {"free":[this.freeproducts], "paid":[this.products]});
                res.save();
            }else{
                res.set("Shopping_Cart", {"free":[], "paid":[]} )
                res.save();
            }
        });
        this.cartLoad();
        return this.CartCount;
    }
    giveCartInfo():any{
        return this.contracts;
    }
    giveFreeCartInfo():any{
        return this.freecontracts;
    }
    deleteItem(sell){
       return this._parse.Parse.Session.current().then(res=>{
            for(let paidItems of res.get("Shopping_Cart").paid){
                let cartObj = res.get("Shopping_Cart");
                let oldPaidObj = res.get("Shopping_Cart").paid;
                if((paidItems as any).JobBoardPrice.id){
                    if((paidItems as any).JobBoardPrice.id == sell.JobBoardPrice.id && sell.contract === (paidItems as any).contract ||
                    (paidItems as any).JobBoardPrice.id == sell.JobBoardPrice.objectId && sell.contract === (paidItems as any).contract){
                        oldPaidObj = _.without(res.get("Shopping_Cart").paid, paidItems);
                    }
                }else if((paidItems as any).JobBoardPrice.objectId){
                    if((paidItems as any).JobBoardPrice.objectId == sell.JobBoardPrice.id && sell.contract === (paidItems as any).contract
                || (paidItems as any).JobBoardPrice.objectId == sell.JobBoardPrice.objectId && sell.contract === (paidItems as any).contract){
                        oldPaidObj = _.without(res.get("Shopping_Cart").paid, paidItems);
                    }
                }else{
                    console.log("wrong delete")
                }
                cartObj.paid = oldPaidObj;
                res.set("Shopping_Cart", cartObj);
            }
            return res.save();
        }).then(()=>{
            this.cartLoad();
            return "success";
        });
    }

    clearCart(){
        return this._parse.Parse.Session.current().then(res=>{
            res.set("Shopping_Cart", {"free":[], "paid":[]});
            return res.save();
        });
    }

    deleteFreeItem(freesell){
        return this._parse.Parse.Session.current().then(res=>{
            for(let freeItems of res.get("Shopping_Cart").free){
                let cartObj = res.get("Shopping_Cart");
                let oldFreeObj = res.get("Shopping_Cart").free;
                if((freeItems as any).jobBoard.jobBoard.id){
                    if((freeItems as any).jobBoard.jobBoard.id == freesell.JobBoard.id && freesell.contract === (freeItems as any).contract){
                        oldFreeObj = _.without(res.get("Shopping_Cart").free, freeItems);
                    }
                }else if((freeItems as any).jobBoard.jobBoard.objectId){
                    if((freeItems as any).jobBoard.jobBoard.objectId == freesell.JobBoard.id && freesell.contract === (freeItems as any).contract){
                        oldFreeObj = _.without(res.get("Shopping_Cart").free, freeItems);
                    }
                }else{
                }
                cartObj.free = oldFreeObj;
                res.set("Shopping_Cart", cartObj);
            }
            return res.save();
        }).then(()=>{
            this.cartLoad();
            return "success";
        });
    }
    constructor(private _parse: Parse){

    }
}