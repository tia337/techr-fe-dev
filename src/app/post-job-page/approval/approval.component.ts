//tslint:disable
import {
    Component,
    OnInit,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter
  } from '@angular/core';
  import { Parse } from '../../parse.service';
import { RootVCRService } from '../../root_vcr.service';
  
  @Component({
    selector: 'approval',
    templateUrl: './approval.component.html',
    styleUrls: [ './approval.component.scss' ]
  })
  
  export class ApprovalComponent implements OnInit {

    approversHidden = true;
    request = 'pending';
    public teamMembers: Array<any> = [];
    public checkedTeamMembers: Array<any> = [];
  
    constructor (
        private _elementRef: ElementRef, 
        private _renderer: Renderer2,
        private _parse: Parse,
        private _root_vcr: RootVCRService
    ) {}
  
  
    ngOnInit() {
        this.getTeamMembers().then(members => {
            this.teamMembers = members;
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
                name: `${teamMember.get('firstName')} ${teamMember.get('lastName')}`,
                teamMemberPoint: teamMember.toPointer(),
                id: teamMember.id,
                checked: false,
                type: 'user',
            };
            i++;
            });
            return (team);
        });
    }

    addToCheckedMembers(member) {
        if (member.checked === false) {
            this.checkedTeamMembers.push(member);
            member.checked = true;
            return;
        } else if (member.checked === true) {
            this.removeFromCheckedTeamMembers(member);
        }
    }

    addEmailToCheckedMembers(email) {
        if (email !== '') {
            const id = Math.random().toString(5);
            this.checkedTeamMembers.push({
                name: email,
                id: id,
                type: 'email',
            });
        }
    } 

    removeFromCheckedTeamMembers(member) {
        this.checkedTeamMembers.forEach(teamMember => {
            if (teamMember.id === member.id) {
                let id = this.checkedTeamMembers.indexOf(teamMember);
                this.checkedTeamMembers.splice(id, 1);   
            }
        });
        if (member.type === 'user') {
            this.teamMembers.forEach(teamMember => {
                if (teamMember.id === member.id) {
                    teamMember.checked = false;
                }
            });
        }
    }

    sendRequest() {
        this.closeRequestApproval();
    }

    closeRequestApproval() {
        this._root_vcr.clear();
    }

  }
  