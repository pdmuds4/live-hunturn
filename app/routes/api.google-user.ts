import { json, LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import type { ExceptionResponse, GoogleUser } from "~/src/types";
import ServerError from "~/src/utils/serverError";

import axios from "axios";

export const loader = async (
    { request } : LoaderFunctionArgs
): Promise<TypedResponse<GoogleUser.GETresponseDTO>|TypedResponse<ExceptionResponse>> => {
    try {
        const payload = await request.json() as GoogleUser.GETrequestDTO;
        const params = {
            access_token: payload.access_token,
        }

        const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', { params });
        if (response.status !== 200) throw new ServerError(
            'Googleのユーザー情報の取得に失敗しました',
            'Failed to get Google user information',
            request.url,
            response.status
        );

        return json(response.data) as TypedResponse<GoogleUser.GETresponseDTO>;
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