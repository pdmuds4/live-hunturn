export default {
    // 参加希望
    "join" : ()=> ({ request: 'join' }),

    // 退席
    "leave" : (args?: string[]) => ({ request: 'leave', users : args }),
}

export type commandReturn = {
    request: string,
    users?: string[]
}