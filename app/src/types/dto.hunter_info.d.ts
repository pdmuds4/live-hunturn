export type HunterInfo = {
    id: string
    avator: string,
    name: string,
    status: 'join-us' | 'stand-by' | 'just-leave',
    quest: number,
}