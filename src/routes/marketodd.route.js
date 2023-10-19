const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");

const marketOddController = require("../controllers/marketodd.controller");

router.get("/markets", marketOddController.getMarketOdds);
router.get(
  "/market-odd/:event_id",
  isLoggedIn,
  marketOddController.getMarketOdd
);

router.get(
  "/live-market-odd/:event_id",
  isLoggedIn,
  marketOddController.getLiveMarketOdd
);

router.get(
  "/market-odd-byevent/:event_id",
  isLoggedIn,
  marketOddController.getMarketOddByEvent
);
router.patch(
  "/market-odd-active",
  isLoggedIn,
  marketOddController.setMarketOddActive
);
router.patch(
  "/market-odd-suspend",
  isLoggedIn,
  marketOddController.setMarketOddSuspend
);
router.patch("/add-market-tv", isLoggedIn, marketOddController.addMarketTVLink);
router.get(
  "/check-match-odd-change/:market_id/:runner_name/:type/:price",
  marketOddController.checkMatchOddPriceChange
);
module.exports = router;
