import { CommandHandler } from "../handler/handlers";
import userController from "../database/controllers/users.controller";
import threadsController from "../database/controllers/threads.controller";

type EventType = {
    [key: string]: () => void
};

const listen = async ({ api, event }: any) => {
    const { threadID, senderID, type, userID } = event;
    const Thread = threadsController({ api });
    const User = userController({ api });
    if (['message', 'message_reply', 'message_reaction'].includes(type)) {
        event.isGroup ? await Thread.create(threadID) : await User.create(senderID || userID) ?? null;
    }
    const handler = new CommandHandler({ api, event, Users: User, Threads: Thread });
    const eventType: EventType = {
        'message': () => {
            handler.handleCommand();
            handler.handleEvent();
        },
        'message_reaction': () => {
            handler.handleReaction();
        },
        'message_reply': () => {
            handler.handleReply();
            handler.handleCommand();
            handler.handleEvent();
        }
    };
    type in eventType ? eventType[type]() : null;
};

export { listen };