import { Command } from "../typings";
import { log } from "../logger";
export class CommandHandler {
    private arguments: any;
    private client: any;
    private config: any;
    private commands: Map<string, Command>;
    private aliases: Map<string, any>;
    private cooldowns: Map<string, Map<string, number>>;
    private handler: any;
    constructor({ api, event, Threads, Users }: any) {
        this.arguments = {
            api: api,
            event: event,
            Users,
            Threads
        }
        this.client = (global as any).client;
        this.config = this.client?.config || {};
        this.commands = this.client?.commands || new Map();
        this.aliases = this.client?.aliases || new Map();
        this.cooldowns = this.client?.cooldowns || new Map();
        this.handler = this.client?.handler || {};
    }

    public async handleCommand(): Promise<void> {
        try {
            const { Users, Threads, api, event } = this.arguments;

            const { body, threadID, senderID, isGroup, messageID } = event
            if (!body.startsWith(this.config.prefix)) {
                return;
            }

            const { data: { banned: banUser } } = await Users.find(senderID);
            if (banUser?.status) {
                return api.sendMessage(`Bạn đã bị ban với lý do: ${banUser.reason}`, threadID);
            }

            const { data: banThread } = await Threads.find(threadID);
            if (isGroup && banThread?.data?.banned?.status) {
                return api.sendMessage(`Nhóm đã bị ban với lý do: ${banThread.data.banned.reason}`, threadID);
            }

            const [cmd, ...args] = body.slice(this.config.prefix.length).trim().split(/ +/);

            const command = this.commands.get(cmd.toLowerCase()) || this.commands.get(this.aliases?.get(cmd.toLowerCase()));

            if (!command) {
                return api.sendMessage("Command không tồn tại", threadID, messageID);
            }

            if (!this.cooldowns.has(command.name)) {
                this.cooldowns.set(command.name, new Map());
            }

            const currentTime = Date.now();
            const timeStamps = this.cooldowns.get(command.name) ?? new Map();
            const cooldownAmount = command.cooldowns * 1000;

            if (this.config.ADMIN_IDS.includes(senderID)) {
                return;
            }

            const expTime = (timeStamps.get(senderID) ?? 0) + cooldownAmount;
            if (currentTime < expTime) {
                const timeLeft = (expTime - currentTime) / 1000;
                return api.sendMessage(`Vui lòng chờ ${timeLeft.toFixed(1)}s để sử dụng ${this.config.prefix}${command.name}`, threadID, messageID);
            }

            timeStamps.set(senderID, currentTime);
            setTimeout(() => {
                timeStamps.delete(senderID);
            }, cooldownAmount);

            const { adminIDs: threadAdminIDs } = await api.getThreadInfo(threadID);

            if (command.role === "admin" && !threadAdminIDs.includes(senderID) && !this.config.ADMIN_IDS.includes(senderID)) {
                return api.sendMessage("Bạn không có quyền sử dụng lệnh này!", threadID, messageID);
            }

            if (command.role === "owner" && !this.config.ADMIN_IDS.includes(senderID)) {
                return api.sendMessage("Bạn không có quyền sử dụng lệnh này!", threadID, messageID);
            }

            command.execute({ ...this.arguments, args });
        } catch (error: any) {
            throw new Error(error);
        }
    }
    public handleEvent(): any {
        try {
            this.commands.forEach((event): any => {
                if (event.events) {
                    event.events({ ...this.arguments });
                }
            })
        } catch (err: any) {
            throw new Error(err);
        }
    }
    public async handleReply(): Promise<void> {

        const { messageReply } = this.arguments.event;
        if (!messageReply) return;

        const reply = this.handler.reply.get(messageReply.messageID);
        if (!reply) {
            return;
        }
        const command = this.commands.get(reply.name);
        if (!command) {
            await this.arguments.api.sendMessage("Missing data to execute handle reply!", this.arguments.event.threadID, this.arguments.event.messageID);
            return;
        }
        if (reply.CDExpires) {
            setTimeout(() => {
                this.handler.reply.delete(messageReply.messageID);
                log([{ message: "[ Handler Reply ]: ", color: "yellow" }, { message: `Deleted reply data for command ${reply.name}! after ${reply.CDExpires} seconds <${messageReply.messageID}>`, color: "green" }]);
            }, reply.CDExpires * 1000);
        }
        if (command.onReply) {
            await command.onReply({ ...this.arguments, reply });
        }
    }
    public async handleReaction(): Promise<void> {
        if (this.arguments.event.type !== 'message_reaction') {
            return;
        }

        const messageID = this.arguments.event.messageID;
        const reaction = this.handler.reactions.get(messageID);
        if (!reaction) {
            return;
        }

        const command = this.commands.get(reaction.name);
        if (!command) {
            await this.arguments.api.sendMessage('Missing data to execute handle reaction', this.arguments.event.threadID, messageID);
            return;
        }

        if (command.onReaction) {
            await command.onReaction({ ...this.arguments, reaction });
        }
    }
}