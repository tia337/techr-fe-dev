import { Injectable } from '@angular/core';
import base64 from 'base-64';
import wtf8 from 'wtf-8';

declare const gapi: any;

@Injectable()
export class Gapi {

	isSigned: boolean;

	loadGapiClient = new Promise(function (resolve, reject) {
		gapi.load('client:auth2', resolve);
	});

	googleInit = new Promise(resolve => {
		this.loadGapiClient.then(result => {
			this.initClient(resolve);
		});
	});

	constructor() {
		this.googleInit.then(() => {
			console.log('got it!');
		});
	}



	initClient(resolve) {
		const client_id = '1002634411423-4df6obj6fe6hjdonds6q0pvhb1ctgn7e.apps.googleusercontent.com';
		const api_key = 'AIzaSyBFfAIR1tt4-AOfcsGxc87y-yZMLdrMNbk';
		const scope = [
			'https://www.googleapis.com/auth/gmail.compose',
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/contacts.readonly',
			'https://www.googleapis.com/auth/gmail.readonly'
		].join(' ');
		const dDocs = ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest', 'https://people.googleapis.com/$discovery/rest?version=v1'];
		gapi.client.init({
			discoveryDocs: dDocs,
			apiKey: api_key,
			clientId: client_id,
			scope: scope
		}).then(() => {
			if (!(gapi.auth2.getAuthInstance().isSignedIn.get())) {
				console.log('You are not logged in Google');
			}
			resolve();
		});
	}

	handleAuthClick() {
		return gapi.auth2.getAuthInstance().signIn().then(suc => {
			console.log(suc);
			return (suc);
		}, err => {
			console.log(err);
			return (err);
		});
	}

	handleSignoutClick() {
		gapi.auth2.getAuthInstance().signOut();
	}

	handleClientLoad() {
		this.loadGapiClient.then(this.initClient);
	}
	getGapi() {
		return this.googleInit.then(() => {
			return gapi;
		});
	}
	getAttachement() {

	}

	sendMessage(message, callback) {
		let atts = [];
		const attPromise = [];
		if (message.att) {
			message.att.forEach(att => {
				attPromise.push(this.getBase64(att));
			});
		}
		Promise.all(attPromise).then(attachments => {
			const atts = [];
			if (attachments) {
				let i = 0;
				attachments.forEach(att => {
					atts.push({
						name: `attachement${i}`,
						type: (att as string).slice((att as string).indexOf('data:', 0) + 5, (att as string).indexOf(';base64,', 0)),
						base64: (att as string).split('base64,')[1]
					});
					i++;
				});
			}
			let mail = [
				'MIME-Version: 1.0\r\n',
				'Content-Type: multipart/mixed; boundary="foo_bar_baz"\r\n',
				`to: ${message.to}\r\n`];
			if (message.cc) {
				mail.push(`cc: ${message.cc}\r\n`);
			}
			if (message.bcc) {
				mail.push(`bcc: ${message.bcc}\r\n`);
			}
			mail.push(`from: ${message.from}\r\n`);
			if (message['threadId']) {
				mail.push(`subject: ${message.resub}\r\n\r\n`);
				mail.push(`References: ${message.references}\r\n`);
				mail.push(`In-Reply-To: ${message.inReply}\r\n`);
			} else {
				mail.push(`subject: ${message.sub}\r\n\r\n`);
			}
			mail = mail.concat([
				'--foo_bar_baz\r\n',
				'Content-Type: text/plain; charset="UTF-8"\r\n',
				'MIME-Version: 1.0\r\n',
				'Content-Transfer-Encoding: 7bit\r\n\r\n',

				`${message.body}\r\n\r\n`,

				'--foo_bar_baz\r\n'
			]);
			if (atts) {
				atts.forEach(att => {
					mail = mail.concat([
						`Content-Type: ${att.type}; name:"${att.name}"\r\n`,
						'MIME-Version: 1.0\r\n',
						'Content-Transfer-Encoding: base64\r\n',
						`Content-Disposition: attachment; filename="${att.name}"\r\n\r\n`,
						`${att.base64}, \r\n\r\n`,
						'--foo_bar_baz\r\n']);
				});
			}
			const sendMail = mail.join('');
			const bytes = wtf8.encode(sendMail);
			const base64EncodedEmail = btoa(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
			const gmail = {
				'userId': message.userEmail,
				'resource': {
					'raw': base64EncodedEmail,
				}
			};
			if (message['threadId']) {
				gmail['resource']['threadId'] = message['threadId'];
			}

			const request = gapi.client.gmail.users.messages.send(gmail);
			request.execute(callback);
		});
	}
	getBase64(file) {
		if (file) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = error => reject(error);
			});
		} else {
			return new Promise((resolve, reject) => {
				resolve(null);
			});
		}
	}
}

