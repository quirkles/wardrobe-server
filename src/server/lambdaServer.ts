import 'reflect-metadata';
import { ConnectionOptions, createConnection, useContainer } from 'typeorm';
import { ApolloServer } from 'apollo-server-lambda';
import { Config } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { APIGatewayProxyCallback, APIGatewayProxyEvent, Context as LambdaContext, Handler } from 'aws-lambda';
import { Logger } from 'pino';
import { Connection } from 'typeorm/connection/Connection';

import { getLogger } from '../logger';
import { authChecker } from '../auth/authChecker';
import resolvers from './resolvers';
import { createLambdaContext } from './appContext';

import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } from '../config';

const ormConfig: ConnectionOptions = {
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    logging: false,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: { migrationsDir: 'src/migration' },
};

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
        await connection.close();
    } catch (e) {
        logger ? logger.error('failed to handle request') : console.log('failed to handle request');
        logger ? logger.error(e) : console.log(e);
        if (connection) {
            logger ? logger.info('closing connection') : console.log('failed to handle request');
            await connection.close();
        }
    }
};
