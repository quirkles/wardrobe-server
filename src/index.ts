import 'reflect-metadata';
import { createConnection, useContainer } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { join } from 'path';
import { Container } from 'typedi';

import { logger } from './logger';
import { v4 as uuid } from 'uuid';
import { authChecker } from './auth/authChecker';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { JwtBody } from './auth/types';
import { GarmentResolver } from './resolvers/GarmentResolver';
import { UserResolver } from './resolvers/UserResolver';
import { BrandResolver } from './resolvers/BrandResolver';
import { CategoryResolver } from './resolvers/CategoryResolver';
import { ColorResolver } from './resolvers/ColorResolver';
import { GarmentImageResolver } from './resolvers/GarmentImageResolver';
import { Logger } from 'pino';

export interface Context {
    user: { id: string; email: string } | null;
    logger: Logger;
}

async function main() {
    try {
        useContainer(Container);
        await createConnection();
        const schema = await buildSchema({
            authChecker: authChecker,
            resolvers: [
                UserResolver,
                GarmentResolver,
                GarmentImageResolver,
                BrandResolver,
                ColorResolver,
                CategoryResolver,
            ],
            container: Container,
            emitSchemaFile: {
                path: join(__dirname, '../', '/schema.gql'),
                commentDescriptions: true,
                sortedSchema: false, // by default the printed schema is sorted alphabetically
            },
        });
        const server = new ApolloServer({
            schema,
            context: ({ req }): Context => {
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
                        const { email, sub } = verify(token, JWT_SECRET) as JwtBody;
                        user = { email, id: sub };
                    }
                } catch (e) {
                    logger.error(e);
                }
                return { user, logger: requestLogger };
            },
        });
        await server.listen(4000);
        logger.info('Server has started!');
    } catch (e) {
        logger.error(e) //eslint-disable-line
    }
}

main();
