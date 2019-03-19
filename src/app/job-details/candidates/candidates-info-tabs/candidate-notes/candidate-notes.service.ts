import { Injectable } from '@angular/core';

import { Parse } from './../../../../parse.service';

@Injectable()
export class CandidateNotesService {

	constructor(private _parse: Parse) { }

	createPointer(objectClass, objectID) {
		const Foo = this._parse.Parse.Object.extend(objectClass);
		const pointerToFoo = new Foo();
		pointerToFoo.id = objectID;
		return pointerToFoo;
	}
	getContractOwner(contractId: string): any {
		const owner = this._parse.Query('Contract');
		owner.include('owner');
		owner.include('owner.Client_Pointer');
		return owner.get(contractId).then((contract: any) => {
			return (contract.get('owner'));
		});
	}

	getCandidate(userId: string): any {
		const user = this._parse.Query('User');
		user.include('voted_user_ids');
		return user.get(userId).then((user: any) => {
			return user;
		});
	}

	getNote(noteId: string): any {
		const note = this._parse.Query('CandidateNotes');
		note.include('Author');
		note.include('FileAttached');
		return note.get(noteId).then((msg: any) => {
			console.log(msg);
			return msg;
		});
	}
	getContractApply(contractId: string, candidateId: string): any {
		const contractPointer = this.createPointer('Contract', contractId);
		const candidatePointer = this.createPointer('_User', candidateId);

		const query = this._parse.Query('ContractApply');
		query.containedIn('contract', [contractPointer]);
		query.containedIn('user', [candidatePointer]);
		query.select('Source_JobBoard.Name', 'user.firstName', 'user.lastName', 'contract.title', 'createdAt', 'updatedAt');
		return query.find().then(applies => {
			let data = [];
			let i = 0;
			applies.forEach(apply => {
				data[i] = {
					Message: `${apply.get('user').get('firstName')} ${apply.get('user').get('lastName')} applied to the ${apply.get('contract').get('title')} via ${apply.get('Source_JobBoard') ? apply.get('Source_JobBoard').get('Name') : 'SwipeIn'}.`,
					Author: ``,
					createdAt: apply.get('createdAt').toISOString(),
					updatedAt: apply.get('updatedAt').toISOString(),
					objectId: apply.id,
					IsPrivate: false,
					FileAttached: null
				};
				i++;
			});
			return data;
		});
	}
	getScorecardScoring(contractId: string, candidateId: string): any {
		const contractPointer = this.createPointer('Contract', contractId);
		const candidatePointer = this.createPointer('_User', candidateId);
		const query = this._parse.Query('ScorecardWeightedScore');
		query.containedIn('Job', [contractPointer]);
		query.containedIn('Candidate', [candidatePointer]);
		query.select('Author.firstName', 'Author.lastName', 'Candidate.firstName', 'Candidate.lastName', 'WeightedScore', 'Job.title', 'createdAt', 'updatedAt');
		return query.find().then(scores => {
			const data = [];
			let i = 0;
			scores.forEach(score => {
				data[i] = {
					Message: `${score.get('Author').get('firstName')} ${score.get('Author').get('lastName')} scored ${score.get('Candidate').get('firstName')} ${score.get('Candidate').get('lastName')} for ${score.get('WeightedScore')} points on job "${score.get('Job').get('title')}"`,
					Author: '',
					createdAt: score.get('createdAt').toISOString(),
					updatedAt: score.get('updatedAt').toISOString(),
					objectId: score.id,
					IsPrivate: false,
					FileAttached: null
				};
				i++;
			});
			return data;
		});
	}
	getUserList(contractId: string, candidateId: string): any {
		const contractPointer = this.createPointer('Contract', contractId);
		const candidatePointer = this.createPointer('_User', candidateId);

		const query = this._parse.Query('UserList');
		query.containedIn('contract', [contractPointer]);
		query.containedIn('candidate', [candidatePointer]);
		query.include('author');
		query.include('candidate');
		return query.first().then(userList => {
			let data = [];
			let i = 0;
			if (userList !== undefined) {
				const author = `${userList.get('author').get('firstName')} ${userList.get('author').get('lastName')}`;
				const candidate = `${userList.get('candidate').get('firstName')} ${userList.get('candidate').get('lastName')}`;
				userList.get('movingHistory').forEach(move => {
					let type;
					switch (move.type) {
						case 0:
							type = 'short list';
							break;
						case 1:
							type = 'phone interview';
							break;
						case 2:
							type = 'face to face interview';
							break;
						case 3:
							type = 'job offered';
							break;
						case 4:
							type = 'hired';
							break;
					}
					data[i] = {
						Message: `${author} moved ${candidate} to ${type} stage.`,
						Author: '',
						updatedAt: move.date,
						objectId: userList.id,
						IsPrivate: false,
						FileAttached: null
					};
					i++;
				});
			}
			return data;
		});
	}
	createCVFile(file: File, filename: string): any {

		const newAttachedFile = this._parse.Object('CVFile');
		newAttachedFile.set('documentFile', file);
		newAttachedFile.set('fileName', filename);

		return newAttachedFile.save().then(savedCV => {
			const query = this._parse.Query('CVFile');
			query.equalTo('objectId', savedCV.id);
			return query.first().then(CV => {
				return (CV);
			});
		});
	}
	getNotesHistory(options) {
		const lastNoteDate = options.lastNoteDate;
		const candidateID = options.candidateID;
		const contractID = options.contractID;
		const isNeedOldNotes = (options.typeNotes === 'old');

		const query = this._parse.Query('CandidateNotes');
		query.equalTo('Candidate', this.createPointer('_User', candidateID));
		query.equalTo('Job', this.createPointer('Contract', contractID));

		query.descending('updatedAt');
		if (isNeedOldNotes) {
			query.lessThanOrEqualTo('updatedAt', lastNoteDate);
			query.limit(1000);
		} else {
			query.greaterThan('updatedAt', lastNoteDate);
		};
		query.include('FileAttached');
		return query.find().then(notes => {
			const data = [];
			for (let i = 0; i < notes.length; i++) {
				const noteC = notes[i];
				data[i] = {
					Message: noteC.get('Message'),
					Author: noteC.get('Author'),
					createdAt: noteC.get('createdAt').toISOString(),
					updatedAt: noteC.get('updatedAt').toISOString(),
					objectId: noteC.id,
					IsPrivate: noteC.get('IsPrivate'),
					FileAttached: noteC.get('FileAttached') ? noteC.get('FileAttached') : null
				};
				data[i].Author.objectId = data[i].Author.id;
			};

			return (data);
		});
	}
	getTeamMembers() {
		let team = [];
		let i = 0;
		const client = this._parse.getCurrentUser().get('Client_Pointer');
		let clientId;
		if (client) {
			clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
		}
		const query = this._parse.Query('Clients');
		query.include('TeamMembers');
		return query.get(clientId).then(clientC => {
			clientC.get('TeamMembers').forEach(teamMember => {
				team[i] = {
					name: `${teamMember.get('firstName')}_${teamMember.get('lastName')}`,
					teamMemberPoint: teamMember.toPointer()
				};
				i++;
			});
			return (team);
		});
	}
}
