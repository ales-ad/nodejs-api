const express = require('express');
const rootRouter = express.Router();

const dealsRoutes = require('../api/deals/deals.route');
const symbolRoutes = require('../api/symbols/symbols.route');

rootRouter.use('/api', dealsRoutes);
rootRouter.use('/api', symbolRoutes);

rootRouter.get('/*', function (req, res) {
    res.status(404).send();
});
module.exports = rootRouter;
