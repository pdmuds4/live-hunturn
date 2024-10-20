import { LoaderFunctionArgs, json } from "@remix-run/node";
import apiHandler from "~/src/utils/apiHandler";
import ServerError from "~/src/utils/serverError";

import axios from "axios";

export const loader = (args: LoaderFunctionArgs) => apiHandler(
    args,
    async ({ request }) => {
        const cookie = request.headers.get('cookie');

        if (cookie) {
            const auth_info = await axios.get('/api.google-oauth', {
                headers: { cookie }
            });

            const access_token = auth_info.data.access_token;
            const user_info = await axios.get(
                'https://www.googleapis.com/oauth2/v1/userinfo',
                {
                    params: { access_token }
                }
            )

            return json(user_info.data);
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