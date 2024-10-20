import { Flex, Icon, Image, Stack, Text } from "@chakra-ui/react"
import { RiLiveFill } from "react-icons/ri";

type Props = {
    hunter: {
        avator: string,
        name: string,
    },
    status: 'join-us' | 'stand-by' | 'just-leave',
    quest: number,
    is_owner: boolean,
}

export default function HunterRow(props: Props) {
    return (
        <Flex className="p-1 text-white" alignItems='center' gap={1}>
            <Image 
                src={props.hunter.avator}
                borderRadius='full'
                alt='Hunter Avator' 
                w={5}
                h={5}
            />
            <Text fontSize='12px'>{props.hunter.name}</Text>
            <Stack className="ml-auto" direction='row' alignItems='end' gap={1}>
            {
                props.is_owner ? 
            (
                <>
                    <Icon as={RiLiveFill} color='#f75f5f' />
                    <Text fontSize='10px' color='#f75f5f'>Liver</Text> 
                </>
            )
                : props.status === 'join-us' ?
            (
                <>
                    <Text color={props.quest >= 2 ? '#5ff773' : 'white'}>{props.quest}</Text>
                    <Text color={props.quest >= 2 ? '#5ff773' : 'white'} fontSize='10px'>Quest</Text> 
                </>           
            ) : (
                <>
                    <Text color='#f6d346'>あと{props.quest}</Text>
                    <Text color='#f7d95f' fontSize='10px'>Quest</Text> 
                </>
            )
            }
            </Stack>
        </Flex>
    )
}