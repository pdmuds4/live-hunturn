import { useState, useEffect } from 'react';
import axios from 'axios';

import { HunterFactory, HunterStorage } from '../models';
import { LiveChatApi, YoutubeLiveApi } from '~/src/types';

const factory = new HunterFactory(new HunterStorage(), new HunterStorage());
export default function useHuntersManager(data: YoutubeLiveApi.GETresponse, youtubeDataApi: boolean) {
    const [hunters, setHunters] = useState({
        host: data.host,
        ...factory.toJson()
    });
    const [next_page_token, setNextPageToken] = useState<string|null>(null);
    const [next_chat_token, setNextChatToken] = useState<string|null>(null);
    const [interval_time, setIntervalTime] = useState<number>(20000);

    useEffect(()=>{
        if (hunters.host.id) {
            const interval = setInterval(()=>{
                if (hunters.host.id) watcher();
            }, interval_time);
            return () => clearInterval(interval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[hunters]);

    async function watcher() {
        try {
            if (youtubeDataApi) {
                const res = await axios.post('/api/youtube-live', {
                    chat_id: data.chat_id,
                    page_token: next_page_token
                });
                const response = res.data as YoutubeLiveApi.POSTresponse;
                console.log(response);

                if (response.query && response.query.length) {
                    response.query.forEach(query => {
                        setHunters({
                            ...hunters,
                            ...factory.queryParser(query)
                        })
                    })
                    setIntervalTime(20000);
                } else {
                    setIntervalTime(interval_time < 20000 ? interval_time*1.1 : 30000);
                }
                setNextPageToken(response.page_token);
            } else {
                const res = await axios.get(`/api/live-chat?live_id=${data.live_id}&chat_token=${next_chat_token}`);
                const response = res.data as LiveChatApi.GETresponse;
                console.log(response);

                if (response.query && response.query.length) {
                    response.query.forEach(query => {
                        setHunters({
                            ...hunters,
                            ...factory.queryParser(query)
                        })
                    })
                    setIntervalTime(20000);
                } else {
                    setIntervalTime(interval_time < 20000 ? interval_time*1.1 : 30000);
                }
                setNextChatToken(response.chat_token);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function questDoneHandler() {
        setHunters({
            host: hunters.host,
            ...factory.doneQuest()
        });
        console.log(hunters);
    }

    function updateQuestHandler(hunter_id: string, quest: number) {
        setHunters({
            host: hunters.host,
            ...factory.updateHunterQuest(hunter_id, quest)
        });
    }

    function deleteHunterHandler(hunter_id: string) {
        setHunters({
            host: hunters.host,
            ...factory.leaveHunter(hunter_id)
        });
    }

    return {
        hunters,
        questDoneHandler,
        updateQuestHandler,
        deleteHunterHandler
    };
}