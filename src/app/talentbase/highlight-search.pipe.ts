import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Pipe({
  name: 'highlightSearch'
})
export class HighlightSearchPipe implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer
  ) {}
  transform(value: any, searchText: string): any {
    if (!searchText) {
      return value;
    }
    const index = value.toLowerCase().indexOf(searchText.toLowerCase());
    const firstPiece = value.slice(0, index).toLowerCase();
    const secondPiece = value.slice(index + searchText.length, value.length).toLowerCase();
    const highlited = `${firstPiece}<span class="highlighted">${searchText}</span>${secondPiece}`;
    value = highlited;
    return value;
  }

}
