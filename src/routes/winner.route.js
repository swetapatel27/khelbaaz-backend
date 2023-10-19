const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/verify");
const winController = require("./../controllers/winner.controller");

//add winner
router.post("/add-winner", isLoggedIn, winController.addWinner);

//get total profit for last n days for admin
router.get(
  "/total-profit/:creator_id",
  isLoggedIn,
  winController.getTotalProfitByCreatorId
);

//get total profit from A date to B date of users in admin panel
router.get(
    "/total-profitby-date/:creator_id/:from_date/:to_date",
    isLoggedIn,
    winController.getTotalProfitByDate  );
module.exports = router;
