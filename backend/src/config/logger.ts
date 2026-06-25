import pino from 'pino';
import { env } from './env.js';

const isProduction = env.NODE_ENV === 'production';

export const logger = pino({
    level: isProduction ? 'info' : 'debug',
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
    ...(isProduction
        ? {}
        : {
              transport: {
                  target: 'pino-pretty',
                  options: {
                      colorize: true,
                      translateTime: 'SYS:standard',
                      ignore: 'pid,hostname',
                  },
              },
          }),
});
