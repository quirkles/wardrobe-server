import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';
import * as path from 'path';

async function main() {
    await createConnection();
    const schema = await buildSchema({
        resolvers: [UserResolver],
        emitSchemaFile: {
            path: path.join(__dirname, '../', '/schema.gql'),
            commentDescriptions: true,
            sortedSchema: false, // by default the printed schema is sorted alphabetically
        },
    });
    const server = new ApolloServer({ schema });
    await server.listen(4000);
    console.log('Server has started!');
}

main();
