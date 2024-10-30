import axios from "axios";
import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Text, Box, Image, Stack, Icon, Input } from "@chakra-ui/react";
import { MdOutlineLiveTv } from "react-icons/md";

import { ViewHomeLayout, UiButton, ProviderAuth } from "~/src/components";
import { GoogleUserApi } from "~/src/types";

export default function Index() {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState<GoogleUserApi.GETresponse|null>(null);
    const [liveID, setLiveID] = useState<string>('');

    useEffect(() => {
        axios.get('/api/google-user')
        .then((res) => {
            setUserInfo(res.data);
        })
        .catch(err => {
            alert(err.response.data.replace('Unexpected Server Error\n\n', ''));
            navigate('/login');
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ProviderAuth>
            <ViewHomeLayout>
                <Text fontSize='min(12vw, 32px)'>
                    Go Live !
                </Text>
                <Box className="text-center">
                    <Image 
                        className="shadow-md"
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
        </ProviderAuth>
    );
}
