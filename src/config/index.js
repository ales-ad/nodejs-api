const dotenv = require('dotenv');
dotenv.config();
const config = {
    app: {
        name: process.env.APP_NAME || 'API',
        env: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3000
    },
    socket: {
        port: process.env.SOCK_PORT || 4000,
        host: process.env.SOCKET_HOST || 'localhost',
        path: process.env.SOCKET_PATH || '/',
    },
}

module.exports = config;