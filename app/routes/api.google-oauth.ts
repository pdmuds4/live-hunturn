import { LoaderFunctionArgs, ActionFunctionArgs, json, createCookie, redirect } from "@remix-run/node";
import apiHandler from "~/src/utils/apiHandler";
import ServerError from "~/src/utils/serverError";

import { GoogleOauthApi } from "~/src/types";

const cookie = createCookie('auth_info', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
})

export const loader = (args: LoaderFunctionArgs) => apiHandler(
    args,
    async ({ request }) => {
        const header = request.headers.get('cookie');

        if (header) {
            const cookie_value = await cookie.parse(header) as GoogleOauthApi.GETresponse;

            if (!cookie_value) throw new ServerError(
                'クッキーのパースに失敗しました',
                'Failed to parse cookie',
                request.url,
                500
            )

            return json(cookie_value)
        } else {
            throw new ServerError(
                'クッキーが見つかりませんでした',
                'No authentication information',
                request.url,
                401
            ) 
        }
    }
)

export const action = (args: ActionFunctionArgs) => apiHandler(
    args,
    async ({ request }) => {
        switch (request.method) {
            case 'POST': {
                const payload = await request.json() as GoogleOauthApi.POSTrequest;
                const cookie_header = await cookie.serialize(payload);

                return redirect('/', {
                    headers: {
                        'Set-Cookie': cookie_header,
                    }
                })
            }
            default: {
                throw new ServerError(
                    'リクエストメソッドが不正です',
                    'Invalid request method',
                    request.url,
                    400
                )
            }
        }
    }
)