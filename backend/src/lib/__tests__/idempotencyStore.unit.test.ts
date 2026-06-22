import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    acquireIdempotencyLock,
    clearIdempotencyMemoryStore,
    completeIdempotency,
    getIdempotencyRecord,
    parseIdempotencyRecord,
    PROCESSING_MARKER,
    releaseIdempotencyLock,
} from '../idempotencyStore.js';

vi.mock('../redis.js', () => ({
    redisClient: null,
}));

describe('idempotencyStore unit', () => {
    beforeEach(() => {
        clearIdempotencyMemoryStore();
    });

    it('acquires lock only once for the same key', async () => {
        const key = 'idempotency:u1:test-key';

        await expect(acquireIdempotencyLock(key)).resolves.toBe(true);
        await expect(acquireIdempotencyLock(key)).resolves.toBe(false);
        await expect(getIdempotencyRecord(key)).resolves.toBe(PROCESSING_MARKER);
    });

    it('stores and replays completed responses', async () => {
        const key = 'idempotency:u1:test-key';
        await acquireIdempotencyLock(key);

        await completeIdempotency(key, 201, { _id: 'c1' });

        const raw = await getIdempotencyRecord(key);
        expect(raw).not.toBeNull();
        expect(parseIdempotencyRecord(raw!)).toEqual({
            statusCode: 201,
            body: { _id: 'c1' },
        });
    });

    it('releases processing lock without removing completed response', async () => {
        const key = 'idempotency:u1:test-key';
        await acquireIdempotencyLock(key);
        await releaseIdempotencyLock(key);

        await expect(getIdempotencyRecord(key)).resolves.toBeNull();

        await acquireIdempotencyLock(key);
        await completeIdempotency(key, 201, { _id: 'c1' });
        await releaseIdempotencyLock(key);

        const raw = await getIdempotencyRecord(key);
        expect(parseIdempotencyRecord(raw!)).toEqual({
            statusCode: 201,
            body: { _id: 'c1' },
        });
    });
});
