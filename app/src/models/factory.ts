import HunterEntity from "~/src/models/entity";
import { HunterInfo } from "~/src/types";

type Query = {
    request: string,
    user_info: {
        id: string,
        avator: string,
        name: string,
        message: string,
        timestamp: Date,
    }
}

export default class HunterFactory {
    Joined:    HunterEntity[]
    StandBy:   HunterEntity[]

    constructor() {
        this.Joined = []
        this.StandBy = []
    }


    joinHunter(info: Omit<HunterInfo,'quest'>) {
        if (this.Joined.find(h=>h.id === info.id)||
            this.StandBy.find(h=>h.id === info.id)
        ) return this.toJson();

        if (this.Joined.length < 3) {
            const entity = new HunterEntity({
                ...info,
                quest: 0
            });
            this.Joined = [...this.Joined, entity];
        } else {
            const must_change_hunter = this.Joined.find(h=>h.mustChange());
            if (must_change_hunter) {
                const entity = new HunterEntity({
                    ...info,
                    quest: 0
                });
                this.changeHunter(must_change_hunter.id, entity);
            } else {
                const entity = new HunterEntity({
                    ...info,
                    quest: 0
                });
                this.StandBy = [...this.StandBy, entity];
            }
        }
        return this.toJson();
    }


    leaveHunter(id: string) {
        const is_standby = this.StandBy.find(h=>h.id === id);
        const is_joined = this.Joined.find(h=>h.id === id);

        if (is_standby) {
            this.StandBy = this.StandBy.filter(h=>h.id !== id);
        } else if (is_joined) {
            if (this.StandBy.length) {
                const standby_hunter = this.StandBy[0];
                this.changeHunter(id, standby_hunter);
            } else {
                this.Joined = this.Joined.filter(h=>h.id !== id);
            }
        }
        return this.toJson();
    }


    changeHunter(leaveId: string, joinHunter: HunterEntity) {
        this.Joined = this.Joined.map(h=>h.id === leaveId ? joinHunter : h);
        this.StandBy = this.StandBy.filter(h=>h.id !== joinHunter.id);
        return this.toJson();
    }


    doneQuest() {
        this.Joined = this.Joined.map(h=>h.doneQuest());
        this.StandBy = this.StandBy.map(h=>h.doneQuest());

        const must_change_hunter = this.Joined.filter(h=>h.mustChange());
        if (must_change_hunter.length) {
            must_change_hunter.forEach((hunter) => {
                if (this.StandBy.length) this.changeHunter(hunter.id, this.StandBy[0]);
            });
        }
        return this.toJson();
    }


    toJson() {
        return {
            Joined:    this.Joined.map(h => h.toJson()),
            StandBy:   this.StandBy.map(h => h.toJson()),
        }
    }




    queryParser(query: Query) {
        switch (query.request) {
            case ('join'): {
                return this.joinHunter({
                    id: query.user_info.id,
                    avator: query.user_info.avator,
                    name: query.user_info.name,
                })
            }
            case ('leave'): {
                return this.leaveHunter(query.user_info.id)
            }
            default: return this.toJson();
        }
    }
}