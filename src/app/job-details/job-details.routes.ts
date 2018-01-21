import { Routes } from '@angular/router';

import { CandidatesComponent } from './candidates/candidates.component';
import { JobBoardsComponent } from './job-boards/job-boards.component';
import { SocialMediaShareComponent } from './social-media-share/social-media-share.component';
import { ErpJobComponent } from './erp-job/erp-job.component';

import { CandidatesRoutes } from './candidates/candidates.routes';
import { JobOverviewComponent } from './job-overview/job-overview.component';
import { JobDetailsGuard } from '../guards/job-details.guard';

export const JobDetailsRoutes: Routes = [
	{ path: '', component: CandidatesComponent },
	{ path: 'candidates', component: CandidatesComponent, canActivate: [JobDetailsGuard], children: [...CandidatesRoutes] },
	{ path: 'job-boards', component: JobBoardsComponent, canActivate: [JobDetailsGuard] },
	{ path: 'job-overview', component: JobOverviewComponent },
	// { path: 'social-media-share', component: SocialMediaShareComponent, canActivate: [JobDetailsGuard] },
	{ path: 'refferal-program', component: ErpJobComponent, canActivate: [JobDetailsGuard] }
];
