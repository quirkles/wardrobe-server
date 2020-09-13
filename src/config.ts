if (process.env.APP_ENV) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require('dotenv');
    const file = `.${process.env.APP_ENV}.env`;
    let hasLoaded = false;
    if (!hasLoaded) {
        dotenv.config(file);
        hasLoaded = true;
    }
}

export const JWT_SECRET = process.env.JWT_SECRET || '';
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
export const ENCRYPTION_IV = process.env.ENCRYPTION_IV || '';
export const DB_HOST = process.env.DB_HOST || '';
export const DB_PORT = Number(process.env.DB_PORT || 80);
export const DB_USERNAME = process.env.DB_USERNAME || '';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_DATABASE = process.env.DB_DATABASE || '';
