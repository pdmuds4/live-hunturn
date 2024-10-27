import HunterEntity, { HunterInfo } from "./entity";

export default class HunterRepository {
    Joined:    HunterEntity[]
    StandBy:   HunterEntity[]
    JustLeave: HunterEntity[]

    constructor() {
        this.Joined = []
        this.StandBy = []
        this.JustLeave = []
    }

    joinHunter(hunter: Omit<HunterInfo, 'status'|'quest'>) {
        if (this.isDuplicate(hunter.id)) return this.toJson();
        const justleave_hunter = this.JustLeave.find(h => h.id === hunter.id)

        const entity = justleave_hunter ? 
            new HunterEntity({
                id: justleave_hunter.id,
                avator: justleave_hunter.avator,
                name: justleave_hunter.name,
                status: justleave_hunter.status,
                quest: 0
            })
            : new HunterEntity({
                id: hunter.id,
                avator: hunter.avator,
                name: hunter.name,
                status: 'join-us',
                quest: 0
            })

        if (this.Joined.length === 3 || entity.status === 'just-leave') {
            this.StandBy = [...this.StandBy, entity.changeStatus('stand-by')]
        } else {
            this.Joined = [...this.Joined, entity.changeStatus('join-us')]
        }
        return this.toJson()
    }

    leaveHunter(id: string | string[]) {
        const hunter = this.Joined.find(h => h.id === id) || this.StandBy.find(h => h.id === id)
        if (hunter) {
            this.Joined = this.Joined.filter(h => h.id !== id)
            this.StandBy = this.StandBy.filter(h => h.id !== id)

            if (hunter.status === 'join-us') {
                this.JustLeave = [...this.JustLeave, hunter.changeStatus('just-leave')]
            }
        }
        return this.toJson()
    }

    manyLeaveHunter(names: string[]) {
        this.Joined = this.Joined.filter(h => !names.includes(h.name));
        this.StandBy = this.StandBy.filter(h => !names.includes(h.name));
        return this.toJson()
    }

    doneQuest() {
        this.Joined = this.Joined.map(h => h.doneQuest())
        this.StandBy = this.StandBy.map(h => h.doneQuest())
        this.JustLeave = this.JustLeave.filter(h => h.quest === 0)

        const must_leave_hunter = this.Joined.find(h => h.mustLeave())
        const must_join_hunter = this.StandBy.find(h => h.mustJoin())

        if (must_leave_hunter) this.leaveHunter(must_leave_hunter.id)
        if (must_join_hunter) this.joinHunter(must_join_hunter)

        return this.toJson();
    }


    isDuplicate(id: string): boolean {
        return  this.Joined.some(h => h.id === id) ||
                this.StandBy.some(h => h.id === id)
    }

    toJson() {
        return {
            Joined:    this.Joined.map(h => h.toJson()),
            StandBy:   this.StandBy.map(h => h.toJson()),
            JustLeave: this.JustLeave.map(h => h.toJson())
        }
    }
}