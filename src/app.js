const express = require('express');
const bodyParser = require('body-parser');
const rootRouter = require('./routes');
const allowCrossDomain = require('./middlewares/allowCrossDomain');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(allowCrossDomain);
app.use(rootRouter);
module.exports = app;
