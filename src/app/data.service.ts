import { Injectable } from '@angular/core';

@Injectable()
export class DataService {


	constructor() {}

	getCountryCode(limkedinCountryCode: string) {
		let result;
		switch(limkedinCountryCode) {
			case "uk": {
				result = "GB";
				break;
			}
			case "ca": {
				result = "CA";
				break;
			}
			case "it": {
				result = "IT";
				break;
			}
			case "es": {
				result = "SP";
				break;
			}
			case "pl": {
				result = "PL";
				break;
			}
			case "in": {
				result = "IND";
				break;
			}
			case "us": {
				result = "US";
				break;
			}
			case "pt": {
				result = "PT";
				break;
			}
			case "fr": {
				result = "FR";
				break;
			}
			case "de": {
				result = "GE";
				break;
			}
			case "nl": {
				result = "NL";
				break;
			}
			case "be": {
				result = "BE";
				break;
			}
			case "ro": {
				result = "RO";
				break;
			}
			case "bg": {
				result = "BG";
				break;
			}
			case "ua": {
				result = "UKR";
				break;
			}
			case "cz": {
				result = "CZ";
				break;
			}
			default: {
				result = "GB";
				break;
			}
		}
		return result;
	}

	getCountryName(countryCode) {
		let result;
		switch(countryCode) {
			case "GB": {
				result = "United Kingdom";
				break;
			}
			case "CA": {
				result = "Canada";
				break;
			}
			case "IT": {
				result = "Italy";
				break;
			}
			case "SP": {
				result = "Spain";
				break;
			}
			case "PL": {
				result = "Poland";
				break;
			}
			case "IND": {
				result = "India";
				break;
			}
			case "US": {
				result = "United States";
				break;
			}
			case "PT": {
				result = "Portugal";
				break;
			}
			case "FR": {
				result = "France";
				break;
			}
			case "GE": {
				result = "Germany";
				break;
			}
			case "NL": {
				result = "Netherlands";
				break;
			}
			case "BE": {
				result = "Belgium";
				break;
			}
			case "RO": {
				result = "Romania";
				break;
			}
			case "BG": {
				result = "Bulgaria";
				break;
			}
			case "UKR": {
				result = "Ukraine";
				break;
			}
			case "CZ": {
				result = "Czech Republic";
				break;
			}
			default: {
				result = "United Kingdom";
				break;
			}
		}
		return result;
	}




}