const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/verify");
const soccerResultController = require("../controllers/soccerresult.controller");

// result declare
router.post(
  "/declare-soccer-result",
  isLoggedIn,
  soccerResultController.addSoccerResult
);

//result rollback
router.post(
  "/soccer-rollback-result",
  isLoggedIn,
  soccerResultController.rollBackSoccerResult
);

//get all bets details(m+s) pl after result declare
router.get(
  "/get_soccer_allbets_pl/:user_id",
  isLoggedIn,
  soccerResultController.getSoccerAllBetsPL
);
module.exports = router;
