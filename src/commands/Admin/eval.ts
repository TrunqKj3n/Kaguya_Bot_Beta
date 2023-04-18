import { Command } from "../../typings";
import { inspect } from "util";

const evalCommand: Command = {
    name: "eval",
    author: "Thiệu Trung Kiên",
    cooldowns: 5,
    description: "Thực thi code",
    role: 'member',
    aliases: ["eval", "1"],
    execute: async ({ api, event, args }) => {
        const code = args.join(" ");
        if (!code) return api.sendMessage("Không có code để thực thi!", event.threadID, event.messageID);
        try {
            const evalAsync = async (code: string) => {
                return eval(code);
            }
            let evaled = await evalAsync(code);
            let result = evaled === undefined ? "Không có kết quả" : evaled;
            return api.sendMessage(result, event.threadID, event.messageID);
        } catch (err: any) {
            return api.sendMessage(`Lỗi: ${err}`, event.threadID, event.messageID);
        }
    }
};
export default evalCommand;