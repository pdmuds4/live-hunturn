import { useEffect } from "react"
import { useNavigate } from "@remix-run/react"
import axios from "axios"

type Props = {
    children: React.ReactNode
}

export default function Auth(props: Props) {
    const navigate = useNavigate()
    useEffect(() => {
        axios.get(
            '/api/google-oauth',
        ).then(
            (res) => {
                if (!res.data.access_token) navigate('/login')
            }
        ).catch(
            () => navigate('/login')
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } ,[])

    return (
        <>
            {props.children}
        </>
    )
}