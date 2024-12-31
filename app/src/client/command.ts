export default class CommandProcessor {
    parser: Record<string,string[]>;

    constructor(command_parser: Record<string,string[]>) {
        this.parser = command_parser;
    }

    recognizer(message: string): boolean {
        return Object.keys(this.parser).some((key) => this.parser[key].some((word) => message.includes(word)));
    }

    toRequest(message: string): string {
        const command = Object.keys(this.parser).find((key) => this.parser[key].some((word) => message.includes(word)));
        return command ? command : '';
    }
}