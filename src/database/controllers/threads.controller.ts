import type { ThreadData } from "../../typings";
import threadsModels from "../models/threads.models";
import config from "../../setup/config";
import { log } from "../../logger";
export default function ({ api }: { api: any }) {
    const getThreadInfo = async (tid: number) => {
        return await api.getThreadInfo(tid) as Partial<ThreadData>;
    }

    const create = async (tid: number): Promise<{ status: boolean, data: any | null }> => {
        try {
            const thread: any = await threadsModels.findOne({ threadID: tid });

            if (thread) {
                return {
                    status: true,
                    data: 'already_exists'
                }
            }

            const threadInfo = await getThreadInfo(tid) as any;

            if (!threadInfo) {
                return {
                    status: false,
                    data: 'invalid_data'
                }
            }

            const { threadName, imageSrc, participantIDs, adminIDs, emoji, approvalMode } = threadInfo;

            const adminIDsArr = adminIDs.map(({ id }: any) => id);

            const newThread = await threadsModels.create({
                threadID: tid,
                data: {
                    name: threadName,
                    threadThumbnail: imageSrc,
                    members: participantIDs.length,
                    adminIDs: adminIDsArr,
                    emoji,
                    prefix: config.prefix,
                    approvalMode,
                    banned: {
                        status: false,
                        reason: null,
                        time: null
                    }
                }
            } ?? {});

            log([
                {
                    message: '[ THREADS ]: ',
                    color: 'yellow'
                },
                {
                    message: 'Đã tạo thành công dữ liệu cho nhóm ',
                    color: 'green'
                },
                {
                    message: `<${tid}> - ${threadName ?? 'Nhóm không có tên'}`,
                    color: 'white'
                }
            ])

            return {
                status: true,
                data: newThread
            };

        } catch (error) {
            return {
                status: false,
                data: null
            };
        }
    }

    const find = async (tid: number): Promise<{ status: boolean, data: any | null }> => {
        try {
            const thread = await threadsModels.findOne({ threadID: tid });

            return {
                status: Boolean(thread),
                data: thread ?? null
            }

        } catch (error) {

            return {
                status: false,
                data: 'internal_error'
            }

        }
    }

    const update = async (tid: number, data: Partial<ThreadData>): Promise<{ status: boolean, data: any | null }> => {
        try {
            const thread = await threadsModels.findOne({ threadID: tid }) as any
            if (!thread) {
                return {
                    status: false,
                    data: 'thread_not_found'
                }
            }
            const updateThreadData = { ...thread.data, ...data }
            thread.data = updateThreadData
            await thread.save();
            return {
                status: Boolean(thread),
                data: thread ?? null
            };
        } catch (error) {
            return {
                status: false,
                data: 'internal_error'
            }
        }
    }

    const remove = async (tid: number): Promise<any> => {
        try {
            const { deletedCount } = await threadsModels.deleteOne({ threadID: tid })
            return {
                status: deletedCount === 1,
                data: 'remove_success'
            }
        } catch (err) {
            return {
                status: false,
                data: 'internal_error'
            }
        }
    }

    const getAll = async (): Promise<{ status: boolean, data: any | null }> => {
        try {
            const getAll = await threadsModels.find();
            return {
                status: Boolean(getAll),
                data: getAll ?? null
            }
        } catch (err) {
            return {
                status: false,
                data: 'internal_error'
            }
        }
    }
    const ban = async (threadID: number, data = { status: false, reason: null, time: null }): Promise<{ status: boolean, data: any | null }> => {
        try {
            const updatedThread = await threadsModels.findOneAndUpdate(
                { threadID },
                {
                    data: {
                        banned: {
                            status: data.status ?? false,
                            reason: data.reason,
                            time: data.time
                        }
                    }
                },
                { new: true }
            ) as any;
            return {
                status: Boolean(updatedThread),
                data: updatedThread?.data?.banned ?? null
            };
        } catch (err) {
            console.log(err)
            return {
                status: false,
                data: 'internal_error'
            };
        }
    };
    return {
        create,
        find,
        update,
        remove,
        getAll,
        ban
    }
}
