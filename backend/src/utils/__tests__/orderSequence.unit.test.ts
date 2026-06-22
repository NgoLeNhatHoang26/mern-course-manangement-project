import { beforeEach, describe, expect, it, vi } from 'vitest';

const orderCounterMocks = vi.hoisted(() => ({
    findOneAndUpdate: vi.fn(),
}));

vi.mock('../../models/orderCounter.js', () => ({
    OrderCounter: orderCounterMocks,
}));

import { getNextOrder, lessonOrderScope, moduleOrderScope } from '../orderSequence.js';

describe('orderSequence unit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('builds stable scope keys', () => {
        expect(moduleOrderScope('c1')).toBe('module:c1');
        expect(lessonOrderScope('m1')).toBe('lesson:m1');
    });

    it('returns the allocated sequence from OrderCounter', async () => {
        orderCounterMocks.findOneAndUpdate.mockResolvedValue({ scope: 'module:c1', seq: 4 });

        const order = await getNextOrder('module:c1', 3);

        expect(order).toBe(4);
        expect(orderCounterMocks.findOneAndUpdate).toHaveBeenCalledWith(
            { scope: 'module:c1' },
            [
                {
                    $set: {
                        seq: {
                            $add: [
                                { $max: [{ $ifNull: ['$seq', 3] }, 3] },
                                1,
                            ],
                        },
                    },
                },
            ],
            { new: true, upsert: true },
        );
    });

    it('uses zero floor by default', async () => {
        orderCounterMocks.findOneAndUpdate.mockResolvedValue({ scope: 'lesson:m1', seq: 1 });

        const order = await getNextOrder('lesson:m1');

        expect(order).toBe(1);
        expect(orderCounterMocks.findOneAndUpdate).toHaveBeenCalledWith(
            { scope: 'lesson:m1' },
            [
                {
                    $set: {
                        seq: {
                            $add: [
                                { $max: [{ $ifNull: ['$seq', 0] }, 0] },
                                1,
                            ],
                        },
                    },
                },
            ],
            { new: true, upsert: true },
        );
    });

    it('throws when counter allocation fails', async () => {
        orderCounterMocks.findOneAndUpdate.mockResolvedValue(null);

        await expect(getNextOrder('module:c1')).rejects.toMatchObject({
            message: 'Failed to allocate order',
            statusCode: 500,
        });
    });
});
