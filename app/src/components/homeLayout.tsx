import { Flex, Center } from "@chakra-ui/react";

export default function HomeLayout(props: { children: React.ReactNode }) {
    return (
        <Center className="text-white bg-gradient-to-br from-red-500 to-orange-400 place-content-center">
            <Flex 
                className="h-screen w-10/12"
                direction='column' 
                justifyContent='center'
                alignItems='center'
                maxW='400px'
                gap={4}
            >   
                {props.children}
            </Flex>
        </Center>
    );
}