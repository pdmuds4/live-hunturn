import { Text, Image } from "@chakra-ui/react";
import { HomeLayout } from "~/src/components";
import OriginalButton from "~/src/components/originalButton";

export default function Login() {
    return (
        <HomeLayout>
            <Image
                className="w-4/12"
                src='/img/logo.svg' 
                alt='Live Hunturn Logo'
                minW={100}
            />
            <Text fontSize='min(12vw, 32px)' as='ins'>Live Hunturn</Text>
            <OriginalButton 
                leftIcon={
                    <Image 
                        src='https://cdn.icon-icons.com/icons2/2429/PNG/512/google_logo_icon_147282.png' 
                        alt='Google Logo' 
                        boxSize={6} 
                    />
                }
            >
                Login for Google
            </OriginalButton>
        </HomeLayout>
    );
}