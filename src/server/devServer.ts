import 'reflect-metadata';
import { ConnectionOptions, createConnection, useContainer } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

import config from '../../config';
import { getLogger } from '../logger';
import { authChecker } from '../auth/authChecker';
import resolvers from './resolvers';
import { createExpressContext } from './appContext';

const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } = config;

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

const logger = getLogger();

const context = createExpressContext(logger);

async function main(): Promise<void> {
    try {
        useContainer(Container);
        await createConnection(ormConfig);
        const schema = await buildSchema({
            authChecker,
            resolvers: resolvers as never,
            container: Container,
            validate: false,
        });
        const server = new ApolloServer({
            schema,
            context,
        });
        await server.listen(4000);
        logger.info('Server has started!');
    } catch (e) {
        logger.error(e);
    }
}

main();
