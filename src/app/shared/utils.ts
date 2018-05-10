import { Parse } from '../parse.service';

export const DeveloperListType = {
	'suggested': -2,
	'applied': -1,
	'shortlist': 0,
	'phoneInterview': 1,
	'f2fInterview': 2,
	'jobOffered': 3,
	'hired': 4,
	'employeeReferrals': 5
};

export const JobType = { 'permanent': 1, 'contract': 2 };
export const ContractStatus = { 'archived': 0, 'active': 1, 'deleted': 2, 'draft': 3, 'pending': 4, 'approved': 5 };
export const FinalVerdict = { 'notSure': 1, 'yes': 2, 'definitely': 3 };
export const JobBoardPush = { 'inactive': 0, 'active': 1, 'expired': 2 };
export const AccessLevel = { 'siteAdmin': 1, 'admin': 2, 'contributor': 3 };
export const ScorecardStatus = { 'archived': 0, 'active': 1, 'deleted': 2 };

// Jobs page
export const JobsToShow = { 'myJobs': 1, 'companyJobs': 2 };

export const Loading = { 'loading': 0, 'success': 1, 'error': 2 };
