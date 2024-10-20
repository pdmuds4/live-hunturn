import { youtube_v3 } from "googleapis";

export default class YoutubeClient extends youtube_v3.Youtube {
    constructor(apiKey: string) {
        super({
            apiVersion: 'v3',
            auth: apiKey
        });
    }
}