const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../../middlewares/verify");
const casionBetController = require("../../controllers/casino/casinobet.controller");

router.post("/add-casinobet", isLoggedIn, casionBetController.addCasinobets);
router.get(
  "/casinobets-bymarket/:mid/:user_id/:game_name",
  isLoggedIn,
  casionBetController.getCasinoBetsByMarketId
);
router.get(
  "/get-casino-result/:mid",
  isLoggedIn,
  casionBetController.getLiveResultByMarket
);
router.post(
  "/declare-casino-result",
  isLoggedIn,
  casionBetController.declareResult
);

router.get(
  "/getDeclaredBetsByFilter/:game_name/:user_id/:f_date",
  isLoggedIn,
  casionBetController.getDeclaredBetsByFilter
);

router.get(
  "/getCasinoResultsInDB/:game_name/:f_date",
  isLoggedIn,
  casionBetController.getCasinoResultsInDB
);

module.exports = router;
