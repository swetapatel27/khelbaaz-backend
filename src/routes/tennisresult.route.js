const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/verify");
const tennisResultController = require("../controllers/tennisresult.controller");

// result declare
router.post(
  "/declare-tennis-result",
  isLoggedIn,
  tennisResultController.addTennisResult
);

//result rollback
router.post(
  "/tennis-rollback-result",
  isLoggedIn,
  tennisResultController.rollBackTennisResult
);

//get all bets details(m+s) pl after result declare
router.get(
  "/get_tennis_allbets_pl/:user_id",
  isLoggedIn,
  tennisResultController.getTennisAllBetsPL
);
module.exports = router;
