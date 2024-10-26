export default class ArrayController {
    static insert<T>(array: T[], element: T): T[] {
        return [...array, element];
    }

    static replace<T>(array: T[], element: T, newElement: T): T[] {
        return array.map(e => e === element ? newElement : e);
    }

    static remove<T>(array: T[], element: T): T[] {
        return array.filter(e => e !== element);
    }
}