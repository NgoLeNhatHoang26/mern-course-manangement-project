import { redisClient } from './redis.js';

export const PROCESSING_MARKER = '__processing__';
const PROCESSING_TTL_SECONDS = 120;
const RESULT_TTL_SECONDS = 24 * 60 * 60;

export interface IdempotencyResult {
    statusCode: number;
    body: unknown;
}

type MemoryEntry = {
    value: string;
    expiresAt: number;
};

const memoryStore = new Map<string, MemoryEntry>();

const memoryGet = (key: string): string | null => {
    const entry = memoryStore.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        memoryStore.delete(key);
        return null;
    }
    return entry.value;
};

const memorySet = (key: string, value: string, ttlSeconds: number): void => {
    memoryStore.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
};

const memorySetNx = (key: string, value: string, ttlSeconds: number): boolean => {
    if (memoryGet(key)) return false;
    memorySet(key, value, ttlSeconds);
    return true;
};

const memoryDel = (key: string): void => {
    memoryStore.delete(key);
};

const isRedisReady = (): boolean => redisClient?.status === 'ready';

export const getIdempotencyRecord = async (scopedKey: string): Promise<string | null> => {
    if (isRedisReady()) {
        try {
            return await redisClient!.get(scopedKey);
        } catch {
            // fall through to in-memory store
        }
    }
    return memoryGet(scopedKey);
};

export const acquireIdempotencyLock = async (scopedKey: string): Promise<boolean> => {
    if (isRedisReady()) {
        try {
            const result = await redisClient!.set(
                scopedKey,
                PROCESSING_MARKER,
                'EX',
                PROCESSING_TTL_SECONDS,
                'NX',
            );
            return result === 'OK';
        } catch {
            // fall through to in-memory store
        }
    }
    return memorySetNx(scopedKey, PROCESSING_MARKER, PROCESSING_TTL_SECONDS);
};

export const completeIdempotency = async (
    scopedKey: string,
    statusCode: number,
    body: unknown,
): Promise<void> => {
    const payload = JSON.stringify({ statusCode, body } satisfies IdempotencyResult);
    if (isRedisReady()) {
        try {
            await redisClient!.set(scopedKey, payload, 'EX', RESULT_TTL_SECONDS);
            return;
        } catch {
            // fall through to in-memory store
        }
    }
    memorySet(scopedKey, payload, RESULT_TTL_SECONDS);
};

export const releaseIdempotencyLock = async (scopedKey: string): Promise<void> => {
    const current = await getIdempotencyRecord(scopedKey);
    if (current !== PROCESSING_MARKER) return;

    if (isRedisReady()) {
        try {
            await redisClient!.del(scopedKey);
            return;
        } catch {
            // fall through to in-memory store
        }
    }
    memoryDel(scopedKey);
};

export const parseIdempotencyRecord = (
    raw: string,
): IdempotencyResult | 'processing' | null => {
    if (raw === PROCESSING_MARKER) return 'processing';
    try {
        const parsed = JSON.parse(raw) as IdempotencyResult;
        if (typeof parsed.statusCode !== 'number') return null;
        return parsed;
    } catch {
        return null;
    }
};

/** @internal test helper */
export const clearIdempotencyMemoryStore = (): void => {
    memoryStore.clear();
};
