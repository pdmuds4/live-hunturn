import axios from "axios";
import { useEffect, useState } from "react";
import { Text, Box, Image, Stack, Icon } from "@chakra-ui/react";
import { MdOutlineLiveTv } from "react-icons/md";

import { ViewHomeLayout, UiButton, ProviderAuth } from "~/src/components";
import { GoogleUserApi } from "~/src/types";


export default function Index() {
    const [userInfo, setUserInfo] = useState<GoogleUserApi.GETresponse|null>(null);

    useEffect(() => {
        axios.get('/api/google-user')
        .then((res) => {
            setUserInfo(res.data);
        })
        .catch((err) => {
            console.error(err);
        });
    }, []);

    return (
        <ProviderAuth>
            <ViewHomeLayout>
                <Text fontSize='min(12vw, 32px)'>
                    Go Live !
                </Text>
                <Box className="text-center">
                    <Image 
                        className="shadow-md cursor-pointer hover:opacity-80"
                        src={userInfo?.picture}
                        alt="youtube account avatar"
                        maxW={100}
                        borderRadius='full'
                    />
                    <Text fontSize='min(8vw, 32px)'>
                        {userInfo?.name}
                    </Text>
                </Box>
                <Stack>
                    <UiButton
                        leftIcon={<Icon as={MdOutlineLiveTv} />}
                    >
                        配信に接続する
                    </UiButton>
                </Stack>
            </ViewHomeLayout>
        </ProviderAuth>
    );
}
