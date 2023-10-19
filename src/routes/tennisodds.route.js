const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");

const tennisOddController = require("../controllers/tennisodds.controller");

//get all markets
router.get("/tennis-markets", isLoggedIn, tennisOddController.getTennisOdds);

//get market odds for particular market id
router.get(
  "/tennis-odd/:market_id",
  isLoggedIn,
  tennisOddController.getTennistoddByMarketId
);
//get tennis odds by event id
router.get(
  "/tennis-odd-byevent/:event_id",
  isLoggedIn,
  tennisOddController.getTennisOddByEvent
);

//change tennis active-inactive
router.patch(
  "/tennis-odd-active",
  isLoggedIn,
  tennisOddController.setTennisOddActive
);
//change tennis suspend-unsuspend
router.patch(
  "/tennis-odd-suspend",
  isLoggedIn,
  tennisOddController.setTennisOddSuspend
);

router.get(
  "/check-tennis-odd-change/:market_id/:runner_name/:type/:price",
  tennisOddController.checkTennisOddPriceChange
);

module.exports = router;
