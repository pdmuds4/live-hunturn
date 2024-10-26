import { useEffect, useState } from "react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Card, Flex } from "@chakra-ui/react";
import { ViewHunterRow, ProviderAuth } from "~/src/components";

import axios from "axios";
import { GoogleUserApi, YoutubeLiveApi } from "~/src/types";

import ArrayController from "~/src/utils/arrayController";

export const loader = ({ request }: LoaderFunctionArgs) => {
    const chat_id = new URL(request.url).searchParams.get('host');
    return json({ chat_id });
}

type HunterInfo = {
    avator: string,
    name: string
    status:   'join-us' | 'stand-by' | 'just-leave',
    quest:    number,
} 

export default function Live() {
    const data = useLoaderData<{ chat_id: string}>();
    // const [chats, setChats] = useState<YoutubeLiveApi.POSTresponse['latest_chat'][]>([]);
    const [hunters, setHunters] = useState<{
        host: HunterInfo,
        joiners: HunterInfo[]
        standbys: HunterInfo[]
        justleaves: HunterInfo[]
    }>({
        host: {} as HunterInfo,
        joiners: [],
        standbys: [],
        justleaves: [],
    });
    const [next_page_token, setNextPageToken] = useState<YoutubeLiveApi.POSTresponse['page_token']>(null);


    useEffect(()=>{
        axios.get('/api/google-user')
        .then((res) => {
            const response = res.data as GoogleUserApi.GETresponse;
            setHunters({...hunters, host: {
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
                    if (!response.user_info) break;

                    // justleavesにいたとき
                    if (hunters.justleaves.some(justleave => justleave.name === response.user_info?.name)) {
                        setHunters({
                            ...hunters,
                            standbys: ArrayController.insert(
                                hunters.standbys,
                                {
                                    avator: response.user_info.avator,
                                    name: response.user_info.name,
                                    status: 'stand-by',
                                    quest: 2
                                }
                            ),
                            justleaves: ArrayController.remove(
                                hunters.justleaves,
                                hunters.justleaves.find(justleave => justleave.name === response.user_info?.name) as HunterInfo
                            )
                        });
                    }

                    // 満員だったとき
                    if (hunters.joiners.length === 3) {
                        // 2クエスト以上の人がjoinersにいたら交代
                        if (hunters.joiners.some(joiner => joiner.quest > 2)) {
                            setHunters({
                                ...hunters, 
                                joiners: ArrayController.replace(
                                    hunters.joiners, 
                                    hunters.joiners.find(joiner => joiner.quest > 2) as HunterInfo,
                                    {
                                        avator: response.user_info.avator,
                                        name: response.user_info.name,
                                        status: 'join-us',
                                        quest: 0
                                    }
                                ),
                                justleaves: ArrayController.insert(
                                    hunters.justleaves,
                                    {
                                        avator: response.user_info.avator,
                                        name: response.user_info.name,
                                        status: 'stand-by',
                                        quest: 2
                                    }
                                ),
                            });

                        // いなかったらstandbysに追加
                        } else {
                            setHunters({
                                ...hunters,
                                standbys: ArrayController.insert(
                                    hunters.standbys,
                                    {
                                        avator: response.user_info.avator,
                                        name: response.user_info.name,
                                        status: 'stand-by',
                                        quest: 2
                                    }
                                )
                            });
                        }
                
                    // joinersに空きがあるとき
                    } else {
                        setHunters({
                            ...hunters, 
                            joiners: ArrayController.insert(
                                hunters.joiners,
                                {
                                    avator: response.user_info.avator,
                                    name: response.user_info.name,
                                    status: 'join-us',
                                    quest: 0
                                }
                            )
                        });
                    }
                    break;
                }

                case ('leave'): {
                    // 1名指定
                    if (response.user_info) {
                        setHunters({
                            ...hunters,
                            joiners: ArrayController.remove(
                                hunters.joiners,
                                hunters.joiners.find(joiner => joiner.name === response.user_info?.name) as HunterInfo
                            ),
                            justleaves: ArrayController.insert(
                                hunters.justleaves,
                                {
                                    avator: response.user_info.avator,
                                    name: response.user_info.name,
                                    status: 'just-leave',
                                    quest: 2
                                }
                            )
                        })

                    // 複数指定
                    } else if (response.user_names) {
                        setHunters({
                            ...hunters,
                            joiners: hunters.joiners.filter(joiner => !response.user_names?.includes(joiner.name)),
                            standbys: hunters.standbys.filter(standby => !response.user_names?.includes(standby.name))
                        })
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
                            { hunters.joiners.map((joiner, index) => joiner && joiner.status == 'join-us' ? (
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
                        { hunters.standbys.map((standby, index) => standby && standby.status == 'stand-by' ? (
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