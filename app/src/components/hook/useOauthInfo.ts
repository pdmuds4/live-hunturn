import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";

import { GoogleOauthDTO } from "~/src/types";


export default function useOauthInfo() {
    const navigate = useNavigate();
    const [authInfo, setAuthInfo] = useState<GoogleOauthDTO>();

    useEffect(() => {
        const auth_info_str = localStorage.getItem('auth_info');
        if (auth_info_str) {
            const auth_info = JSON.parse(auth_info_str) as GoogleOauthDTO;
            setAuthInfo(auth_info);
        } else navigate('/login')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return authInfo;
}