export type GETrequest = {
    live_id: string;
}

export type GETresponse = {
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
    chat_token: string;
}