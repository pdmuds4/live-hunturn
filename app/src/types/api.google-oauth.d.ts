import { GoogleOauthDTO } from "./dto.googleOauth";

export type GETresponse = GoogleOauthDTO;

export type POSTrequest = {
    access_token: string;
};