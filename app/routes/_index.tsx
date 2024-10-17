import { Text, Box, Image, Stack, Icon } from "@chakra-ui/react";
import { MdOutlineLiveTv } from "react-icons/md";

import { HomeLayout } from "~/src/components";
import OriginalButton from "~/src/components/originalButton";

export default function Index() {
    return (
        <HomeLayout>
            <Text fontSize='min(12vw, 32px)'>
                Go Live !
            </Text>
            <Box className="text-center">
                <Image 
                    className="shadow-md"
                    src='https://yt3.googleusercontent.com/ytc/AIdro_k-adfLoZx59Y62rNV58cop7fhtr4RK8K5YBORgORjDBVQ=s160-c-k-c0x00ffffff-no-rj'
                    alt="youtube account avatar"
                    minW={100}
                    borderRadius='full'
                />
                <Text fontSize='min(8vw, 32px)'>
                    PAM
                </Text>
            </Box>
            <Stack>
                <OriginalButton
                    leftIcon={<Icon as={MdOutlineLiveTv} />}
                >
                    配信に接続する
                </OriginalButton>
            </Stack>
        </HomeLayout>
    );
}
