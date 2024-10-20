import { Text, Box, Image, Stack, Icon } from "@chakra-ui/react";
import { MdOutlineLiveTv } from "react-icons/md";

import { ProviderAuthInfo, ViewHomeLayout, UiButton } from "~/src/components";

export default function Index() {
    return (
        <ProviderAuthInfo>
            <ViewHomeLayout>
                <Text fontSize='min(12vw, 32px)'>
                    Go Live !
                </Text>
                <Box className="text-center">
                    <Image 
                        className="shadow-md"
                        src='https://yt3.googleusercontent.com/ytc/AIdro_k-adfLoZx59Y62rNV58cop7fhtr4RK8K5YBORgORjDBVQ=s160-c-k-c0x00ffffff-no-rj'
                        alt="youtube account avatar"
                        maxW={100}
                        borderRadius='full'
                    />
                    <Text fontSize='min(8vw, 32px)'>
                        PAM
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
        </ProviderAuthInfo>
    );
}
