import { LoaderFunctionArgs, ActionFunctionArgs, TypedResponse, json } from "@remix-run/node";
import apiHandler from "~/src/utils/apiHandler";
import ServerError from "~/src/utils/serverError";

import YoutubeClient from "~/src/client/youtube";
import { YoutubeLiveApi } from "~/src/types";

import CommandProcessor from "~/src/client/command";
import command_assets from "~/src/command";

const client = new YoutubeClient(import.meta.env.VITE_YOUTUBE_API_KEY);
const command = new CommandProcessor(command_assets);

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
                            pageToken: payload.page_token ? payload.page_token : undefined
                        }
                    );
    
                    const chats = response.data.items
                    const page_token = response.data.nextPageToken ? response.data.nextPageToken : '';
                    
                    if (chats && chats.length > 0) {
                        const latest5_chat = chats.slice(-10).reverse();

                        return json({
                            query: latest5_chat.map(chat => {
                                const chat_message = chat.snippet?.displayMessage as string;
                                if (command.isCommand(chat_message)) {
                                    const { request, users } = command.process(chat_message);
                                    if (users && users.length) {
                                        return {
                                            user_names: users,
                                            request,
                                            page_token
                                        }
                                    } else {
                                        const user_info = {
                                            id:        chat.authorDetails?.channelId       ? chat.authorDetails.channelId       : null,
                                            name:      chat.authorDetails?.displayName     ? chat.authorDetails.displayName     : null,
                                            avator:    chat.authorDetails?.profileImageUrl ? chat.authorDetails.profileImageUrl : null,
                                            message:   chat.snippet?.displayMessage        ? chat.snippet.displayMessage        : null,
                                            timestamp: chat.snippet?.publishedAt           ? new Date(chat.snippet.publishedAt) : null,
                                        }
        
                                        return {
                                            user_info,
                                            request,
                                            page_token
                                        }
                                    }
                                } else {
                                    return null;
                                }
                            }).filter((i) => i !== null),
                            page_token
                        }) as TypedResponse<YoutubeLiveApi.POSTresponse>;
                    } else {
                        return json({
                            query: null,
                            page_token
                        }) as TypedResponse<YoutubeLiveApi.POSTresponse>;
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