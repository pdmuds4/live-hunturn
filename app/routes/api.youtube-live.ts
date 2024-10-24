import { LoaderFunctionArgs, ActionFunctionArgs, TypedResponse, json } from "@remix-run/node";
import apiHandler from "~/src/utils/apiHandler";
import ServerError from "~/src/utils/serverError";

import YoutubeClient from "~/src/client/youtube";
import { YoutubeLiveApi } from "~/src/types";

import { youtube_v3 } from "googleapis";

const client = new YoutubeClient(import.meta.env.VITE_YOUTUBE_API_KEY);

export const loader = (args: LoaderFunctionArgs) => apiHandler(
    args,
    async ({ request }) => {
        const param = new URL(request.url).searchParams;
        const liveID = param.get('live_id');

        if (liveID) {
            const response = await client.videos.list(
                { 
                    id: [liveID], 
                    part: ['snippet', 'liveStreamingDetails'] 
                }
            );
            const video_info = response.data.items ? response.data.items[0] : null;

            const live_info = video_info?.liveStreamingDetails;
            if (live_info) {
                const chat_id = live_info.activeLiveChatId;
                if (!chat_id) throw new ServerError(
                    'この配信は終了しているか、チャットが無効です',
                    'No chat found',
                    request.url,
                    404
                );

                return json({ chat_id }) as TypedResponse<YoutubeLiveApi.GETresponse>;
            } else {
                throw new ServerError(
                    'この動画はライブ配信コンテンツではありません',
                    'No live information found',
                    request.url,
                    404
                )
            }
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

export const action = (args: ActionFunctionArgs) => apiHandler(
    args,
    async ({ request }) => {
        switch (request.method) {
            case 'POST': {
                const payload = await request.json() as YoutubeLiveApi.POSTrequest;

                if (payload.chat_id) {
                    const response = await client.liveChatMessages.list(
                        {
                            liveChatId: payload.chat_id,
                            part: ['id', 'snippet', 'authorDetails'],
                            //maxResults: 5,
                            pageToken: payload.page_token ? payload.page_token : undefined
                        }
                    );

                    const chats = response.data.items
                    const page_token = response.data.nextPageToken ? response.data.nextPageToken : '';
                    
                    if (chats && chats.length > 0) {
                        const latest_chat = chats.at(-1) as youtube_v3.Schema$LiveChatMessage;
                        const chat_info = {
                            id:        latest_chat.authorDetails?.channelId       ? latest_chat.authorDetails.channelId       : null,
                            name:      latest_chat.authorDetails?.displayName     ? latest_chat.authorDetails.displayName     : null,
                            avator:    latest_chat.authorDetails?.profileImageUrl ? latest_chat.authorDetails.profileImageUrl : null,
                            message:   latest_chat.snippet?.displayMessage        ? latest_chat.snippet.displayMessage        : null,
                            timestamp: latest_chat.snippet?.publishedAt           ? new Date(latest_chat.snippet.publishedAt) : null,
                        };
                        return json({ latest_chat: chat_info, page_token });
                    } else {
                        throw new ServerError(
                            'チャットが見つかりませんでした',
                            'No chat found',
                            request.url,
                            404
                        )
                    }
                } else {
                    throw new ServerError(
                        'チャットIDが見つかりませんでした',
                        'No chatID found',
                        request.url,
                        400
                    )
                }
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
);