import { OrderCounter } from '../models/orderCounter.js';
import { AppError } from './AppError.js';

export const moduleOrderScope = (courseId: string): string => `module:${courseId}`;

export const lessonOrderScope = (moduleId: string): string => `lesson:${moduleId}`;

/**
 * Atomically allocates the next order number for a scope.
 * `floor` should be the current max order from existing documents so counters
 * stay in sync when migrating from the previous read-then-write approach.
 */
export const getNextOrder = async (scope: string, floor = 0): Promise<number> => {
    const counter = await OrderCounter.findOneAndUpdate(
        { scope },
        [
            {
                $set: {
                    seq: {
                        $add: [
                            { $max: [{ $ifNull: ['$seq', floor] }, floor] },
                            1,
                        ],
                    },
                },
            },
        ],
        { new: true, upsert: true },
    );

    if (!counter) {
        throw new AppError('Failed to allocate order', 500);
    }

    return counter.seq;
};
