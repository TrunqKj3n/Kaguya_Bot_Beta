import type { Command } from "../../typings"; // Đây là cú pháp để import một kiểu dữ liệu

export default <Command>{ // Đây là cú pháp để export một lệnh
    name: "example", // Tên lệnh, được sử dụng trong việc gọi lệnh
    author: "Thiệu Trung Kiên", // Tên tác giả
    cooldowns: 50, // Thời gian cooldown giữa 2 lần sử dụng lệnh
    description: "Mẫu lệnh cơ bản", // Mô tả lệnh
    role: 'member', // Quyền hạn của người dùng để sử dụng lệnh [member, admin, owner]
    aliases: ["ex", "1"], // Tên lệnh alias
    execute: async ({ api, event }) => {
        // Ở đây là nơi bạn viết code cho lệnh
        return api.sendMessage("Đây là mẫu lệnh cơ bản", event.threadID, event.messageID);
    },
    events: async ({ api, event }) => {
        // Ở đây là nơi bạn viết code cho các sự kiện
    },
    onReply: async ({ api, event, reply }) => {
        // Ở đây là nơi bạn viết code cho 
    },
    onReaction: async ({ api, event, reaction }) => {
        // Ở đây là nơi bạn viết code cho handle reaction
    }
}