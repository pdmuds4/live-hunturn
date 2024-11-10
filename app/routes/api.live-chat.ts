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
        const liveID = param.get('live_id');

        if (liveID) {
            const browser = await puppeteer.launch({
                headless: false,
                args: [
                    '--window-position=-1000,-1000',  // 画面外に配置
                    '--disable-gpu', // GPU使用を無効にする
                    '--disable-software-rasterizer'  // ソフトウェアレンダリングを無効にする
                ]
            });
            const page = await browser.newPage();

            try {
                await page.goto(`https://www.youtube.com/live_chat?is_popout=1&v=${liveID}`, { waitUntil: 'networkidle2' });
                await page.waitForSelector('yt-live-chat-text-message-renderer');
                
                const chat_infos = await page.$$eval('yt-live-chat-text-message-renderer', (elements) => {
                    return elements.map((element) => {
                        const message = element.querySelector('#message')?.textContent;
                        if (message) {
                            const avator = element.querySelector('.yt-img-shadow')!.getAttribute('src');
                            return {
                                id: avator?.replace('https://yt3.ggpht.com', '').split('=')[0] || '',
                                name: element.querySelector('#author-name')!.textContent || '',
                                avator: avator || '',
                                message: message,
                                timestamp: new Date()
                            }
                        } else {
                            return null;
                        }
                    }).filter((command) => command !== null);
                });

                const query = chat_infos.map((user_info) => {
                    if (command.recognizer(user_info.message)) {
                        const request = command.toRequest(user_info.message);
                        return { request, user_info }
                    } else {
                        return null;
                    }
                }).filter((command) => command !== null);

                return json({ query: query.length ? query: null }) as TypedResponse<LiveChatApi.GETresponse>;
            } finally {
                await browser.close();
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
);