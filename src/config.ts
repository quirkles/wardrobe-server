import * as path from 'path';
import dotenv from 'dotenv';

const env = process.env.APP_ENV;
if (env && env === 'local') {
    // Use dotenv locally, serverless sets them on lambda
    const configPath = path.resolve(process.cwd(), '.local.env');
    dotenv.config({ path: configPath });
}

export const JWT_SECRET = process.env.JWT_SECRET || '';
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
export const ENCRYPTION_IV = process.env.ENCRYPTION_IV || '';
export const DB_HOST = process.env.DB_HOST || '';
export const DB_PORT = Number(process.env.DB_PORT || 5432);
export const DB_USERNAME = process.env.DB_USERNAME || '';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_DATABASE = process.env.DB_DATABASE || '';
