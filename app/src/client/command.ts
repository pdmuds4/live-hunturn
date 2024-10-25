import type { commandReturn } from "../command";

export default class CommandProcessor {
    commandAsset: Record<string,(args?: string[])=>commandReturn>;

    constructor(command_asset: Record<string,(args?: string[])=>commandReturn>) {
        this.commandAsset = command_asset;
    }

    isCommand(message: string) {
        return message.startsWith('!');
    }

    process(command: string) {
        const [func_name, ...args] = command.replace('!', '').split(' ');

        if (!this.commandAsset[func_name]) throw new Error('不正なコマンドです');
        return this.commandAsset[func_name](args);
    }
}