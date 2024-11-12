import { json, LoaderFunctionArgs } from "@remix-run/node";

import apiHandler from "~/src/utils/apiHandler";
import { useLoaderData } from "@remix-run/react";

import { Card, Flex } from "@chakra-ui/react";
import { ViewHunterRow, UiButton } from "~/src/components";

import axios from "axios";
import { YoutubeLiveApi } from "~/src/types";
import useHuntersManager from "~/src/hooks/useHuntersManager";

export const loader = (args: LoaderFunctionArgs) => apiHandler(
    args,
    async ({ request }) => {
        const live_id = new URL(request.url).searchParams.get('v');
        const response = await axios.get(`/api/youtube-live?live_id=${live_id}`);
        return json(response.data);
    }
)

export default function Live() {
    const data = useLoaderData<YoutubeLiveApi.GETresponse>();
    const { hunters, questDoneHandler, updateQuestHandler, deleteHunterHandler } = useHuntersManager(data, true);

    return (
        <Flex className="w-screen h-screen justify-center">
            <Card className="relative w-full bg-slate-700/95" maxW='500px' minW="200px">
                <Card className="w-full border-yellow-700 border-4 border-double bg-slate-950/95 text-white" h={132}>
                    <Flex direction='column'>
                        <ViewHunterRow 
                            {...hunters.host}
                            status="join-us"
                            quest={0}
                            is_owner
                        />
                        { hunters.Joined.map((joiner, index) => (
                            <ViewHunterRow 
                                key={index}
                                {...joiner}
                                status="join-us"
                                is_owner={false}
                                updateQuestHandler={updateQuestHandler}
                                deleteHunterHandler={deleteHunterHandler}
                            />
                        ))}
                    </Flex>
                </Card>
                <Flex className="text-white p-1 h-full" direction='column'>
                    <UiButton className="h-6 text-xs" onClick={questDoneHandler}>
                        待機中：{hunters.StandBy.length}人
                    </UiButton>
                    { hunters.StandBy.map((standby, index) =>  (
                        <ViewHunterRow 
                            key={index}
                            {...standby}
                            status="stand-by"
                            is_owner={false}
                            updateQuestHandler={updateQuestHandler}
                            deleteHunterHandler={deleteHunterHandler}
                        />
                    ))}
                </Flex>
            </Card>
        </Flex>
    );
}