import type { UserData } from '../../typings';
import userModels from '../models/users.models';
import { log } from '../../logger';
export default function ({ api }: { api: any }) {
    const getUserInfo = async (uid: number) => {
        const data = await api.getUserInfo(uid);
        return data?.[uid] ?? null;
    }

    const find = async (uid: number): Promise<{ status: boolean; data: any | null }> => {
        try {
            const user = await userModels.findOne({ uid });
            return {
                status: Boolean(user),
                data: user?.toObject() ?? null,
            };
        } catch (error) {
            return {
                status: false,
                data: null,
            };
        }
    }

    const remove = async (uid: number): Promise<{ status: boolean, data: any | null }> => {
        try {
            const { deletedCount } = await userModels.deleteOne({ uid });
            return {
                status: Boolean(deletedCount),
                data: 'deleted_success'
            };
        } catch (error: any) {
            return {
                status: false,
                data: null,
            }
        }
    }

    const create = async (uid: number): Promise<{ status: boolean, data: any | null }> => {
        try {
            const user = await userModels.findOne({ uid });

            if (user) {
                return {
                    status: false,
                    data: 'already_exists'
                };
            }

            const userData: Partial<UserData> = await getUserInfo(uid)

            const newUser = await userModels.create({
                uid,
                data: {
                    money: 0,
                    exp: 0,
                    banned: {
                        status: false,
                        reason: "",
                        time: 0
                    },
                    name: userData?.name ?? "",
                    firstName: userData?.firstName ?? "",
                    vanity: userData?.vanity ?? "",
                    avatar: `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    type: userData?.type ?? "",
                    profileUrl: userData?.profileUrl ?? "",
                    isFriend: userData?.isFriend ?? false,
                    isBirthday: userData?.isBirthday ?? false,
                    gender: userData?.gender == 2 ? "Nam" : userData?.gender == 1 ? "Nữ" : "Không xác định",
                    other: {},
                } ?? {}
            });

            log([
                {
                    message: '[ USER ] : ',
                    color: 'yellow'
                },
                {
                    message: `Đã tạo thành công dữ liệu cho user `,
                    color: 'green'
                },
                {
                    message: `<${uid}> - ${userData?.name}`,
                    color: 'white'
                }
            ])

            return {
                status: true,
                data: newUser,
            }
        } catch (error) {
            return {
                status: false,
                data: null,
            }
        }
    }

    const update = async (uid: number, data: Partial<UserData>): Promise<{ status: boolean, data: any | null }> => {
        try {
            const filter = { uid };
            const user = await userModels.findOne({ filter });
            if (!user) {
                return {
                    status: false,
                    data: 'user_not_found'
                };
            }
            const updatedUserData = { ...user.data, ...data };
            user.data = updatedUserData;
            await user.save();
            return {
                status: true,
                data: user.toObject()
            };
        } catch (error) {
            return {
                status: false,
                data: null
            };
        }
    }

    const getAll = async (): Promise<{ status: boolean, data: any | null }> => {
        try {
            const user = await userModels.find();
            return {
                status: true,
                data: user,
            }
        } catch (error) {
            return {
                status: false,
                data: null,
            }
        }
    }
    const ban = async (uid: any, { data = { status: false, reason: null, time: null } }): Promise<{ status: boolean, data: any }> => {
        try {
            const user: any = await userModels.findOneAndUpdate(
                { uid },
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
            );
            return {
                status: Boolean(user),
                data: user?.data?.banned ?? null
            };
        } catch (err) {
            return {
                status: false,
                data: 'internal_error'
            };
        }
    };
    return {
        create,
        find,
        remove,
        update,
        getAll,
        ban
    }
}