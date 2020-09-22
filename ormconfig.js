/* eslint-disable @typescript-eslint/no-var-requires */

const config = require('./config');

console.log('config') //eslint-disable-line
console.log(config) //eslint-disable-line

const envs = ['dev', 'local'];

module.exports = envs.map((env) => {
    const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = config;
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
