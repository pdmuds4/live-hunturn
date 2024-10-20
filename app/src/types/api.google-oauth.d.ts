export type GETresponse = {
    access_token: string;
    authuser: string;
    expires_in: number;
    prompt: string;
    scope: string;
    token_type: string;
};

export type POSTrequest = {
    access_token: string;
};