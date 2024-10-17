import { Text, Image, Button, Flex, Center } from "@chakra-ui/react";

export default function Login() {
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
                <Image
                    className="w-4/12"
                    src='/img/logo.svg' 
                    alt='Live Hunturn Logo'
                    minW={100}
                />
                <Text fontSize='min(12vw, 32px)' as='ins'>Live Hunturn</Text>
                <Button 
                    colorScheme='blackAlpha'
                    leftIcon={
                        <Image 
                            src='https://cdn.icon-icons.com/icons2/2429/PNG/512/google_logo_icon_147282.png' 
                            alt='Google Logo' 
                            boxSize={6} 
                        />
                    }
                >
                    Login for Google
                </Button>
            </Flex>
        </Center>
    );
}