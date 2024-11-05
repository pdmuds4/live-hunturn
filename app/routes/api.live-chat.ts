import { LoaderFunctionArgs, TypedResponse, json } from "@remix-run/node";
import apiHandler from "~/src/utils/apiHandler";
import ServerError from "~/src/utils/serverError";

import { LiveChatApi } from "~/src/types";
import puppeteer from "puppeteer";

export const loader = (args: LoaderFunctionArgs) => apiHandler(
    args,
    async ({ request }) => {
        const param = new URL(request.url).searchParams;
        const liveID = param.get('live_id');

        if (liveID) {
            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            await page.goto(`https://www.youtube.com/live_chat?is_popout=1&v=${liveID}`);
            await page.waitForSelector('yt-live-chat-text-message-renderer');

            const messages = await page.$$eval('yt-live-chat-text-message-renderer', (elements) => {
                return elements.map((element) => {
                    return element
                });
            });
            return json({ messages });
            
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