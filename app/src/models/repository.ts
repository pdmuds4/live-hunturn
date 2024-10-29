import HunterEntity from "~/src/models/entity";
import { HunterInfo } from "~/src/types";

export default class HunterRepository {
    Joined:    HunterEntity[]
    StandBy:   HunterEntity[]

    constructor() {
        this.Joined = []
        this.StandBy = []
    }

    joinHunter(hunter: Omit<HunterInfo,'status'|'quest'>) {
        if (this.Joined.some(h => h.id === hunter.id)||this.StandBy.some(h => h.id === hunter.id)) return this.toJson()
        const must_change_joiner = this.Joined.find(h => h.mustChange())

        if (this.Joined.length < 3) {
            const entity = new HunterEntity({
                ...hunter,
                status: 'join-us',
                quest: 0
            })

            this.Joined = [...this.Joined, entity]
        } else if (must_change_joiner) {
            const entity = new HunterEntity({
                ...hunter,
                status: 'stand-by',
                quest: 0
            })
            this.StandBy = [...this.StandBy, entity]
            this.changeHunter(must_change_joiner, entity)
        } else {
            const entity = new HunterEntity({
                ...hunter,
                status: 'stand-by',
                quest: 0
            })

            this.StandBy = [...this.StandBy, entity]
        }

        return this.toJson()
    }

    leaveHunter(id: string) {
        this.StandBy = this.StandBy.filter(h => h.id !== id)
        const joined_hunter = this.Joined.find(h => h.id === id)
        const standby_hunter = this.StandBy[0]

        this.Joined = this.Joined.filter(h => h.id !== id)
        if (joined_hunter && standby_hunter) {
            if (standby_hunter.mustChange()) {
                this.changeHunter(joined_hunter, standby_hunter)
            } else if (this.Joined.length <= 3) {
                this.Joined = [...this.Joined, standby_hunter.changeStatus('join-us')]
                this.StandBy = this.StandBy.filter(h => h.id !== standby_hunter.id)
            }
        }

        return this.toJson()
    }

    changeHunter(leaveHunter: HunterEntity, joinHunter: HunterEntity) {
        const leave_hunter = this.Joined.find(h => h.id === leaveHunter.id)
        const join_hunter = this.StandBy.find(h => h.id === joinHunter.id)

        if (leave_hunter && join_hunter) {
            this.Joined = [...this.Joined.filter(h => h.id !== leaveHunter.id), join_hunter.changeStatus('join-us')]
            this.StandBy = this.StandBy.filter(h => h.id !== joinHunter.id)
        }
        return this.toJson()
    }

    // manyLeaveHunter(names: string[]) {
        
    // }

    doneQuest() {
        this.Joined = this.Joined.map(h => h.doneQuest());
        this.StandBy = this.StandBy.map(h => h.doneQuest());

        const join_change = this.Joined.filter(h => h.mustChange());
        if (join_change.length) {
            join_change.forEach(j => {
                const standby_change = this.StandBy.find(s => s.mustChange());
                if (standby_change) this.changeHunter(j, standby_change)
            })
        }

        return this.toJson()
    }


    toJson() {
        return {
            Joined:    this.Joined.map(h => h.toJson()),
            StandBy:   this.StandBy.map(h => h.toJson()),
        }
    }
}