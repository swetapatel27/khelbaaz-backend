const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");
const bookmakeroddsController = require("../controllers/bookmakerodds.controller");
router.get(
  "/bookmaker-odd/:event_id",
  isLoggedIn,
  bookmakeroddsController.getBookmakerodds
);

router.get(
  "/check-bookmaker-change/:market_id/:runner_name/:type/:price",
  bookmakeroddsController.checkBookmakerPriceChange
);

router.patch(
  "/bookmaker-odd-suspend",
  isLoggedIn,
  bookmakeroddsController.setBookmakerOddSuspend
);
module.exports = router;
