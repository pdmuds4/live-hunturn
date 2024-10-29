import { useEffect, useState, useRef} from "react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Card, Flex } from "@chakra-ui/react";
import { ViewHunterRow, ProviderAuth, UiButton } from "~/src/components";

import axios from "axios";
import { GoogleUserApi, YoutubeLiveApi, type HunterInfo } from "~/src/types";
import { HunterRepository } from "~/src/models";

const hunterRepository = new HunterRepository();

export const loader = ({ request }: LoaderFunctionArgs) => {
    const chat_id = new URL(request.url).searchParams.get('host');
    return json({ chat_id });
}

export default function Live() {
    const data = useLoaderData<{ chat_id: string}>();
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [hunters, setHunters] = useState({
        host: {} as HunterInfo,
        ...hunterRepository.toJson()
    });
    const [next_page_token, setNextPageToken] = useState<string|null>(null);
    const [interval_time, setIntervalTime] = useState<number>(10000);

    const joinAudio = useRef<HTMLAudioElement>(null);
    const leaveAudio = useRef<HTMLAudioElement>(null);


    useEffect(()=>{
        axios.get('/api/google-user')
        .then((res) => {
            const response = res.data as GoogleUserApi.GETresponse;
            setHunters({...hunters, host: {
                id: response.id,
                avator: response.picture,
                name: response.name,
                status: 'join-us',
                quest: 0
            }});
        })
        .catch(err => {
            console.error(err.response.data.replace('Unexpected Server Error\n\n', ''));
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
        if (hunters.host.id) {
            const interval = setInterval(()=>{
                if (hunters.host.id) chatWatcher();
            }, interval_time);
            return () => clearInterval(interval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[hunters]);


    const chatWatcher = async () => {
        try {
            const res = await axios.post('/api/youtube-live', {
                chat_id: data.chat_id,
                page_token: next_page_token
            });

            const response = res.data as YoutubeLiveApi.POSTresponse;
            console.log(response);

            if (response.query && response.query.length) {
                response.query.forEach((query) => {
                    switch (query.request) {
                        case ('join'): {
                            if (query.user_info) {
                                setHunters({
                                    host: hunters.host,
                                    ...hunterRepository.joinHunter({
                                        id: query.user_info.id,
                                        avator: query.user_info.avator,
                                        name: query.user_info.name,
                                    })
                                });
                            }
                            break;
                        }

                        case ('leave'): {
                            if (query.user_info) {
                                setHunters({
                                    host: hunters.host,
                                    ...hunterRepository.leaveHunter(query.user_info.id)
                                });
                            } else if (query.user_names) {
                                setHunters({
                                    host: hunters.host,
                                    ...hunterRepository.toJson()
                                });
                            }
                            break;
                        }
                        default: break;
                    }
                });

                setIntervalTime(10000);
            } else {
                setIntervalTime(interval_time*1.1);
            }

            setNextPageToken(response.page_token);
        } catch (err) {
            console.error(err)
        }
    }

    const questDoneHandler = () => {
        setHunters({
            host: hunters.host,
            ...hunterRepository.doneQuest()
        });
        console.log(hunters);
    }


    return (
        <ProviderAuth>
            <Flex className="w-screen h-screen justify-center">
                <Card className="relative w-full bg-slate-700/95" maxW='500px' minW="200px">
                    <Card className="w-full border-yellow-700 border-4 border-double bg-slate-950/95 text-white" h={132}>
                        <Flex direction='column'>
                            <ViewHunterRow 
                                {...hunters.host}
                                is_owner
                            />
                            { hunters.Joined.map((joiner, index) => joiner.status == 'join-us' ? (
                                <ViewHunterRow 
                                    key={index}
                                    {...joiner}
                                    is_owner={false}
                                />
                            ): <></>)}
                        </Flex>
                    </Card>
                    <Flex className="text-white p-1 h-full" direction='column'>
                        <UiButton onClick={questDoneHandler}>
                            クエスト終了
                        </UiButton>
                        { hunters.StandBy.map((standby, index) => standby.status == 'stand-by' ? (
                            <ViewHunterRow 
                                key={index}
                                {...standby}
                                is_owner={false}
                            />
                        ): <></>)}
                    </Flex>
                </Card>
                <audio ref={joinAudio}>
                    <track kind="captions" src="/audio/join.mp3" />
                </audio>
                <audio ref={leaveAudio}>
                    <track kind="captions" src="/audio/leave.mp3" />
                </audio>
            </Flex>
        </ProviderAuth>
    );
}