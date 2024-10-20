import { Card, Flex } from "@chakra-ui/react";
import { ViewHunterRow, ProviderAuth } from "~/src/components";

const resouce = {
    hunter: {
        avator: 'https://yt3.googleusercontent.com/ytc/AIdro_k-adfLoZx59Y62rNV58cop7fhtr4RK8K5YBORgORjDBVQ=s160-c-k-c0x00ffffff-no-rj',
        name: 'Hunter',
    },
    quest: 2,
    is_owner: false,
}

export default function Live() {
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