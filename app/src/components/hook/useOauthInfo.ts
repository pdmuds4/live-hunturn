import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";

import { GoogleOauthDTO } from "~/src/types";

import axios from "axios";

export default function useOauthInfo() {
    const navigate = useNavigate();
    const [authInfo, setAuthInfo] = useState<GoogleOauthDTO>();

    useEffect(() => {
        axios.get('/api/google-oauth')
            .then(res => {
                setAuthInfo(res.data);
            })
            .catch(() => navigate('/login'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return authInfo;
}