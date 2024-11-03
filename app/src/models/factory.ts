import {HunterEntity, HunterStorage} from "~/src/models";
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
    Joined:    HunterStorage
    StandBy:   HunterStorage

    constructor(defaultJoined: HunterStorage, defaultStandBy: HunterStorage) {
        this.Joined = defaultJoined
        this.StandBy = defaultStandBy
    }


    joinHunter(info: Omit<HunterInfo,'quest'>) {
        if (
            this.Joined.checkById(info.id)||
            this.StandBy.checkById(info.id)
        ) return this.toJson();


        if (this.Joined.length < 3) {
            const entity = new HunterEntity({
                ...info,
                quest: 0
            });
            this.Joined.insert(entity);
        } else {
            const must_change_hunter = this.Joined.findMustChange();
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
                this.StandBy.insert(entity);
            }
        }
        return this.toJson();
    }


    leaveHunter(id: string) {
        const is_standby = this.StandBy.findById(id);
        const is_joined = this.Joined.findById(id);

        if (is_standby) {
            this.StandBy.deleteById(id);
        } else if (is_joined) {
            if (this.StandBy.length) {
                const standby_hunter = this.StandBy.findByIndex(0);
                this.changeHunter(id, standby_hunter);
            } else {
                this.Joined.deleteById(id);
            }
        }
        return this.toJson();
    }


    changeHunter(leaveId: string, joinHunter: HunterEntity) {
        this.Joined.replaceById(leaveId, joinHunter);
        this.StandBy.deleteById(joinHunter.id);
        return this.toJson();
    }


    doneQuest() {
        this.Joined.updateEach(h=>h.doneQuest());
        this.StandBy.updateEach(h=>h.doneQuest());

        const must_change_hunter = this.Joined.filterMustChange();
        if (must_change_hunter.length && this.StandBy.length) {
            must_change_hunter.forEach((hunter) => {
                this.changeHunter(hunter.id, this.StandBy.findByIndex(0));
            });
        }
        return this.toJson();
    }


    toJson() {
        return {
            Joined:    this.Joined.toJson(),
            StandBy:   this.StandBy.toJson(),
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