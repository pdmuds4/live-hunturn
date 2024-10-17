import { Button, ButtonProps } from "@chakra-ui/react";
import { useRef } from "react";

type Props = ButtonProps & {
    children: React.ReactNode
}

export default function OriginalButton(props: Props) {
    const audioRef = useRef<HTMLAudioElement>(null);

    return (
        <>
            <Button 
                colorScheme='blackAlpha'
                {...props}
                onClick={()=>audioRef.current?.play()}
            >
                {props.children}
            </Button>
            <audio ref={audioRef} src="/audio/btnclick.mp3">
                <track kind="captions" />
            </audio>
        </>
    )
}