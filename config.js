// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

let hasLoaded = false;
if (!hasLoaded) {
    dotenv.config();
    hasLoaded = true;
}

module.exports.JWT_SECRET = process.env.JWT_SECRET;
module.exports.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
module.exports.ENCRYPTION_IV = process.env.ENCRYPTION_IV;
module.exports.DB_HOST = process.env.DB_HOST;
module.exports.DB_PORT = process.env.DB_PORT;
module.exports.DB_USERNAME = process.env.DB_USERNAME;
module.exports.DB_PASSWORD = process.env.DB_PASSWORD;
module.exports.DB_DATABASE = process.env.DB_DATABASE;
