import { Injectable } from '@angular/core';
//tslint:disable:indent
@Injectable()
export class TalentbaseService {

  private randomColorsArray = [
    '#6bbc6e',
    '#78d60a',
    '#bbd0fb',
    '#e18d1d',
    '#0f1832',
    '#7f5a31',
    '#d41fbe',
    '#ae83e5',
    '#5567bf',
    '#6a01a1',
    '#37611b',
    '#ac04b9',
    '#ce3f08',
    '#2ac2c4'
  ];

  constructor() { }

  createArray(array: Array<any>, type: string) {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
      const date = {
        id: Math.random().toFixed(20).substring(4, 9),
        checked: false,
        title: array[i],
        count: Math.floor(Math.random() * 80) + 1,
        type: type
      };
      newArray.push(date);
    };
    return newArray;
  }
  createCandidatesArray(filtersArray, pipelineStagesArray, jobTitlesArray, candidateNames, candidateLocations, candidatePositions, candidateSource) {
    const count = 100;
    let array = [];
    for (let i = 0; i < count; i++) {
      const data = {
        id: Math.random().toFixed(20).substring(4, 9),
        checked: false,
        name: candidateNames[Math.floor(Math.random() * candidateNames.length-1) + 1],
        filters: [
          filtersArray[Math.floor(Math.random() * filtersArray.length-1) + 1].id,
          pipelineStagesArray[Math.floor(Math.random() * pipelineStagesArray.length-1) + 1].id
        ],
        position: candidatePositions[Math.floor(Math.random() * candidatePositions.length-1) + 1],
        appliedJob: {
          job: null,
          source: null,
          date: new Date(new Date(2012, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2012, 0, 1).getTime()))
        },
        location: candidateLocations[Math.floor(Math.random() * candidateLocations.length-1) + 1],
        avatar: undefined
      };
      filtersArray.forEach(item => {
        if (item.id === data.filters[0]) {
          data.appliedJob.job = item.title;
          data.appliedJob.source = candidateSource[Math.floor(Math.random() * candidateSource.length-1) + 1];
        }
      });
      array.push(data);
    }
    return array;
  }

  uploadMoreCandidates(limits, array) {
    let arrayNew = array.slice(limits.from, limits.to);
    return arrayNew;
  }

  selectAllCandidates (array) {
    const checkedArray = [];
    array.forEach(candidate => {
      candidate.checked = true;
      checkedArray.push(candidate);
    });
    return checkedArray;
  }

}
