import { useState, useEffect } from 'react';
import axios from 'axios';

import { HunterFactory } from '../models';
import { YoutubeLiveApi } from '~/src/types';

const factory = new HunterFactory();
export default function useHuntersManager(data: YoutubeLiveApi.GETresponse) {
    const [hunters, setHunters] = useState({
        host: data.host,
        ...factory.toJson()
    });
    const [next_page_token, setNextPageToken] = useState<string|null>(null);

    useEffect(()=>{
        if (hunters.host.id) {
            const interval = setInterval(()=>{
                if (hunters.host.id) watcher();
            }, 10000);
            return () => clearInterval(interval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[hunters]);

    async function watcher() {
        try {
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
            }
            setNextPageToken(response.page_token);
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

    return {
        hunters,
        questDoneHandler
    };
}