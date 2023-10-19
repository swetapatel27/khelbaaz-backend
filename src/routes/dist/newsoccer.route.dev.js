"use strict";

var express = require("express");

var router = express.Router();

var _require = require("./../middlewares/verify"),
    isLoggedIn = _require.isLoggedIn;

var soccerController = require("./../controllers/newsoccer.controller");

router.get("/soccer/test", // isLoggedIn,
soccerController.testing);
module.exports = router;