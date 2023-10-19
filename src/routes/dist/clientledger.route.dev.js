"use strict";

var express = require("express");

var router = express.Router();

var clientLedgerController = require("../controllers/clientledger.controller");

var _require = require("../middlewares/verify"),
    isLoggedIn = _require.isLoggedIn;

router.get("/get-myledger/:user_id/:days", isLoggedIn, clientLedgerController.getClientLedgerByDays);
router.get("/user-profitloss/:user_id/", isLoggedIn, clientLedgerController.getUserProfitLose);
module.exports = router;