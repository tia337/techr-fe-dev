import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { BehaviorSubject, Subject  } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Parse } from '../../parse.service';
import { resolve } from 'path';

@Injectable()
export class AddCandidateService {


  public candidatesUploaded: BehaviorSubject<any> = new BehaviorSubject(null);
  public goToImport: BehaviorSubject<boolean> = new BehaviorSubject(null);

  private rchilliURL: string = 'https://rest.rchilli.com/RChilliParser/Rchilli/parseResumeBinary';

  constructor(
	private _http: Http,
	private _parse: Parse
  ) { }

  uploadCVs (cvFile): any {
		const reader: FileReader = new FileReader();
		reader.addEventListener('loadend', (event) => {
			const data = reader.result.split(',')[1];
			const jsonObject = JSON.stringify({
				'filedata': data,
				'filename': cvFile.name,
				'userkey': 'VBDK5ZXUULD',
				'version': '7.0.0',
				'subuserid': 'SWIPEIN'
			});
			const headers: Headers = new Headers();
			headers.append('Access-Control-Allow-Origin', '*');
			headers.append('Content-Type', 'application/json');
			const request = this._http.post(this.rchilliURL, jsonObject, { headers: headers });
			request.map(res => {
				return res.json();
			}).subscribe(response => {
				console.log(response);
				this.candidatesUploaded.next(response.ResumeParserData);
			});
		});
		reader.readAsDataURL(cvFile);
  }

  parsingCv (cvFile) {
	this.createBase64(cvFile).then(result => {
		const filename = cvFile.name;
		const base64 = result;
		this.sendCV(base64, filename).then(result => {
			this.candidatesUploaded.next(result);
		}).catch(error => console.log(error));
	});
  }

  createYears(): Array<string> {
	  const years = [];
	  const currentDate: Date = new Date();
	  const currentYear = currentDate.getFullYear();
	  for (let i = 1970; i < currentYear + 1; i++) {
		years.push(i.toString());
	  };
	  return years;
  }

  createMonths(): Array<string> {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	return months;
  }

  sendCV(base64: any, filename: string) {
	  return new Promise ((resolve, reject) => {
		this._parse.execCloud('parsingCV', { base64: base64, filename: filename })
			.then(response => {
				resolve(this.concatCandidateResult(response));
				reject(response);
			});
	  });
  }

  createBase64 (file) {
	const reader: FileReader = new FileReader();
	const promise = new Promise((resolve, reject) => {
		reader.readAsDataURL(file);
		reader.onload = function () {
			resolve(reader.result);
		};
		reader.onerror = (error) => {
			console.log('Error: ', error);
			reject(error);
		};
	});
	return promise;
  }
  
  getError(error: number): string {
		switch (error) {
			case 1001:
			case 1002:
			case 1003:
			case 1005:
			case 1006:
			case 1007:
			case 1010:
			case 1011:
			case 1012:
			case 1013:
			case 1017:
			case 1020:
			case 1041:
			case 1042:
			return ('Service error. We apologize for the temporary inconvenience.');
			case 1004:
			return ('Invalid file name or file extension.');
			case 1008:
			return ('Not text content in CV.');
			case 1009:
			return ('Resume file extension not supported. Supported: doc, docx, dot, rtf, pdf, odt, txt, htm, html.');
			case 1014:
			return ('Corrupted file data.');
			case 1015:
			return ('Unable to parse content.');
			case 1016:
			return ('No resume content found.');
			case 1018:
			return ('File size is too large for processing.');
			case 1019:
			return ('Unable to detect language.');
			case 1021:
			return ('File conversion error.');
		}
  }

  redirectToImport(value: boolean): void {
	this.goToImport.next(value);
  }

  concatCandidateResult(array: Array<any>) {
		let temp = {};
		array.forEach(item => {
			for (let x in item) {
				temp[x] = item[x];
			}
		});
		return temp;
  }


  
}
