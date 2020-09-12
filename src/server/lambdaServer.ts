import 'reflect-metadata';
import { createConnection, useContainer } from 'typeorm';
import { ApolloServer } from 'apollo-server-lambda';
import { buildSchema } from 'type-graphql';
import { join } from 'path';
import { Container } from 'typedi';

import { getLogger } from '../logger';
import { authChecker } from '../auth/authChecker';
import resolvers from './resolvers';
import { createLambdaContext } from './appContext';
import { APIGatewayProxyCallback, APIGatewayProxyEvent, Context as LambdaContext, Handler } from 'aws-lambda';

const context = createLambdaContext(getLogger());

async function createHandler(): Promise<Handler> {
    useContainer(Container);
    await createConnection();
    const schema = await buildSchema({
        authChecker,
        resolvers: resolvers as any,
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
        playground: {
            endpoint: '/dev/graphql',
        },
    });

    return server.createHandler({
        cors: {
            origin: '*',
            credentials: true,
        },
    });
}

export const graphqlHandler = (
    event: APIGatewayProxyEvent,
    context: LambdaContext,
    callback: APIGatewayProxyCallback,
) => {
    createHandler().then((handler) => handler(event, context, callback));
};
