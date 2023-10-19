const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");
const bonusController = require("../controllers/bonus.controller");


router.patch(
  "/convert-bonus",
  bonusController.convertBonus
);

//Edit bonus amount and bonus percentage for admin
router.patch(
  "/edit-bonus-amount",
  bonusController.editBonusAmount
)

//get total bonus issued in last 24 hours for admin
router.get(
  "/total-bonus-issued",
  bonusController.getTotalBonus
)

module.exports = router;