import HunterEntity from "./entity"

export default class HunterStorage {
    storage: HunterEntity[]

    constructor(defaultStorage: HunterEntity[] = []) {
        this.storage = defaultStorage
    }

    checkById(id: string) {
        return this.storage.some(h=>h.id === id)
    }

    findById(id: string) {
        return this.storage.find(h=>h.id === id)
    }

    findByIndex(index: number) {
        return this.storage[index]
    }

    findMustChange() {
        return this.storage.find(h=>h.mustChange())
    }

    filter(callback: (hunter: HunterEntity) => boolean) {
        return this.storage.filter(callback)
    }

    filterMustChange() {
        return this.storage.filter(h=>h.mustChange())
    }

    insert(entity: HunterEntity) {
        this.storage = [...this.storage, entity]
    }

    replaceById(id: string, entity: HunterEntity) {
        this.storage = this.storage.map(h=>h.id === id ? entity.resetQuest() : h)
    }

    updateEach(callback: (hunter: HunterEntity) => HunterEntity) {
        this.storage = this.storage.map(callback)
    }

    deleteById(id: string) {
        this.storage = this.storage.filter(h=>h.id !== id)
    }

    toJson() {
        return this.storage.map(h=>h.toJson())
    }


    get length() {
        return this.storage.length
    }
}