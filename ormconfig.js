// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } = require('./src/config');

module.exports = {
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
