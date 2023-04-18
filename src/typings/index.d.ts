declare global {
    var client: {
        commands: Map<string, any>;
        events: Map<string, any>;
        cooldowns: Map<string, any>;
        aliases: Map<string, any>;
        handler: {
            reply: Map<string, any>;
            reactions: Map<string, any>;
        };
        config: any
    };
    var utils: any;
}

export interface Command {
    name: string; // Tên lệnh, được sử dụng trong việc gọi lệnh
    author: string; // Tên tác giả
    cooldowns: number; // Thời gian cooldown giữa 2 lần gọi lệnh
    description: string; // Mô tả về lệnh
    role: 'member' | 'admin' | 'owner'; // Quyền hạn của người dùng để sử dụng lệnh
    aliases: string[]; // Tên lệnh alias
    execute: ({ api, event, args }: any) => Promise<void>; // Hàm xử lý lệnh
    events?: ({ api, event, args }: any) => Promise<void>; // Hàm xử lý sự kiện
    onReply?: ({ api, event, reply, args }: any) => Promise<void>; // Hàm xử lý reply
    onReaction?: ({ api, event, reaction }: any) => Promise<void>; // Hàm xử lý reaction
}

export interface UserData {
    money: number; // Tiền của người dùng
    exp: number; // Exp của người dùng
    banned: { // Trạng thái ban của người dùng
        status: boolean; // Là 1 boolean để xác định người dùng có bị ban hay không
        reason: string; // Lý do ban
        time: number; // Thời gian ban
    };
    name: string | null; // Tên của người dùng
    firstName: string; // Tên đệm của người dùng
    vanity: string; // Vanity của người dùng
    avatar: string; // Avatar của người dùng
    gender: string | number; // Giới tính của người dùng
    type?: string; // Loại tài khoản của người dùng
    profileUrl: string; // Link profile của người dùng
    isFriend: boolean; // Là 1 boolean để xác định người dùng có phải bạn bè hay không
    isBirthday: boolean; // Là 1 boolean để xác định người dùng có phải sinh nhật hay không
    other?: object; // Dữ liệu khác
    type?: string; // Loại tài khoản của người dùng
    default?: any; // Dữ liệu mặc định
}

export interface ThreadData {
    name: string | null; // Tên nhóm
    emoji?: string | null; // Emoji của nhóm
    prefix: string; // Prefix của nhóm
    members: number; // Số thành viên của nhóm
    banned: { // Trạng thái ban của nhóm
        status: boolean; // Là 1 boolean để xác định nhóm có bị ban hay không
        reason: string; // Lý do ban
        time: number; // Thời gian ban
    };
    adminIDS: any[]; // Mảng ID của admin của nhóm
    approvalMode: boolean; // Là 1 boolean để xác định nhóm có ở chế độ duyệt thành viên hay không
    threadThumbnail?: string | null; // Ảnh đại diện của nhóm
}
