import { HunterInfo } from "~/src/types"

export default class HunterEntity {
    readonly id: string
    avator: string
    name:   string
    status: 'join-us' | 'stand-by'
    quest:  number

    constructor(hunterInfo: HunterInfo) {
        this.id = hunterInfo.id
        this.avator = hunterInfo.avator
        this.name = hunterInfo.name
        this.status = hunterInfo.status
        this.quest = hunterInfo.quest
    }

    changeStatus(status: 'join-us' | 'stand-by') {
        return new HunterEntity({
            id: this.id,
            avator: this.avator,
            name: this.name,
            status: status,
            quest: 0
        })
    }

    doneQuest() {
        return new HunterEntity({
            id: this.id,
            avator: this.avator,
            name: this.name,
            status: this.status,
            quest: this.quest + 1
        })
    }

    mustChange() {
        return this.quest >= 2
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