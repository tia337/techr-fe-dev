import { Component, OnInit } from '@angular/core';
import { Parse } from '../parse.service';
import {RootVCRService} from "../root_vcr.service";
import {ScoreCandidateComponent} from "../job-details/candidates/candidates-info-tabs/scorecards-assessments/score-candidate/score-candidate.component";


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  stars = 3.23;
  stars2 = 1.091;
  stars3 = -23.2;
  stars4 = 20;
  stars5: number;


  constructor(private _parse: Parse, private _root_vcr: RootVCRService) { }

  ngOnInit() {
    // const parameters = {
    //   email: this._parse.Parse.User.current().get('Work_email'),
    //   clientName: this._parse.Parse.User.current().get('Client')
    // };
    // this._parse.Parse.Cloud.run('createStripeCustomer', parameters).then(response => {
    //   console.log(response);
    // });

    // this._parse.Parse.Cloud.run('subscribeCustomerToPlan', {
    //   customerId: 'cus_BQJSx0qBYTtmAO',
    //   planId: 207
    // }).then(response => {
    //   console.log(response);
    // });

    // let candidate, contract, scorecard;

    // const a = new this._parse.Parse.Query(this._parse.Parse.User);
    // a.get('JPARZQBte4').then(parseCandidate => {
    //   candidate = parseCandidate;
    //   const b = new this._parse.Parse.Query('Scorecards');
    //   return b.get('F27t9pHJNU');
    // }).then(parseScorecard => {
    //   scorecard = parseScorecard;
    //   const c = new this._parse.Parse.Query('Contract');
    //   return c.get('7HBJFAAYPl');
    // }).then(parseContract => {
    //   contract = parseContract;
    // }).then(() => {
    //   const scoreCandidateComponent = this._root_vcr.createComponent(ScoreCandidateComponent);
    //   scoreCandidateComponent.candidate = candidate;
    //   scoreCandidateComponent.contract = contract;
    //   scoreCandidateComponent.scorecard = scorecard;
    // });

  }

}
