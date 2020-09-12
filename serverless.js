// serverless.yml
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

let hasLoaded = false;
if (!hasLoaded) {
    dotenv.config();
    hasLoaded = true;
}

module.exports = {
    plugins: ['serverless-plugin-typescript', 'serverless-functions-base-path'],
    service: 'wardrobe-gql',
    provider: {
        name: 'aws',
        runtime: 'nodejs12.x',
        environment: {
            JWT_SECRET: '',
            ENCRYPTION_KEY: process.env.JWT_SECRET,
            ENCRYPTION_IV: process.env.ENCRYPTION_KEY,
            DB_HOST: process.env.ENCRYPTION_IV,
            DB_PORT: process.env.DB_HOST,
            DB_USERNAME: process.env.DB_PORT,
            DB_PASSWORD: process.env.DB_USERNAME,
            DB_DATABASE: process.env.DB_PASSWORD,
        },
    },
    functions: {
        graphql: {
            handler: 'lambdaServer.graphqlHandler',
            events: [
                {
                    http: {
                        path: 'graphql',
                        method: 'post',
                        cors: true,
                    },
                },
                {
                    http: {
                        path: 'graphql',
                        method: 'get',
                        cors: true,
                    },
                },
            ],
        },
    },
    custom: {
        functionsBasePath: 'src/server',
    },
};
