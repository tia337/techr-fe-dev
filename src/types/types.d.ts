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

type StagesArray  = Array<{ index: number, type: string, title: string, value: number, editable: boolean}>;

type Stage = {
    index: number, 
    type: string, 
    title: string, 
    value: number,
    editable: boolean
};

type ClientsArray = Array< {
    id: number,
    name: string
}>;

type ProjectsArray = Array< {
    id: number,
    name: string,
    clients: ClientsArray
} >