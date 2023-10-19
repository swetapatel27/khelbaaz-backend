"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../middlewares/verify"),
    isLoggedIn = _require.isLoggedIn;

var fancyController = require("../controllers/fancy.controller");

router.get("/fancy/:event_id", isLoggedIn, fancyController.getSesionById);
router.get("/test-fancy/:event_id", isLoggedIn, fancyController.getTestFancyById);
router.patch("/fancy-active", isLoggedIn, fancyController.setFancyActive);
router.patch("/fancy-suspend", isLoggedIn, fancyController.setFancySuspend);
router.get("/check-fancy-change/:event_id/:runner_name/:type/:price", fancyController.checkFancyPriceChange);
module.exports = router;