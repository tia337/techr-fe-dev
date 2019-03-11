import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { Parse } from '../parse.service';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
//tslint:disable:indent

@Injectable()
export class PostJobService {

  private apiKey: string = 'AIzaSyBFfAIR1tt4-AOfcsGxc87y-yZMLdrMNbk';

  logoUpdate: EventEmitter<any> = new EventEmitter();
  approversArray: BehaviorSubject<any> = new BehaviorSubject(null);
  currentApproversArray = this.approversArray as Observable<any>;

  constructor(private _http: Http, private _parse: Parse) { }

  // ngOnInit() {

  // }
  checkAdmin(){
    return this._parse.Parse.User.current().get('HR_Access_Level');
  }

  getCoordinates(address: string): Observable<any> {
    return this._http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key='+this.apiKey)
      .map(res => {
        let response = res.json();
        if(response.status == 'OK') {
          let result = [];
          response.results.forEach(location => {
            let country = location.address_components.find(adminLevel => {
              return adminLevel.types.indexOf('country') != -1;
            });

            result.push({
              formattedAddress: location.formatted_address,
              countryName: country.long_name,
              countryCode: country.short_name,
              lat: location.geometry.location.lat,
              lng: location.geometry.location.lng,
            });
          });
          // return response;
          return result;
        } else
          return {};
      })
      .catch((error: any) => Observable.throw(error.json()||'Error'));
  }

  // getSuggestedPlaces() {
  //   this._http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key='+this.apiKey)
  //     .then(predictions => {
  //       result.data.predictions.forEach(prediction => {
  //         result.push({
  //           description: prediction.description,
  //           place_id: prediction.place_id
  //         });
  //       });
  //       console.log();
  //     });
  //
  // }

  getCurrencies(): any {
    return this._parse.Query('Currencies').find();
  }

  getDefaultCurrency(): any {
    const currency = this._parse.Query('Currencies');
    currency.equalTo('Currency', 'GBP');
    return currency.first(value => {
      return value;
    });
  }

  // FOR SKILLS ROLES AND INDUSTRIES

  getIndustries() {
    const industriesQuery = new this._parse.Parse.Query('Industry');
    return industriesQuery.find().then( industries => {
      return industries;
    });
  }

  getRoles() {
    const rolesQuery = new this._parse.Parse.Query('UserRole');
    return rolesQuery.find().then( roles => {
      return roles;
    });
  }

  getSkills() {
    const limit = 1000;
    const skip = 0;

    return this.querySkills([], skip, limit);
  }

  private querySkills(result, skip, limit) {
    const skillsQuery = new this._parse.Parse.Query('ProgrammingSkill');
    skillsQuery.limit(limit);
    skillsQuery.skip(skip);
    return skillsQuery.find().then( skills => {
      result = result.concat(skills);
      if (skills.length !== limit) {
        return result;
      } else {
        skip += limit;
        return this.querySkills(result, skip, limit);
      }
    });
  }

  getCategories() {
    const skillCategoriesQuery = new this._parse.Parse.Query('SkillCategory');
    skillCategoriesQuery.ascending('orderIndex');
    return skillCategoriesQuery.find();
  }

  createSkillComponent(skill: any, experience: number) {
    const skillComponent = new this._parse.Parse.Object('SkillComponent');
    skillComponent.set('skill', skill);
    skillComponent.set('selectedExperienceDuration', experience);
    return skillComponent;
  }

  getJobCountry(name: string) {
    const jobCountryQuery = new this._parse.Parse.Query('Country');
    jobCountryQuery.equalTo('Country', name);
    return jobCountryQuery.find().then(jobCountries => {
      return jobCountries;
    });
  }
  saveIsPostJobShowAlert() {
    let partner = this._parse.Parse.User.current().get('partner');
    partner.set('isPostJobShowAlert', true);
    partner.save();
  }
  checkIsPostJobShowAlert() {
    let partner = this._parse.Parse.User.current().get('partner');
    return partner.fetch().then(res => {
      return res.get('isPostJobShowAlert');
    });
  }
  getClientDepartments(): Promise<Array<{name: string}>> {
    const clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
    return this._parse.execCloud('getClientDepartments', { clientId: clientId });
  }
  getClientOffices(): Promise<Array<{name: string}>> {
    const clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
    return this._parse.execCloud('getClientOffices', { clientId: clientId });
  }
  getClientsOfClient() {
    const clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
    return this._parse.execCloud('getClientsOfClient', { clientId: clientId });
  }
  getClientRecruitmentProjects() {
    const clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
    return this._parse.execCloud('getClientRecruitmentProjects', { clientId: clientId });
  }
  throwApprovers(array) {
    this.approversArray.next(array);
  }
}
