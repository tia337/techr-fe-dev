import { Routes } from '@angular/router';
import { CandidateChatComponent } from './candidates-info-tabs/candidate-chat/candidate-chat.component';
import { ScorecardsAssessmentsComponent } from './candidates-info-tabs/scorecards-assessments/scorecards-assessments.component';
import { ScoringComponent } from './candidates-info-tabs/scoring/scoring.component';
import { SkillsComponent } from './candidates-info-tabs/skills/skills.component';
import { CandidateCvComponent } from './candidates-info-tabs/candidate-cv/candidate-cv.component';
import { CandidateNotesComponent } from './candidates-info-tabs/candidate-notes/candidate-notes.component';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';


export const CandidatesRoutes: Routes = [
	// { path: '', component: CandidateProfileComponent },
	// {
	//   path: 'candidate',
	//   component: CandidateProfileComponent,
	//   children: [
	{ path: '', redirectTo: 'notes', pathMatch: 'full' },
	{ path: 'notes', component: CandidateNotesComponent },
	{ path: 'scorecards-assessments', component: ScorecardsAssessmentsComponent },
	{ path: 'scoring', component: ScoringComponent },
	{ path: 'chat', component: CandidateChatComponent },
	{ path: 'skills', component: SkillsComponent },
	{ path: 'cv', component: CandidateCvComponent }
	//   ]
	// }
];
