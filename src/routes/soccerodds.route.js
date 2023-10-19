const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");

const soccerOddController = require("../controllers/soccerodds.controller");

//get all markets
router.get("/soccer-markets", isLoggedIn, soccerOddController.getSoccerOdds);

//get market odds for particular market id
router.get(
  "/soccer-odd/:market_id",
  isLoggedIn,
  soccerOddController.getSoccertoddByMarketId
);
//get soccer odds by event id
router.get(
  "/soccer-odd-byevent/:event_id",
  isLoggedIn,
  soccerOddController.getSoccerOddByEvent
);

//change soccer active-inactive
router.patch(
  "/soccer-odd-active",
  isLoggedIn,
  soccerOddController.setSoccerOddActive
);
//change soccer suspend-unsuspend
router.patch(
  "/soccer-odd-suspend",
  isLoggedIn,
  soccerOddController.setSoccerOddSuspend
);

router.get(
  "/check-soccer-odd-change/:market_id/:runner_name/:type/:price",
  soccerOddController.checkSoccerOddPriceChange
);

module.exports = router;
