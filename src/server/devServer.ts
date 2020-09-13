import 'reflect-metadata';
import { createConnection, useContainer } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { join } from 'path';
import { Container } from 'typedi';

import { getLogger } from '../logger';
import { authChecker } from '../auth/authChecker';
import resolvers from './resolvers';
import { createExpressContext } from './appContext';
import { ormConfig } from '../ormconfig';

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
            emitSchemaFile: {
                path: join(__dirname, '../', '/schema.gql'),
                commentDescriptions: true,
                sortedSchema: false,
            },
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
