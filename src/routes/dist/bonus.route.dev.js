"use strict";

var express = require("express");

var router = express.Router();

var _require = require("./../middlewares/verify"),
    isLoggedIn = _require.isLoggedIn;

var bonusController = require("../controllers/bonus.controller");

router.patch("/convert-bonus", bonusController.convertBonus); //Edit bonus amount and bonus percentage for admin

router.patch("/edit-bonus-amount", bonusController.editBonusAmount); //get total bonus issued in last 24 hours for admin

router.get("/total-bonus-issued", bonusController.getTotalBonus);
module.exports = router;