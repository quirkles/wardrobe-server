import 'reflect-metadata';
import { Context, APIGatewayProxyEvent, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { ApolloServer } from 'apollo-server-lambda';

import * as TypeORM from 'typeorm';
import * as TypeGraphQL from 'type-graphql';

import { Container } from 'typedi';

import {
    BrandResolver,
    CategoryResolver,
    ColorResolver,
    GarmentImageResolver,
    GarmentResolver,
    UserResolver,
    HealthCheckResolver
} from '../resolvers';
import { Brand, Color, Garment, GarmentCategory, GarmentImage, GarmentSubCategory, User } from '../entities';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } from '../config';
import { authChecker } from '../auth/authChecker';
import { getLogger } from '../logger';
import { createLambdaContext } from './appContext';

const ormConfig: TypeORM.ConnectionOptions = {
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    logging: false,
    entities: [Brand, Color, Garment, GarmentCategory, GarmentImage, GarmentSubCategory, User],
};

TypeORM.useContainer(Container);

async function bootstrap(event: APIGatewayProxyEvent, context: Context, callback: Callback<APIGatewayProxyResult>) {
    try {
        await TypeORM.getConnection();
    } catch (err) {
        await TypeORM.createConnection(ormConfig);
    }

    // build TypeGraphQL executable schema
    (global as any).schema =
        (global as any).schema ||
        (await TypeGraphQL.buildSchema({
            authChecker,
            resolvers: [
                BrandResolver,
                CategoryResolver,
                ColorResolver,
                GarmentImageResolver,
                GarmentResolver,
                UserResolver,
                HealthCheckResolver,
            ],
            container: Container,
            emitSchemaFile: false,
        }));
    const schema = (global as any).schema;

    (global as any).logger = (global as any).logger || getLogger();
    const logger = (global as any).logger;

    logger.info(ormConfig);

    (global as any).apolloContext = (global as any).apolloContext || createLambdaContext(logger);

    const apolloContext = (global as any).apolloContext;
    const server = new ApolloServer({
        schema,
        context: apolloContext,
        playground: {
            endpoint: '/dev/graphql',
        },
    });
    server.createHandler()(event, context, callback);
}

export function graphql(event: APIGatewayProxyEvent, context: Context, callback: Callback<APIGatewayProxyResult>) {
    bootstrap(event, context, callback);
}
