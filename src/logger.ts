import pino, { Logger } from 'pino';
import * as os from 'os';
import { join } from 'path';

let logOutput: string | number = 1;
if (process.env.APP_ENV && process.env.APP_ENV === 'local') {
    logOutput = join(__dirname, '..', 'logs', `server.log`);
}

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
        pino.destination(logOutput),
    );
    logger.info(`Starting logging to ${logOutput === 1 ? 'stdout' : logOutput}`);
    return logger;
};
