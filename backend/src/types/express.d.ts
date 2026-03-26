// express.d.ts
import mongoose from 'mongoose'

export interface IUserPayload {
    _id: mongoose.Types.ObjectId
    id: string
    role: string
}

declare global {
    namespace Express {
        interface Request {
            user?: IUserPayload
        }
    }
}