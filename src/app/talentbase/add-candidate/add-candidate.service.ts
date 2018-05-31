import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { BehaviorSubject, Subject  } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
@Injectable()
export class AddCandidateService {


  public candidatesUploaded: BehaviorSubject<any[]> = new BehaviorSubject(null);

  private rchilliURL = 'https://rest.rchilli.com/RChilliParser/Rchilli/parseResumeBinary';

  constructor(
    private _http: Http
  ) { }

  uploadCVs (cvFile): any {
		const reader = new FileReader();
		reader.addEventListener('loadend', (event) => {
			const data = reader.result.split(',')[1];
			const jsonObject = JSON.stringify({
				'filedata': data,
				'filename': cvFile.name,
				'userkey': 'VBDK5ZXUULD',
				'version': '7.0.0',
				'subuserid': 'SWIPEIN'
			});
			const headers = new Headers();
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
  
  getError(error: number) {
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
  
}