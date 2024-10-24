export type GETrequest = {
    live_id: string;
}

export type GETresponse = {
    chat_id: string | null;
}

export type POSTrequest = {
    chat_id: string;
    page_token: string | null;
}

export type POSTresponse = {
    latest_chat: {
        id: string | null;
        name: string | null;
        avatar: string | null;
        message: string | null;
        timestamp: Date | null;
    },
    page_token: string | null;
}