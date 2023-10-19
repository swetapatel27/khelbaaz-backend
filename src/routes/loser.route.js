const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/verify");
const loserController = require("./../controllers/loser.controller");

//add winner
router.post("/add-loser", isLoggedIn, loserController.addLoser);

//get total loss for last n days for admin
router.get("/total-loss/:creator_id",isLoggedIn,loserController.getTotalLossByCreatorId);

//get total loss from A date to B date of users in admin panel
router.get("/total-lossby-date/:creator_id/:from_date/:to_date",isLoggedIn,loserController.getTotalLossByDate);

module.exports = router;
