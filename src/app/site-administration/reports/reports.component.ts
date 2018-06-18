import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Parse } from '../../parse.service';
import { RootVCRService } from '../../root_vcr.service';
import { AlertComponent } from '../../shared/alert/alert.component';
//tslint:disable:indent

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public teamMembers: Array<any> = [];
  public checkedTeamMembers: Array<any> = [];
  public scheduleArray: Array<any> = [];
  schedule = '';
  showUsers = false;

  @ViewChild('reportName') reportName: ElementRef;
  @ViewChild('scheduleInput') scheduleInput: ElementRef;


  constructor(
    private _parse: Parse,
    private _root_vcr: RootVCRService
  ) { }

  ngOnInit() {
    this.getTeamMembers().then(members => this.teamMembers = members);
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
            const id = this.checkedTeamMembers.indexOf(teamMember);
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

  generateReport() {
    const clientId = this._parse.getClientId();

    this._parse.execCloud('generateReport', { clientId: clientId })
    .then(report => {
      console.log(report);
      window.open(report, "_blank");
    })
    .catch(err => {
      console.error(err);
    })
  }

  generateSchedule() {
      const alert = this._root_vcr.createComponent(AlertComponent);
      alert.content = 'Report scheduler is only available in the enterprise edition. Please contact your sales representative.';
      alert.title = 'Restricted access';
		alert.addButton({
			type: 'warn',
			title: 'Close',
			onClick: () => {
				this._root_vcr.clear();
			}
		});
    // const reportName = this.reportName.nativeElement.value;
    // const delivery = this.scheduleInput.nativeElement.value;
    // const id = Math.random().toString(10).slice(1, 5);
    // if (reportName === '' || delivery === '' ) {
    //     return;
    // } else {
    //     const date = new Date();
    //     const users = this.checkedTeamMembers;
    //     const schedule = {
    //       name: reportName,
    //       users: users,
    //       date: date,
    //       delivery: delivery,
    //       creator: `${this._parse.getCurrentUser().get('firstName')}  ${this._parse.getCurrentUser().get('lastName')}`,
    //       id: id,
    //       status: 'active'
    //     };
    //     this.scheduleArray.push(schedule);
    //     this.checkedTeamMembers = [];
    //     this.reportName.nativeElement.value = null;
    //     this.reportName.nativeElement.value = null;
    //     this.schedule = '';
    //     this.teamMembers.forEach(teamMember => {
    //             teamMember.checked = false;
    //     });
    // }
  }

  removeSchedule(schedule) {
    this.scheduleArray.forEach(item => {
        if (item.id === schedule.id) {
            const index = this.scheduleArray.indexOf(item);
            this.scheduleArray.splice(index, 1);
        }
    });
  }

}
