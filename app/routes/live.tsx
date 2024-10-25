import { useEffect, useState } from "react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Card, Flex } from "@chakra-ui/react";
import { ViewHunterRow, ProviderAuth } from "~/src/components";

import axios from "axios";
import { GoogleUserApi, YoutubeLiveApi } from "~/src/types";

export const loader = ({ request }: LoaderFunctionArgs) => {
    const chat_id = new URL(request.url).searchParams.get('host');
    return json({ chat_id });
}

const resouce = {
    hunter: {
        avator: 'https://yt3.googleusercontent.com/ytc/AIdro_k-adfLoZx59Y62rNV58cop7fhtr4RK8K5YBORgORjDBVQ=s160-c-k-c0x00ffffff-no-rj',
        name: 'Hunter',
    },
    quest: 2,
    is_owner: false,
}

export default function Live() {
    const data = useLoaderData<{ chat_id: string}>();
    // const [chats, setChats] = useState<YoutubeLiveApi.POSTresponse['latest_chat'][]>([]);
    const [hunters, setHunters] = useState<{
        host: GoogleUserApi.GETresponse,
        joiners: YoutubeLiveApi.POSTresponse['user_info'][]
        standbys: YoutubeLiveApi.POSTresponse['user_info'][]
    }>({
        host: {} as GoogleUserApi.GETresponse,
        joiners: [],
        standbys: []
    });
    const [next_page_token, setNextPageToken] = useState<YoutubeLiveApi.POSTresponse['page_token']>(null);


    useEffect(()=>{
        axios.get('/api/google-user')
        .then((res) => {
            const response = res.data as GoogleUserApi.GETresponse;
            setHunters({...hunters, host: response});
        })
        .catch(err => {
            alert(err.response.data.replace('Unexpected Server Error\n\n', ''));
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
            console.log(res.data);
            // const response = res.data as YoutubeLiveApi.POSTresponse;
            // console.log(response);

            setNextPageToken(res.data.page_token);
        })
        .catch(err => 
            alert(err.response.data.replace('Unexpected Server Error\n\n', ''))
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
                                    avator: hunters.host.picture, 
                                    name: hunters.host.name
                                }} 
                                status="join-us" 
                                quest={0}
                                is_owner
                            />
                            <ViewHunterRow {...resouce} status="join-us" />
                            <ViewHunterRow {...resouce} status="join-us" />
                            <ViewHunterRow {...resouce} status="join-us" />
                        </Flex>
                    </Card>
                    <Flex className="text-white p-1" direction='column'>
                        
                    </Flex>
                </Card>
            </Flex>
        </ProviderAuth>
    );
}