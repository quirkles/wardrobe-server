if (process.env.APP_ENV && process.env.APP_ENV === 'dev') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require('dotenv');
    let hasLoaded = false;
    if (!hasLoaded) {
        dotenv.config();
        hasLoaded = true;
    }
}

export const JWT_SECRET = process.env.JWT_SECRET || '';
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
export const ENCRYPTION_IV = process.env.ENCRYPTION_IV || '';
export const DB_HOST = process.env.DB_HOST || '';
export const DB_PORT = process.env.DB_PORT || '';
export const DB_USERNAME = process.env.DB_USERNAME || '';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_DATABASE = process.env.DB_DATABASE || '';
