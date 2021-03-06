import { APIGatewayProxyEvent, Context as LambdaContext } from 'aws-lambda';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Logger } from 'pino';
import { v4 as uuid } from 'uuid';

import config from '../../config';
import { JwtBody } from '../auth/types';

export interface AppContext {
    user: { id: string; email: string } | null;
    logger: Logger;
}

interface ExpressIntegrationContext {
    req: Request;
    res: Response;
}

interface LambdaIntegrationContext {
    event: APIGatewayProxyEvent;
    context: LambdaContext;
}

export const createExpressContext = (logger: Logger) => (integrationContext: ExpressIntegrationContext): AppContext => {
    const { req } = integrationContext;
    let user = null;
    let requestLogger = logger;
    try {
        requestLogger = logger.child({
            requestId: uuid(),
        });
        requestLogger.info('received request:');
        requestLogger.info(req);
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            const { email, sub } = verify(token, config.JWT_SECRET) as JwtBody;
            user = { email, id: sub };
        }
    } catch (e) {
        logger.error(e);
    }
    return { user, logger: requestLogger };
};

export const createLambdaContext = (logger: Logger) => (integrationContext: LambdaIntegrationContext): AppContext => {
    const { event, context } = integrationContext;
    let user = null;
    let requestLogger = logger;
    try {
        requestLogger = logger.child({
            requestId: uuid(),
        });
        requestLogger.info(context);
        requestLogger.info(event);
        const authHeader = event.headers.authorization || '';
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            const { email, sub } = verify(token, config.JWT_SECRET) as JwtBody;
            user = { email, id: sub };
        }
    } catch (e) {
        logger.error(e);
    }
    return { user, logger: requestLogger };
};
