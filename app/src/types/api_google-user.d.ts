export type GETrequestDTO = {
    access_token: string;
}

export type GETresponseDTO = {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}