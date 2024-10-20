import { ActionFunctionArgs, json, LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import type { ExceptionResponse, GoogleCode } from "~/src/types";
import ServerError from "~/src/utils/serverError";

import axios from "axios";

export const loader = async (
    { request }: LoaderFunctionArgs
): Promise<TypedResponse<GoogleCode.GETresponseDTO>|TypedResponse<ExceptionResponse>> => {
    try {
        const url = new URL(request.url);
        const oauth_code = url.searchParams.get('code');

        if (!oauth_code) throw new ServerError(
            'OAuthコードの取得に失敗しました',
            'The code could not be retrieved',
            request.url,
            400
        );
        return json({ code: oauth_code });
    } catch (error) {
        if (error instanceof ServerError) {
            return json({
                message: error.message,
                detail: error.detail,
                route: error.route,
            }, { status: error.statusCode });
        } else {
            return json({
                message: '不明なエラーが発生しました',
                detail: 'Error is not an instance of Error',
                route: request.url,
            }, { status: 500 });
        }
    }
}

export const action = async (
    { request }: ActionFunctionArgs
): Promise<TypedResponse<GoogleCode.POSTresponseDTO>|TypedResponse<GoogleCode.DELETEresponseDTO>|TypedResponse<ExceptionResponse>> => {
    try {
        switch (request.method) {
            case 'POST': {
                const payload = await request.json() as GoogleCode.POSTrequestDTO;
                const params = {
                    code:          payload.code,
                    client_id:     process.env.GOOGLE_OAUTH_CLIENT_ID,
                    client_secret: process.env.GOOGLE_OAUTH_SECRET,
                    redirect_uri: 'http://localhost:5173/',
                    grant_type:   'authorization_code',
                    access_type:  'offline',
                }
            
                const response = await axios.post('https://oauth2.googleapis.com/token', params);
                return json(response.data) as TypedResponse<GoogleCode.POSTresponseDTO>;
            }
            case 'DELETE': {
                const payload = await request.json() as GoogleCode.DELETErequestDTO;
                const params = {
                    token: payload.access_token,
                }
                const response = await axios.get('https://accounts.google.com/o/oauth2/revoke', { params });
                if (response.status !== 200) throw new ServerError(
                    'ログアウトに失敗しました',
                    'Failed to revoke token',
                    request.url,
                    400
                );
                return json({ message: response.data }) as TypedResponse<GoogleCode.DELETEresponseDTO>;
            }
            default: {
                throw new ServerError(
                    '不正なリクエストです',
                    'Only GET & POST requests are allowed',
                    request.url,
                    405
                );
            }
        }
    } catch (error) {
        if (error instanceof ServerError) {
            return json({
                message: error.message,
                detail: error.detail,
                route: error.route,
            }, { status: error.statusCode });
        } else {
            return json({
                message: '不明なエラーが発生しました',
                detail: 'Error is not an instance of Error',
                route: request.url,
            }, { status: 500 });
        }
    }
}