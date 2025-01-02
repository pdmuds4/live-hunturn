import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { Text, Image, Stack, Icon, Input } from "@chakra-ui/react";
import { MdOutlineLiveTv } from "react-icons/md";

import { ViewHomeLayout, UiButton } from "~/src/components";

export default function Index() {
    const navigate = useNavigate();

    const [liveID, setLiveID] = useState<string>('');
    return (
        <>
            <ViewHomeLayout>
                <Image
                    className="w-4/12"
                    src='/img/logo.svg' 
                    alt='Live Hunturn Logo'
                    minW={100}
                />
                <Text fontSize='min(12vw, 32px)' as='ins'>Live Hunturn</Text>
                <Stack>
                    <Input 
                        placeholder="配信IDを入力"
                        value={liveID}
                        onChange={(e) => setLiveID(e.target.value)}
                        className="border-2"
                        focusBorderColor="blackAlpha.600"
                        bgColor="white"
                        color="red.400"
                        colorScheme="blackAlpha"
                    />
                    <UiButton
                        leftIcon={<Icon as={MdOutlineLiveTv} />}
                        disabled={!liveID.length}
                        onClick={()=>navigate(`/live?v=${liveID}`)}
                    >
                        配信に接続する
                    </UiButton>
                </Stack>
            </ViewHomeLayout>
        </>
    );
}
