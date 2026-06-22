import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderCounter extends Document {
    scope: string;
    seq: number;
}

const orderCounterSchema = new Schema<IOrderCounter>({
    scope: { type: String, required: true, unique: true },
    seq: { type: Number, required: true, default: 0 },
});

export const OrderCounter = mongoose.model<IOrderCounter>('OrderCounter', orderCounterSchema);
