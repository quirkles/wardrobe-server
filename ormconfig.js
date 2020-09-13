/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envs = ['dev', 'local'];

module.exports = envs.map((env) => {
    const configFilePath = path.resolve(process.cwd(), `.${env}.env`);
    const configFromEnvFile = dotenv.parse(fs.readFileSync(configFilePath));
    const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = configFromEnvFile;
    return {
        name: env,
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
});
