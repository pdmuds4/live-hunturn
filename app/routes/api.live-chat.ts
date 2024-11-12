import { LoaderFunctionArgs, TypedResponse, json } from "@remix-run/node";
import apiHandler from "~/src/utils/apiHandler";
import ServerError from "~/src/utils/serverError";

import { LiveChatApi } from "~/src/types";
import puppeteer from "puppeteer";

import CommandProcessor from "~/src/client/command";
import command_parser from "~/src/command";

const command = new CommandProcessor(command_parser);

export const loader = (args: LoaderFunctionArgs) => apiHandler(
    args,
    async ({ request }) => {
        const param = new URL(request.url).searchParams;
        const live_id = param.get('live_id');
        const chat_token = param.get('chat_token');

        if (live_id) {
            const browser = await puppeteer.launch({
                headless: false,
                args: [
                    '--window-position=-1000,-1000',
                    '--disable-gpu',
                    '--disable-software-rasterizer',
                    '--window-size=200,200'  // ウィンドウサイズを指定
                ]
            });
            const page = await browser.newPage();

            try {
                await page.goto(`https://www.youtube.com/live_chat?is_popout=1&v=${live_id}`, { waitUntil: 'networkidle2' });
                await page.waitForSelector('yt-live-chat-text-message-renderer');
                
                const chat_infos = await page.$$eval('yt-live-chat-text-message-renderer', (elements) => {
                    return elements.map((element) => {
                        const message = element.querySelector('#message')?.textContent;
                        if (message) {
                            const avator = element.querySelector('.yt-img-shadow')!.getAttribute('src');
                            return {
                                chat_id: element.getAttribute('id') || '',
                                user_info: {
                                    id: avator?.replace('https://yt3.ggpht.com', '').split('=')[0] || '',
                                    name: element.querySelector('#author-name')!.textContent || '',
                                    avator: avator || '',
                                    message: message,
                                    timestamp: new Date()
                                }
                            }
                        } else {
                            return null;
                        }
                    }).filter(
                        (command) => command !== null
                    )
                });


                const last_chat_id = chat_infos[chat_infos.length - 1].chat_id;
                const next_chat_index = chat_infos.findIndex((info) => info.chat_id === chat_token) + 1;

                const query = chat_infos.slice(next_chat_index).map((info) => {
                    if (command.recognizer(info.user_info.message)) {
                        const request = command.toRequest(info.user_info.message);
                        return { request, user_info: info.user_info };
                    } else {
                        return null;
                    }
                }).filter((command) => command !== null);

                return json({ 
                    query: query.length ? query: null,
                    chat_token: last_chat_id
                }) as TypedResponse<LiveChatApi.GETresponse>;
            } catch(e){
                return json({ query: null, chat_token }) as TypedResponse<LiveChatApi.GETresponse>;
            }finally {
                await browser.close();
            }
        } else {
            throw new ServerError(
                '配信IDを入力してください',
                'No live_id found',
                request.url,
                400
            )
        }
    }
);