type ChatTeamMember = {
    firstName: string,
    lastName: string,
    id: string | boolean,
    sessionStatus: string,
    avatar: string,
    undefinedAvatar: string,
    background: string
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
    editable: boolean
}>;

type Stage = {
    index: number, 
    type: string, 
    title: string, 
    value: number,
    editable: boolean
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
        firstName: string,
        lastName: string,
        headline: string,
        location: string,
        avatarURL: string,
        checked?: boolean
    }
    
    type FilterItem = {
        type: string,
        items: Array<{ title: string, count: number | string }>
        checked?: boolean
    }
    
    type UserTalentDBFilter = {
        title: string
        type: string,
        index?: string,
        checked?: boolean
    }

    // TALENT DATA BASE TYPES END  
