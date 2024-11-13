import { useState } from "react";
import { Flex, Icon, Image, Stack, Text, Input } from "@chakra-ui/react"
import { RiLiveFill } from "react-icons/ri";
import { HunterInfo } from "~/src/types";

type Props = HunterInfo & { 
    status: 'join-us'|'stand-by'
    is_owner: boolean
    updateQuestHandler?: (id: string, quest: number) => void
    deleteHunterHandler?: (id: string) => void
};

export default function HunterRow(props: Props) {
    const [toggle_input, setToggleInput] = useState(false);

    const updateQuestHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (props.updateQuestHandler) props.updateQuestHandler(props.id, Number(e.currentTarget.value));
            setToggleInput(!toggle_input);
        }
    }

    const deleteHunterHandler = () => {
        if (props.deleteHunterHandler) props.deleteHunterHandler(props.id);
    }

    return (
        <Flex className="p-1 text-white" alignItems='center' gap={1}>
            <Image 
                src={props.avator}
                borderRadius='full'
                alt='Hunter Avator' 
                w={5}
                h={5}
                onDoubleClick={deleteHunterHandler}
            />
            <Text className="min-w-12 w-1/2 whitespace-nowrap text-ellipsis overflow-hidden" fontSize='12px'>{props.name}</Text>
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
                    <Text 
                        className="cursor-pointer"
                        color={props.quest >= 2 ? '#5ff773' : 'white'}
                        onDoubleClick={()=>setToggleInput(!toggle_input)}
                        hidden={toggle_input}
                    >
                        {props.quest}
                    </Text>
                    <Input
                        type="number"
                        onKeyUp={updateQuestHandler}
                        className="border-2 bg-slate-950/95"
                        color="whiteAlpha.900"
                        w={20}
                        h={8}
                        hidden={!toggle_input}
                    />
                    <Text color={props.quest >= 2 ? '#5ff773' : 'white'} fontSize='10px'>クエ</Text> 
                </>           
            ) : (
                <>  
                    <Text color='#f7d95f' fontSize='10px'>あと</Text> 
                    <Text
                        className="cursor-pointer"
                        color='#f6d346'
                        onDoubleClick={()=>setToggleInput(!toggle_input)}
                        hidden={toggle_input}
                    >
                        {props.quest}
                    </Text>
                    <Input
                        type="number"
                        onKeyUp={updateQuestHandler}
                        className="border-2 bg-slate-700/95"
                        color="whiteAlpha.900"
                        w={20}
                        h={8}
                        hidden={!toggle_input}
                    />
                    <Text color='#f7d95f' fontSize='10px'>クエ</Text> 
                </>
            )
            }
            </Stack>
        </Flex>
    )
}