// Import các module và file cấu hình
import login from "Chatbot-Remake-KGY";
import fs from "fs-extra"
import config from "./setup/config";

// Import các middleware
import { listen } from "./listen/listen";
import { commandMiddleware } from "./middleware/commands.middleware";
import { connectDB } from "./middleware/database.middleware";
import { log } from "./logger";

// Đọc credentials file và chuyển thành dạng JSON
const credentials = fs.readFileSync(__dirname + "/setup/credentials.json") as unknown as string;

// Khai báo hàm main
async function main() {
    // Thiết lập giá trị ban đầu cho global biến client
    global.client = {
        commands: new Map(),
        events: new Map(),
        cooldowns: new Map(),
        aliases: new Map(),
        handler: {
            reply: new Map(),
            reactions: new Map(),
        },
        config: config
    };
    try {
        // Kết nối cơ sở dữ liệu
        const dbRes = await connectDB();
        if (!dbRes.success) {
            log([{ message: '[ DATABASE ]: ', color: 'green' }, { message: dbRes.message, color: 'red' }]);
        }
    } catch (error: any) {
        log([{ message: '[ DATABASE ]: ', color: 'green' }, { message: error, color: 'red' }]);
    }
    // Sử dụng middleware cho command
    await commandMiddleware()

    // Đăng nhập vào tài khoản và bắt đầu lắng nghe sự kiện
    login({ appState: JSON.parse(credentials) }, async (err: any, api: any) => {
        if (err) {
            throw new Error(err);
        }
        api.setOptions(config.options);
        try {
            await api.listenMqtt(async (err: any, event: any) => {
                if (err) {
                    throw err;
                }
                await listen({ api, event, client: global.client })
            });
        } catch (error) {
            console.log('Error occurred during listening: ', error);
        }
    });
}

// Thực thi hàm main và bắt lỗi nếu có
main().catch((error) => {
    console.log('Error occurred: ', error);
});

// Xử lý các promise không được bắt lại trong quá trình thực thi