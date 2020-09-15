const express = require("express");
const router = express.Router();

const controller = require("./symbols.controller");

router.get("/symbols", controller.getData);
module.exports = router;
