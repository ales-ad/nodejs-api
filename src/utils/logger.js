const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

var logger = createLogger({
    format: combine(timestamp(), myFormat),
    transports: [
        new transports.File({
            filename: './src/log/debug.log',
            json: true,
            timestamp: true,
        }),
    ],

    exitOnError: false,
});

module.exports = logger;
