import { json, LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import type { ExceptionResponse, GoogleOauth } from "~/src/types";
import ServerError from "~/src/utils/serverError";

export const loader = async (
    { request } : LoaderFunctionArgs
): Promise<TypedResponse<GoogleOauth.GETresponseDTO>|TypedResponse<ExceptionResponse>> => {
    try {
        if (!process.env.GOOGLE_OAUTH_CLIENT_ID) throw new ServerError(
            'Google OAuthのクライアントIDがみつかりませんでした',
            'Please set the GOOGLE_OAUTH_CLIENT_ID environment variable',
            request.url,
            404
        );

        const params = new URLSearchParams({
            client_id:       process.env.GOOGLE_OAUTH_CLIENT_ID || '',
            redirect_uri:    'http://localhost:5173/api/google-code',
            scope:           'https://www.googleapis.com/auth/userinfo.profile',
            response_type:   'code',
            approval_prompt: 'force',
            access_type:     'offline',
        }).toString();

        return json({
            url: `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
        })
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