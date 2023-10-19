const express = require("express");
const router = express.Router();
const clientLedgerController = require("../controllers/clientledger.controller");
const { isLoggedIn } = require("../middlewares/verify");

router.get(
  "/get-myledger/:user_id/:days",
  isLoggedIn,
  clientLedgerController.getClientLedgerByDays
);

router.get(
  "/user-profitloss/:user_id/",
  isLoggedIn,
  clientLedgerController.getUserProfitLose
);
module.exports = router;
