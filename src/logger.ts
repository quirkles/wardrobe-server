import pino from 'pino';
import * as os from 'os';
import { join } from 'path';

const logDir = join(__dirname, '..', 'logs', `server.log`);

const logger = pino(
    {
        base: {
            hostname: os.hostname,
        },
    },
    pino.destination(logDir),
);

logger.info(`Starting logging to ${logDir}`);

export { logger };
