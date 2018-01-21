import { ParseObject, ParseUser } from 'parse';
import { FormControl } from '@angular/forms';

export interface IScoringOptions {
  scorecard: ParseObject;
  candidate: ParseUser;
  verdict: string;
  weightedScore: number;
  finalMark: number;
  taggedUsers: any;
  contract: ParseObject;
  questions: Array<IQuestionsObject>;
  areas: Array<IAreaObject>;
  ScorecardWeightedScore?: ParseObject;
}

interface IQuestionsObject {
  question: ParseObject;
  note: FormControl;
  parseObj?: ParseObject;
}

interface IAreaObject {
  area: ParseObject;
  rating: FormControl;
  parseObj?: ParseObject;
}
