import { LoaderFunctionArgs, TypedResponse, json } from "@remix-run/node";
import apiHandler from "~/src/utils/apiHandler";
import ServerError from "~/src/utils/serverError";

import YoutubeClient from "~/src/client/youtube";
import { YoutubeLiveApi } from "~/src/types";

const client = new YoutubeClient(import.meta.env.VITE_YOUTUBE_API_KEY);

export const loader = (args: LoaderFunctionArgs) => apiHandler(
    args,
    async ({ request }) => {
        const param = new URL(request.url).searchParams;
        const liveID = param.get('live_id');

        if (liveID) {
            const response = await client.videos.list({ id: [liveID], part: ['snippet', 'liveStreamingDetails'] });
            const video_info = response.data.items ? response.data.items[0] : null;
            const channel_id = video_info?.snippet?.channelId;

            return json({ channel_id }) as TypedResponse<YoutubeLiveApi.GETresponse>;
        } else {
            throw new ServerError(
                '配信IDを入力してください',
                'No liveID found',
                request.url,
                400
            )
        }
    }
)