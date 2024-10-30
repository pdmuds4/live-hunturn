import { LoaderFunctionArgs, ActionFunctionArgs, TypedResponse, json } from "@remix-run/node";
import apiHandler from "~/src/utils/apiHandler";
import ServerError from "~/src/utils/serverError";

import YoutubeClient from "~/src/client/youtube";
import { YoutubeLiveApi } from "~/src/types";

import CommandProcessor from "~/src/client/command";
import command_parser from "~/src/command";

const client = new YoutubeClient(import.meta.env.VITE_YOUTUBE_API_KEY);
const command = new CommandProcessor(command_parser);

export const loader = (args: LoaderFunctionArgs) => apiHandler(
    args,
    async ({ request }) => {
        const param = new URL(request.url).searchParams;
        const liveID = param.get('live_id');

        if (liveID) {
            const video_response = await client.videos.list(
                { 
                    id: [liveID], 
                    part: ['snippet', 'liveStreamingDetails']
                }
            );
            const video_info = video_response.data.items ? video_response.data.items[0] : null;
            const live_info = video_info?.liveStreamingDetails;
            if (live_info) {
                const chat_id = live_info.activeLiveChatId;
                if (!chat_id) throw new ServerError(
                    'この配信は終了しているか、チャットが無効です',
                    'No chat found',
                    request.url,
                    404
                );

                const channel_id = video_info!.snippet!.channelId as string;
                const channel_response = await client.channels.list(
                    {
                        id: [channel_id],
                        part: ['snippet']
                    }
                );
                const channel_info = channel_response.data.items![0];
                const host = {
                    id: channel_id,
                    name: channel_info!.snippet!.title as string,
                    avator: channel_info!.snippet!.thumbnails!.default!.url as string
                }

                return json({ host, chat_id }) as TypedResponse<YoutubeLiveApi.GETresponse>;
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
                            pageToken: payload.page_token ? payload.page_token : undefined
                        }
                    );
    
                    const chat_infos = response.data.items;
                    const page_token = response.data.nextPageToken as string;
                    
                    const query = chat_infos ? chat_infos.map((chat_info) => {
                        const message = chat_info!.snippet!.displayMessage as string;
                        if (command.recognizer(message)) {
                            const request = command.toRequest(message);
                            const user_info = {
                                id:        chat_info!.authorDetails!.channelId,
                                name:      chat_info!.authorDetails!.displayName,
                                avator:    chat_info!.authorDetails!.profileImageUrl,
                                message:   chat_info!.snippet!.displayMessage,
                                timestamp: new Date(chat_info!.snippet!.publishedAt!)
                            }
                            return { request, user_info }
                        } else {
                            return null;
                        }
                    }).filter((command) => command !== null) : null;

                    return json({ query, page_token }) as TypedResponse<YoutubeLiveApi.POSTresponse>;
                    
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