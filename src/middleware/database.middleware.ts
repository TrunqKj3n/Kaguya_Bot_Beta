import mongoose from 'mongoose';
import { log } from '../logger';
export const connectDB = async (): Promise<any> => {
    try {
        await mongoose.connect(global.client.config.database.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as any);
        log([
            {
                message: '[ DATABASE ]: ',
                color: 'green'
            },
            {
                message: 'Đã kết nối đến database',
                color: 'white'
            }
        ])
        return {
            success: true,
            message: 'Connected to database'
        }
    } catch (error: any) {
        return {
            success: false,
            message: error
        }
    }
};