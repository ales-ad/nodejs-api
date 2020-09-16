const fs = require('fs');
const express = require('express');
const expressJwt = require('express-jwt');

const config = require('./config');
const rootRouter = require('./routes');
const allowCrossDomain = require('./middlewares/allowCrossDomain');

const app = express();

app.use(allowCrossDomain);

const publicKey = fs.readFileSync(config.jwt.secret, 'utf8');
app.use(
    expressJwt({
        secret: publicKey,
        algorithms: ['RS256'],
    })
);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(err.status).send({ message: err.message });
        return;
    }
    next();
});

app.use(rootRouter);

module.exports = app;
