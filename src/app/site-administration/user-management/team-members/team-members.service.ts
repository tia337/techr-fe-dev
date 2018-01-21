import { Injectable } from '@angular/core';
import { Parse } from '../../../parse.service';

@Injectable()
export class TeamMembersService {

  constructor(private _parse: Parse) {}

  getUsers(): any {
    const clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
    const query = this._parse.Query('Clients');
    query.equalTo('objectId', clientId);
    // query.include('TeamMembers');
    return query.first().then(client => {
      return this._parse.staticObject().fetchAll(client.get('TeamMembers'));
    });
  }

  getDeletedUsers(): any {
    const clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
    const query = this._parse.Query('Clients');
    query.equalTo('objectId', clientId);
    // query.include('TeamMembers');
    return query.first().then(client => {
      return this._parse.staticObject().fetchAll(client.get('InactiveUsers'));
    });
  }

  getInvitations(): any {
    const clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
    const query = this._parse.Query('Clients');
    query.equalTo('objectId', clientId);
    return query.first().then(client => {

      const invitations = this._parse.Query('Invitations');
      invitations.equalTo('ClientPointer', client);
      invitations.notEqualTo('Invitation_Status', 1);
      invitations.notEqualTo('Invitation_Status', 3);
      // invitations.equalTo('Invitation_Author', this._parse.getCurrentUser());
      return invitations.find(invitation => {
        return invitation;
      });

    });
  }

  deleteInvitation(invitationId: string): any {
    console.log(invitationId);
    const invitations = this._parse.Query('Invitations');
    return invitations.get(invitationId).then(invitation => {
      invitation.set('Invitation_Status', 3);
      return invitation.save();
    });
  }

  resendInvitation(invitationId: string) {
    // const user = this._parse.Query('User');
    // user.get(this._parse.getCurrentUser().id).then(currentUser => {
    //   const invitationQuery = this._parse.Query('Invitations');
    //   invitationQuery.equalTo('objectId', invitationId);
    //   invitationQuery.equalTo('Invitation_Author', currentUser);
    //   invitationQuery.first().then(invitationPromise => {
    //     invitationPromise.fetch().then(invitation => {
    //       this._parse.execCloud('sendEmail', {
    //         to: invitation.get('Email_Address'),
    //         from: currentUser.get('Work_email'),
    //         subject: 'SwipeIn Invitation',
    //         text: invitation.get('InvitationMessage')
    //       });
    //     });
    //   });
    // });
    return this._parse.Parse.Cloud.run('resendInvitation', {invitiationId: invitationId});
  }

}
