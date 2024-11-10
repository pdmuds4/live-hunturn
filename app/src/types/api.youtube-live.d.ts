export type GETrequest = {
    live_id: string;
}

export type GETresponse = {
    host: {
        id: string;
        name: string;
        avator: string;
    }
    live_id: string;
    chat_id: string | null;
}

export type POSTrequest = {
    chat_id: string;
    page_token: string | null;
}

export type POSTresponse = {
    query : {
        user_info: {
            id: string;
            name: string;
            avator: string;
            message: string;
            timestamp: Date;
        },
        request: string,
    }[] | null;
    page_token: string | null;
}