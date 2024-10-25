export type GETrequest = {
    live_id: string;
}

export type GETresponse = {
    chat_id: string | null;
}

export type POSTrequest = {
    host_id: string;
    chat_id: string;
    page_token: string | null;
}

export type POSTresponse = {
    user_info?: {
        id: string;
        name: string;
        avator: string;
        message: string;
        timestamp: Date;
    }[],
    user_names?: string[],
    request: 'join' | 'leave' | 'rejoin',
    page_token: string | null;
}