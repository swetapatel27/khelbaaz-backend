"use strict";

var express = require("express");

var router = express.Router();

var _require = require("./../middlewares/verify"),
    isLoggedIn = _require.isLoggedIn;

var marketOddController = require("../controllers/marketodd.controller");

router.get("/markets", isLoggedIn, marketOddController.getMarketOdds);
router.get("/market-odd/:event_id", isLoggedIn, marketOddController.getMarketOdd);
router.get("/live-market-odd/:event_id", isLoggedIn, marketOddController.getLiveMarketOdd);
router.get("/market-odd-byevent/:event_id", isLoggedIn, marketOddController.getMarketOddByEvent);
router.patch("/market-odd-active", isLoggedIn, marketOddController.setMarketOddActive);
router.patch("/market-odd-suspend", isLoggedIn, marketOddController.setMarketOddSuspend);
router.patch("/add-market-tv", isLoggedIn, marketOddController.addMarketTVLink);
router.get("/check-match-odd-change/:market_id/:runner_name/:type/:price", marketOddController.checkMatchOddPriceChange);
module.exports = router;