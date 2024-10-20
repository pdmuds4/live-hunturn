/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "@remix-run/react"
import { useEffect, useState, createContext } from "react"

import { GoogleOauthDTO } from "~/src/types";

type Props = {
    children: React.ReactNode
}

export const authContext = createContext({} as GoogleOauthDTO | null);

export default function AuthInfo (props: Props) {
    const navigate = useNavigate();
    const [auth_context, setAuthContext] = useState<GoogleOauthDTO | null>(null);

    useEffect(()=>{
        const auth_info_str = localStorage.getItem('auth_info');
        if (auth_info_str) {
            const auth_info = JSON.parse(auth_info_str) as GoogleOauthDTO;
            setAuthContext(auth_info);
        } else navigate('/login')
    }, [])

    return (
        <authContext.Provider value={auth_context}>
            {props.children}
        </authContext.Provider>
    )
}