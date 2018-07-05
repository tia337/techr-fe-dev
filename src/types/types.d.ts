import { FinalVerdict } from "app/shared/utils";

type UserParse = {
    Languages: Array<any>,
    Phone: string,
    phone2?: string,
    WebSites: Array<{ Type: string, Url: string }>,
    dataOwners: Array<{ ownerId: string }>,
    email: string,
    firstName?: string,
    lastName?: string,
    summary?: string,
    username?: string,
    _created_at: Date,
    _id: string,
    _p_developer: string,
    _updated_at: Date,
    avatarURL?: string,
    headline?: string,
    location?: string
}

type DeveloperParse = {
    dataOwners: Array<{ ownerId: string }>,
    jobStatuses: Array<number>,
    skills: Array<any>,
    _created_at: Date,
    _updated_at: Date,
    _id: string,
    _p_documentCV: string
}

type ChatTeamMember = {
    firstName: string,
    lastName: string,
    id: string | boolean,
    sessionStatus: string,
    avatar: string,
    undefinedAvatar: string,
    background: string
}

type MessageParse = {
    IsEmailDelivered: boolean, 
    IsEmailOpened: boolean,
    IsEmailSent: boolean,
    authorAvatarURL: string, 
    authorFullname: string, 
    isEmailed: boolean,
    isPushSent: boolean, 
    message: string,
    _created_at: Date,
    _updated_at: Date,
    _id: string,
    _p_Type: string,
    _p_author: string,
    _p_dialog: string
}

type NotesParse = {
    IsPrivate: boolean,
    Message: string,
    TaggedColleagues: Array<string>,
    authorAvatarURL: string,
    authorFullname: string,
    candidateFullname: string,
    contractTitle: string,
    emailIDs: Array<string>,
    isEmailSent: boolean,
    isPushSent: boolean,
    notePipelineStage: number,
    _created_at: Date,
    _updated_at: Date,
    _id: string,
    _p_Author: string,
    _p_Candidate: string,
    _p_Client: string,
    _p_Job: string,
    _p_contractOwner: string
}

type ScorecardsParse = {
    ClientName: string,
    FinalVerdict: number,
    FinalVerdictNotes: string,
    TaggedColleagues: Array<string>,
    WeightedScore: number,
    authorAvatarURL: string,
    authorFullname: string,
    candidateFullname: string,
    contractTitle: string,
    isWebPushSent: boolean,
    scoringPipelineStage: number,
    _created_at: Date,
    _updated_at: Date,
    _id: string,
    _p_Author: string,
    _p_Candidate: string,
    _p_Client: string,
    _p_Job: string,
    _p_Scorecard: string,
    _p_contractOwner: string
}

type UpdatedUser = {
    userId: string
}

interface LooseObject {
    [key: string]: any
}

type NotificationMessageSender = {
    avatarURL: string,
    firstName: string,
    id: string,
    lastName: string,
    sessionStatus: boolean
}

type StagesArray  = Array<{ 
    index: number, 
    type: string, 
    title: string, 
    value: number, 
    editable: boolean,
    settingsOpened?: boolean,
    rejectedLogic: boolean,
    withdrawnLogic: boolean,
    candidates?: Array<any>
}>;

type Stage = {
    index: number, 
    type: string, 
    title: string, 
    value: number,
    editable: boolean,
    settingsOpened?: boolean,
    rejectedLogic: boolean,
    withdrawnLogic: boolean,
    candidates?: Array<any>
};

type ClientsArray = Array<{
    id: number,
    name: string
}>;

type ProjectsArray = Array<{
    id: number,
    name: string,
    clients: ClientsArray
}>;

type BulkActionsArray = Array<{
    className: string,
    id: string,
    rejectionList: {
        opened: boolean, 
        reasons: Array<{ 
            type: string, 
            reason: string 
        }>
    },
    rejectionReason: string,
    hasRejectionReason: boolean,
    personalRejectionReason: boolean,
    source: string,
    _objCount: string
    attributes: Object,
    createdAt: Date
  }>;

  type FilterParams = {
      applied: Array<any>,
      pipeline: Array<any>,
      location: Array<any>,
      preferences: Array<any>,
      source: Array<any>
  }

  type UserRole = {
      roleName: string, 
      roleDescription: string, 
      roleRights: [
          { id: string, description: string }
        ]
    };

    type PaginationLimits = {
        from: number,
        to: number
    };

    
    // TALENT DATA BASE TYPES START
    
    type TalentDBCandidate = {
        _id: string,
        firstName: string,
        lastName: string,
        headline: string,
        location: string,
        avatarURL: string,
        checked?: boolean
    }
    
    type FilterItem = {
        type: string,
        items: Array<{ 
            title: string, 
            usersId: Array<string>,
            filteredUsersId?: Array<string>,
            count: number,
            disabled?: boolean,
            hidden?: boolean    
          }>,
        checked?: boolean,
    }
    
    type UserTalentDBFilter = {
        title: string
        type: string,
        index?: string,
        checked?: boolean
    }

    type BulkUploadItem = {
        id: string,
        date: Date,
        author: string,
        authorEmail: string,
        filesError?: number,
        filesSuccess: number,
        filesTotal: number,
        uploadFilename: string,
        uploadFinished: boolean,
        uploadSize: number,
        uploadUserFilename: string
    }

    type Experience = {
        id: string,
        jobTitle: string,
        companyName: string,
        location: string,
        monthDateFrom: string,
        yearDateFrom: string,
        monthDateTo: string,
        yearDateTo: string,
        currentlyWorks: boolean,
        description: string,
        hidden?: boolean
    }

    type Education = {
        id: string,
        schoolInstitutionName: string,
        degree: string,
        major: string,
        location: string,
        yearDateFrom: string,
        monthDateFrom: string,
        yearDateTo: string,
        monthDateTo: string,
        currentlyAttends: boolean,
        description: string,
        hidden?: boolean
    }

    type SingleViewCandidateLeftBlock = {
        user: UserParse,
        developer: DeveloperParse,
        attachments: Array<any>,
        tags: Array<any>
    }

    type SingleViewCandidateCenterBlock = Array<{ 
        title: string,
        count: number | string,
        contracts: Array<any>
    }>

    type SingleViewCandidateRightBlock = Array<{ 
        title: string, 
        items: Array<any>,
        roles?: Array<any>,
        industries?: Array<any>
    }>

    // TALENT DATA BASE TYPES END  
