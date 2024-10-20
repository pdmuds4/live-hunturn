export type GETresponseDTO = {
    code: string;
}

export type POSTrequestDTO = {
    code: string;
}
export type POSTresponseDTO = {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    id_token: string;
    expires_in: number;
}