import { Pipe, PipeTransform } from '@angular/core';
import { ParseObject } from 'parse';

@Pipe({
  name: 'filterScorecards',
  pure: false
})
export class ScorecardsFilterPipe implements PipeTransform {
  transform(data: ParseObject[], scorecardStatus: number): any[] {
    if (data) {
      return data.filter(scorecard => {
        return scorecard.get('Status') === scorecardStatus;
      });
    }
  }
}
