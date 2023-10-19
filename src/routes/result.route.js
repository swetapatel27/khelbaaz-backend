const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/verify");
const resultController = require("../controllers/result.controller");

router.post("/declare-result", isLoggedIn, resultController.addResult);
router.post("/declare-draw", isLoggedIn, resultController.declareDraw);
router.post("/clear-book-results", isLoggedIn, resultController.clearBookResults);
router.post("/rollback-result", isLoggedIn, resultController.rollBackResult);

//get all bets details(m+s) pl after result declare
router.get(
  "/get_allbets_pl/:user_id",
  isLoggedIn,
  resultController.getAllBetsPL
);

//get all bets detail(m+s+t) after result declared by grouping event for specific user in admin
router.get(
  "/get_allbets_overview/:user_id",
  //isLoggedIn,
  resultController.getAllBetsPLOverview
);
module.exports = router;
