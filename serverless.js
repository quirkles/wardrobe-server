/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
const path = require('path');

const env = process.env.APP_ENV || 'dev';
const file = `.${env}.env`;
const configPath = path.resolve(process.cwd(), file);
dotenv.config({ path: configPath });

module.exports = {
    service: 'wardrobe-gql',
    provider: {
        name: 'aws',
        runtime: 'nodejs12.x',
        environment: {
            JWT_SECRET: process.env.JWT_SECRET,
            ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
            ENCRYPTION_IV: process.env.ENCRYPTION_IV,
            DB_HOST: process.env.DB_HOST,
            DB_PORT: process.env.DB_PORT,
            DB_USERNAME: process.env.DB_USERNAME,
            DB_PASSWORD: process.env.DB_PASSWORD,
            DB_DATABASE: process.env.DB_DATABASE,
            APP_ENV: process.env.APP_ENV,
        },
    },

    functions: {
        graphql: {
            timeout: 20,
            handler: 'dist/server/handler.graphql',
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
            vpc: {
                securityGroupIds: [process.env.VPC_SECURITY_GROUP_ID],
                subnetIds: [process.env.VPC_SUBNET_ID_A, process.env.VPC_SUBNET_ID_B],
            },
        },
    },
};
