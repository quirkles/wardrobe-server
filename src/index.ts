import 'reflect-metadata';
import { createConnection, useContainer } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { join } from 'path';
import { Container } from 'typedi';

import { authChecker } from './auth/authChecker';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { JwtBody } from './auth/types';
import { GarmentResolver } from './resolvers/GarmentResolver';
import { UserResolver } from './resolvers/UserResolver';
import { BrandResolver } from './resolvers/BrandResolver';
import { CategoryResolver } from './resolvers/CategoryResolver';
import { ColorResolver } from './resolvers/ColorResolver';
import { GarmentImageResolver } from './resolvers/GarmentImage';

export interface Context {
    user: { id: string; email: string } | null;
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
                try {
                    const authHeader = req.headers.authorization || '';
                    const token = authHeader.split('Bearer ')[1];
                    if (token) {
                        const { email, sub } = verify(token, JWT_SECRET) as JwtBody;
                        user = { email, id: sub };
                    }
                } catch (e) {
                    console.log(e) //eslint-disable-line
                }
                return { user };
            },
        });
        await server.listen(4000);
        console.log('Server has started!');
    } catch (e) {
        console.log(e) //eslint-disable-line
    }
}

main();
