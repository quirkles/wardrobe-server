/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Set the env from APP_ENV and fall back to local
const env = process.env.APP_ENV || 'local';

function getDotenvConfig() {
    const envPath = path.join(__dirname, '..', `.${env}.env`);
    let dotEnvBuffer = null;
    try {
        dotEnvBuffer = fs.readFileSync(envPath);
    } catch (err) {
        if (err.code === 'ENOENT') return {};
        throw err;
    }
    return dotenv.parse(dotEnvBuffer);
}

function getEnvVarConfig() {
    const envVars = [
        'JWT_SECRET',
        'ENCRYPTION_KEY',
        'ENCRYPTION_IV',
        'LOG_TO_FILE',
        'DB_HOST',
        'DB_PORT',
        'DB_USERNAME',
        'DB_PASSWORD',
        'DB_DATABASE',
        'VPC_SECURITY_GROUP_ID',
        'VPC_SUBNET_ID_A',
        'VPC_SUBNET_ID_B',
    ];
    return envVars.reduce((envVarConfig, varName) => {
        const value = process.env[varName];
        if (value) {
            envVarConfig[varName] = value;
        }
        return envVarConfig;
    }, {});
}

const baseConfig = require('./base') || {};
const envConfig = require(`./${env}`) || {};

const fromEnvFile = getDotenvConfig();
const fromProcessEnv = getEnvVarConfig();
const config = Object.assign(baseConfig, envConfig, fromEnvFile, fromProcessEnv);

module.exports = config;
