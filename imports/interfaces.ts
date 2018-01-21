export interface IUser {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  publicProfileUrl?: string;
  email?: string;
  avatarURL?: string;
  numConnections?: number;
  countryCode?: string;
  emailVerified?: boolean;
  summary?: string;
  partner?: any;  // ???
  positions?: Array<any>;
  developer?: any;  // ???
  recrutier?: any;  // ???
  companyNames?: Array<string>;
  savedProfiles?: Array<any>;
  authData?: any;
  headline?: string;
  location?: any;
  session?: string;
  companyIDs?: Array<string>;
  password?: string;
  industry?: string;
  Started_Trial?: Date;
  ExpiresOn?: Date;
  DaysTrialLeft?: number;
}

export interface IContract {
  programingSkills?: Array<any>;
  isHaveSuggestedCandidates?: boolean;
  startContractDate?: any;
  flexibleDays?: number;
  optionalSkills?: Array<any>;
  jobBenefitsHidden?: boolean;
  countryCode?: string;
  maxAnnualRate?: number;
  maxRate?: number;
  userObjectId?: string;
  collaboratorStatuses?: Array<any>;
  companyName?: string;
  isTR?: boolean;
  companyDescriptionHidden?: boolean;
  sponsoringWorkingVisa?: boolean;
  contractDescription?: string;
  isASAP?: boolean;
  logo?: File;
  applies?: Array<any>;
  countriesSourcing?: Array<any>;
  collaborators?: Array<any>;
  postCode?: string;
  isActive?: boolean;
  durationMax?: number;
  minAnnualRate?: number;
  minRate?: number;
  status?: number;
  owner?: any;
  postLocation?: any;
  CountriesSourcingFrom?: Array<any>;
  useMasterKey?: boolean;
  jobType?: number;
  industryTags?: Array<any>;
  postCodeCity?: string;
  salaryPreferencesHidden?: boolean;
  title?: string;
  jobBenefits?: string;
  sponsoringWorkVisa?: boolean;
  submits?: Array<any>;
  industries?: Array<any>;
  roles?: Array<any>;
  durationMin?: number;
  companyDescription?: string;
}
