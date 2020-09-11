const express = require('express');
const router = express.Router();

const testController = require('./test.controller');

router.get('/index', testController.test);

module.exports = router;