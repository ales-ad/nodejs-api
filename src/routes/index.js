const express = require('express');
const rootRouter = express.Router();
const userRoutes = require('../api/test/test.route');

rootRouter.use('/api', userRoutes);

module.exports = rootRouter;