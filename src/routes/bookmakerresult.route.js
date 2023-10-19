const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/verify");
const bookmakerResultController = require("../controllers/bookmakerresult.controller");

// result declare
router.post(
  "/declare-bookmaker-result",
  isLoggedIn,
  bookmakerResultController.addBookmakerResult
);

//result rollback
router.post(
  "/bookmaker-rollback-result",
  isLoggedIn,
  bookmakerResultController.rollBackBookmakerResult
);

//get all bets details(m+s) pl after result declare
router.get(
  "/get_bookmaker_allbets_pl/:user_id",
  isLoggedIn,
  bookmakerResultController.getBookmakerAllBetsPL
);
module.exports = router;
