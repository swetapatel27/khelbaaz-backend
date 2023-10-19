const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/verify");
const fancyResultController = require("../controllers/fancyresult.controller");

// result declare
router.post(
  "/declare-fancy-result",
  isLoggedIn,
  fancyResultController.addFancyResult
);

//result rollback
router.post(
  "/fancy-rollback-result",
  isLoggedIn,
  fancyResultController.rollBackFancyResult
);

//get all bets details(m+s) pl after result declare
router.get(
  "/get_fancy_allbets_pl/:user_id",
  isLoggedIn,
  fancyResultController.getFancyAllBetsPL
);
module.exports = router;
