import { useNavigate } from "@remix-run/react";

import { Text, Image } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";
import { ViewHomeLayout, UiButton } from "~/src/components";

import axios from "axios";

export default function Login() {
    const navigate = useNavigate();
    const loginHandler = useGoogleLogin({
        onSuccess: tokenResponse => {
            axios.post('/api/google-oauth', tokenResponse)
            .then(() => navigate('/'))
            .catch(err => alert(err.response.data.replace('Unexpected Server Error\n\n', '')))
        },
        onError: error => console.log(error),
    })

    return (
        <ViewHomeLayout>
            <Image
                className="w-4/12"
                src='/img/logo.svg' 
                alt='Live Hunturn Logo'
                minW={100}
            />
            <Text fontSize='min(12vw, 32px)' as='ins'>Live Hunturn</Text>
            <UiButton 
                leftIcon={
                    <Image 
                        src='https://cdn.icon-icons.com/icons2/2429/PNG/512/google_logo_icon_147282.png' 
                        alt='Google Logo' 
                        boxSize={6} 
                    />
                }
                onClick={()=>loginHandler()}
            >
                Login for Google
            </UiButton>
        </ViewHomeLayout>
    );
}