export type HunterInfo = {
    id: string
    avator: string,
    name: string,
    status: 'join-us' | 'stand-by' | 'just-leave',
    quest: number,
}

export default class HunterEntity {
    readonly id: string
    avator: string
    name:   string
    status: 'join-us' | 'stand-by' | 'just-leave'
    quest:  number

    constructor(hunterInfo: HunterInfo) {
        this.id = hunterInfo.id
        this.avator = hunterInfo.avator
        this.name = hunterInfo.name
        this.status = hunterInfo.status
        this.quest = hunterInfo.quest
    }

    changeStatus(status: 'join-us' | 'stand-by' | 'just-leave') {
        return new HunterEntity({
            id: this.id,
            avator: this.avator,
            name: this.name,
            status: status,
            quest: status === 'stand-by' ? 2 : 0
        })
    }

    resetQuest() {
        return new HunterEntity({
            id: this.id,
            avator: this.avator,
            name: this.name,
            status: this.status,
            quest: 0
        })
    }

    doneQuest() {
        if (this.status === 'join-us' || this.status === 'just-leave') {
            return new HunterEntity({
                id: this.id,
                avator: this.avator,
                name: this.name,
                status: this.status,
                quest: this.quest + 1
            })
        } else {
            return new HunterEntity({
                id: this.id,
                avator: this.avator,
                name: this.name,
                status: this.status,
                quest: this.quest == 0 ? this.quest : this.quest - 1
            })
        }
    }

    mustLeave() {
        return this.status === 'join-us' && this.quest >= 2
    }

    mustJoin() {
        return this.status === 'stand-by' && this.quest <= 0
    }

    toJson(): HunterInfo {
        return {
            id: this.id,
            avator: this.avator,
            name: this.name,
            status: this.status,
            quest: this.quest
        }
    }
}