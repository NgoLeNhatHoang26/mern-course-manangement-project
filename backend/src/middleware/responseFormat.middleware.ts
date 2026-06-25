import { NextFunction, Request, Response } from 'express';

type SuccessBody = {
    success: true;
    data: unknown;
    message?: string;
    meta?: unknown;
};

type ErrorBody = {
    success: false;
    message: string;
    errors?: unknown;
    code?: string;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

export const responseFormatMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const originalJson = res.json.bind(res);

    res.json = ((body?: unknown) => {
        if (isObject(body) && typeof body.success === 'boolean') {
            return originalJson(body);
        }

        if (res.statusCode >= 400) {
            const payload: ErrorBody = {
                success: false,
                message: isObject(body) && typeof body.message === 'string' ? body.message : 'Request failed',
                errors: isObject(body) ? body.errors : undefined,
                code: isObject(body) && typeof body.code === 'string' ? body.code : undefined,
            };
            return originalJson(payload);
        }

        const payload: SuccessBody = {
            success: true,
            data: body ?? null,
            message: isObject(body) && typeof body.message === 'string' ? body.message : undefined,
            meta: isObject(body) ? body.meta : undefined,
        };
        return originalJson(payload);
    }) as Response['json'];

    next();
};
