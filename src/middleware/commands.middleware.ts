import fs from "fs-extra";
import path from "path";
import { log } from "../logger";

interface Command {
    name: string;
    aliases?: string[];
    execute: Function;
}

export const commandMiddleware = async (): Promise<void> => {
    try {
        const dir = await fs.readdir(path.join(__dirname, "../commands"));
        for (const directory of dir) {
            if (fs.statSync(path.join(__dirname, `../commands/${directory}`)).isDirectory()) {
                const cmd = await fs.readdir(path.join(__dirname, `../commands/${directory}`));
                for (const command of cmd) {
                    try {
                        const commands: Command = (await import(path.join(__dirname, `../commands/${directory}/${command}`))).default;
                        if (!commands.name) {
                            log([
                                {
                                    message: '[ COMMAND ]: ',
                                    color: 'green'
                                },
                                {
                                    message: `Không thể tải lệnh : ${command} vì không có tên lệnh`,
                                    color: 'red'
                                }
                            ]);
                            continue;
                        }
                        if (typeof commands.execute !== 'function') {
                            log([
                                {
                                    message: '[ COMMAND ]: ',
                                    color: 'green'
                                },
                                {
                                    message: `Không thể tải lệnh : ${command} vì không có hàm thực thi`,
                                    color: 'red'
                                }
                            ]);
                            continue;
                        }
                        await global.client.commands.set(commands.name, commands);
                        await log([
                            {
                                message: '[ COMMAND ]: ',
                                color: 'green'
                            },
                            {
                                message: `Đã tải thành công lệnh : ./${directory.toLowerCase()}/${commands.name}`,
                                color: 'white'
                            }
                        ]);
                        if (commands.aliases && Array.isArray(commands.aliases)) {
                            for (const alias of commands.aliases) {
                                if (global.client.aliases.has(alias)) {
                                    log([
                                        {
                                            message: '[ ALIAS ]: ',
                                            color: 'ocean'
                                        },
                                        {
                                            message: `Bí danh "${alias}" đã được sử dụng cho lệnh <${global.client.aliases.get(alias)}> nên không thể sử dụng cho lệnh : ${commands.name}`,
                                            color: 'red'
                                        }
                                    ]);
                                    continue;
                                }
                                global.client.aliases.set(alias, commands.name);
                            }
                        }
                    } catch (error) {
                        log([
                            {
                                message: '[ COMMAND ]: ',
                                color: 'green'
                            },
                            {
                                message: `Không thể tải lệnh : ${command} vì lỗi : ${error}`,
                                color: 'red'
                            }
                        ]);
                        continue;
                    }
                }
            }
        }
    } catch (error) {
        log([
            {
                message: '[ COMMAND ]: ',
                color: 'green'
            },
            {
                message: `Không thể tải lệnh do lỗi : ${error}`,
                color: 'red'
            }
        ]);
    }
};