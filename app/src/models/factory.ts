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
    JustLeft:  HunterStorage

    constructor(defaultJoined: HunterStorage, defaultStandBy: HunterStorage) {
        this.Joined = defaultJoined
        this.StandBy = defaultStandBy
        this.JustLeft = new HunterStorage()
    }


    joinHunter(info: Omit<HunterInfo,'quest'>) {
        if (
            this.Joined.checkById(info.id)||
            this.StandBy.checkById(info.id)
        ) return this.toJson();

        if (this.JustLeft.checkById(info.id)) {
            const compair_hunter_quest = this.Joined.orderByDes()[this.StandBy.length % 3].quest;
            const entity_quest = 2 - compair_hunter_quest + Math.floor(this.StandBy.length / 3);
            const entity = new HunterEntity({
                ...info,
                quest: entity_quest < 2 ? 2 : entity_quest
            });
            
            this.StandBy.insert(entity);
            return this.toJson();
        }

        if (this.Joined.length < 3) {
            const entity = new HunterEntity({
                ...info,
                quest: 0
            });
            this.Joined.insert(entity);
        } else {
            const must_change_hunter = this.Joined.findMustChange('joinus');
            if (must_change_hunter) {
                const entity = new HunterEntity({
                    ...info,
                    quest: 0
                });
                this.changeHunter(must_change_hunter.id, entity);
            } else {
                const compair_hunter_quest = this.Joined.orderByDes()[this.StandBy.length % 3].quest;
                const entity_quest = 2 - compair_hunter_quest + Math.floor(this.StandBy.length / 3) * 2;
                const entity = new HunterEntity({
                    ...info,
                    quest: entity_quest
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
                const must_join_hunter = this.StandBy.findMustChange('standby');
                must_join_hunter ? this.changeHunter(id, must_join_hunter) : this.changeHunter(id, this.StandBy.findByIndex(0));
            } else {
                this.Joined.deleteById(id);
            }
            this.JustLeft.insert(is_joined);
        }
        return this.toJson();
    }


    changeHunter(leaveId: string, joinHunter: HunterEntity) {
        this.Joined.replaceById(leaveId, joinHunter);
        this.StandBy.deleteById(joinHunter.id);
        return this.toJson();
    }


    doneQuest() {
        this.Joined.updateEach(h=>h.doneQuest('joinus'));
        this.StandBy.updateEach(h=>h.doneQuest('standby'));
        this.JustLeft.clear();

        const must_leave_hunter = this.Joined.filterMustChange('joinus').sort((a, b) => b.quest - a.quest);
        const must_join_hunter = this.StandBy.filterMustChange('standby');

        if (must_leave_hunter.length && must_join_hunter.length) {
            must_leave_hunter.forEach((h, i) => {
                if (must_join_hunter[i]) {
                    this.changeHunter(h.id, must_join_hunter[i])
                    this.JustLeft.insert(h);
                }
            });
        } else if (this.Joined.length < 3 && must_join_hunter.length) {
            must_join_hunter.forEach(h => {
                this.StandBy.deleteById(h.id);
                this.Joined.insert(h);
            });
        }
        return this.toJson();
    }

    updateHunterQuest(hunter_id: string, quest: number) {
        this.Joined.updateEach(h=>h.id === hunter_id ? h.updateQuest(quest) : h);
        this.StandBy.updateEach(h=>h.id === hunter_id ? h.updateQuest(quest) : h);
        return this.toJson();
    }


    toJson() {
        return {
            Joined:    this.Joined.toJson(),
            StandBy:   this.StandBy.toJson(),
            JustLeft:  this.JustLeft.toJson()
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