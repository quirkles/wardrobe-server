import 'reflect-metadata';
import { createConnection, useContainer } from 'typeorm';
import { ApolloServer } from 'apollo-server-lambda';
import { Config } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { APIGatewayProxyCallback, APIGatewayProxyEvent, Context as LambdaContext, Handler } from 'aws-lambda';

import { getLogger } from '../logger';
import { authChecker } from '../auth/authChecker';
import resolvers from './resolvers';
import { createLambdaContext } from './appContext';

import { ormConfig } from '../ormconfig';
import { Logger } from 'pino';
import { Connection } from 'typeorm/connection/Connection';

async function createHandler(apolloContext: Config['context'], logger: Logger): Promise<Handler> {
    useContainer(Container);
    logger.info('building schema');
    const schema = await buildSchema({
        authChecker,
        resolvers: resolvers as any,
        container: Container,
        emitSchemaFile: false,
    });
    logger.info('creating server');
    const server = new ApolloServer({
        schema,
        context: apolloContext,
        playground: {
            endpoint: '/dev/graphql',
        },
    });

    logger.info('creating handler');
    const handler = await server.createHandler({
        cors: {
            origin: true,
            credentials: true,
        },
    });
    logger.info('created handler');

    return handler;
}

export const graphqlHandler = async (
    event: APIGatewayProxyEvent,
    lambdaContext: LambdaContext,
    callback: APIGatewayProxyCallback,
): Promise<void> => {
    let logger = null as Logger | null;
    let connection = null as Connection | null;
    try {
        logger = getLogger();
        const apolloContext = createLambdaContext(logger);
        logger.info('creating connection');
        connection = await createConnection(ormConfig);
        logger.info('connection created');
        const handler = await createHandler(apolloContext, logger);
        const result = await handler(event, lambdaContext, callback);
        logger.info(result);
        logger.info('closing connection');
        await connection.close();
        return result;
    } catch (e) {
        logger ? logger.error('failed to handle request') : console.log('failed to handle request');
        logger ? logger.error(e) : console.log(e);
        if (connection) {
            logger ? logger.info('closing connection') : console.log('failed to handle request');
            await connection.close();
        }
    }
};
