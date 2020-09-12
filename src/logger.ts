import pino, { Logger } from 'pino';
import * as os from 'os';
import { join } from 'path';

const logDir = join(__dirname, '..', 'logs', `server.log`);

let logger: Logger;

export const getLogger = (): Logger => {
    if (logger) {
        return logger;
    }
    logger = pino(
        {
            base: {
                hostname: os.hostname,
            },
        },
        pino.destination(logDir),
    );
    logger.info(`Starting logging to ${logDir}`);
    return logger;
};
