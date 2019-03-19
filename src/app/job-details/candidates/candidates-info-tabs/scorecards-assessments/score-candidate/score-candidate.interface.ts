import { FormControl } from '@angular/forms';

export interface IScoringOptions {
  scorecard: any;
  candidate: any;
  verdict: string;
  weightedScore: number;
  finalMark: number;
  taggedUsers: any;
  contract: any;
  questions: Array<IQuestionsObject>;
  areas: Array<IAreaObject>;
  ScorecardWeightedScore?: any;
}

interface IQuestionsObject {
  question: any;
  note: FormControl;
  parseObj?: any;
}

interface IAreaObject {
  area: any;
  rating: FormControl;
  parseObj?: any;
}
