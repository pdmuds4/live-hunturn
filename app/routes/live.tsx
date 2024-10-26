import { useEffect, useState } from "react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Card, Flex } from "@chakra-ui/react";
import { ViewHunterRow, ProviderAuth } from "~/src/components";

import axios from "axios";
import { GoogleUserApi, YoutubeLiveApi } from "~/src/types";

import OriginalButton from "~/src/components/uiButton";

import { HunterInfo, HunterRepository } from "~/src/models";

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
    const [next_page_token, setNextPageToken] = useState<YoutubeLiveApi.POSTresponse['page_token']>(null);


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

        chatWatcher();
        // const intervalId = setInterval(chatWatcher, 2000);
        // return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    const chatWatcher = () => {
        axios.post('/api/youtube-live', {
            chat_id: data.chat_id,
            page_token: next_page_token
        })
        .then(res => {
            const response = res.data as YoutubeLiveApi.POSTresponse;

            switch (response.request) {
                case ('join'): {
                    if (response.user_info) {
                        setHunters({
                            ...hunters,
                            ...hunterRepository.joinHunter({
                                id: response.user_info.id,
                                avator: response.user_info.avator,
                                name: response.user_info.name,
                            })
                        });
                    }
                    break;
                }

                case ('leave'): {
                    if (response.user_info) {
                        setHunters({
                            ...hunters,
                            ...hunterRepository.leaveHunter(response.user_info.id)
                        });
                    } else if (response.user_names) {
                        setHunters({
                            ...hunters,
                            ...hunterRepository.manyLeaveHunter(response.user_names)
                        });
                    }
                    break;
                }
                default: break;
            }

            setNextPageToken(res.data.page_token);
        })
        .catch(err => 
            console.error(err.response.data.replace('Unexpected Server Error\n\n', ''))
        );
    }

    const questDoneHandler = () => {
        setHunters({
            ...hunters,
            ...hunterRepository.doneQuest()
        });
    }


    return (
        <ProviderAuth>
            <Flex className="w-screen h-screen justify-center">
                <Card className="relative w-full bg-slate-700/95" maxW='500px' minW="200px">
                    <Card className="w-full border-yellow-700 border-4 border-double bg-slate-950/95 text-white" h={132}>
                        <Flex direction='column'>
                            <ViewHunterRow 
                                hunter={{
                                    avator: hunters.host.avator, 
                                    name: hunters.host.name
                                }} 
                                status={hunters.host.status}
                                quest={hunters.host.quest}
                                is_owner
                            />
                            { hunters.Joined.map((joiner, index) => joiner.status == 'join-us' ? (
                                <ViewHunterRow 
                                    key={index}
                                    hunter={{
                                        avator: joiner.avator, 
                                        name: joiner.name
                                    }} 
                                    status={joiner.status} 
                                    quest={joiner.quest}
                                    is_owner={false}
                                />
                            ): <></>)}
                        </Flex>
                    </Card>
                    <Flex className="text-white p-1" direction='column'>
                        <OriginalButton onClick={questDoneHandler}>
                            クエスト終了
                        </OriginalButton>
                        { hunters.StandBy.map((standby, index) => standby.status == 'stand-by' ? (
                            <ViewHunterRow 
                                key={index}
                                hunter={{
                                    avator: standby.avator, 
                                    name: standby.name
                                }} 
                                status={standby.status}
                                quest={standby.quest}
                                is_owner={false}
                            />
                        ): <></>)}
                    </Flex>
                </Card>
            </Flex>
        </ProviderAuth>
    );
}