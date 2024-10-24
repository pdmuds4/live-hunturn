import { useEffect, useState } from "react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Card, Flex } from "@chakra-ui/react";
import { ViewHunterRow, ProviderAuth } from "~/src/components";

import axios from "axios";
import { YoutubeLiveApi } from "~/src/types";

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
    
    const [next_page_token, setNextPageToken] = useState<YoutubeLiveApi.POSTresponse['page_token']>(null);

    useEffect(()=>{
        axios.get('/api/google-user')
        .then((res) => {
            console.log(res.data);
        })
        .catch(err => {
            alert(err.response.data.replace('Unexpected Server Error\n\n', ''));
        });

        const fetchData = () => {
            axios.post('/api/youtube-live', {
                chat_id: data.chat_id,
                page_token: next_page_token
            })
            .then(res => {
                console.log(res.data);
                setNextPageToken(res.data.page_token);
                
            })
            .catch(err => 
                alert(err.response.data.replace('Unexpected Server Error\n\n', ''))
            );
        }

        fetchData();
        const intervalId = setInterval(fetchData, 3000);
        return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    return (
        <ProviderAuth>
            <Flex className="w-screen h-screen justify-center">
                <Card className="relative w-full bg-slate-700/95" maxW='500px' minW="200px">
                    <Card className="w-full border-yellow-700 border-4 border-double bg-slate-950/95 text-white" h={132}>
                        <Flex direction='column'>
                            <ViewHunterRow {...resouce} status="join-us" is_owner/>
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