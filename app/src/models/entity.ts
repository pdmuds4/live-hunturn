import { HunterInfo } from "~/src/types"

export default class HunterEntity {
    readonly id: string
    avator: string
    name:   string
    quest:  number

    constructor(hunterInfo: HunterInfo) {
        this.id = hunterInfo.id
        this.avator = hunterInfo.avator
        this.name = hunterInfo.name
        this.quest = hunterInfo.quest
    }

    resetQuest() {
        return new HunterEntity({
            id: this.id,
            avator: this.avator,
            name: this.name,
            quest: 0
        })
    }

    doneQuest() {
        return new HunterEntity({
            id: this.id,
            avator: this.avator,
            name: this.name,
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
            quest: this.quest
        }
    }
}